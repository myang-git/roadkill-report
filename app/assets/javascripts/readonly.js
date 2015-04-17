function initUI() {
//	$('#btnTopReporters').setToProperWidth();
//	$('#btnLogout').setToProperWidth();
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


