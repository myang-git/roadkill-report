function initUI() {
//	$('#btnTopReporters').setToProperWidth();
//	$('#btnLogout').setToProperWidth();
	$('#btnLogout').on('click', function() {
		FB.logout(function(response) {
			console.log('logged out');
			window.location = '/signout';
		});
	});
	$('#mainContainer').vcenter();
}

function init(event, ui) {
	var fbConnected = function() {
		console.log("init() - fbConnected");
		initUI();
	};

	var fbNotConnected = function() {
		console.log("init() - fbNotConnected");
	};

	initFB(fbConnected, fbNotConnected);
}

$(document).on("pagecreate", "#home", init);


