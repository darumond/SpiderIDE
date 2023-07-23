import Typography from '@mui/material/Typography';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { IconButton } from '@mui/material';
import IDEModal from 'renderer/Modal/IDEModal';
const ipcRenderer = window.electron.ipcRenderer

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

export default function ConfigTemplate(props: any) {
    return (
        <IDEModal open={props.open} setOpen={props.setOpen} title="Config Templates">
            <div className='flex w-full justify-around gap-16'>
                <Template name={'Basic Config'} id={0} setClose={() => props.setOpen(false)} />
                <Template name={'Https'} id={1} setClose={() => props.setOpen(false)} />
                <Template name={'Reverse Proxy'} id={2} setClose={() => props.setOpen(false)} />
            </div>
        </IDEModal>
    );
}
