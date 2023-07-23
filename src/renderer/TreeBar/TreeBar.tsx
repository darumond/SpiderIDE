import * as React from 'react';
import { useRef, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import { TreeViewFile2 } from './AddRemoveDuplicateNodes/TreeViewFile2';
import { NodeModel, CustomData } from "./AddRemoveDuplicateNodes/types";
import { useState } from "react";
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
const ipcRenderer = window.electron.ipcRenderer

import {
  Tree,
  MultiBackend,
  DragLayerMonitorProps,
  getDescendants,
  getBackendOptions
} from "@minoru/react-dnd-treeview";
import { ProjectContext } from 'renderer/App';
import ConfigTemplate from 'renderer/ConfigJSON/ConfigTemplate';

export const getLastId = (treeData: NodeModel[]) => {
  const reversedArray = [...treeData].sort((a, b) => {
    if (a.id < b.id) {
      return 1;
    } else if (a.id > b.id) {
      return -1;
    }

    return 0;
  });

  if (reversedArray.length > 0) {
    return reversedArray[0].id;
  }

  return 0;
};
export default function TreeBar() {
  const inputFile = useRef(null)
  const [openConfigTemplate, setOpenConfigTemplate] = useState(false);
  
  const {
    projectName, setProjectName, isProjectLoaded, setIsProjectLoaded, currentTool, treeData, setTreeData
  } = React.useContext(ProjectContext);

  const [title, setTitle] = useState(projectName);

  useEffect(()=>
  {
    ipcRenderer.on('refresh', (arg: any) => {
      const { success, treeNode } = arg;
      console.log("Refresh "+ treeNode)
      setTreeData(treeNode);
    })
    return ()=> ipcRenderer.removeAllListeners("refresh");
  }
  )
  

  useEffect(() => {
    if (currentTool === "config")
      setTitle("Config")
    else if (currentTool === "request")
      setTitle("Request")
    else
      setTitle(projectName)
  }, [currentTool, projectName])


  const handleRefresh = () => {
    ipcRenderer.sendMessage('refresh')
  }

  const handleDelete = (id: NodeModel["id"]) => {
    ipcRenderer.sendMessage('delete-node', { nodeID: id })
    ipcRenderer.once('delete-node', (arg: any) => {
      const { success } = arg;
      if (success) {
        const deleteIds = [
          id,
          ...getDescendants(treeData, id).map((node) => node.id)
        ];
        const newTree = treeData.filter((node) => !deleteIds.includes(node.id));
        setTreeData(newTree);
      }
    });
  };

  const loadProject = async () => {
    ipcRenderer.sendMessage("load-project");
    window.electron.ipcRenderer.once('load-project', (arg: any) => {
      const { success, treeNode, projectName } = arg;
      console.log("treeNode", treeNode)
      if (success) {
        setIsProjectLoaded(true)
        setTreeData(treeNode);
        console.log("TReeData", treeData)
        setProjectName(projectName);
      }
    });
  }

  const handleCreateFile = (id: NodeModel["id"], name: string) => {
    const lastId = getLastId(treeData);
    const descendants = getDescendants(treeData, id);
    setTreeData([
      ...treeData,
      {
        "id": lastId + 1,
        "is_creating": true,
        "parent": id,
        "droppable": false,
        "text": "",
        "data": {
          "fileType": "csv"
        }
      }
    ]);
    ipcRenderer.once("create-file", (arg: any) => {
      const { success, treeNode } = arg;
      handleRefresh()
    });
  };

  const handleCreateDirectory = (id: NodeModel["id"]) => {
    const lastId = getLastId(treeData);
    const descendants = getDescendants(treeData, id);
    setTreeData([
      ...treeData,
      {
        "id": lastId + 1,
        "is_creating": true,
        "parent": id,
        "droppable": true,
        "text": ""
      }
    ]);
    ipcRenderer.once("create-folder", (arg: any) => {
      const { success, treeNode } = arg;
      handleRefresh();
    });
  };


  React.useEffect(() => {
    if (inputFile.current !== null) {
      inputFile.current.setAttribute("directory", "");
      inputFile.current.setAttribute("webkitdirectory", "");
    }
  }, [inputFile]);
  const theme = useTheme();
  return (
    <div className='flex flex-col gap-2 p-nav-pad bg-primary-main col-span-3  border-t-0 border-b-0  h-screen'>
      <div className='flex justify-between align-middle'>
        <div className='flex-grow overflow-hidden'>
          <Button color="secondary" size="large" startIcon={<ArrowDropDownOutlinedIcon />} className='text-lg font-semibold' onClick={() => currentTool === "default" && loadProject()}>
            <span className="overflow-hidden overflow-ellipsis whitespace-nowrap normal-case font-bold text-lg">{title}</span>
          </Button>
        </div>
        {
          isProjectLoaded && <div className='flex overflow-hidden'>
            <IconButton
              color="secondary" onClick={() => handleCreateDirectory(0)}
            >
              <CreateNewFolderOutlinedIcon />
            </IconButton>
            <IconButton
              color="secondary" onClick={() => currentTool !== "config" ? handleCreateFile(0, "new_file") : setOpenConfigTemplate(true)}
            >
              <NoteAddOutlinedIcon />
            </IconButton>
          </div>
        }
      </div>
      <TreeViewFile2 treeData={treeData} setTreeData={setTreeData} onCreateDirectory={handleCreateDirectory} onCreateFile={handleCreateFile} onDelete={handleDelete} onRefresh={handleRefresh} />
      <ConfigTemplate open={openConfigTemplate} setOpen={setOpenConfigTemplate} />
    </div >
  );
}
