const statusBoard = require('./lib/status-board').default;

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