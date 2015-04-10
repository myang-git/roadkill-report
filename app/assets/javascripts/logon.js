
var WHEIGHT = $(window).height();
var WWIDTH = $(window).width();

function init(event, ui) {
  $("#centerContainer").center();
}

$(document).on("pageshow", init);

