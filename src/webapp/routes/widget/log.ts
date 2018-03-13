import { Request, Response } from 'express';
import * as path from 'path';

export function log(request: Request, response: Response) {
  response.render(path.join(__dirname, '../..', 'templates', 'dashboard-log.ejs'));
}
