//-----------------------
// Storage interface
//-----------------------

function StorageBase (){ }

StorageBase.prototype.get = function (key: any, callback: any){};

StorageBase.prototype.set = function (key: any, value: any, callback: any){};

module.exports = StorageBase;