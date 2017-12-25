// -----------------------
// Storage interface
// -----------------------
export default interface IStorageBase {
  get(key: any, callback: any): void;
  set(key: any, value: any, callback: any): void;
}
