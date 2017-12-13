const statusBoard = require('./lib/status-board').default;

console.log(statusBoard);


statusBoard(
  {
    port: process.env.ATLASBOARD_PORT || 3000,
    install: false
  },
  function (err) {
    if (err) {
      throw err;
    }
  }
);