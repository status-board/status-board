//-----------------------
// Storage interface
//-----------------------

function StorageBase (){ }

StorageBase.prototype.get = function (key, callback){};

StorageBase.prototype.set = function (key, value, callback){};

module.exports = StorageBase;