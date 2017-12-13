(function () {

  // GRID_ROWS and GRID_COLUMNS are globals defined in the template file

  var mainContainer = $("#main-container");
  var gridsterContainer = $(".gridster ul");
  var gutter = parseInt(mainContainer.css("paddingTop"), 10) * 2;
  var gridsterGutter = gutter / 2;
  var height = 1080 - mainContainer.offset().top - gridsterGutter;
  var width = mainContainer.width();
  var vertical_cells = GRID_ROWS, horizontal_cells = GRID_COLUMNS;
  var widgetSize = {
    w: (width - horizontal_cells * gutter) / horizontal_cells,
    h: (height - vertical_cells * gutter) / vertical_cells
  };

  gridsterContainer.gridster({
    'widget_margins': [gridsterGutter, gridsterGutter],
    'widget_base_dimensions': [widgetSize.w, widgetSize.h]
  });

})();