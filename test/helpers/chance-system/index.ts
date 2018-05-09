import directoryPath from './directoryPath';
import fileExt from './fileExt';
import fileName from './fileName';
import filePath from './filePath';
import fileType from './fileType';
import mimeType from './mimeType';

export interface IChanceSystem {
  directoryPath: () => string;
  fileExt: (type?: string) => string;
  fileName: (ext?: string) => string;
  filePath: () => string;
  fileType: () => string;
  mimeType: () => string;
}

export const system: IChanceSystem = {
  directoryPath,
  fileExt,
  fileName,
  filePath,
  fileType,
  mimeType,
};
