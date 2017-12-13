//= jquery
//= jquery.gridster.with-extras
//= underscore

var atlasboard = atlasboard || {};

atlasboard.triggerEvent = function () {
  var $sender = $('#widgets-container');
  $sender.trigger.apply($sender, arguments);
};

atlasboard.on = function () {
  var $sender = $('#widgets-container');
  $sender.on.apply($sender, arguments);
};

$(function () {

  var widgetDefaultHandlers = { // widget API. Can be extended widgets

    /**
     * Called when the widget gets initialised. Before the arrival of first data
     * @param {JQuery} $widgetContainer widget container object
     * @param {string} widgetId
     */

    onInit: function () {
      atlasboard.triggerEvent("widgetInit", {
        $widgetContainer: arguments[0],
        widgetId: arguments[1]
      });
    },

    /**
     * Called when the widget receives an error response from the server
     * @param {JQuery} $errorContainer error container object
     * @param {Object} data data parameter
     * @param {Object} data.error error object
     * @param {string} widgetId
     */

    onError: function () {
      atlasboard.triggerEvent("widgetError", {
        $errorContainer: arguments[0],
        data: arguments[1],
        widgetId: arguments[2]
      });
    },

    /**
     * Called when the widget receives data from the server
     * @param {JQuery} $widgetContainer widget container object
     * @param {Object} data data parameter
     * @param {string} widgetId
     */

    onData: function () {
      atlasboard.triggerEvent("widgetData", {
        $widgetContainer: arguments[0],
        data: arguments[1],
        widgetId: arguments[2]
      });
    },

    log: function (data) {
      socket.emit('log', {widgetId: this.eventId, data: data}); // emit to logger
    }
  };

  function logError(widget, err) {
    var errMsg = 'ERROR on ' + widget.eventId + ': ' + err;
    console.error(errMsg);
    socket.emit('log', {widgetId: widget.eventId, error: errMsg}); // emit to logger
  }

  function wrapFn(obj, f1, f2) {
    return function () {
      f1.apply(obj, arguments);
      f2.apply(obj, arguments);
    }
  }

  function extendWrapping(widgetJS, widgetDefaultHandlers) {
    for (var handler in widgetDefaultHandlers) {
      if (widgetJS[handler]) {
        widgetJS[handler] = wrapFn(widgetJS, widgetJS[handler],
            widgetDefaultHandlers[handler]);
      } else {
        widgetJS[handler] = widgetDefaultHandlers[handler];
      }
    }
    return widgetJS;
  }

  function bindWidget(io, $li) {
    var widgetId = encodeURIComponent($li.attr("data-widget-id"));
    var eventId = $li.attr("data-event-id");

    var $widgetContainer = $("<div>").addClass("widget-container").appendTo($li).hide();
    var $errorContainer = $("<div>").addClass("widget-error").appendTo($li).hide();

    // fetch widget html and css
    $widgetContainer.load("/widgets/" + widgetId, function () {

      // fetch widget js
      $.get('/widgets/' + widgetId + '/js', function (js) {

        var widgetJS = {};
        try {
          eval('widgetJS = ' + js);
          widgetJS.eventId = eventId;
          widgetJS = extendWrapping(widgetJS, widgetDefaultHandlers);
          widgetJS.onInit($widgetContainer, widgetId);
        }
        catch (e) {
          logError(widgetJS, e);
        }

        io.on(eventId, function (data) {
          if (data.error) {
            widgetJS.onError.apply(widgetJS, [$errorContainer, data, widgetId]);
          } else {

            if (!$widgetContainer.is(':visible')) {
              $widgetContainer.siblings().fadeOut(500);
              $widgetContainer.fadeIn(500);
            }
            widgetJS.onData.apply(widgetJS, [$widgetContainer, data, widgetId]);
          }
        });

        io.emit("resend", eventId);
      });
    });
  }

  // disable caching for now as chrome somehow screws things up sometimes
  $.ajaxSetup({cache: false});

  var gridsterContainer = $(".gridster ul");

  var serverInfo;
  var socket = io.connect();

  socket.on("connect", function () {
    atlasboard.triggerEvent("socketConnected", {socket: socket});
  });

  socket.on("disconnect", function () {
    atlasboard.triggerEvent("socketDisconnected", {socket: socket});
  });

  socket.on('reconnecting', function () {
    atlasboard.triggerEvent("socketReconnecting", {socket: socket});
  });

  socket.on('reconnect_failed', function () {
    atlasboard.triggerEvent("socketReconnectFailed", {socket: socket});
  });

  socket.on("serverinfo", function (newServerInfo) {
    if (!serverInfo) {
      serverInfo = newServerInfo;
    } else if (newServerInfo.startTime > serverInfo.startTime) {
      window.location.reload();
    }
  });

  gridsterContainer.children("li").each(function (index, li) {
    var $li = $(li);
    $li.empty();
    bindWidget(socket, $li);
  });

});
