import MixinDescriptor = Chance.MixinDescriptor;
import directoryPath from './directoryPath';
import fileExt from './fileExt';
import fileName from './fileName';
import filePath from './filePath';
import fileType from './fileType';
import mimeType from './mimeType';

export const system: MixinDescriptor = {
  directoryPath,
  fileExt,
  fileName,
  filePath,
  fileType,
  mimeType,
};
