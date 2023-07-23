import '@fontsource/poppins'; // Defaults to weight 400
import * as React from 'react';
import NavBar from './NavBar/NavBar';
import NavBarIcon from './NavBar/NavBarIcon';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import CodeEditor from './CodeEditor/CodeEditor';
import TreeBar from './TreeBar/TreeBar';
import { createContext, useState, useEffect } from 'react';
import { RunBar } from './RunBar/RunBar';
import './App.css';
import RequestEditor from './RequestEditor/RequestEditor';
import { NodeModel } from '@minoru/react-dnd-treeview';
import ConsoleWindow from './ConsoleWindow/ConsoleWindow';
import GitEditor from './GitEditor/GitEditor';
const ipcRenderer = window.electron.ipcRenderer;

const theme = createTheme({
  typography: {
    fontFamily: 'Poppins',
  },

  palette: {
    text: {
      primary: '#C4CBDA',
      secondary: '#9099AC',
    },
    mode: 'dark',
    primary: {
      light: '#24272E',
      main: '#24272E',
      dark: '#1F2228',
    },
    secondary: {
      light: '#C4CBDA',
      main: '#C4CBDA',
      dark: '#9099AC',
    },
  },
});

export type ToolType = 'default' | 'config' | 'request' | 'git';

export const ProjectContext = createContext(null);

export default function App() {
  const runBarRef = React.useRef(null);
  const [currentFileId, setCurrentFileId] = useState(0);
  const [currentLangage, setCurrentLanguage] = useState('cpp');
  const [currentFileDefaultId, setCurrentFileDefaultId] = useState(0);
  const [currentTool, setCurrentTool] = useState<ToolType>('default');
  const [projectName, setProjectName] = useState('Load a Project');
  const [isProjectLoaded, setIsProjectLoaded] = useState(false);
  const [currentFilePaths, setCurrentFilePaths] = useState([]);
  const [treeData, setTreeData] = useState<NodeModel[]>([]);

  useEffect(() => {
    ipcRenderer.on('load-config', (arg) => {
      const { success } = arg;
      success && setCurrentTool('config');
    });
    ipcRenderer.on('load-request', (arg) => {
      const { success } = arg;
      console.log(`path active: ${currentFilePaths}`);
      success && setCurrentTool('request');
      console.log(`Id active: ${currentFileId}`);
    });
    ipcRenderer.on('load-git', (arg) => {
      const { success } = arg;
      success && setCurrentTool('git');
    });
    ipcRenderer.on('reload-project', (arg) => {
      const { success } = arg;
      success && setCurrentTool('default');
      //console.log(`path active: ${currentFilePaths}`)
      success && setCurrentFileId(currentFileDefaultId);
      //console.log(`Id active: ${currentFileId}`)
      //console.log('list of Paths: ', currentFilePaths)
    });
    return () => {
      ipcRenderer.removeAllListeners('load-config');
      ipcRenderer.removeAllListeners('load-request');
      ipcRenderer.removeAllListeners('load-git');
      ipcRenderer.removeAllListeners('load-project');
    };
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        currentTool,
        currentFileId,
        setCurrentFileId,
        projectName,
        setProjectName,
        isProjectLoaded,
        setIsProjectLoaded,
        currentFilePaths,
        setCurrentFilePaths,
        treeData,
        setTreeData,
        currentFileDefaultId,
        setCurrentFileDefaultId,
        currentLangage,
        setCurrentLanguage,
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="flex h-screen w-full">
          <NavBar>
            <NavBarIcon
              iconType="folder"
              onClick={() =>
                isProjectLoaded && ipcRenderer.sendMessage('reload-project')
              }
            />
            {isProjectLoaded && (
              <>
                <NavBarIcon
                  iconType="construction"
                  onClick={() => {
                    ipcRenderer.sendMessage('load-config');
                    setCurrentFileId(0);
                  }}
                />
                <NavBarIcon
                  iconType="send"
                  onClick={() => {
                    ipcRenderer.sendMessage('load-request');
                    setCurrentFileId(0);
                  }}
                />
                <NavBarIcon
                  iconType="git"
                  onClick={() => {
                    ipcRenderer.sendMessage('load-git');
                    setCurrentFileId(0);
                  }}
                />
              </>
            )}
          </NavBar>
          
            {currentTool !== "git" ? 
            ( <div className="grid grid-cols-12 divide-x-2 divide-solid divide-primary-light w-full">
              <TreeBar />
              <div className="flex flex-col col-span-9 border-t-0 border-b-0 relative">
              <RunBar ref={runBarRef} />
              {currentTool === 'request' ? (
                <RequestEditor />
              ) : (
                <CodeEditor />
              )}
              <ConsoleWindow bounds={runBarRef} />
            </div>
            </div> )
                :
              (
                <div className="grid grid-cols-12 divide-x-2 divide-solid divide-primary-light w-full">
                <div className="flex flex-col col-span-12 border-t-0 border-b-0 relative">
                <RunBar ref={runBarRef} />
                <GitEditor />
              <ConsoleWindow bounds={runBarRef} />
            </div>
          </div>
                  )}
        </div>
      </ThemeProvider>
    </ProjectContext.Provider>
  );
}
