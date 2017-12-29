const fs = jest.genMockFromModule('fs');

/*
 * fs.readFileSync
 */
let mockedFile = null;

function setMockedFile(newMockedFile) {
  mockedFile = Buffer.from(JSON.stringify(newMockedFile));
}

function readFileSync() {
  return mockedFile || Buffer.from(JSON.stringify({}));
}

function readFile(path, callback) {
  if (path.includes('valid_path')) {
    callback(null, '{"name":"dashboard"}');
  } else if (path.includes('invalid_content')) {
    callback(null, 'invalid content');
  } else if (path.includes('error_path')) {
    callback(Error('ERROR'));
  }
}

fs.__setMockedFile = setMockedFile;
fs.readFileSync = readFileSync;
fs.readFile = readFile;

/*
 * fs.stat
 */
let isFileResponse = null;

function setIsFileResponse(response) {
  isFileResponse = response;
}

const stat = jest.fn((filePath, callback) => {
  if (isFileResponse === 'ENOENT') {
    return callback({ code: 'ENOENT' });
  }
  if (isFileResponse === 'ERROR') {
    return callback(Error('ERROR'));
  }
  return callback(null, {
    isFile: () => {
      return isFileResponse || false;
    },
  });
});

fs.__setIsFileResponse = setIsFileResponse;
fs.stat = stat;

/*
 * Export FS
 */
module.exports = fs;
