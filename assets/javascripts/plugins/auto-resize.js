(function () {

  var mainContainer = $("#main-container");
  var initialWidth = mainContainer.outerWidth();
  var initialHeight = mainContainer.outerHeight();

  $(window).resize(function () {
    var scaleFactorWidth = $(window).width() / initialWidth;
    var scaleFactorHeight = $(window).height() / initialHeight;
    mainContainer.css("transform", "scale(" + Math.min(scaleFactorWidth, scaleFactorHeight) + ")");
  }).resize();

})();