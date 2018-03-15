import * as Chance from 'chance';
import mimeTypes from './mime-types';

const chance = new Chance();

/**
 * returns a commonly used file extension based on optional type
 *
 * @method chance.system.fileExt
 * @param {string} type
 */
export default function (type?: string): string {
  const types = [
    'application/pdf',
    'audio/mpeg',
    'audio/wav',
    'image/png',
    'image/jpeg',
    'image/gif',
    'video/mp4',
    'video/mpeg',
    'text/html',
  ];
  const mimeType = type ? mimeTypes[type] : mimeTypes[chance.pickone(types)];
  const fileExts = mimeType.extensions;

  return `.${chance.pickone(fileExts)}`;
}
