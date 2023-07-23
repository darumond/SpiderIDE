import * as React from 'react';
import { useState, useRef, useContext, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { ProjectContext } from '../App';
const ipcRenderer = window.electron.ipcRenderer;

interface File {
    name: string;
    language: string;
    value: string;
}

export default function CodeEditor() {
    const { currentFileId, setCurrentFileId, currentLangage, setCurrentLanguage } = useContext(ProjectContext);
    const [currentFilePath, setCurrentFilePath] = useState(currentFileId);
    const editorRef = useRef();

    const [file, setFile] = useState("");
    useEffect(() => {
        ipcRenderer.sendMessage("get-content", currentFileId);
        //ipcRenderer.sendMessage('get-request', currentFileId);
        ipcRenderer.on('get-content', (arg: any) => {
            const { success, content, filePath } = arg;
            if (success) {
                setFile(content);
                setCurrentFilePath(filePath)
            }
            else {
                setCurrentFilePath(0)
                setCurrentFileId(0);
            }
            //console.log("content got ", content)
        });
        ipcRenderer.on('add-vhost', (arg: any) => {
            ipcRenderer.sendMessage('get-content', currentFileId)
        });
        return () => {
            ipcRenderer.removeAllListeners('get-content')
            ipcRenderer.removeAllListeners('add-vhost')
        }
    }, [currentFileId]);

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

        // Setup Vim keybindings
        editor.addAction({
            id: 'vim-mode',
            label: 'Enable Vim Mode',
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.US_SLASH],
            run: function () {
                monaco.editor.setOptions({
                    readOnly: false,
                    contextmenu: false,
                    minimap: { enabled: false },
                    mouseWheelZoom: false,
                    renderLineHighlight: 'none',
                    scrollbar: { vertical: 'hidden', horizontal: 'hidden' },
                    hideCursorInOverviewRuler: true,
                    hideCursor: true,
                    renderIndentGuides: false,
                });
                monaco.editor.setEditorClassName('vim-mode');
                editor.trigger('keyboard', 'vim.enterInsertMode', {});
                return null;
            }
        });

        // Add status node for Vim mode
        const statusNode = document.createElement('code');
        statusNode.className = 'status-node';
        editor.addOverlayWidget({
            getId: function () {
                return 'vim-status-widget';
            },
            getDomNode: function () {
                return statusNode;
            },
            getPosition: function () {
                return {
                    preference: monaco.editor.OverlayWidgetPositionPreference.BOTTOM_RIGHT_CORNER
                };
            }
        });

        // Initialize Vim mode
        window.require.config({
            paths: {
                'monaco-vim': 'https://unpkg.com/monaco-vim/dist/monaco-vim'
            }
        });

        window.require(['monaco-vim'], function (MonacoVim) {
            MonacoVim.initVimMode(editor, statusNode);
        });
    }

    const handleChange = (e) => {
        ipcRenderer.sendMessage('write-file', {
            nodeID: currentFileId,
            content: e,
        });
    };

    return (
        <>
            {currentFileId === 0 ? (
                <div className="w-full bg-primary-dark flex justify-center align-middle h-full">
                    <div className="flex flex-col justify-center h-full text-xl overflow-hidden whitespace-nowrap">
                        <div
                            style={{
                                width: '100%',
                                height: 100,
                                paddingBottom: '1%',
                                position: 'relative',
                            }}
                        >
                            <iframe
                                src="https://giphy.com/embed/sW0L5TunRpSCFD954x"
                                width="100%"
                                height="100%"
                                style={{ position: 'absolute', pointerEvents: 'none' }}
                                frameBorder="0"
                                className="giphy-embed"
                                allowFullScreen
                            ></iframe>
                        </div>
                        Please select a file
                    </div>
                </div>
            ) : (
                <Editor
                    width="100%"
                    theme="my-theme"
                    path={currentFilePath}
                    onMount={handleEditorDidMount}
                    defaultLanguage={currentLangage}
                    defaultValue={file}
                    onChange={handleChange}
                />
            )}
        </>
    );
}
