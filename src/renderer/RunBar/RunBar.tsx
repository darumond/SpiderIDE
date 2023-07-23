import * as React from 'react';
import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';
import { IconButton } from '@mui/material';
import { ProjectContext } from 'renderer/App';
import AddIcon from '@mui/icons-material/Add';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import ConfigAddVhost from 'renderer/ConfigJSON/ConfigAddVhost';
import { TabBar } from './TabBar';
import RunFolder from './RunFolder';
const ipcRenderer = window.electron.ipcRenderer;

function convertHeaders(headers: string) {
  const stringVar = headers;
  const lines = stringVar.split('\n');
  const obj: { [key: string]: string } = {};

  lines.forEach(line => {
    const [key, ...values] = line.split(':');
    const trimmedKey = key.trim();

    if (values.length > 0) {
      const trimmedValue = values.join(':').trim();
      obj[trimmedKey] = trimmedValue;
    } else {
      console.error(`Invalid header format: ${line}`);
    }
  });

  return obj;
}

export const RunBar = forwardRef((props, ref) => {
  const {
    projectName, setProjectName, isProjectLoaded, setIsProjectLoaded, currentTool, currentFileId, currentFilePaths, setCurrentFilePaths,
    setCurrentFileId
  } = React.useContext(ProjectContext);
  const theme = useTheme();
  const methodRef = React.useRef<string | null>(null);
  const urlRef = React.useRef<string | null>(null);
  const headersRef = React.useRef<string | null>(null);
  const bodyRef = React.useRef<string | null>(null);
  const [response, setResponse] = React.useState('');
  const [cmakeStdout, setcmakeStdout] = React.useState('');
  const [makeStdout, setmakeStdout] = React.useState('');
  const [foldersArr, setfoldersArr] = React.useState([]);
  const [openRunFolder, setRunfolder] = React.useState(false);

  const [openConfigAddVhost, setOpenConfigAddVhost] = React.useState(false);

  ipcRenderer.on('get-request', (arg: any) => {
    const { success, content } = arg;
    if (success) {
      urlRef.current = content["url"];
      methodRef.current = content["method"];
      headersRef.current = content["headers"];
      bodyRef.current = content["body"];
      console.log("Current URL: ", urlRef.current)
    } else {
      urlRef.current = null;
      methodRef.current = null;
      headersRef.current = null;
      bodyRef.current = null;
    }
  });
  React.useEffect(() => {
    if(foldersArr.length !== 0)
    {
      setRunfolder(true);
    }
  }, [foldersArr]);
  React.useEffect(() => {

    ipcRenderer.on('execute-curl', (arg: any) => {
      const { success, response } = arg;
      console.log("Response from server: " + response["body"]);
      setResponse(response);
      ipcRenderer.sendMessage('display-response', response);
    });
    ipcRenderer.on('cmake-stdout', (arg: any) => {
      const { success, cmakeStdout } = arg;
      // console.log("stdout cmake: ", cmakeStdout);
      setcmakeStdout(cmakeStdout);
      ipcRenderer.sendMessage('display-cmake', cmakeStdout);
    });

    ipcRenderer.on('choose-config', (arg: any) => {
      const { success, foldersNames } = arg;
      console.log("folderNames: ", foldersNames);
      setfoldersArr(foldersNames);
    });

    ipcRenderer.on('make-stdout', (arg: any) => {
      const { success, makeStdout } = arg;
      setmakeStdout(makeStdout);
      ipcRenderer.sendMessage('display-make', makeStdout);
    });
    return () => { ipcRenderer.removeAllListeners('run-config');ipcRenderer.removeAllListeners('get-request'); ipcRenderer.removeAllListeners('execute-curl'); ipcRenderer.removeAllListeners('cmake-stdout'); ipcRenderer.removeAllListeners('make-stdout') }
  }, [])


  const handleSendClick = () => {
    ipcRenderer.sendMessage('get-request', currentFileId);

    setTimeout(() => {
      const newUrl = urlRef.current !== null ? urlRef.current.toString() : "";
      const newHeaders = headersRef.current !== null ? convertHeaders(headersRef.current) : {};
      ipcRenderer.sendMessage('execute-curl', {
        method: methodRef.current,
        newUrl,
        body: bodyRef.current,
        newHeaders
      });
    }, 100);


    // Ajouter le code pour afficher le GIF
    const gifContainer = document.createElement("div");
    gifContainer.style.position = "absolute";
    gifContainer.style.top = "0";
    gifContainer.style.left = "0";
    gifContainer.style.width = "50%";
    gifContainer.style.height = "50%";
    gifContainer.style.zIndex = "9999";

    const gifFrame = document.createElement("iframe");
    gifFrame.src = "https://giphy.com/embed/Q7k1Czf6lT5KvIzdXQ";
    gifFrame.width = "100%";
    gifFrame.height = "100%";
    gifFrame.frameBorder = "0";
    gifFrame.className = "giphy-embed";
    gifFrame.style.pointerEvents = "none"; // Désactiver les événements de pointeur (y compris le hover)

    gifContainer.appendChild(gifFrame);

    const container = document.getElementById("request-editor"); // Remplacez "request-editor" par l'ID de votre conteneur souhaité

    // Ajouter le conteneur du GIF au conteneur principal
    container.appendChild(gifContainer);

    // Supprimer le conteneur du GIF après un certain délai (par exemple, 3 secondes)
    setTimeout(() => {
      container.removeChild(gifContainer);
    }, 1700);
  };

  const handleBuildClick = () => {
    ipcRenderer.sendMessage('build-config', currentFileId);
  }

  const handleRunClick = () => {
    ipcRenderer.sendMessage('choose-config', currentFileId);
  }

  return (
    <div ref={ref} className="bg-primary-dark p-nav-pad flex align-middle w-full gap-nav-gap">
      {currentTool === 'default' ? <TabBar /> : <div className="w-full"></div>}
      <div className='flex'>
        {currentTool === 'default' && (
          <div className='flex' >
            <IconButton onClick={handleBuildClick}>
              <HandymanOutlinedIcon style={{ color: theme.palette.secondary.light }} />
            </IconButton>
            <IconButton onClick={handleRunClick}>
              <PlayArrowOutlinedIcon style={{ color: theme.palette.secondary.light }} />
            </IconButton>
          </div>
        )}
        {currentTool === 'request' && (
          <IconButton onClick={handleSendClick}>
            <SendOutlinedIcon style={{ color: theme.palette.secondary.light }} />
          </IconButton>
        )}
        {currentTool === 'config' && (
          currentFileId !== 0 &&
          <IconButton>
            <AddIcon style={{ color: theme.palette.secondary.light }} onClick={() => setOpenConfigAddVhost(true)} />
          </IconButton>
        )}
      </div>
      <ConfigAddVhost open={openConfigAddVhost} setOpen={setOpenConfigAddVhost} />
      <RunFolder open={openRunFolder} setOpen={setRunfolder} />
    </div>
  );


})
