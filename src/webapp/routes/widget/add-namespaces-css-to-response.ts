import { Response } from 'express';
import { addNamespace } from './add-namespace';

export function addNamespacesCSSToResponse(css: string, namespace: string, response: Response) {
  response.write('<style>');
  addNamespace(css, response, namespace);
  response.write('</style>');
}
