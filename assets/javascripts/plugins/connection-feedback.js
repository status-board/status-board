(function () {

  atlasboard.on("socketConnected", function (e) {
    console.log('connected');
    $('#main-container').removeClass("disconnected");
  });

  atlasboard.on("socketDisconnected", function (e) {
    $('#main-container').addClass("disconnected");
    console.log('disconnected');
  });

  atlasboard.on("socketReconnectFailed", function (e) {
    console.log('reconnected FAILED');
  });

  atlasboard.on("socketReconnecting", function (e) {
    console.log('reconnecting...');
  });

})();