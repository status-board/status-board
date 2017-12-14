import * as fs from 'fs';
import * as request from 'request';

const projectPackageJson = fs.readFileSync('../../../package.json');

export default function () {
  return request.defaults({
    headers: {
      'User-Agent': 'AtlasBoard/' + JSON.parse(projectPackageJson).version,
    },
    jar: true,
  });
}
