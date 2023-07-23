import * as React from 'react';
const ipcRenderer = window.electron.ipcRenderer
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { IconButton } from '@mui/material';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: 100,
    p: 5,
};

const Template = (props) => {

    return (
        <div className='flex flex-col justify-center align-middles gap-2'>
            <div className='flex justify-center'>
                <IconButton onClick={() => { ipcRenderer.sendMessage('create-config-template', { templateId: props.id }); props.setClose() }}>
                    <PostAddIcon sx={{ fontSize: 50 }} />
                </IconButton>
            </div>
            <Typography className='text-center' variant="body2" >{props.name}</Typography>
        </div>
    )
}

export default function IDEModal(props: any) {
    return (
        <>
            <Modal
                open={props.open}
                onClose={() => props.setOpen(false)}
            >
                <Box sx={style} className="bg-primary-dark rounded-md flex flex-col justify-between">
                    <div className='mb-8'>
                        <Typography id="transition-modal-title" variant="h5" component="h2">
                            {props.title}
                        </Typography>
                    </div>
                    {props.children}
                </Box>
            </Modal>
        </>
    );
}
