import * as fs from 'fs';
import * as path from 'path';
import * as request from 'request';

const projectPackageJson = fs.readFileSync(path.join(__dirname, '../../..', 'package.json'));

export default function () {
  return request.defaults({
    headers: {
      'User-Agent': `Status Board/${JSON.parse(projectPackageJson.toString()).version}`,
    },
    jar: true,
  });
}
