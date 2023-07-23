const { getPathFromId, listFilesRecursively } = require('./tree.js')
const assert = require('assert');

let treeNode = []

it('should retrieve info about one node in tests directory', async () => {
   treeNode = await listFilesRecursively('../tests');
   const fileToTest = treeNode[0];
   const expected = { id: 1, 
                      parent: 0, 
                      is_creating: false, 
                      droppable: false,
                      text: 'toto.js', 
                      path: '../tests/toto.js', 
                      data:  { fileType: 'javascript', extension: 'js', icon: ''}};
   const actual = { id: fileToTest.id, 
                    parent: fileToTest.parent, 
                      is_creating: fileToTest.is_creating, 
                      droppable: fileToTest.droppable,
                      text: fileToTest.text, 
                      path: fileToTest.path, 
                      data:  fileToTest.data};
    assert.deepStrictEqual(actual, expected);
});

it('should retrieve info of another node in tests directory', async () => {
   treeNode = await listFilesRecursively('../tests');
   const fileToTest = treeNode[1];
   const expected = { id: 2, 
                      parent: 0, 
                      is_creating: false, 
                      droppable: true,
                      text: 'zoro', 
                      path: '../tests/zoro'};
   const actual = { id: fileToTest.id, 
                      parent: fileToTest.parent, 
                      is_creating: fileToTest.is_creating, 
                      droppable: fileToTest.droppable,
                      text: fileToTest.text, 
                      path: fileToTest.path}
    assert.deepStrictEqual(actual, expected);
});

it('should retrieve path from id 1', async () => {
    const expected = '../tests/toto.js';
    const actual = getPathFromId(1, treeNode, '../tests');
    assert.strictEqual(actual, expected);
});

it('should retrieve path from id 2', async () => {
    const expected = '../tests/zoro';
    const actual = getPathFromId(2, treeNode, '../tests');
    assert.strictEqual(actual, expected);
});


