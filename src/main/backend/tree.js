const fs = require('fs');
const path = require('path');

/**
 * The function `transformExtensionAndType` takes a filename as input and returns the corresponding
 * extension, file type, and icon based on certain conditions.
 * @param filename - The `filename` parameter is a string that represents the name of a file, including
 * its extension.
 * @returns an object with three properties: "extension", "fileType", and "icon".
 */
function transformExtensionAndType(filename) {
    const splitFilename = filename.split('.');
    const extension = splitFilename.pop();
    let icon = '';
    let newExtension = '';
    let newType = '';
    if(filename === 'Dockerfile')
    {
        newExtension = filename;
        newType = 'docker';
    }
    else if (extension === 'cpp' || extension == 'cc') {
        newExtension = 'cc';
        newType = 'cpp';
    } else if (extension === 'hxx' || extension === 'hpp' || extension === 'hh') {
        newExtension = 'hh';
        newType = 'hpp';
    } else if (splitFilename[0] === 'CMakeLists') {
        icon = 'cmake';
        newExtension = extension;
        newType = 'cmake';
    } else if (extension.includes("git")) {
        newExtension = 'git'
        newType = 'git'
    }
    else if (extension === "yml" || extension === "yaml")
    {
        newExtension = extension;
        newType = filename.includes(".gitlab") ? 'gitlab' : 'yml'
    }
    else if (extension === 'py') {
        newExtension = 'py';
        newType = 'python';
    } else if (extension === 'json') {
        newExtension = 'json';
        newType = 'json';
    } else if (extension === 'js') {
        newExtension = 'js'
        newType = 'javascript'
    } else if (filename.toLowerCase() === 'readme.md') {
        newExtension = 'Readme';
        newType = 'markdown';
    } else if (extension === 'md') {
        newExtension = 'markdown';
        newType = 'markdown';
    }
    else if (extension === 'txt') {
        newExtension = extension;
        newType = 'text'
    }
    else if (splitFilename.length === 0) {
        newExtension = ''
        newType = 'text'
    }
    
    return {
        extension: newExtension,
        fileType: newType,
        icon: icon
    };
}

/**
 * The function `listFilesRecursively` recursively lists all files and directories in a given directory
 * and returns them as a tree structure.
 * @param [dir=./] - The `dir` parameter is the directory path from which you want to start listing the
 * files recursively. By default, it is set to the current directory (`'./'`).
 * @param [parentId=0] - The `parentId` parameter is used to keep track of the parent node's ID in the
 * recursive function. It is used to assign the correct parent ID to each directory or file node in the
 * tree structure.
 * @param [treeNode] - The `treeNode` parameter is an array that represents the tree structure of the
 * files and directories in the given directory. Each element in the array represents a node in the
 * tree and contains information about the node, such as its ID, parent ID, text (name), path, and
 * other properties depending
 * @returns The function `listFilesRecursively` returns a tree node array that represents the directory
 * structure and files found in the specified directory.
 */
async function listFilesRecursively(dir = './', parentId = 0, treeNode = []) {
    const files = fs.readdirSync(dir);
    files.forEach(node => {
        const filePath = path.join(dir, node);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            const directory = {
                id: treeNode.length + 1,
                parent: parentId,
                is_creating: false,
                droppable: true,
                text: node,
                path: filePath
            };
            treeNode.push(directory);
            listFilesRecursively(filePath, directory.id, treeNode);
        } else {
            const { extension, fileType, icon } = transformExtensionAndType(node);
            const file = {
                id: treeNode.length + 1,
                parent: parentId,
                is_creating: false,
                droppable: false,
                text: node,
                path: filePath,
                data: {
                    fileType: fileType,
                    extension: extension,
                    icon: icon
                }
            };
            treeNode.push(file);
        }
    });
    return treeNode;
}

/**
 * The function `getPathFromId` takes an `id`, a `jsonList`, and an optional `root` path, and returns
 * the path of the item with the given `id` in the `jsonList` as a string.
 * @param id - The `id` parameter is the unique identifier of the item for which you want to retrieve
 * the path.
 * @param jsonList - The `jsonList` parameter is an array of objects representing a hierarchical
 * structure. Each object in the array has the following properties:
 * @param [root=./] - The `root` parameter is a string that represents the root directory or path where
 * the file or folder structure begins. It is optional and has a default value of `'./'`, which
 * represents the current directory.
 * @returns a string representing the path of an item in a JSON list based on its ID.
 */
function getPathFromId(id, jsonList, root = './') {
    if (id === 0)
        return root;

    const item = jsonList.find(item => item.id === id);
    if (!item) {
        return "";
    }

    const path = [item.text];
    let parentId = item.parent;
    while (parentId !== 0) {
        const parentItem = jsonList.find(item => item.id === parentId);
        if (parentItem) {
            path.unshift(parentItem.text);
            parentId = parentItem.parent;
        } else {
            break;
        }
    }

    const finalRoot = root.endsWith('/') ? root.slice(0, -1) : root;
    return finalRoot + '/' + path.join("/");
}

module.exports = { getPathFromId, listFilesRecursively, transformExtensionAndType};
