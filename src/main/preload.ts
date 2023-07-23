// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example'
  | 'create-file'
  | 'load-project'
  | 'get-content'
  | 'select-dirs'
  | 'create-folder'
  | 'delete-node'
  | 'rename-node'
  | 'move-file'
  | 'write-file'
  | 'refresh'
  | 'load-config'
  | 'load-request'
  | 'reload-project'
  | 'create-config-template'
  | 'get-request'
  | 'execute-curl'
  | 'display-response'
  | 'add-vhost'
  | 'display-response'
  | 'get-path'
  | 'load-git'
  | 'build-config'
  | 'cmake-stdout'
  | 'make-stdout'
  | 'display-cmake'
  | 'display-make'
  | 'run-config'
  | 'choose-config'
  | 'terminal-into'
  | 'terminal-incData'
  | 'resize'

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    removeAllListeners(channel?: Channels) {
      ipcRenderer.removeAllListeners(channel)
    },
    async invoke(channel: Channels, ...args: unknown[]) {
      return ipcRenderer.invoke(channel, ...args);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
