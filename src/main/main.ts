/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { createFile, getContent, createFolder, deleteNode, renameNode, moveFile, writeFile, findContent } from './backend/node';
import { getPathFromId, listFilesRecursively, transformExtensionAndType } from './backend/tree';
import { checkAndCreateConfig, checkAndCreateRequest, createConfigFolder, parseRequest, addVhost, checkAndCreateBuild, gitStatus, runBuildConfig, getConfig } from './backend/utils';
import sendRequest from './backend/request';
var pty = require('../../release/app/node_modules/node-pty-prebuilt-multiarch');
const os = require("os");
var shell = os.platform() === "win32" ? "powershell.exe" : "bash";

const { exec,spawn } = require('child_process');
let treeNode: any = []
let rootProjectName = ""
let root = __dirname + "/"
class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;


/* The above code is an event listener in Electron's main process. It listens for an IPC (Inter-Process
Communication) event with the name 'ipc-example'. When this event is triggered, it receives an
argument 'arg' from the renderer process. */
ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});



/* The above code is an event listener in a Electron application using TypeScript. It listens for the
'load-project' event and expects an argument with a 'path' property. */
ipcMain.on('load-project', async (event, arg: { path: string }) => {
  let msg = ""
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  })
  const projectName = path.parse(result.filePaths[0]).name
  root = result.filePaths.toString() + "/"
  rootProjectName = root;
  await listFilesRecursively(root)
    .then((res) => {
      treeNode = res;
      event.reply('load-project', { success: true, treeNode: treeNode, projectName: projectName });
    })
    .catch((err) => event.reply('load-project', { success: false, treeNode: [], err: err }));
});

/* The above code is an event listener in Electron's main process. It listens for the 'reload-project'
event and expects an argument containing a path. */
ipcMain.on('reload-project', async (event, arg: { path: string }) => {
  await listFilesRecursively(rootProjectName)
    .then((res) => {
      root = rootProjectName
      treeNode = res;
      event.reply('refresh', { success: true, treeNode })
      event.reply('reload-project', { success: true })
    })
    .catch((err) => {
      event.reply('reload-project', { success: false })
    });
});

/* The above code is an event listener in Electron's main process. It listens for the 'load-config'
event and expects an argument object with a 'path' property. */
ipcMain.on('load-config', async (event, arg: { path: string }) => {
  const configFilePath = checkAndCreateConfig(rootProjectName) + "/";
  await listFilesRecursively(configFilePath)
    .then((res) => {
      root = configFilePath
      treeNode = res;
      event.reply('refresh', { success: true, treeNode })
      event.reply('load-config', { success: true })
    })
    .catch((err) => {
      event.reply('load-config', { success: false })
    });
})

/* The above code is an event listener in a TypeScript application. It listens for a 'load-request'
event from the main process. When the event is triggered, it expects an argument object with a
'path' property. */
ipcMain.on('load-request', async (event, arg: { path: string }) => {
  const configFilePath = checkAndCreateRequest(rootProjectName) + "/";
  await listFilesRecursively(configFilePath)
    .then((res) => {
      root = configFilePath
      treeNode = res;
      event.reply('refresh', { success: true, treeNode })
      event.reply('load-request', { success: true })
    })
    .catch((err) => {
      event.reply('load-request', { success: false })
    });
})


ipcMain.on('build-config', async (event, arg) => {
  const configFilePath = checkAndCreateBuild(rootProjectName) + '/';

  try {
    const list = await listFilesRecursively(configFilePath);
    treeNode = list;
    const cmakeCommand = `cd ${configFilePath} && cmake ../..`;
    const makeCommand = `cd ${configFilePath} && make -j`;

    exec(cmakeCommand, async (error, cmakeStdout, cmakeStderr) => {
      if (error) {
        console.error(`CMake execution failed: ${error}`);
        event.reply('cmake-stdout', { success: true, makeStdout: error });
        return;
      }
      listFilesRecursively(root)
        .then((res) => {
          treeNode = res;
          event.reply('refresh', { success: true, treeNode })
        })
        .catch((err) => event.reply('refresh', { success: false, treeNode }));

      event.reply('cmake-stdout', { success: true, cmakeStdout: cmakeStdout });
      exec(makeCommand, async (error, makeStdout, makeStderr) => {
        if (error) {
          console.error(`Make execution failed: ${makeStdout}`);
          event.reply('make-stdout', { success: true, makeStdout: error });
          return;
        }
        listFilesRecursively(root)
          .then((res) => {
            treeNode = res;
            event.reply('refresh', { success: true, treeNode })
          })
          .catch((err) => event.reply('refresh', { success: false, treeNode }));

        event.reply('make-stdout', { success: true, makeStdout: makeStdout });
      });
    });
  } catch (err) {
    console.error(`Error: ${err}`);
    event.reply('build-config', { success: false });
  }

  event.reply('build-config', { success: true });
});

ipcMain.on('choose-config', async (event, arg) => {
  const foldersNames = runBuildConfig(rootProjectName);
  event.reply('choose-config', { success: true, foldersNames: foldersNames })

});

ipcMain.on('run-config', async (event, arg: { selectedFolder: string }) => {
  console.log("IN BACKEND: ", arg.selectedFolder);
  const jsonConfig = getConfig(rootProjectName, arg.selectedFolder);
  console.log("JSON FILE: ", jsonConfig);
  const configFolderPath = path.join(rootProjectName, 'spider-ide', 'build');
  try {
    const runCommand = `./spider`;
    const runArgs = [`../config/${arg.selectedFolder}/${jsonConfig}`];
    const runOptions = {
      cwd: configFolderPath,
    };

    const serverProcess = spawn(runCommand, runArgs, runOptions);
    const res = arg.selectedFolder + "/" + jsonConfig;
    event.reply('run-config', { success: true, config: res });
    serverProcess.on('error', (error) => {
      //event.reply('run-config', { success: true, error: error });
    });

    serverProcess.on('exit', (code) => {
            console.log("TESTING WHILE");
    });
  } catch (err) {
    console.error(`Error: ${err}`);
  }
});

/* The above code is an event listener in Electron's main process. It listens for the 'load-git' event
and expects an argument containing a 'path' property. */
ipcMain.on('load-git', async (event, arg: { path: string }) => {
  const configFilePath = checkAndCreateRequest(rootProjectName) + "/";
  const gitStatusResponse = gitStatus("toto")
  await listFilesRecursively(configFilePath)
    .then((res) => {
      treeNode = res;
      event.reply('refresh', { success: true, treeNode })
      event.reply('load-git', { success: true, })
    })
    .catch((err) => {
      event.reply('load-git', { success: false })
    });
})


/* The above code is an event listener in Electron's main process. It listens for the 'refresh' event
and expects an argument object with a 'path' property. */
ipcMain.on('refresh', async (event, arg: { path: string }) => {
  await listFilesRecursively(root)
    .then((res) => {
      treeNode = res;
      event.reply('refresh', { success: true, treeNode })
    })
    .catch((err) => event.reply('refresh', { success: false, treeNode }));
})

/* The above code is an event listener that listens for the 'get-content' event. When this event is
triggered, it receives an argument of type number. It then logs a message indicating that it has
received the order to get content. */
ipcMain.on('get-content', async (event, arg: number) => {
  console.log("Received order get content")
  const filePath = getPathFromId(arg, treeNode, root)
  await getContent(filePath)
    .then((res) => {
      event.reply('get-content', { success: true, content: res, filePath: filePath })
    })
    .catch((err) => {
      console.log("get-content", err)
      event.reply('get-content', { success: false, content: "", err: err });
    });
});

/* The above code is defining an IPC (Inter-Process Communication) handler in a TypeScript file. The
handler is named 'get-path' and it takes in two arguments: 'event' and 'arg'. The 'event' argument
represents the event that triggered the handler, and the 'arg' argument is expected to be a number. */
ipcMain.handle('get-path', async (event, arg: number) => {
  const filePath = getPathFromId(arg, treeNode, root)
  // console.log("HE HO",filePath)
  return filePath
}
)

/* The above code is an event listener that listens for a 'get-request' event from the main process.
When the event is received, it calls the `parseRequest` function with the argument passed in the
event. The `parseRequest` function is expected to return a promise. If the promise is resolved, it
sends a reply event with a success status and the result of the promise as the content. If the
promise is rejected, it sends a reply event with a success status of false, an empty content, and
the error that was thrown. */
ipcMain.on('get-request', async (event, arg: number) => {
  await parseRequest(arg, treeNode, root)
    .then((res) => { event.reply('get-request', { success: true, content: res }) })
    .catch((err) => {
      event.reply('get-request', { success: false, content: "", err: err });
    });
});

/* The above code is an event listener in a Electron application. It listens for the
'create-config-template' event and expects an argument object with a 'templateId' property. */
ipcMain.on('create-config-template', async (event, arg: { templateId: number }) => {
  console.log("create-config")
  await createConfigFolder(arg.templateId, root).then(async (e) => {
    await listFilesRecursively(root)
      .then((res) => {
        console.log("create-config successfully")
        treeNode = res;
        event.reply('refresh', { success: true, treeNode })
        event.reply('create-config-template', { success: true })
      })
      .catch((err) => event.reply('create-config-template', { success: false }));
  }
  ).catch((err) => {
    console.log("create-config error")
    console.log(err)
    event.reply('create-config-template', { success: true });
  }
  );
});

/* The above code is an event listener in a Electron application using TypeScript. It listens for the
'create-file' event and expects an argument object with a parentID and filename. */
ipcMain.on('create-file', async (event, arg: { parentID: number, filename: String }) => {
  await createFile(getPathFromId(arg.parentID, treeNode, root) + "/" + arg.filename).then((e) => {
    const data = transformExtensionAndType(arg.filename)
    const file = {
      id: treeNode.length + 1,
      parent: arg.parentID,
      droppable: false,
      text: arg.filename,
      path: getPathFromId(arg.parentID, treeNode, root) + "/" + arg.filename,
      data: data
    }
    treeNode.push(file)
    event.reply('create-file', { success: true, treeNode: treeNode });
  }
  ).catch((err) => {
    event.reply('create-file', { success: false, treeNode: treeNode });
  }
  );
});

/* The above code is an event listener in Electron's main process that listens for the 'create-folder'
event. When this event is triggered, it expects an argument object with a parentID and dirname
property. */
ipcMain.on('create-folder', async (event, arg: { parentID: number, dirname: String }) => {
  const folder_path = getPathFromId(arg.parentID, treeNode, root) + "/" + arg.dirname
  await createFolder(folder_path).then(() => {
    const folder = {
      id: treeNode.length + 1,
      parent: arg.parentID,
      droppable: true,
      path: getPathFromId(arg.parentID, treeNode, root) + "/" + arg.dirname,
      text: arg.dirname,
    }
    treeNode.push(folder)
    console.log(treeNode)
    event.reply('create-folder', { success: true, treeNode: treeNode });
  }
  ).catch((err) => {
    console.log(err)
    event.reply('create-folder', { success: false, treeNode: treeNode });
  }
  );
});

/* The above code is an event listener in Electron's main process. It listens for the 'delete-node'
event and performs the following actions: */
ipcMain.on('delete-node', async (event, arg: { nodeID: number }) => {
  const response = await dialog.showMessageBox(mainWindow, {
    type: 'question',
    buttons: ['Oui', 'Non'],
    defaultId: 1,
    title: 'Confirmation de suppression',
    message: 'Êtes-vous sûr de vouloir supprimer ce nœud ?',
    detail: 'Cette action est irréversible.'
  });
  if (response.response === 0) {
    const file_path = getPathFromId(arg.nodeID, treeNode, root)
    await deleteNode(file_path).then(() => {
      event.reply('delete-node', { success: true });
    }
    ).catch((err) => {
      console.log(err)
      event.reply('delete-node', { success: false, err: err });
    }
    );
  }
  else {
    event.reply('delete-node', { success: false, err: "Suppression annulée" });
  }
});

/* The above code is an event listener that listens for the 'rename-node' event. When the event is
triggered, it expects an argument object with a 'nodeID' property (number) and a 'newName' property
(string). */
ipcMain.on('rename-node', async (event, arg: { nodeID: number, newName: String }) => {
  const new_name = path.parse(getPathFromId(arg.nodeID, treeNode, root)).dir + "/" + arg.newName
  await renameNode(getPathFromId(arg.nodeID, treeNode, root), new_name).then(() => {
    event.reply('rename-node', { success: true });
  }
  ).catch((err) => {
    event.reply('rename-node', { success: false, err: err });
  }
  );
});

/* The above code is an event listener in a Electron application using TypeScript. It listens for the
'move-file' event and expects an argument object with 'nodeID' and 'destID' properties. */
ipcMain.on('move-file', async (event, arg: { nodeID: number, destID: number }) => {
  await moveFile(getPathFromId(arg.nodeID, treeNode, root), getPathFromId(arg.destID, treeNode, root) + "/" + path.parse(getPathFromId(arg.nodeID, treeNode, root)).base).then(async () => {
    await listFilesRecursively(root).then(res => treeNode = res)
    event.reply('move-file', { success: true, treeNode: treeNode });
  }
  ).catch((err) => {
    event.reply('move-file', { success: false, err: err });
  }
  );
});

/* The above code is an event listener that listens for the 'write-file' event from the main process.
When the event is triggered, it receives an argument object containing a nodeID and content. */
ipcMain.on('write-file', async (event, arg: { nodeID: number, content: String }) => {
  await writeFile(getPathFromId(arg.nodeID, treeNode, root), arg.content).then(() => {
    event.reply('write-file', { success: true });
  }
  ).catch((err) => {
    event.reply('write-file', { success: false, err: err });
  }
  );
});

/* The above code is an event listener that listens for an 'execute-curl' event. When this event is
triggered, it receives an object containing the method, newUrl, body, and newHeaders. It then
creates a request object using these values and calls the sendRequest function with the request
object. */
ipcMain.on('execute-curl', (event, { method, newUrl, body, newHeaders }) => {
  const request = {
    method: method,
    url: newUrl,
    headers: newHeaders,
    body: body
  };
  sendRequest(request)
    .then(response => {
      console.log('My response: ', response);
      event.reply('execute-curl', { success: true, response: response });
    })
    .catch(error => {
      console.error(error);
    });
  ;

});

/* The above code is an event listener in Electron's main process. It listens for the
'display-response' event and when triggered, it sends a response back to the renderer process with a
success status and the response data. */
ipcMain.on('display-response', async (event, response: string) => {
  event.reply('display-response', { success: true, response: response });
});

ipcMain.on('display-cmake', async (event, cmakeStdout) => {
  console.log("DISPLAY CMAKE:", cmakeStdout);

  if (cmakeStdout instanceof Error) {
    const errorMessage = cmakeStdout.message;
    event.reply('display-cmake', { success: false, cmakeStdout: errorMessage });
  } else {
    event.reply('display-cmake', { success: true, cmakeStdout: cmakeStdout });
  }
});


ipcMain.on('display-make', async (event, makeStdout) => {
  console.log("DISPLAY CMAKE:", makeStdout);

  if (makeStdout instanceof Error) {
    const errorMessage = makeStdout.message;
    event.reply('display-make', { success: false, makeStdout: errorMessage });
  } else {
    event.reply('display-make', { success: true, makeStdout: makeStdout });
  }
});




/* The above code is an event listener in Electron's main process. It listens for the 'add-vhost' event
and expects to receive an object with properties 'vhost' and 'id'. It then calls the 'addVhost'
function with the received 'vhost' and the result of calling 'getPathFromId' function with the
received 'id', 'treeNode', and 'root' as arguments. If the 'addVhost' function resolves
successfully, it logs some messages to the console and sends a success response back to the renderer
process. If the 'addVhost' */
ipcMain.on('add-vhost', async (event, arg: { vhost: any, id: number }) => {
  const path = getPathFromId(arg.id, treeNode, root);
  await addVhost(arg.vhost, path).then(e => {
    console.log("vhost args: ", arg.vhost, arg.id)
    console.log("adding vhost")
    event.reply('add-vhost', { success: true });
  }).catch(err => {
    console.log("adding vhost error 2", err)
    event.reply('add-vhost', { success: false, err: err });
  })
});




// ipcMain.on('find-content', async (event, arg: { target: string }) => {
//   try {
//     const res = await findContent(root, arg.target);
//     event.reply('find-content', { success: true});
//   } catch (err) {
//     event.reply('find-content', { success: false,err: err });
//   }
// });



if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      if (mainWindow === null) createWindow()
    });
  })
  .catch(console.log);

  var ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 100,
    cwd: process.env.HOME,
    env: process.env
  });

  ptyProcess.on("data", (data) => {
    console.log("MMAGIC: ", data)
    mainWindow?.webContents.send("terminal-incData", data);
  });

  ipcMain.on("terminal-into", (event, data) => {
    console.log("data", data)
    ptyProcess.write(data);
  })

  ipcMain.on("resize", (event, size) => {
    console.log("size", size)
    ptyProcess.resize(
      Math.max(size ? size.cols : 80, 30),
      Math.max(size ? size.rows : 10, 30)
  );  })
