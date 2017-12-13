(function () {

  atlasboard.on("widgetError", function (e, data) {

    console.error(data.error || data);

    var $errorContainer = data.$errorContainer;
    if (data.data && data.data.error === 'disabled') {
      $errorContainer.html('<span class="disabled">DISABLED</span>');
    } else {
      $errorContainer.html('<span class="error">&#9888;</span>');
    }

    if (!$errorContainer.is(':visible')) {
      $errorContainer.siblings().hide();
      $errorContainer.fadeIn();
    }
  });

})();