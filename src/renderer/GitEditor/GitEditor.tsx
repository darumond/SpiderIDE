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
import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ipcRenderer = window.electron.ipcRenderer;

import {
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  Table,
  TableBody,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
} from '@mui/material';
import { TablePagination } from '@mui/base';

const Added = () => {
  return <Chip label="Added" color="success" variant="outlined" />;
};

const Modified = () => {
  return <Chip label="Modified" color="warning" variant="outlined" />;
};

const Deleted = () => {
  return <Chip label="Deleted" color="error" variant="outlined" />;
};

const Untracked = () => {
  return <Chip label="Untracked" color="info" variant="outlined" />;
};

const Staged = () => {
  return <Chip label="Staged" color="primary" variant="outlined" />;
};

const Unstaged = () => {
  return <Chip label="Unstaged" color="secondary" variant="outlined" />;
};

const Unmerged = () => {
  return <Chip label="Unmerged" color="error" variant="outlined" />;
};

const Conflicted = () => {
  return <Chip label="Conflicted" color="error" variant="outlined" />;
};

const Renamed = () => {
  return <Chip label="Renamed" color="warning" variant="outlined" />;
};

const Copied = () => {
  return <Chip label="Copied" color="warning" variant="outlined" />;
};

const Ignored = () => {
  return <Chip label="Ignored" color="info" variant="outlined" />;
};

const ReturnChip = (props: any) => {
  const { status } = props;
  switch (status) {
    case 'Added':
      return <Added />;
    case 'Modified':
      return <Modified />;
    case 'Deleted':
      return <Deleted />;
    case 'Untracked':
      return <Untracked />;
    case 'Staged':
      return <Staged />;
    case 'Unstaged':
      return <Unstaged />;
    case 'Unmerged':
      return <Unmerged />;
    case 'Conflicted':
      return <Conflicted />;
    case 'Renamed':
      return <Renamed />;
    case 'Copied':
      return <Copied />;
    case 'Ignored':
      return <Ignored />;
    default:
      return <div></div>;
  }
};

const Row = (file: string, status: string) => {
  const [buttonColor, setButtonColor] = useState('success');
  const [buttonText, setButtonText] = useState('Add');

  const handleButtonClick = () => {
    setButtonColor(buttonColor === 'success' ? 'error' : 'success');
    setButtonText(buttonText === 'Add' ? 'Remove' : 'Add');
  };

  return (
    <TableRow>
      <TableCell align="left">{file}</TableCell>
      <TableCell align="center">
        <ReturnChip status={status} />
      </TableCell>
      <TableCell align="right">
        <Button
          variant="contained"
          color={buttonColor}
          className="w-20"
          onClick={handleButtonClick}
        >
          {buttonText}
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default function GetEditor() {
  const [inputText, setInputText] = useState('');

  const handleAddAll = () => {
    //Lance la fonction addAll ici
    console.log('Add All effectué');
  };

  const handlePush = () => {
    //Lance la fonction push ici
    console.log('Push effectué');
  };

  const handlePull = () => {
    //Lance la fonction pull ici
    console.log('Pull effectué');
  };

  const handleCommit = () => {
    //Lance la fonction commit ici
    console.log('Commit effectué avec le texte :', inputText);
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  return (
    <div className="w-full h-full bg-primary-dark flex flex-col gap-y-2 items-center">
      <div className="w-10/12 flex flex-col gap-y-2 justify-center   ">
        <TextField
          label="Commit message"
          color="secondary"
          value={inputText}
          onChange={handleInputChange}
        />
        <div className="w-full grid grid-cols-10 gap-x-2 justify-center h-16 py-3">
          <div className="col-span-9">
            <Button
              variant="contained"
              className="w-full bg-primary-main h-full"
              onClick={handleCommit}
              disabled={inputText === ""}
            >
              Commit
            </Button>
          </div>
          <div className="col-span-1 relative">
            <div className="absolute bottom-12 right-14">
              <SpeedDial
                ariaLabel="SpeedDial basic example"
                className="absolute"
                direction="down"
                icon={<ExpandMoreIcon />}
              >
                <SpeedDialAction
                  key="AddAll"
                  icon={<AddIcon />}
                  tooltipTitle="Add All"
                  onClick={handleAddAll}
                />
                <SpeedDialAction
                  key="Push"
                  icon={<UploadIcon />}
                  tooltipTitle="Push"
                  onClick={handlePush}
                />
                <SpeedDialAction
                  key="Pull"
                  icon={<DownloadIcon />}
                  tooltipTitle="Pull"
                  onClick={handlePull}
                />
              </SpeedDial>
            </div>
          </div>
        </div>
      </div>
      <div className="w-10/12 h-3/4 flex bg-primary-main border overflow-scroll no-scrollbar rounded border-gray-800 ">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">
                  <strong>File</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Change</strong>
                </TableCell>
                <TableCell align="left">
                  <strong></strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Row('test', 'Added')}
              {Row('test', 'Modified')}
              {Row('test', 'Deleted')}
              {Row('test', 'Untracked')}
              {Row('test', 'Added')}
              {Row('test', 'Modified')}
              {Row('test', 'Deleted')}
              {Row('test', 'Added')}
              {Row('test', 'Modified')}
              {Row('test', 'Deleted')}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}
