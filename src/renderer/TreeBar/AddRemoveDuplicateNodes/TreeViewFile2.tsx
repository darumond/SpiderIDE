import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { ThemeProvider, CssBaseline } from "@mui/material";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import {
  Tree,
  MultiBackend,
  DragLayerMonitorProps,
  getDescendants,
  getBackendOptions
} from "@minoru/react-dnd-treeview";
import { NodeModel, CustomData } from "./types";
import { CustomNode } from "./CustomNode";
import { CustomDragPreview } from "./CustomDragPreview";
import { AddDialog } from "./AddDialog";
import styles from "./App.module.css";
import SampleData from "./sample_data.json";
import { getLastId } from "../TreeBar";
const ipcRenderer = window.electron.ipcRenderer

export type Props = {
  treeData: NodeModel[];
  setTreeData: (node: NodeModel[]) => void;
  onDelete: (id: NodeModel["id"]) => void;
  onCreateFile: (id: NodeModel["id"]) => void;
  onRefresh: () => void;
  onCreateDirectory: (id: NodeModel["id"]) => void;
};
export const TreeViewFile2: React.FC<Props> = ({ treeData, setTreeData, onCreateDirectory, onCreateFile, onDelete, onRefresh }) => {

  const handleDrop = (newTree: NodeModel<CustomData>[], { dragSourceId, dropTargetId }) => {
    ipcRenderer.sendMessage('move-file', { nodeID: dragSourceId, destID: dropTargetId })
    ipcRenderer.once('move-file', (arg: any) => {
      const { success } = arg;
      if (success) {
        const { treeNode } = arg
        setTreeData(treeNode);
      }
    })
  };

  const [open, setOpen] = useState<boolean>(false);

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleSubmit = (newNode: Omit<NodeModel<CustomData>, "id">) => {
    const lastId = getLastId(treeData) + 1;

    setTreeData([
      ...treeData,
      {
        ...newNode,
        id: lastId
      }
    ]);

    setOpen(false);
  };

  const handleTextChange = (id: NodeModel["id"], value: string) => {
    const newTree = treeData.map((node) => {
      if (node.id === id) {
        return {
          ...node,
          text: value
        };
      }

      return node;
    });

    setTreeData(newTree);
  };


  return (
    <DndProvider backend={MultiBackend} options={getBackendOptions()}>
      <div className={`${styles.app} overflow-hidden whitespace-nowrap  overflow-y-auto no-scrollbar`} >
        <Tree
          tree={treeData}
          rootId={0}
          render={(node: NodeModel<CustomData>, options) => (
            <CustomNode
              node={node}
              {...options}
              onDelete={onDelete}
              onCreateFile={onCreateFile}
              onCreateDirectory={onCreateDirectory}
              onRefresh={onRefresh}
              onTextChange={handleTextChange}
            />
          )}
          dragPreviewRender={(
            monitorProps: DragLayerMonitorProps<CustomData>
          ) => <CustomDragPreview monitorProps={monitorProps} />}
          onDrop={handleDrop}
          classes={{
            root: styles.treeRoot,
            draggingSource: styles.draggingSource,
            dropTarget: styles.dropTarget
          }}
        />
      </div>
    </DndProvider>
  );
}

