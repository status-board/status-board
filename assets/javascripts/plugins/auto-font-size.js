(function () {

  function resizeBaseLineBasedOnWidgetWith($el) {
    var RATIO = 0.035; // ratio width vs font-size. i.e: for a 400 width widget, 400 * 0.035 = 14px font size as baseline
    var divWidth = $el.width();
    var newFontSize = divWidth * RATIO;
    $('.content.auto-font-resize', $el).css({"font-size": newFontSize + 'px'});
  }

  atlasboard.on("widgetInit", function (e, data) {
    resizeBaseLineBasedOnWidgetWith(data.$widgetContainer);
  });

})();