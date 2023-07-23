import Typography from '@mui/material/Typography';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { Box, Button, IconButton, Switch, TextField } from '@mui/material';
import IDEModal from 'renderer/Modal/IDEModal';
import { useContext, useState } from 'react';
import { ProjectContext } from 'renderer/App';
import { FormControlLabel } from '@mui/material';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ipcRenderer = window.electron.ipcRenderer;

const Vhost = (props) => {
  return (
    <div className="flex flex-col justify-center align-middles gap-2">
      <div className="flex justify-center">
        <IconButton
          onClick={() => {
            ipcRenderer.sendMessage('create-config-template', {
              templateId: props.id,
            });
            props.setClose();
          }}
        >
          <PostAddIcon sx={{ fontSize: 50 }} />
        </IconButton>
      </div>
      <Typography className="text-center" variant="body2">
        {props.name}
      </Typography>
    </div>
  );
};

const Footer = (props: any) => {
  return (
    <div className="w-full flex flex-row-reverse mt-8">
      <Button
        color="secondary"
        onClick={() => {
          props.addVhost();
          props.setClose();
        }}
      >
        Add
      </Button>
      <Button color="secondary" onClick={() => props.setClose()}>
        Cancel
      </Button>
    </div>
  );
};
export default function ConfigAddVhost(props: any) {
  const { currentFileId, setCurrentFileId } = useContext(ProjectContext);

  const [ip, setIp] = useState('127.0.0.1');
  const [ipError, setIpError] = useState(false);
  const [port, setPort] = useState('8000');
  const [portError, setPortError] = useState(false);

  const [serverName, setServerName] = useState('localhost');
  const [serverNameError, setServerNameError] = useState(false);

  const [root, setRoot] = useState('./');
  const [rootError, setRootError] = useState(false);

  const [defaultFile, setDefaultFile] = useState('index.html');

  const [sslCertificate, setSslCertificate] = useState('');

  const [sslCertificateKey, setSslCertificateKey] = useState('');

  const [cudeFile, setCudeFile] = useState(false);

  const [isDefaultVhost, setIsDefaultVhost] = useState(false);

  const addVhost = () => {
    let vhost = {
      ip: ip,
      port: port,
      serverName: serverName,
      root: root,
    };
    console.log(`cudeFile: ${cudeFile}`);
    if (cudeFile) {
      cudeFile === 'on' ? (vhost.cudeFile = true) : (vhost.cudeFile = false);
      setCudeFile(false);
    }
    if (defaultFile) vhost.defaultFile = defaultFile;
    if (isDefaultVhost) {
      isDefaultVhost === 'on'
        ? (vhost.isDefaultVhost = true)
        : (vhost.isDefaultVhost = false);
      setIsDefaultVhost(false);
    }
    if (sslCertificate) vhost.sslCertificate = sslCertificate;
    if (sslCertificateKey) vhost.sslCertificateKey = sslCertificateKey;

    ipcRenderer.sendMessage('add-vhost', {
      id: currentFileId,
      vhost: vhost,
    });
  };

  const handleChange = (event, setState, setErrorState) => {
    const value = event.target.value;
    setState(value);

    if (value === '') {
      setErrorState(true);
    } else {
      setErrorState(false);
    }
  };

  const handleChangeOptinoal = (event, setState) => {
    const value = event.target.value;
    setState(value);
  };

  return (
    <IDEModal open={props.open} setOpen={props.setOpen} title="Add Vhost">
      <Box component="form" noValidate autoComplete="off">
        <div className="flex flex-wrap w-full  gap-nav-gap overflow-hidden p-2">
          <TextField
            color="secondary"
            required
            id="outlined-required"
            label="IP"
            defaultValue={ip}
            error={ipError}
            helperText={ipError && 'IP must be valid'}
            onChange={(event) => handleChange(event, setIp, setIpError)}
          />
          <TextField
            color={portError ? 'secondary' : 'primary'}
            required
            id="outlined-required"
            label="Port"
            type="number"
            defaultValue={port}
            error={portError}
            helperText={portError && 'Port must be valid'}
            onChange={(event) => handleChange(event, setPort, setPortError)}
          />
          <TextField
            color="secondary"
            required
            id="outlined-required"
            label="Server Name"
            defaultValue={serverName}
            helperText={serverNameError && 'Server Name must be valid'}
            error={serverNameError}
            onChange={(event) =>
              handleChange(event, setServerName, setServerNameError)
            }
          />
          <TextField
            color="secondary"
            required
            id="outlined-required"
            label="Root"
            error={rootError}
            helperText={rootError && 'Root must be valid'}
            defaultValue={root}
            onChange={(event) => handleChange(event, setRoot, setRootError)}
          />
        </div>
        <Accordion
          sx={{
            backgroundColor: 'transparent',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Options</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="flex flex-col justify-center align-middles gap-2">
              <TextField
                color="secondary"
                label="Default File"
                defaultValue="index.html"
                onChange={(event) =>
                  handleChangeOptinoal(event, setDefaultFile)
                }
              />
              <TextField
                color="secondary"
                label="SSL Certificate"
                defaultValue=""
                onChange={(event) =>
                  handleChangeOptinoal(event, setSslCertificate)
                }
              />
              <TextField
                color="secondary"
                label="SSL Certificate Key"
                defaultValue=""
                onChange={(event) =>
                  handleChangeOptinoal(event, setSslCertificateKey)
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    color="warning"
                    inputProps={{ 'aria-label': 'controlled' }}
                    onChange={(event) =>
                      handleChangeOptinoal(event, setCudeFile)
                    }
                  />
                }
                label="Cude File"
              />
              <FormControlLabel
                control={
                  <Switch
                    color="warning"
                    inputProps={{ 'aria-label': 'controlled' }}
                    onChange={(event) =>
                      handleChangeOptinoal(event, setIsDefaultVhost)
                    }
                  />
                }
                label="Default Vhost"
              />
            </div>
          </AccordionDetails>
        </Accordion>
      </Box>
      <Footer addVhost={addVhost} setClose={() => props.setOpen(false)} />
    </IDEModal>
  );
}
