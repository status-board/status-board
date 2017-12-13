(function () {

  atlasboard.on("widgetInit", function (e, data) {

    var spinner = new Spinner({
      className: 'spinner',
      color: '#f5f5f5',
      width: 5,
      length: 15,
      radius: 25,
      lines: 12,
      speed: 0.7,
      shadow: true
    }).spin();

    $("<div>").addClass("spinner").append(spinner.el).appendTo(data.$widgetContainer.parent());
  });

  atlasboard.on("widgetData", function (e, data) {
    $('.spinner', data.$widgetContainer.parent()).hide();
  });

  atlasboard.on("widgetError", function (e, data) {
    $('.spinner', data.$errorContainer.parent()).hide();
  });

})();