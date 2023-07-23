import React, { useContext, useState } from "react";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { ArrowRight } from "@mui/icons-material";
import { useDragOver } from "@minoru/react-dnd-treeview";
import { NodeModel, CustomData } from "./types";
import { TypeIcon } from "./TypeIcon";
import Input from '@mui/base/Input';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import styles from "./CustomNode.module.css";
import { useEffect } from 'react';
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import { ProjectContext } from "../../App";
const ipcRenderer = window.electron.ipcRenderer

export type Props = {
  node: NodeModel<CustomData>;
  depth: number;
  isOpen: boolean;
  onToggle: (id: NodeModel["id"]) => void;
  onDelete: (id: NodeModel["id"]) => void;
  onCreateFile: (id: NodeModel["id"]) => void;
  onRefresh: () => void;
  onCreateDirectory: (id: NodeModel["id"]) => void;
  onTextChange: (id: NodeModel["id"], value: string) => void;
};

export const CustomNode: React.FC<Props> = (props) => {
  const {
    currentFileId,
    setCurrentFileId,
    currentLangage,
    setCurrentLanguage
  } = useContext(ProjectContext);
  const [hover, setHover] = useState<boolean>(false);
  const [labelText, setLabelText] = useState(props.node.text);
  const [visibleInput, setVisibleInput] = useState(false);
  const { id, droppable, data } = props.node;
  const indent = props.depth * 24;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    props.onToggle(props.node.id);
  };

  const handleShowInput = () => {
    setVisibleInput(true);
  };

  const handleCancel = () => {
    props.onRefresh();
    setLabelText(props.node.text)
    setVisibleInput(false);
  };

  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabelText(e.target.value);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
    if (e.key === "Escape") {
      handleCancel()
    }
  }

  const handleSubmit = () => {
    if (labelText !== "") {
      if (typeof props.node.is_creating !== "undefined" && props.node.is_creating) {
        if (!props.node.droppable) {
          const arg = { parentID: props.node.parent, filename: labelText }
          ipcRenderer.sendMessage("create-file", arg);
        }
        else {
          const arg = { parentID: props.node.parent, dirname: labelText }
          ipcRenderer.sendMessage("create-folder", arg);
        }
      }
      else {
        ipcRenderer.sendMessage('rename-node', { nodeID: id, newName: labelText })
        ipcRenderer.once('rename-node', (arg: any) => {
          const { success } = arg;
          if (!success) {
            //bonus add red border to show user bad file
            return
          }
        })
      }
      setVisibleInput(false);
      props.onTextChange(id, labelText);
    }
  };


  const handleChangeFile = async () => {
    setCurrentFileId(props.node.id)
    setCurrentLanguage(props.node.data?.fileType)
    ipcRenderer.sendMessage("get-content", props.node.id);
    ipcRenderer.sendMessage('get-request', props.node.id);
  }

  useEffect(() => {
    if (labelText === "")
      setVisibleInput(true)
  }, [labelText]);

  useEffect(() => {
    setLabelText(props.node.text)
  }, [props.node.text])

  const dragOverProps = useDragOver(id, props.isOpen, props.onToggle);

  return (
    <div
      className={`tree-node cursor-pointer rounded-md my-1 flex justify-between ${styles.root} ${currentFileId == props.node.id ? "bg-secondary-dark" : "hover:bg-secondary-dark opacity-70"}`}
      style={{ paddingInlineStart: indent }}
      {...dragOverProps}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={(e) => props.node.droppable ? handleToggle(e) : handleChangeFile()}
    >
      <div className="flex col-span-8 items-center overflow-hidden" >

        <div
          className={`${styles.expandIconWrapper} ${props.isOpen ? styles.isOpen : ""
            }`}
        >
          {props.node.droppable && (
            <div>
              <KeyboardArrowRightOutlinedIcon />
            </div>
          )}
        </div>
        <div className="flex overflow-hidden">
          <TypeIcon droppable={droppable} fileType={data?.fileType} />
        </div>
        <div className={styles.labelGridItem}
        >
          {visibleInput ? (
            <div className={styles.inputWrapper}>
              <Input
                className="border-solid border-2 border-secondary-light"
                type="text"
                autoFocus={true}
                slotProps={{
                  input: {
                    className: 'p-0 bg-transparent border-0 outline-none pl-1 w-full font-sans text-secondary-main',
                    style: { fontSize: '14px' },
                    spellCheck: false
                  }
                }}
                value={labelText}
                onChange={handleChangeText}
                onKeyDown={handleKeyDown}
                onBlur={handleCancel}
              />

            </div>
          ) : (
            <div className={styles.inputWrapper}>
              <Typography variant="body2" className={`${styles.nodeLabel} text-ellipsis overflow-hidden`} onDoubleClick={handleShowInput}>
                {labelText}
              </Typography>
            </div>
          )}
        </div>
      </div>
      {hover && (
        <div className="flex justify-end">
          {props.node.droppable && (
            <>
              <div className={styles.actionButton}>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); !props.isOpen && props.onToggle(props.node.id); props.onCreateDirectory(id) }}>
                  <CreateNewFolderOutlinedIcon fontSize="small" />
                </IconButton>
              </div>
              <div className={styles.actionButton}>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); !props.isOpen && props.onToggle(props.node.id); props.onCreateFile(id) }}>
                  <NoteAddOutlinedIcon fontSize="small" />
                </IconButton>
              </div>
            </>)}
          <div className={styles.actionButton}>
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); props.onDelete(id) }}>
              <DeleteOutlinedIcon fontSize="small" />
            </IconButton>
          </div>
        </div>
      )}
    </div>
  );
};
