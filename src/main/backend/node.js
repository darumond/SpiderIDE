const fs = require('fs');
const path = require('path');

/**
 * The function `getContent` reads the content of a file and returns it as a promise.
 * @param filePath - The `filePath` parameter is a string that represents the path to the file you want
 * to read. It should include the file name and extension. For example, if you want to read a file
 * named "example.txt" located in the same directory as your code file, you would pass the value "./
 * @returns The function `getContent` is returning a Promise object.
 */
function getContent(filePath) {
  return new Promise(function (resolve, reject) {
    fs.readFile(filePath, 'utf8', function (err, data) {
      if (err)
        reject(err);
      else
        resolve(data);
    });
  });
}


/**
 * The function `deleteNode` deletes a file or directory at the specified path.
 * @param path - The `path` parameter is a string that represents the file or directory path that you
 * want to delete.
 * @returns a Promise.
 */
function deleteNode(path) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(path)) {
      if (fs.lstatSync(path).isDirectory()) {
        deleteFolderRecursive(path)
          .then(() => resolve(`${path} has been deleted`))
          .catch((err) => reject(err));
      } else {
        fs.unlink(path, (err) => {
          if (err)
            reject(err);
          else
            resolve(`${path} has been deleted`);
        });
      }
    }
  });
}

/**
 * The function `deleteFolderRecursive` recursively deletes a folder and all its contents in
 * JavaScript.
 * @param folderPath - The `folderPath` parameter is the path to the folder that you want to delete
 * recursively.
 * @returns The function `deleteFolderRecursive` returns a Promise.
 */
function deleteFolderRecursive(folderPath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(folderPath)) {
      fs.readdir(folderPath, (err, files) => {
        if (err) {
          reject(err);
          return;
        }

        const promises = files.map((file) => {
          const filePath = path.join(folderPath, file);
          if (fs.lstatSync(filePath).isDirectory()) {
            return deleteFolderRecursive(filePath);
          } else {
            return new Promise((resolve, reject) => {
              fs.unlink(filePath, (err) => {
                if (err)
                  reject(err);
                else
                  resolve();
              });
            });
          }
        });

        Promise.all(promises)
          .then(() => {
            fs.rmdir(folderPath, (err) => {
              if (err)
                reject(err);
              else
                resolve();
            });
          })
          .catch((err) => reject(err));
      });
    } else {
      resolve();
    }
  });
}


/**
 * The function creates a file at the specified path if it doesn't already exist.
 * @param path - The `path` parameter is a string that represents the file path where the new file will
 * be created.
 * @returns The function `createFile` is returning a Promise.
 */
function createFile(path) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(path)) {
      reject(new Error(`${path} already exists`));
      return;
    }
    fs.writeFile(path, '', (err) => {
      if (err)
        reject(err);
      else
        resolve(`${path} was created`);
    });
  });
}

/**
 * The function creates a new folder at the specified path and returns a promise that resolves with a
 * success message or rejects with an error.
 * @param path - The `path` parameter is a string that represents the directory path where the folder
 * will be created.
 * @returns a Promise object.
 */
function createFolder(path) {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, function (err) {
      if (err)
        reject(err);
      else
        resolve(`${path} was created`);
    });
  }
  );
}


/**
 * The function `renameNode` renames a file or directory at the given path to the specified new name.
 * @param path - The `path` parameter is the current name or location of the node (file or directory)
 * that you want to rename.
 * @param newName - The `newName` parameter is the new name that you want to give to the node or file
 * at the specified `path`.
 * @returns a Promise.
 */
function renameNode(path, newName) {
  return new Promise((resolve, reject) => {
    fs.rename(path, newName, (err) => {
      if (err)
        reject(err);
      else
        resolve(`Rename ${path} complete with ${newName}`);
    });
  }
  );
}

/**
 * The function `writeFile` writes content to a file at the specified path and returns a promise that
 * resolves when the file is successfully written.
 * @param path - The path parameter is a string that represents the file path where the content will be
 * written to. It should include the file name and extension.
 * @param content - The `content` parameter is the data that you want to write to the file. It can be a
 * string, a buffer, or an object that will be converted to a string.
 * @returns The function `writeFile` is returning a Promise object.
 */
function writeFile(path, content) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(path, content, function (err) {
      if (err) {
        reject(err);
      }
      else {
        resolve(`${path} was written`);
      }
    });
  }
  );
}

/**
 * The function `moveFile` moves a file from the old path to the new path and returns a promise that
 * resolves with a success message or rejects with an error.
 * @param oldPath - The old path is the current location or directory of the file that you want to
 * move. It is the path to the file that you want to move.
 * @param newPath - The `newPath` parameter is the new path or location where you want to move the file
 * to. It should be a string representing the new file path, including the file name and extension.
 * @returns a Promise.
 */
function moveFile(oldPath, newPath) {
  return new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, (err) => {
      if (err)
        reject(err);
      else
        resolve(`${oldPath} was moved to ${newPath}`);
    });
  }
  );
}


/**
 * The function `findContent` recursively searches for a target string in all files within a given
 * directory and returns an array of objects containing the file path, line number, and column where
 * the target string is found.
 * @param target - The `target` parameter is the string that you want to search for in the content of
 * the files.
 * @param [directory] - The `directory` parameter is the path to the directory where you want to search
 * for files. By default, it is set to `__dirname`, which is a Node.js variable that represents the
 * current directory of the script file.
 * @param [files] - The `files` parameter is an array that is used to store the information about the
 * files that contain the target content. It is initially empty and gets populated as the function
 * recursively searches through the directory and its subdirectories. Each file that contains the
 * target content is represented as an object with the following properties
 * @returns an array of objects that represent the files where the target content was found. Each
 * object in the array contains the filePath, lineNumber, and column where the target content was found
 * in the file.
 */
function findContent(target, directory = __dirname, files = []) {
  fs.readdir(directory, { withFileTypes: true }, (err, files) => {
    if (err)
      throw err;
    files.forEach((file) => {
      const filePath = path.join(directory, file.name);

      if (file.isDirectory())
        findContent(target, filePath);
      else {
        fs.readFile(filePath, 'utf8', function (err, data) {
          if (err)
            throw err;
          const lines = data.split('\n');
          lines.forEach((line, lineNumber) => {
            const column = line.indexOf(target);
            if (column >= 0)
              files.push({ filePath, lineNumber, column });
          });
        });
      }
    });
  });
  return files;
}

module.exports = { getContent, deleteNode, createFile, createFolder, renameNode, writeFile, findContent, moveFile };
