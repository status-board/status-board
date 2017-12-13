module.exports = function (jobWorker, deps) {
  return require('../../logger')(jobWorker, deps.io);
};