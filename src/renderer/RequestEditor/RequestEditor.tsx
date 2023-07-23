import * as React from 'react';
import { useState, useRef, useContext, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { ProjectContext } from '../App';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
const ipcRenderer = window.electron.ipcRenderer;

export default function RequestEditor() {
    const { currentFileId, setCurrentFileId, currentLangage, setCurrentLanguage } = useContext(ProjectContext);
    const [method, setMethod] = React.useState('');
    const [url, setUrl] = React.useState('');
    const [headers, setHeaders] = React.useState('');
    const [body, setBody] = React.useState('');
    const [responseBody, setResponseBody] = React.useState('');
    const [responseHeaders, setResponseHeaders] = React.useState('');
    const [responseStatus, setResponseStatus] = React.useState('');
    const [display, setDisplay] = React.useState(false);
    useEffect(() => {
        handleSaveClick();
    }, [url, headers, body, method]);
    useEffect(() => {
        ipcRenderer.on('get-request', (arg: any) => {
            const { success, content } = arg;
            if (success) {
                setUrl(content['url']);
                setMethod(content['method']);
                setHeaders(content['headers']);
                setBody(content['body']);
            } else {
                setUrl('');
                setMethod('');
                setHeaders('');
                setBody('');
            }
        });

        ipcRenderer.on('display-response', (arg: any) => {
            const { success, response } = arg;
            setResponseBody(response['body']);
            setResponseStatus(response['status']);
            setResponseHeaders(response['headers']);
            setDisplay(true);
            console.log('DISPLAY RESPONSE');
            console.log(response);
        });
        return () => {
            ipcRenderer.removeAllListeners('get-request');
            ipcRenderer.removeAllListeners('display-response');
        };
    }, []);

    const handleSaveClick = () => {
        const requestInfo = {
            url,
            method,
            headers,
            body,
        };

        const jsonData = JSON.stringify(requestInfo, null, 2);
        console.log(jsonData);

        ipcRenderer.sendMessage('write-file', {
            nodeID: currentFileId,
            content: jsonData,
        });
    };

    const ResponseDiv = () => {
        return (
            <div className="bg-primary-main rounded-lg grid grid-rows-16 shadow-lg">
                <h3 className="secondary row-span-2 text-2xl p-12">Response</h3>
                <div className="flex justify-between items-center w-full row-span-6 px-8 mt-2">
                    <span className="text-secondary text-lg mr-2 ">STATUS</span>
                    <div className="">
                        {responseStatus && (
                            <>
                                {responseStatus === 200 || responseStatus === 201 ? (
                                    <Chip
                                        label={`GOOD ${responseStatus}`}GO
                                        color="success"
                                        variant="outlined"
                                    />
                                ) : (
                                    <Chip
                                        label={`BAD ${responseStatus}`}
                                        color="error"
                                        variant="outlined"
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className=" row-span-5 px-8">
                <span className="secondary text-lg mr-2">HEADERS</span>
                    <TextField
                        id="outlined-basic"
                        variant="outlined"
                        multiline
                        rows={5}
                        value={responseHeaders}
                        spellCheck={false}
                        color="secondary"
                        fullWidth
                        className="text-secondary"
                    />
                </div>
                <div className="row-span-4 px-8 ">
                <span className="secondary text-lg mr-2">BODY</span>
                    <TextField
                        id="outlined-basic"
                        variant="outlined"
                        multiline
                        rows={5}
                        value={responseBody}
                        spellCheck={false}
                        color="secondary"
                        fullWidth
                        className="text-secondary"
                    />
                </div>
            </div>
        );
    };

    return (
        <>
            {currentFileId === 0 ? (
                <div className="w-full bg-primary-dark flex justify-center align-middle h-full">
                    <div className="flex flex-col justify-center h-full text-xl overflow-hidden whitespace-nowrap">
                        <div
                            style={{
                                width: '100%',
                                height: 100,
                                paddingBottom: '1%',
                                position: 'relative',
                            }}
                        >
                            <iframe
                                src="https://giphy.com/embed/sW0L5TunRpSCFD954x"
                                width="100%"
                                height="100%"
                                style={{ position: 'absolute', pointerEvents: 'none' }}
                                frameBorder="0"
                                className="giphy-embed"
                                allowFullScreen
                            ></iframe>
                        </div>
                        Please select a request
                    </div>
                </div>
            ) : (

                <div className="w-full bg-primary-dark flex justify-center align-middle h-full" id = "request-editor">
                    <div className="grid grid-cols-2 bg-primary-dark px-20 h-5/6 gap-x-4 my-10">
                        <div className="bg-primary-main rounded-lg grid grid-rows-16 shadow-lg">
                            <h3 className="secondary row-span-3 text-2xl p-12">Request</h3>
                            <div className="flex items-center w-full row-span-4 px-8 mt-2">
                                <span className="secondary text-lg mr-2">URL</span>
                                <TextField
                                    color="secondary"
                                    id="outlined-basic"
                                    label="e.g. http://example.com"
                                    variant="outlined"
                                    value={url}
                                    onChange={(event) => {
                                        setUrl(event.target.value);
                                    }}
                                    spellCheck={false}
                                />
                                <FormControl sx={{ minWidth: 110, marginLeft: '1rem' }}>
                                    <InputLabel color="secondary" id="demo-simple-select-label">
                                        Method
                                    </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={method}
                                        label="Method"
                                        onChange={(event) => setMethod(event.target.value)}
                                        color="secondary"
                                    >
                                        <MenuItem value={'GET'}>GET</MenuItem>
                                        <MenuItem value={'HEAD'}>HEAD</MenuItem>
                                        <MenuItem value={'PUT'}>PUT</MenuItem>
                                        <MenuItem value={'DELETE'}>DELETE</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="flex flex-col w-full px-8 row-span-6">
                                <span className="secondary text-lg mr-2">HEADERS</span>
                                <TextField
                                    id="outlined-basic"
                                    label={`e.g.\nHost: example.com`}
                                    variant="outlined"
                                    multiline
                                    rows={5}
                                    value={headers}
                                    onChange={(event) => setHeaders(event.target.value)}
                                    spellCheck={false}
                                    color="secondary"
                                />
                            </div>
                            <div className="flex flex-col w-full row-span-5 px-8">
                                <span className="secondary text-lg mr-2">BODY</span>
                                <TextField
                                    id="outlined-basic"
                                    label={"e.g. name: 'Example Product'"}
                                    variant="outlined"
                                    multiline
                                    rows={5}
                                    value={body}
                                    onChange={(event) => setBody(event.target.value)}
                                    spellCheck={false}
                                    color="secondary"
                                />
                            </div>
                        </div>
                        <ResponseDiv />
                    </div>
                </div>
            )}
        </>
    );
}
