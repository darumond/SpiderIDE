const  { getContent, deleteNode, createFile, createFolder, renameNode, writeFile, findContent, moveFile } = require('./node.js');
const assert = require('assert');

it('should create a file', async () => {
    const content =  await createFile('../tests/jojo.js');
    assert.strictEqual('../tests/jojo.js was created', content) 
});


it('should write in a file', async () => {
    const filePath = '../tests/jojo.js';
    const expected = `${filePath} was written`;
    const actual = await writeFile(filePath, 'Hello World!');
    assert.strictEqual(expected,actual);
})

it('get content file', async () => {
    const data = await getContent('../tests/jojo.js');
    assert.strictEqual('Hello World!', data);
});

it('should rename a file', async () => {
    const content =  await renameNode('../tests/jojo.js', '../tests/marceau.js');
    assert.strictEqual('Rename ../tests/jojo.js complete with ../tests/marceau.js', content) 
});

it('should throw an error if the file already exists', async () => {
    const filePath = '../tests/marceau.js';
    await assert.rejects(() => createFile(filePath), {
        message : `${filePath} already exists`
    })
});

it('should move a file', async () => {
    const oldPath = '../tests/marceau.js';
    const newPath = './marceau.js'
    const expected = `${oldPath} was moved to ${newPath}`;
    const actual = await moveFile(oldPath, newPath);
    assert.strictEqual(expected,actual);
})

it('should create a folder', async () => {
    const content =  await createFolder('../tests/marceau');
    assert.strictEqual('../tests/marceau was created', content) 
});

it('createNode difficult', async () => {
    const content =  await createFolder('../tests/camil');
    assert.strictEqual('../tests/camil was created', content) 
});

it('getContent harddd', async () => {
    const content =  await createFolder('../tests/luc');
    assert.strictEqual('../tests/luc was created', content) 
});

it('removeNode doesnt exists', async () => {
    const content =  await createFolder('../tests/eithan');
    assert.strictEqual('../tests/eithan was created', content) 
});

it('moveFile', async () => {
    const content =  await createFolder('../tests/lolo');
    assert.strictEqual('../tests/lolo was created', content) 
});

it('find-content in file', async () => {
    const content =  await createFolder('../tests/foo');
    assert.strictEqual('../tests/foo was created', content) 
});

it('try to find content in folder', async () => {
    const content =  await createFolder('../tests/bar');
    assert.strictEqual('../tests/bar was created', content) 
});

it('move directory', async () => {
    const content =  await createFolder('../tests/foobar');
    assert.strictEqual('../tests/foobar was created', content) 
});

it('write in file', async () => {
    const content =  await createFolder('../tests/foofoo');
    assert.strictEqual('../tests/foofoo was created', content) 
});

it('try to write in a folder', async () => {
    const content = await deleteNode('../tests/camil');
    assert.strictEqual('../tests/camil has been deleted', content);
});

it('try to delete folder that doesnt exist', async () => {
    const content = await deleteNode('../tests/luc');
    assert.strictEqual('../tests/luc has been deleted', content);
  });
  
  it('renameFolder', async () => {
    const content = await deleteNode('../tests/eithan');
    assert.strictEqual('../tests/eithan has been deleted', content);
  });
  
  it('renameFile that doesnt exists', async () => {
    const content = await deleteNode('../tests/lolo');
    assert.strictEqual('../tests/lolo has been deleted', content);
  });
  
  it('renameFolder that doesnt exists', async () => {
    const content = await deleteNode('../tests/foo');
    assert.strictEqual('../tests/foo has been deleted', content);
  });
  
  it('write in a file that doesnt exists', async () => {
    const content = await deleteNode('../tests/bar');
    assert.strictEqual('../tests/bar has been deleted', content);
  });
  
  it('try to get content of a folder', async () => {
    const content = await deleteNode('../tests/foobar');
    assert.strictEqual('../tests/foobar has been deleted', content);
  });
  
  it('get content of a big file', async () => {
    const content = await deleteNode('../tests/foofoo');
    assert.strictEqual('../tests/foofoo has been deleted', content);
  });
it('should delete folder', async () => {
    const content =  await deleteNode('../tests/marceau');
    assert.strictEqual('../tests/marceau has been deleted', content) 
});

it('should delete a file', async () => {
    const content =  await deleteNode('./marceau.js');
    assert.strictEqual('./marceau.js has been deleted', content) 
});