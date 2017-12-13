$(function () {

  var MAX_LOG_LINES = 100;

  // escape html - https://github.com/janl/mustache.js/blob/master/mustache.js#L82
  var ENTITY_MAP = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  function timestamp() {
    return '<span class="timestamp">' + moment().format("h:mm:ss") + '</span>';
  }

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return ENTITY_MAP[s];
    });
  }

  function log(container, level, content) {
    var filter = $('div.filter input', '#' + container).val();
    if (filter) {
      if (content.indexOf(filter) == -1) {
        return;
      }
    }

    if ($('.pause', '#' + container).is(':checked')) {
      return;
    }

    content = '<span class="log_text logtype_' + level + '"">' + escapeHtml(content) + '</span>';
    $('.content', '#' + container).prepend('<div class="entry">' + timestamp() + ' ' + content + '</div>');

    // maintain a limit number of entries in the screen (delete old ones)
    if ($('.content .entry', '#' + container).length == (MAX_LOG_LINES + 1)) {
      $('.content .entry', '#' + container)[MAX_LOG_LINES].remove();
    }
  }

  var socket = io.connect();

  socket.on("connect", function () {
    console.log('connected');
    $('#main-container').removeClass("disconnected");

    socket.on("disconnect", function () {
      $('#main-container').addClass("disconnected");
      console.log('disconnected');
    });

    // reconnect
    socket.on('reconnecting', function () {
      console.log('reconnecting...');
    });

    socket.on('reconnect_failed', function () {
      console.log('reconnected FAILED');
    });

    socket.on('client', function (data) {
      log('client', data.error ? 'error' : 'log', JSON.stringify(data));
    });

    socket.on('server', function (data) {
      log('server', data.type, data.msg);
    });

  });

  $('button.clear').click(function () {
    $('div.content', $(this).closest('div.logcontainer')).empty();
  });

  $('.content').on('click', '.entry', function () {
    $(this).toggleClass('expanded');
  });

  $('div.filter input').keyup(function () {
    var filter = $(this).val();
    var entries = $('.content .entry', $(this).closest('div.logcontainer'));
    var pattern = new RegExp(filter);
    entries.each(function () {
      if (filter && !pattern.test($('span.log_text', this).text())) {
        $(this).hide();
      }
      else {
        $(this).show();
      }
    });
  });

});