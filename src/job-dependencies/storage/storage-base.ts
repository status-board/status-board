// -----------------------
// Storage interface
// -----------------------
import { noop } from '../../helpers';

export default function storageBase() {
  return {
    get: noop,
    set: noop,
  };
}
