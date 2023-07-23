import * as React from 'react';
import { useState, useRef, useContext, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { ProjectContext } from '../App';
import AddBoxIcon from '@mui/icons-material/AddBox';

import Modal from '@mui/material/Modal';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

import { dividerClasses } from '@mui/material';

const ipcRenderer = window.electron.ipcRenderer;

export default function ConfigJSON() {
  const {currentFileId, setCurrentFileId, currentLangage, setCurrentLanguage} = useContext(ProjectContext);
  const editorRef = useRef();
  const [file, setFile] = useState('');
  const [showSquare, setShowSquare] = useState(true); // State to control the visibility of the square
  const [jsonStringTemplate, setJsonStringTemplate] = useState(''); // State for the JSON template

  useEffect(() => {
    ipcRenderer.once('get-content', (arg: any) => {
      const { success, content } = arg;
      if (success) {
        setFile(content);
        setShowSquare(false); // Hide the square when content is received
      } else {
        setCurrentFileId(0);
      }
    });
  }, []);

  function handleEditorDidMount(editor: any, monaco: any) {
    editorRef.current = editor;
    monaco.editor.defineTheme('my-theme', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1F2228',
      },
    });
    monaco.editor.setTheme('my-theme');
  }

  const handleChange = (e: any) => {
    ipcRenderer.sendMessage('write-file', {
      nodeID: currentFileId,
      content: e,
    });
  };

  const [open, setOpen] = useState(false);
  const [formValues, setFormValues] = useState({});

  const handleOpen = () => {
    setOpen(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const ip = event.target.elements.ip.value;
    const port = event.target.elements.port.value;
    const serverName = event.target.elements.serverName.value;
    const root = event.target.elements.root.value;
    const defaultFile = event.target.elements.defaultFile.value;
    const cudeFile = event.target.elements.cudeFile.value;
    const sslCert = event.target.elements.sslCert.value;
    const sslKey = event.target.elements.sslKey.value;
    const isDefaultVhost = event.target.elements.isDefaultVhost.value;

    const formData = {
      ip: ip,
      port: port,
      serverName: serverName,
      root: root,
      defaultFile: defaultFile,
      cudeFile: cudeFile,
      sslCert: sslCert,
      sslKey: sslKey,
      isDefaultVhost: isDefaultVhost,
    };

    setFormValues({});
    setOpen(false);
  };

  return (
    <>
      <div className="flex justify-center">
        <AddBoxIcon
          className="cursor-pointer hover:text-blue-500"
          onClick={handleOpen}
        />
      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="modal-content bg-gray-800 rounded p-4 max-w-sm mx-auto mt-20">
          <h2 className="text-red-500 text-xl font-bold flex justify-between items-center mb-2">
            Config
          </h2>
          <form
            id="formCreateVhost"
            onSubmit={handleSubmit}
            className="grid grid-cols-2 gap-4"
          >
            <label htmlFor="ip" className="text-red-500">
              IP
            </label>
            <input
              type="text"
              id="ip"
              name="ip"
              className="border border-gray-300 text-red-500 rounded px-3 py-1 w-full"
            />

            <label htmlFor="port" className="text-red-500">
              Port
            </label>
            <input
              type="number"
              id="port"
              name="port"
              min="0"
              className="border border-gray-300 text-red-500 rounded px-3 py-1 w-full"
            />

            <label htmlFor="serverName" className="text-red-500">
              Server Name
            </label>
            <input
              type="text"
              id="serverName"
              name="serverName"
              className="border border-gray-300 text-red-500 rounded px-3 py-1 w-full"
            />

            <label htmlFor="root" className="text-red-500">
              Root
            </label>
            <input
              type="text"
              id="root"
              name="root"
              className="border border-gray-300 text-red-500 rounded px-3 py-1 w-full"
            />

            <label htmlFor="defaultFile" className="text-red-500">
              Default File
            </label>
            <input
              type="text"
              id="defaultFile"
              name="defaultFile"
              className="border border-gray-300 text-red-500 rounded px-3 py-1 w-full"
            />

            <label htmlFor="sslCert" className="text-red-500">
              SSL Cert
            </label>
            <input
              type="text"
              id="sslCert"
              name="sslCert"
              className="border border-gray-300 text-red-500 rounded px-3 py-1 w-full"
            />

            <label htmlFor="sslKey" className="text-red-500">
              SSL Key
            </label>
            <input
              type="text"
              id="sslKey"
              name="sslKey"
              className="border border-gray-300 text-red-500 rounded px-3 py-1 w-full"
            />

            <div className="flex items-center mb-2">
              <FormControlLabel
                className="text-red-500 "
                label="Cude File"
                control={
                  <Checkbox id="cudeFile" name="cudeFile" color="secondary" />
                }
              />
            </div>

            <div className="flex items-center mb-2">
              <FormControlLabel
                className="text-red-500 "
                label="Default Vhost"
                control={
                  <Checkbox
                    id="isDefaultVhost"
                    name="isDefaultVhost"
                    color="secondary"
                  />
                }
              />
            </div>

            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded mt-2"
            >
              Create vhost
            </button>
          </form>
        </div>
      </Modal>

      <Editor
        width="100%"
        theme="my-theme"
        onMount={handleEditorDidMount}
        defaultLanguage={currentLangage}
        value={jsonStringTemplate}
        onChange={handleChange}
      />
    </>
  );
}