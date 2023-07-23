import Typography from '@mui/material/Typography';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { Box, Button, IconButton, Switch, TextField } from '@mui/material';
import IDEModal from 'renderer/Modal/IDEModal';
import { useContext, useState, useEffect } from 'react';
import { ProjectContext } from 'renderer/App';
import { FormControlLabel } from '@mui/material';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';

const ipcRenderer = window.electron.ipcRenderer;

export default function RunFolder(props: any) {
    const [foldersArr, setFoldersArr] = useState([]);
    const [selectedFolder, setSelectedFolder] = useState('');

    useEffect(() => {
        ipcRenderer.on('choose-config', (arg: any) => {
            const { success, foldersNames } = arg;
            console.log("folderNames: ", foldersNames);
            setFoldersArr(foldersNames);
        });

        return () => {
            ipcRenderer.removeAllListeners('choose-config');
        }
    }, []);

    const handleFolderClick = (folderName) => {
        setSelectedFolder(folderName);
        props.setOpen(false); // Close the IDEModal
    };

    useEffect(() => {
        if (selectedFolder !== '') {
            console.log("SELECTED FOLDER: ", selectedFolder);
            ipcRenderer.sendMessage('run-config', { selectedFolder: selectedFolder });
        }

    }, [selectedFolder]);

    return (
        <IDEModal open={props.open} setOpen={props.setOpen} title="Choose one config">
            <Box>
                {foldersArr.map((folderName, index) => (
                    <Button
                        key={index}
                        variant="contained"
                        color={folderName === selectedFolder ? 'secondary' : 'primary'}
                        startIcon={<PostAddIcon />}
                        fullWidth
                        onClick={() => handleFolderClick(folderName)}
                    >
                        {folderName}
                    </Button>
                ))}
            </Box>
        </IDEModal>
    );
}
