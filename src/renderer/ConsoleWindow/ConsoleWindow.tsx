import React, { useEffect, useState, useRef } from "react";
import { Resizable } from "re-resizable";
import Button from '@mui/material/Button';
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import TextField from "@mui/material/TextField";
import { IconButton, Tab, Tabs, Typography } from "@mui/material";
import { resolve } from "url";
import { XTerm } from 'xterm-for-react'
import { FitAddon } from 'xterm-addon-fit';
import { Terminal } from 'xterm';


const ipcRenderer = window.electron.ipcRenderer;

type ConsoleTab = "terminal" | "output"

function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowSize;
}


const MyTerminal = () => {
    const xtermRef = React.useRef(null)
    const containerRef = React.useRef(null)
    React.useEffect(() => {
        ipcRenderer.sendMessage("terminal-into", "\x0D");
        const handleResize = () => {
            const resizeObject = { cols: (containerRef?.current?.clientWidth), rows: containerRef?.current?.clientHeight }
            console.log(resizeObject)
            console.log(xtermRef.current.terminal)
            xtermRef.current.terminal.resize(Math.round(containerRef?.current?.clientWidth / 9.5), Math.round(containerRef?.current?.clientHeight / 9.5))
            ipcRenderer.sendMessage("resize", resizeObject)
        };
        handleResize();
        window.addEventListener('resize', ()=> handleResize())
        return () => {
            window.removeEventListener("resize", handleResize);
        }
    }, [])

    React.useEffect(() => {
        // You can call any method in XTerm.js by using 'xterm xtermRef.current.terminal.[What you want to call]
        ipcRenderer.on('terminal-incData', (data) => {
            xtermRef.current.terminal.write(data);
        })
        return () => {
            ipcRenderer.removeAllListeners('terminal-incData')
        }
    }, [])

    return (
        // Create a new terminal and set it's ref.
        <div ref={containerRef} className="w-full h-full max-h-full overflow-scroll" >
            <XTerm options={{ allowTransparency: true, windowOptions: { fullscreenWin: true, maximizeWin: true }, windowsMode: true, theme: { background: 'transparent' } }} ref={xtermRef} onData={(e) => {
                ipcRenderer.sendMessage("terminal-into", e);
            }} />
        </div>
    )
}




function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function ConsoleWindow(props) {

    const windowSize = useWindowSize();
    const [size, setSize] = useState({ width: 200, height: 60 });
    const [isUp, setIsUp] = useState(false);
    const [isTransitionEnabled, setIsTransitionEnabled] = useState(false);
    const [cmakeStdoutWindow, setcmakeStdoutWindow] = useState("");
    const [makeStdoutWindow, setmakeStdoutWindow] = useState("");
    const [runningServer, setRunningServer] = useState("");
    const [consoleTab, setConsoleTab] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setConsoleTab(newValue);
    };

    useEffect(() => {
        if (cmakeStdoutWindow !== "") {
            handleButtonClick();
        }
    }, [cmakeStdoutWindow]);
    useEffect(() => {
        if (runningServer !== "") {
            handleButtonClick();
        }
    }, [runningServer]);
    useEffect(() => {
        if (makeStdoutWindow !== "") {
            setSize((prevSize) => {
                setIsUp(true);
                return { width: 350, height: 700 };
            });
        }
    }, [makeStdoutWindow]);

    useEffect(() => {
        ipcRenderer.on("display-cmake", (arg) => {
            const { success, cmakeStdout } = arg;
            console.log("stdout cmake in console window: ", cmakeStdout);
            setcmakeStdoutWindow(cmakeStdout);
        });

        ipcRenderer.on("display-make", (arg) => {
            const { success, makeStdout } = arg;
            console.log("stdout make in console window: ", makeStdout);
            setmakeStdoutWindow(makeStdout);
        });

        ipcRenderer.on("run-config", (arg) => {
            const { success, config } = arg;
            console.log("JSON CONFIG CONSOLE WINDOW: ", config)
            const runningServ = `Running server from ${config}...`
            setRunningServer(runningServ);
        });

        return () => {

            ipcRenderer.removeAllListeners("display-cmake");
            ipcRenderer.removeAllListeners("display-make");
        }
    }, [])


    const handleButtonClick = () => {
        setIsTransitionEnabled(true);
        setSize((prevSize) => {
            if (prevSize.width === 200 && prevSize.height === 60) {
                setIsUp(false);
                return { width: 350, height: 700 };
            } else {
                setIsUp(true);
                setcmakeStdoutWindow("");
                setmakeStdoutWindow("");
                return { width: 200, height: 60 };
            }
        });
    };

    const handleResizeStop = (e, direction, ref, d) => {
        setIsTransitionEnabled(false);
        setSize((prevSize) => ({
            width: prevSize.width + d.width,
            height: prevSize.height + d.height,
        }));
    };

    return (
        <Resizable
            enable={{ top: true }}
            size={size}
            style={{
                transition: isTransitionEnabled ? "width 0.3s, height 0.3s" : "none",
                display: "flex",
                flexDirection: "column",
                width: "100%",
            }}
            minHeight={60}
            maxHeight={windowSize.height - props.bounds.current?.getBoundingClientRect().height}
            className="!absolute !bottom-0 bg-primary-dark !w-full border-solid border-l-0 border-t-2 border-primary-light "
            onResizeStart={() => setIsTransitionEnabled(false)}
            onResizeStop={handleResizeStop}
        >
            <div className="flex flex-col h-full">
                <div className="flex w-full items-center p-nav-pad justify-between">
                    <div className="flex">
                        <Tabs value={consoleTab} className="rounded" onChange={handleChange} aria-label="basic tabs example" textColor="secondary" indicatorColor="secondary">
                            <Tab label="Console" {...a11yProps(0)} color="secondary" />
                            <Tab label="Output" {...a11yProps(1)} color="secondary" />
                        </Tabs>
                    </div>
                    <IconButton color="secondary" onClick={handleButtonClick}>
                        {isUp ? <KeyboardArrowUpOutlinedIcon /> : <KeyboardArrowDownOutlinedIcon />}
                    </IconButton>
                </div>
                <div className="h-full px-nav-pad overflow-hidden">
                    {consoleTab === 0 ? (<MyTerminal />) :
                        (
                            <div className="h-full">
                                {cmakeStdoutWindow && (
                                    <Typography variant="body2" sx={{ p: 2 }}>
                                        {cmakeStdoutWindow}
                                    </Typography>
                                )}
                                {makeStdoutWindow && (
                                    <Typography variant="body2" sx={{ p: 2 }}>
                                        {makeStdoutWindow}
                                    </Typography>
                                )}
                                {runningServer && (
                                    <Typography variant="body2" sx={{ p: 2 }}>
                                        {runningServer}
                                    </Typography>
                                )}
                            </div>
                        )}
                </div>


            </div>
        </Resizable>
    );
}
