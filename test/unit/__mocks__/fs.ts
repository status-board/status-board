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
 * fs.existsSync
 */
function existsSync(path) {
  if (path === '/packages') return true;
  if (path === '/packages/default/dashboards') return true;
  if (path === '/packages/default/jobs') return true;
  if (path === '/packages/default/widgets') return true;
  if (path === '/packages/demo/dashboards') return true;
  if (path === '/packages/demo/dashboards/myfirst_dashboard.json') return true;
  if (path === '/packages/demo/jobs') return true;
  if (path === '/packages/demo/jobs/google-calendar/google-calendar.js') return true;
  if (path === '/packages/demo/jobs/issue-types/issue-types.js') return true;
  if (path === '/packages/demo/jobs/picture-of-the-day/picture-of-the-day.js') return true;
  if (path === '/packages/demo/jobs/quotes/quotes.js') return true;
  if (path === '/packages/demo/jobs/sales-graph/sales-graph.js') return true;
  if (path === '/packages/demo/widgets') return true;
  if (path === '/packages/demo/widgets/calendar/calendar.styl') return true;
  if (path === '/packages/demo/widgets/calendar/calendar.html') return true;
  if (path === '/packages/demo/widgets/calendar/calendar.js') return true;
  if (path === '/packages/demo/widgets/image/image.styl') return true;
  if (path === '/packages/demo/widgets/image/image.html') return true;
  if (path === '/packages/demo/widgets/image/image.js') return true;
  if (path === '/packages/demo/widgets/keyvaluelist/keyvaluelist.styl') return true;
  if (path === '/packages/demo/widgets/keyvaluelist/keyvaluelist.html') return true;
  if (path === '/packages/demo/widgets/keyvaluelist/keyvaluelist.js') return true;
  if (path === '/packages/demo/widgets/linegraph/linegraph.styl') return true;
  if (path === '/packages/demo/widgets/linegraph/linegraph.html') return true;
  if (path === '/packages/demo/widgets/linegraph/linegraph.js') return true;
  if (path === '/packages/demo/widgets/quotes/quotes.styl') return true;
  if (path === '/packages/demo/widgets/quotes/quotes.html') return true;
  if (path === '/packages/demo/widgets/quotes/quotes.js') return true;
  if (path === '/empty/item/directory') return true;
  if (path === '/read/items/from/package/dir/error') return true;
  if (path === '/read/items/from/package/dir/error/fake-directory/widgets') return true;
  if (path === '/fill/packages/error') return true;
  if (path === '/file/doesnt/match/extension') return true;
  if (path === '/file/doesnt/match/extension/fake-directory/widgets') return true;
  return false;
}

fs.existsSync = existsSync;

/*
 * fs.readdir
 */
function readdir(path, cb) {
  if (path === '/packages') return cb(null, ['default', 'demo']);
  if (path === '/packages/default/dashboards') return cb(null, []);
  if (path === '/packages/default/jobs') return cb(null, ['another-test-job', 'another-test-job-2', 'test-job']);
  if (path === '/packages/default/widgets') return cb(null, ['another-test-widget', 'another-test-widget-2', 'test-widget']);
  if (path === '/packages/demo/dashboards') return cb(null, ['myfirst_dashboard.json']);
  if (path === '/packages/demo/jobs') return cb(null, ['google-calendar', 'issue-types', 'picture-of-the-day', 'quotes', 'sales-graph']);
  if (path === '/packages/demo/widgets') return cb(null, ['calendar', 'image', 'keyvaluelist', 'linegraph', 'quotes']);
  if (path === '/empty/item/directory') return cb(null, ['fake-directory']);
  if (path === '/read/items/from/package/dir/error') return cb(null, ['fake-directory']);
  if (path === '/file/doesnt/match/extension') return cb(null, ['fake-directory']);
  if (path === '/file/doesnt/match/extension/fake-directory/widgets') return cb(null, ['fake-widget']);
  return cb('ERROR');
}

fs.readdir = readdir;

/*
 * fs.statSync
 */
function statSync(path) {
  if (path === '/packages/default') return { isDirectory: () => true };
  if (path === '/packages/default/jobs/another-test-job') return { isDirectory: () => true };
  if (path === '/packages/default/jobs/another-test-job-2') return { isDirectory: () => true };
  if (path === '/packages/default/jobs/test-job') return { isDirectory: () => true };
  if (path === '/packages/default/widgets/test-widget') return { isDirectory: () => true };
  if (path === '/packages/default/widgets/another-test-widget') return { isDirectory: () => true };
  if (path === '/packages/default/widgets/another-test-widget-2') return { isDirectory: () => true };
  if (path === '/packages/demo') return { isDirectory: () => true };
  if (path === '/packages/demo/jobs/google-calendar') return { isDirectory: () => true };
  if (path === '/packages/demo/jobs/issue-types') return { isDirectory: () => true };
  if (path === '/packages/demo/jobs/picture-of-the-day') return { isDirectory: () => true };
  if (path === '/packages/demo/jobs/quotes') return { isDirectory: () => true };
  if (path === '/packages/demo/jobs/sales-graph') return { isDirectory: () => true };
  if (path === '/packages/demo/widgets/calendar') return { isDirectory: () => true };
  if (path === '/packages/demo/widgets/image') return { isDirectory: () => true };
  if (path === '/packages/demo/widgets/keyvaluelist') return { isDirectory: () => true };
  if (path === '/packages/demo/widgets/linegraph') return { isDirectory: () => true };
  if (path === '/packages/demo/widgets/quotes') return { isDirectory: () => true };
  if (path === '/empty/item/directory/fake-directory') return { isDirectory: () => true };
  if (path === '/read/items/from/package/dir/error/fake-directory') return { isDirectory: () => true };
  if (path === '/file/doesnt/match/extension/fake-directory') return { isDirectory: () => true };
  return { isDirectory: () => false };
}

fs.statSync = statSync;

/*
 * Export FS
 */
module.exports = fs;
