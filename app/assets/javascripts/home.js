var LOCATION_SERVICE_TIMEOUT = 10000;
var HTTP_REQUEST_TIMEOUT = 10000;
var GOOGLE_MAPS_API_URL = "http://maps.googleapis.com/maps/api/geocode/json?language=zh-TW&sensor=true&latlng=";
var CAMERA_IMAGE = "/assets/camera.png";
var DEFAULT_MAP_CENTER = {lat: 23.97565, lng: 120.973882};
var LOCATION_ERROR_MESSAGE = "無法定位";
var LOCATION_SERVICE_INTERRUPTED = "請手動標記位置";
var GETTING_LOCATION_MESSAGE = "定位中...";
var LOCATION_SERVICE_UNAVAILABLE = "手機或瀏覽器不具備定位功能，或定位功能尚未啟用";
var GEOCODING_SERVICE_UNAVAILABLE = "無法取得地址";
var PHOTO_UNAVAILABLE = "請先拍照記錄";
var LOCATION_SERVICE_DENIED = "請允許網站使用定位服務";
var CHINESE_DIGITS = ['一', '二', '三'];
var UPLOAD_DONE = "上傳成功!";
var UPLOAD_FAILED = "無法上傳，請稍後再試";
var UPLOADING = "上傳中..."; 
var PICK_LOCATION = "請點選地點";
var PICK_DATE = "請選拍攝日期"; 
var PROCESSING = "處理中...";
var PARSE_GEOCODING_RESULT_FAILED = "無法解析地址資訊";
var GEOCODING_SERVICE_ERROR = "地址查詢產生錯誤";
var NO_PUBLISH_ACTIONS_PERMISSION = "尚未取得貼文授權，請重新登入並允許APP貼文至Facebook"

/* ui elements */
var btnUpload;
var editPopup;
var uiReady = false;

/* views */
var eventRows = [];
var mapView = null;

/* models */
var rkreport = null;

function Lightbox(element) {
	this.element = $(element);
	this.image = this.element.find("#lightboxImg");
}

Lightbox.prototype.setImageSrc = function(src) {
	this.image.attr("src", src);
};

Lightbox.prototype.open = function() {
	this.element.popup("open", {positionTo: "window"});
};

function LocationManager() {
	this.elevationService = new google.maps.ElevationService();
}
LocationManager.PERMISSION_DENIED = 1;
LocationManager.POSITION_UNAVAILABLE = 2;
LocationManager.TIMEOUT = 3;
LocationManager.LOCATION_SERVICE_UNAVAILABLE = 996;
LocationManager.GEOCODING_REQUEST_FAILED = 998;

LocationManager.prototype.getAddress = function(lat, lng, callback) {
	var fullURL = GOOGLE_MAPS_API_URL + lat + "," + lng;
	var request = $.ajax({
		url: fullURL,
		type: "GET",
		timeout: HTTP_REQUEST_TIMEOUT
	});
	
	var requestDone = function(geocodingResponse) {
		if (geocodingResponse.status=="OK" && geocodingResponse.results.length>0) {
			var address = parseGeocodingResult(geocodingResponse);
			if(address!=null) {
				$.proxy(callback.handleAddress, callback)(address);
			}
			else {
				$.proxy(callback.handleLocationError, callback)({code: 995, message: PARSE_GEOCODING_RESULT_FAILED});
			}
		}
		else {
			$.proxy(callback.handleLocationError, callback)({code: 994, message: GEOCODING_SERVICE_ERROR});
		}
	};
	
	var requestFailed = function(xhr, status) {
		var error = {code: 998, message: GEOCODING_SERVICE_UNAVAILABLE};
		$.proxy(callback.handleLocationError, callback)(error);
	};
	 
	request.done(requestDone);
	request.fail(requestFailed);
	
};

LocationManager.prototype.getElevation = function(lat, lng, callback) {
	var locations = [];
	locations.push(new google.maps.LatLng(lat, lng));
	var request = {
    "locations": locations
	};
	this.elevationService.getElevationForLocations(request, function(results, status) {
		if(status == google.maps.ElevationStatus.OK) {
			if (results[0]) {
				callback.handleElevation(lat, lng, results[0].elevation);
			} 
			else {
				callback.handleElevationError(lat, lng, status, "no results found");
      }
    }
    else {
      callback.handleElevationError(lat, lng, status, "service error");
    }
  });
};

LocationManager.prototype.getLocation = function(callback) {
	if (navigator.geolocation) {
		if(callback.locationRequestStarted!=null) {
			callback.locationRequestStarted();
		}
		navigator.geolocation.getCurrentPosition(
			$.proxy(callback.handleLocation, callback), 
			$.proxy(callback.handleLocationError, callback), 
			{enableHighAccuracy: true, maximumAge: 0, timeout: LOCATION_SERVICE_TIMEOUT}
		);
	}	
	else {
		var error = {code: 996, message: LOCATION_SERVICE_UNAVAILABLE};
		$.proxy(callback.handleLocationError, callback)(error); 
	}
};

var sharedLocationManager = new LocationManager();
var mapLocationManager = new LocationManager();

function RkEventRow(rowNumber, rowElement, rkevent) {
	this.rowElement = $(rowElement);
	this.event = rkevent;
	this.photoElement = this.rowElement.find(".photo");
	this.photoElement.on("click", $.proxy(this.photoPressed, this));
	//this.photoElement.on("load", $.proxy(this.photoLoaded, this));
	this.photoPicker = this.rowElement.find(".photoPicker");
	this.photoPicker.on("change", $.proxy(this.photoPickerChanged, this));
	this.descElement = this.rowElement.find(".photoDesc");
	this.locationElement = this.rowElement.find(".location");
	this.btnEdit = this.rowElement.find(".btnEdit");
	this.btnEdit.on("click", $.proxy(this.btnEditPressed, this));
	this.rowNumber = rowNumber;
	this.image = null;
	this.desc = null;
	this.hasImage = false;
}

/*
RkEventRow.prototype.photoPickerChanged = function(event) {
	var file = event.target.files[0];
	if(file!=null) {
		this.displayPhoto(file, 0);
		this.getLocation(true);
		this.hasImage = true;
	}
};
*/

RkEventRow.prototype.updateLocationLabel = function() {
		var photoDateString = dateString(new Date(this.event.time));
		var locationPlusTime = this.event.shortAddress + " (" + photoDateString + ")";
		this.locationElement.html(locationPlusTime);
};

RkEventRow.prototype.updateLocation = function() {
	mapView.delegate = this;
	mapView.show({location: this.event.location, address: {longaddress: this.event.address, shortaddress: this.event.shortAddress}, time: new Date(this.event.time)});
};

RkEventRow.prototype.handleAddress = function(address) {
	try {
		this.event.address = address.longaddress;
		this.event.shortAddress = address.shortaddress;
		this.event.country = address.country;
		this.event.city = address.city;
		this.updateLocationLabel();
	}
	finally {	
		hidePageBusy();
	}
};

RkEventRow.prototype.locationRequestStarted = function() {
	this.locationElement.html(GETTING_LOCATION_MESSAGE);
	showPageBusy(GETTING_LOCATION_MESSAGE);
};

RkEventRow.prototype.handleLocation = function(location) {
	try {
		this.event.location = {
			latitude: location.coords.latitude,
			longitude: location.coords.longitude,
			altitude: 0.0//location.coords.altitude
		};
		sharedLocationManager.getAddress(this.event.location.latitude, this.event.location.longitude, this);
		if(this.event.location.altitude==null || this.event.location.altitude==0) {
			sharedLocationManager.getElevation(this.event.location.latitude, this.event.location.longitude, this);
		}
	}
	catch(e) {
		hidePageBusy();
	}
};

RkEventRow.prototype.handleLocationError = function(error) {
	this.locationElement.html(LOCATION_ERROR_MESSAGE);
	hidePageBusy();
	if(error.code==LocationManager.PERMISSION_DENIED) {
		alert(LOCATION_SERVICE_DENIED);
	}
};

RkEventRow.prototype.handleElevation = function(lat, lng, elevation) {
	this.event.location.altitude = elevation;
};

RkEventRow.prototype.handleElevationError = function(lat, lng, status, message) {
	
};


RkEventRow.prototype.deletePhoto = function() {
	this.photoElement.attr("src", CAMERA_IMAGE);
	this.photoElement.css({
		"-webkit-transform": "",
		"transform:rotate": ""
	});
	this.photoPicker.val("");
	this.photoPicker.on("change", $.proxy(this.photoPickerChanged, this));
};

RkEventRow.prototype.clear = function() {
	if(this.hasImage) {
		this.deletePhoto();
	}
	this.locationElement.html("");
	this.descElement.val("");
	this.hasImage = false;
};

RkEventRow.prototype.retakePhoto = function() {
	editPopup.popup("close");
	this.clear();
	this.takePicture();
};

RkEventRow.prototype.displayPhoto = function(file, rotation) {
	var baseurl = window.URL ? window.URL : window.webkitURL;
	var imgSrc = baseurl.createObjectURL(file);
	this.photoElement.attr("src", imgSrc);

/*
	var transform = "rotate(" + rotation + "deg)";
	this.photoElement.css({
		"-webkit-transform": transform,
		"transform:rotate": transform,
	});
*/

	hidePageBusy();
};

/*
RkEventRow.prototype.photoLoaded = function(event) {
	if(!this.hasImage) return;
	var img = this.photoElement[0];
	EXIF.getData(img, function() {
		var lat = EXIF.getTag(img, "GPSLatitude");
		//alert(EXIF.pretty(img));
	});
};
*/

/*
RkEventRow.prototype.photoPickerChanged = function(event) {
	if(event.target.files.length==0) {
		return;
	}
	
	showPageBusy("處理中...");
	var photoRow = this;
	var originalPhotoElement = this.photoElement;
	var file = event.target.files[0];
	this.hasImage = true;
	this.event.time = new Date().getTime();
	this.event.photoFile = file;
	photoRow.displayPhoto(file, 0);
	sharedLocationManager.getLocation();
};
*/


RkEventRow.prototype.photoPickerChanged = function(event) {
	if(event.target.files.length==0) {
		return;
	}
	
	showPageBusy(PROCESSING);
	var photoRow = this;
	var originalPhotoElement = this.photoElement;
	var file = event.target.files[0];
	this.hasImage = true;
	this.event.time = new Date().getTime();
	this.event.photoFile = file;
	photoRow.displayPhoto(file, 0);
	loadImage.parseMetaData(file, $.proxy(function(data) {
		var foundLocationInPhoto = false;
		if (data.exif) {
			var exifData = null;
			try {
				console.log(data.exif);
				exifData = parseExif(data.exif);
			}
			catch(err) {
				alert("unable to parse exif location");
			}
			if(exifData!=null) {
				if(exifData.time!=null) {
					this.event.time = exifData.time.getTime();
				}
				if(exifData.location!=null) {
					this.event.location = exifData.location;
					foundLocationInPhoto = true;
					sharedLocationManager.getAddress(exifData.location.latitude, exifData.location.longitude, this);
				}
			}
		}
		
		if(!foundLocationInPhoto) {
			sharedLocationManager.getLocation(this);
		}
	}, this));
};


RkEventRow.prototype.mapViewConfirmed = function(options) {
	this.event.location = options.location.coords;
	this.event.address = options.location.address.longaddress;
	this.event.shortAddress = options.location.address.shortaddress;
	this.event.country = options.location.address.country;
	this.event.city = options.location.address.city;
	this.event.time = options.time.getTime();
	this.updateLocationLabel();
};

RkEventRow.prototype.mapViewCancelled = function() {
	
};

RkEventRow.prototype.btnEditPressed = function(event) {
	event.preventDefault();
	if(this.hasImage) {
		editPopup.find("#btnRetakePhoto").off("click").on("click", $.proxy(this.retakePhoto, this)); 
		editPopup.find("#btnUpdateLocation").off("click").on("click", $.proxy(this.updateLocation, this));
		editPopup.popup("open");
	}
	else {
		alert(PHOTO_UNAVAILABLE);
	}
};

RkEventRow.prototype.takePicture = function() {
	this.photoPicker.trigger('click');
};

RkEventRow.prototype.showPhotoLightbox = function() {
	var image = $(this).attr("src");
	$("#lightboxImg").attr("src", image);	
	$("#lightbox").popup("open", {positionTo: "window"});
};

RkEventRow.prototype.photoPressed = function(event) {
	if(!this.hasImage) {
		this.takePicture();
	}
};

function RkEvent() {
	this.photoFile = null;
	this.time = null;
	this.location = null;
	this.desc = null;	
	this.address = null;
	this.shortAddress = null;
	this.speciesCh = null;
	this.speciesLat = null;
}

RkEvent.prototype.clear = function() {
	this.photoFile = null;
	this.time = null;
	this.location = null;
	this.desc = null;	
	this.address = null;
	this.shortAddress = null;
	this.speciesCh = null;
	this.speciesLat = null;
};

function RkReport() {
	this.events = [];
}

RkReport.prototype.createEvent = function(address) {
	var newEvent = new RkEvent();
	this.events.push(newEvent);
	return newEvent;
};

RkReport.prototype.validEvents = function() {
	var list = [];
	for(var i=0; i<this.events.length; i++) {
		if(this.events[i].photoFile!=null) {
			list.push(this.events[i]);
		}
	}
	return list;
};

RkReport.prototype.validEventCount = function() {
	var count = 0;
	for(var i=0; i<this.events.length; i++) {
		if(this.events[i].photoFile!=null) {
			count++;
		}
	}
	return count;
};

function MapView(mapCanvas) {
	this.delegate = null;
	this.location = null;
	this.address = null;
	this.altitude = null;
	this.time = null;
	this.locationLabel = $("#selectedMapLocation");
	this.dateLabel = $("#selectedDate");
	this.btnConfirmLocation = $("#btnConfirmLocation");
	this.btnConfirmLocation.on("click", $.proxy(this.btnConfirmLocationPressed, this));
	this.btnCancelMapView = $("#btnCancelMapView");
	this.btnCancelMapView.on("click", $.proxy(this.btnCancelMapViewPressed, this));
	this.btnPickDateTime = $("#btnPickDateTime");
	this.btnPickDateTime.on("click", $.proxy(this.btnPickDateTimePressed, this));
	this.datePicker = $("#datePicker");
	this.datePicker.bind("datebox", $.proxy(this.datePickerChanged, this));
	this.marker = null;
}

MapView.prototype.init = function(mapCanvas) {
	this.canvas = mapCanvas;
	var center = null;
	if(this.location!=null) {
		center = new google.maps.LatLng(this.location.latitude, this.location.longitude);
	}
	else {
		center = new google.maps.LatLng(DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng);
	}
	
	var mapOptions = {
		center: center,
		zoom: 10,
		panControl: false,
		zoomControl: false,
		streetViewControl: false,
		draggableCursor:'crosshair'
	};
	this.map = new google.maps.Map(this.canvas, mapOptions);
	google.maps.event.addListener(this.map, 'click', $.proxy(this.mapClicked, this));
	
	if(this.location!=null) {
		this.placeMarker(center);
	}
};

MapView.prototype.placeMarker = function(latlng) {
	if(this.marker==null) {
		this.marker = new google.maps.Marker({
			position: latlng
		});	
	}
	else {
		this.marker.setPosition(latlng);
	}
	this.marker.setMap(null);
	this.marker.setMap(this.map);
	this.map.panTo(latlng);
};

MapView.prototype.mapClicked = function(event) {
	var latlng = event.latLng;
	this.placeMarker(latlng);
	this.address = null;
	this.altitude = null;
	var lat = latlng.lat();
	var lng = latlng.lng();
	mapLocationManager.getAddress(lat, lng, this);
	mapLocationManager.getElevation(lat, lng, this);
};

MapView.prototype.resize = function(width, height) {
	$(this.canvas).css({
		height: height
	});
};

MapView.prototype.getSelectedLocation = function() {
	var latlng = this.marker.getPosition();
	var coords = {
		latitude: latlng.lat(),
		longitude: latlng.lng(),
		altitude: this.altitude
	};
	return {coords: coords, address: this.address};
};

MapView.prototype.show = function(options) {
	if(options.location!=null) {
		this.location = options.location;
		this.address = options.address;
		this.time = options.time;
		if(this.address!=null) {
			this.locationLabel.html(this.address.shortaddress);
		}
		
		if(this.time!=null) {
			this.dateLabel.html(this.time.toLocaleDateString());
		}
		if(this.map!=null) {
			var center = new google.maps.LatLng(this.location.latitude, this.location.longitude);
			this.placeMarker(center);
			this.map.panTo(center);
		}
	}
	else {
		this.locationLabel.html(GETTING_LOCATION_MESSAGE);
		mapLocationManager.getLocation(this);
	}
	var options = {
		transition: 'slide'
	};
	$.mobile.pageContainer.pagecontainer("change", "#map", options);
};

MapView.prototype.dismiss = function() {
	var options = {
		transition: "slide",
		reverse: true
	};
	$.mobile.pageContainer.pagecontainer("change", "#", options);
};

MapView.prototype.btnConfirmLocationPressed = function(event, ui) {
	event.preventDefault();
	if(this.marker==null) {
		alert(PICK_LOCATION);
		return;
	}
	if(this.time==null) {
		alert(PICK_DATE);
		return;
	}
	this.dismiss();
	if(this.delegate==null) {
		return;
	}
	var location = this.getSelectedLocation();
	this.delegate.mapViewConfirmed({location: location, time: this.time});
};

MapView.prototype.btnCancelMapViewPressed = function(event, ui) {
	event.preventDefault();
	this.dismiss();
	if(this.delegate.mapViewCancelled==null) {
		return;
	}
	this.delegate.mapViewCancelled();
};

MapView.prototype.btnPickDateTimePressed = function(event, ui) {
	event.preventDefault();
	this.datePicker.datebox("open");
};

MapView.prototype.handleLocation = function(location) {
	var center = new google.maps.LatLng(location.latitude, location.longitude);
	this.map.panTo(center);
};

MapView.prototype.handleAddress = function(address) {
	this.locationLabel.html(address.longaddress);
	this.address = address;
};

MapView.prototype.handleLocationError = function(location) {
	this.locationLabel.html(LOCATION_ERROR_MESSAGE);
};

MapView.prototype.handleElevation = function(lat, lng, elevation) {
	this.altitude = elevation;
};

MapView.prototype.handleElevationError = function(lat, lng, status, message) {
	this.altitude = null;
};

MapView.prototype.datePickerChanged = function(event, passed) {
	if(passed.method=='set') {
		this.time = new Date(passed.value);
		this.time.setHours(0);
		this.time.setMinutes(0);
		this.time.setSeconds(0);
		this.time.setMilliseconds(0);
		this.dateLabel.html(this.time.toLocaleDateString());
	}
	else if(passed.method=='postrefresh') {
		var calendar = $('.ui-datebox-container');
		var calendarWidth = calendar.outerWidth();
		var calendarHeight = calendar.outerHeight();
		var windowHeight = $(window).height();
		var windowWidth = $(window).width();
		var mapToolbar = $('#mapToolbar');
		var mapToolbarHeight = mapToolbar.height();
		var top = (windowHeight - mapToolbarHeight - calendarHeight) / 2;
		var left = (windowWidth - calendarWidth) / 2;
		calendar.css({
			top: top,
			left: left
		});
	}
};

function showPageBusy(label) {
  $.mobile.loading('show', {
      text: label,
      textVisible: true,
      theme: 'c'
  });
}

function hidePageBusy() {
  $.mobile.loading('hide');
}

function parseExif(exif) {
	exifData = {};
	
	var latRef = exif[0x0001];
	var lngRef = exif[0x0003];
	var latValues = exif[0x0002];
	var lngValues = exif[0x0004];
	if(latRef!=null && lngRef!=null && latValues!=null && lngValues!=null) {
		var altitudeRef = exif[0x0005]==0 ? 1 : -1;
		var altitude = exif[0x0006];
		var latSign = (latRef=="S" ? -1 : 1);
		var latitude = (latValues[0] + latValues[1] / 60.0 + latValues[2] / 3600.0) * latSign;
		var lngSign = (lngRef=="W" ? -1 : 1);
		var longitude = (lngValues[0] + lngValues[1] / 60.0 + lngValues[2] / 3600.0) * lngSign;
		var exifLocation = {latitude: latitude, longitude: longitude, altitude: altitude};
		exifData.location = exifLocation;
	}

	var dateTimeOriginal = exif[0x9003];
	if(dateTimeOriginal!=null) {
		var pos = dateTimeOriginal.indexOf(" ");
		var dateString = dateTimeOriginal.substring(0, pos);
		dateString = dateString.replace(/:/g, '/');
		var timeString = dateTimeOriginal.substring(pos + 1);
		var time = new Date(dateString + " " + timeString);
		exifData.time = time;
	}
	
	return exifData;
	
}

function parseGeocodingResult(response) {
	var country = null, city = null, locality = null, sublocality = null, route;
	var found = false;
	for(var r in response.results) {
		var result = response.results[r];
		for (var ac in result.address_components) {
			var addressComponent = result.address_components[ac];				
			var types = addressComponent.types;
			for(var t in types) {
				var type = types[t];
				if (city==null && (type=="administrative_area_level_1" || type=="administrative_area_level_2")) {
					city = addressComponent.long_name;
					break;
				}
				else if (locality==null && type=="administrative_area_level_3") {
					locality = addressComponent.long_name;
					break;
				}
				else if (sublocality==null && type=="administrative_area_level_4") {
					sublocality = addressComponent.long_name;
					break;
				}
				else if (country==null && type=="country") {
					country = addressComponent.short_name;
				}
				else if (route==null && type=="route") {
					route = addressComponent.short_name;
				}
			}
		}
	}
	
	found = city!=null;

	var address = null;
	result = null;
	if (found) {
		shortAddress = city;
		longAddress = shortAddress;
		if(locality!=null) {
			shortAddress+=locality;
			longAddress+=locality;
		}
		else if(sublocality!=null){
			shortAddress+=sublocality;
			longAddress+=sublocality;
		}
		if (route!=null) {
			longAddress = longAddress + route;
		}
		 
		result = {shortaddress: shortAddress, longaddress: longAddress, country: country, city: city};
	}
	return result;
}

function btnGetLocationPressed(event, ui) {
	event.preventDefault();
	getLocation(true);
};


function viewWidth() {
	return $(window).width() - 40;
}

function btnTakePicturePressed(event, ui) {
	photoPicker.trigger('click');
	return false;		
}


function upload(events, done, fail) {
	var formData = new FormData();
	formData.append("event_count", events.length);
	for(var i=0; i<events.length; i++) {
		var event = events[i];
		formData.append("lat_" + i, event.location.latitude);
		formData.append("lng_" + i, event.location.longitude);
		formData.append("altitude_" + i, event.location.altitude);
		formData.append("time_" + i, event.time);
		formData.append("address_" + i, event.address);
		formData.append("country_" + i, event.country);
		formData.append("city_" + i, event.city);
		formData.append("photo_" + i, event.photoFile);
		formData.append("photo_desc_" + i, event.desc);
	}

	var request = $.ajax({
		url: "reports",
		type: "POST",
		beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));},
		data: formData,
		cache: false,
		processData: false,
		contentType: false,
		timeout: 120000
	});
	
	request.done(done);
	
	request.fail(fail);
}

function clearReport(report) {
	for(var i=0; i<report.events.length; i++) {
		var eventRow = eventRows[i];
		var event = report.events[i];
		eventRow.clear();
		event.clear();
	}
}

function prepareReport(report) {
	for(var i=0; i<report.events.length; i++) {
		var eventRow = eventRows[i];
		var event = report.events[i];
		if(eventRow.hasImage) {
			var file = eventRow.photoPicker.prop("files")[0];
			var desc = eventRow.descElement.val();
			event.desc = desc;
			event.photoFile = file;
		}
	}
	return null;
}

function validateEvents(events) {
	for(var i=0; i<events.length; i++) {
		var event = events[i];
		if(event.location==null || event.time==null) {
			return {
				eventid: i,
				message: "請為第" + CHINESE_DIGITS[i] + "筆紀錄標定日期與位置"
			};
		}		
	}
	return null;
}

function canUpload() {
	var validEventCount = rkreport.validEventCount();
	if(validEventCount==0) {
		alert(PHOTO_UNAVAILABLE);
		return;
	}

	var done = function(resp) {
		if(resp.status==0) {
			clearReport(rkreport);
			hidePageBusy();
			alert(UPLOAD_DONE);
		}
		else {
			hidePageBusy();
			alert(resp.message);
		}
	};
	var fail = function(xhr, status) {
		hidePageBusy();
		alert(UPLOAD_FAILED);
	};

	prepareReport(rkreport);
	var events = rkreport.validEvents();
	var error = validateEvents(events);
	if(error!=null) {
		alert(error.message);
		return;
	} 
	showPageBusy(UPLOADING);
	upload(events, done, fail);	
}

function cannotUpload() {
	alert(NO_PUBLISH_ACTIONS_PERMISSION);
}

function btnUploadPressed(event, ui) {
	event.preventDefault();

	var fbuid = FB.getUserID();
	checkFBPermissions(fbuid, function(permissions) {
		if(permissions.publish_actions) {
			canUpload();			
		}
		else {
			cannotUpload();
		}
	});

}

function numberToString(number) {
	var s = "" + number;
	if (s.length < 2) {
		s = "0" + s;
	}
	return s;
}

function dateString(datetime) {
	var month = datetime.getMonth() + 1;
	var date = datetime.getDate();
	return "" + month + "/" + date;
}

function currentTimestampString(time) {
	var now = time;
	var year = time.getFullYear();
	var month = now.getMonth() + 1;
	var date = now.getDate();
	var hour = now.getHours();
	var minute = now.getMinutes();
	var timestampString = now.getFullYear() + "/" + numberToString(month) + "/" + numberToString(date) + " " + numberToString(hour) + ":" + numberToString(minute);
	return timestampString; 
}

function initUI() {
	if(uiReady) {
		return;
	}
	$('#btnLogout').on('click', function() {
		FB.logout(function(response) {
			console.log('logged out');
			window.location = '/signout';
		});
	});
	$('#photoList').show();
	$('#homeToolbar').show();
	btnUpload = $("#btnUpload");;
	btnUpload.on("click", btnUploadPressed);
	photoPicker = $('#photoPicker');
	editPopup = $("#editPopup");
	var elements = $("[id=eventRow]");
	for(var row=0; row<elements.length; row++) {
		var element = elements[row];
		var rkevent = rkreport.createEvent();
		var newRow = new RkEventRow(row, element, rkevent);
		eventRows.push(newRow);
	}
	
	mapView = new MapView();
	uiReady = true;

}
 
function initModels() {
	if(rkreport!=null) {
		return;
	}
	rkreport = new RkReport();
}


function initGmap(event, ui) {
	if(mapView.map!=null) {
		return;
	}
	var mapCanvas = $("#gmapCanvas")[0];
	var windowHeight = $(window).height();
	var toolbarHeight = $('#mapToolbar').height();
	var mapHeight = windowHeight - toolbarHeight;
	$(mapCanvas).css({
		height: mapHeight + "px"
	});
	mapView.init(mapCanvas);
}

function init(event, ui) {
	var fbConnected = function() {
		console.log("init() - fbConnected");
		initModels();
		initUI();
	};

	var fbNotConnected = function() {
		console.log("init() - fbNotConnected");
		windows.location = '/logon'
	};

	initFB(fbConnected, fbNotConnected);
}

$(document).on("pagecreate", "#home", init);
$(document).on("pagecreate", "#map", initGmap);


