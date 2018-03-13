import * as path from 'path';

export function getSafeItemName(itemName: any) {
  return path.basename(itemName).split('.')[0];
}
