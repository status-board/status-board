import * as fs from 'fs';
import * as path from 'path';
import * as request from 'request';

const projectPackageJson = fs.readFileSync(path.join(__dirname, '../../..', 'package.json'));

export default function () {
  return request.defaults({
    headers: {
      'User-Agent': 'AtlasBoard/' + JSON.parse(projectPackageJson).version,
    },
    jar: true,
  });
}
