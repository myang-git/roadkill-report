
var WHEIGHT = $(window).height();
var WWIDTH = $(window).width();

function init(event, ui) {
  $("#centerContainer").center();
  initFB();
}

function checkFBLoginState() {
  FB.getLoginStatus(function(response) {
    console.log(response);
    if(response.status === 'connected') {
      if(response.authResponse) {
        window.location = '/auth/facebook/callback';
      }
    }
    else {
      console.log('not logged in FB');
    }
  });
}

$(document).on("pageshow", init);

