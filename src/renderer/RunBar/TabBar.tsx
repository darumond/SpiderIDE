import * as React from 'react';
import { ProjectContext } from 'renderer/App';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';

const ipcRenderer = window.electron.ipcRenderer


const useHover = () => {
    const [hovered, setHovered] = React.useState();

    const eventHandlers = React.useMemo(() => ({
        onMouseOver() { setHovered(true); },
        onMouseOut() { setHovered(false); }
    }), []);

    return [hovered, eventHandlers];
}

const Tab = (props: any) => {
    const {
        currentFilePaths,
        setCurrentFilePaths, currentFileId, setCurrentFileId, treeData, setTreeData,
        currentFileDefaultId, setCurrentFileDefaultId
    } = React.useContext(ProjectContext);

    const [hovered, eventHandlers] = useHover();

    const handleCloseTab = (closePath) => {
        const newCurrentFilePaths = currentFilePaths.filter(({ id, path }: any) => { return closePath !== path })
        setCurrentFilePaths(newCurrentFilePaths);
        if (currentFileId === props.id) {
            if (newCurrentFilePaths.length !== 0)
            {
                setCurrentFileId(newCurrentFilePaths[0]["id"])
                setCurrentFileDefaultId(newCurrentFilePaths[0]["id"])              
            }
            else {
                setCurrentFileId(0)
                setCurrentFileDefaultId(0)
            }
        }
    };
    return (
        <div {...eventHandlers} onClick={props.onClick} className={`flex flex-row border-solid border-2  rounded-lg cursor-pointer ${currentFileId === props.id ? "border-secondary-light bg-primary-main" : "opacity-90 border-secondary-dark bg-primary-main"} `}>
            <div className='flex flex-row items-center col-span-2 p-2 mr-3'>
                <span className={`text-sm select-none whitespace-nowrap ${currentFileId === props.id ? "text-secondary-main" : "text-secondary-light"}`} >{props.name}</span>
            </div>

            <div className='flex flex-row-reverse justify-content items-center col-span-1 mr-2'>
                {
                    (hovered || currentFileId === props.id) ?
                        <CloseIcon fontSize='10' onClick={(event) => {
                            event.stopPropagation();
                            ; handleCloseTab(props.path)
                        }} /> : <CloseIcon fontSize='10' className='text-transparent' />
                }

            </div>
        </div>
    )
}

export const TabBar = () => {
    const {
        currentFilePaths,
        setCurrentFilePaths, currentFileId, setCurrentFileId, treeData, setTreeData, currentFileDefaultId,
        setCurrentFileDefaultId
    } = React.useContext(ProjectContext);

    React.useEffect(() => {
        const get_path = async () => {
            ipcRenderer.invoke("get-path", currentFileId).then((currentFilePath) => {
                if (currentFilePaths.filter(({ id, path }: any) => { return path === currentFilePath }).length > 0) {
                    return
                }
                setCurrentFilePaths([...currentFilePaths, { path: currentFilePath, id: currentFileId }])
            })
        }
        if (currentFileId !== 0)
            get_path()
    }, [currentFileId])

    return (
        <div className='flex grow flex-row gap-2 overflow-scroll no-scrollbar '>
            {
                Object.values(currentFilePaths).map(({ path, id }: any) => {
                    return (
                        id !== 0 &&
                        (
                            <div>
                                <Tab key={id} id={id} onClick={() => setCurrentFileId(id)} path={path} name={treeData.find(item => item.path === path) ? treeData.find(item => item.path === path)["text"] : "no name"} />
                            </div>)
                    );
                })
            }
        </div>
    )
}
