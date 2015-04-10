<%@ page contentType="text/html; charset=UTF-8" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<title>路殺通報</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="http://code.jquery.com/mobile/1.4.2/jquery.mobile-1.4.2.min.css" media="screen" rel="stylesheet" />
<script src="http://code.jquery.com/jquery-1.10.2.min.js"></script>
<script src="http://code.jquery.com/mobile/1.4.2/jquery.mobile-1.4.2.min.js"></script>
<script src="http://www.nihilogic.dk/labs/exif/exif.js"></script>
<script src="http://www.nihilogic.dk/labs/binaryajax/binaryajax.js"></script>
<script>
	var btnTakePicture;
	var btnGetLocation;
	var btnUpload;
	var timeLabel;
	var locationLabel;
	var photoPicker;
	var currentLocation;
	var currentAddress;
	var photoCanvas;
	
	var imageFiles;
	
	var LOCATION_SERVICE_TIMEOUT = 10000;
	var HTTP_REQUEST_TIMEOUT = 10000;
	var GOOGLE_MAPS_API_URL = "http://maps.googleapis.com/maps/api/geocode/json?language=zh-TW&sensor=true&latlng=";

	function showPageBusy(label) {
        $.mobile.loading('show', {
            text: label,
            textVisible: true,
            theme: 'b'
        });
	}
	
	function hidePageBusy() {
        $.mobile.loading('hide');
	}
	
	function handleGeocodingFailure() {
		// do nothing for now
	}
	
	function handleGeocodingResult(response) {
		var country, city = null, locality = null, sublocality = null;
		var found = false;
		for(var r in response.results) {
			var result = response.results[r];
			for (var ac in result.address_components) {
				var addressComponent = result.address_components[ac];				
				var types = addressComponent.types;
				for(var t in types) {
					var type = types[t];
					if (city==null && type=="administrative_area_level_2") {
						city = addressComponent.long_name;
						break;
					}
					else if (locality==null && type=="locality") {
						locality = addressComponent.long_name;
						break;
					}
					else if (sublocality==null && type=="sublocality") {
						sublocality = addressComponent.long_name;
						break;
					}
					else if (country==null && type=="country") {
						country = addressComponent.short_name;
					}
				}
			}
			if (city!=null && locality!=null) {
				found = true;
				break;
			}
		}

		var address = null;
		if (found) {
			address = city + locality;
			if (sublocality!=null) {
				address = address + sublocality;
			}
		}
		return address;
	}

	function getAddress(lat, lng) {
		var fullURL = GOOGLE_MAPS_API_URL + lat + "," + lng;
		var request = $.ajax({
			url: fullURL,
			type: "GET",
			timeout: HTTP_REQUEST_TIMEOUT
		});
		request.done(function(geocodingResponse) {
			if (geocodingResponse.status=="OK" && geocodingResponse.results.length>0) {
				var address = handleGeocodingResult(geocodingResponse);
				if(address!=null) {
					locationLabel.innerHTML = address;
				}
			}
			else {
				handleGeocodingFailure();
			}
			hidePageBusy(); 
		});
		request.fail(function(xhr, status) {
			handleGeocodingFailure();
			hidePageBusy(); 
	});
	}

	function handleLocation(location) {
		currentLocation = location;
		getAddress(location.coords.latitude, location.coords.longitude);
	}
	
	function handleLocationError(error) {
		locationLabel.innerHTML = "無法定位";
		hidePageBusy();
	}

	function getLocation(isModal) {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(handleLocation, handleLocationError, {enableHighAccuracy: true, timeout: LOCATION_SERVICE_TIMEOUT});
			if (isModal) {
				showPageBusy("定位中­...");
			}
		}	
		else {
			locationLabel.innerHTML = "無法定位";
		}
	}
	
	function btnGetLocationPressed(event, ui) {
		event.preventDefault();
		getLocation(true);
	};
	
	
	function viewWidth() {
		return $(window).width() - 40;
	}
	
	function createBinaryFile(uintArray) {
		var data = new Uint8Array(uintArray);
		var file = new BinaryFile(data);

		file.getByteAt = function(iOffset) {
			return data[iOffset];
		};

		file.getBytesAt = function(iOffset, iLength) {
			var aBytes = [];
			for (var i = 0; i < iLength; i++) {
				aBytes[i] = data[iOffset  + i];
			}
			return aBytes;
			};
	
		file.getLength = function() {
			return data.length;
		};
	
		return file;
	}

	function rotateImage(imageFile) {
		var binaryReader = new FileReader();
		binaryReader.onloadend=function(d) {
			var exif = EXIF.readFromBinaryFile(createBinaryFile(d.target.result));
			var orientation = exif.Orientation;
			var rotation = 0;
			if (orientation==8) {
				rotation = -90;
			}
			else if(orientation==3) {
				rotation = 180;
			}
			else if(orientation==6) {
				rotation = 90;
			}
			if (rotation!=0) {
				var transform = "rotate(" + rotation + "deg)";
				$("#photoContainer").css({
					"-webkit-transform":  transform
				});
			}
		};
		binaryReader.readAsArrayBuffer(imageFile);
	}
	
	function photoPickerChanged(event, ui) {
		event.preventDefault();
		if(this.files.length === 0) return;
		imageFiles = this.files;
		rotateImage(imageFiles[0]);
		var baseurl = window.URL ? window.URL : window.webkitURL;
		var backgroundURL = "url(" + baseurl.createObjectURL(imageFiles[0]) + ")";
		$("#photoContainer").css({
			"background": backgroundURL,
			"background-position": "center center",
    		"background-size": "cover",
    		"border": ""
		});
	}
			
	function btnTakePicturePressed(event, ui) {
		photoPicker.trigger('click');
		return false;		
	}
	
	function btnUploadPressed(event, ui) {
		event.preventDefault();
		if (currentLocation==null) {
			alert("請先定位再上傳");
			return;
		}
		if (imageFiles==null || imageFiles.length==0) {
			alert("請先拍照再上傳");
		}
		showPageBusy("上傳中...");
		var formData = new FormData();
		var photoId = 0;
		$.each(imageFiles, function(key, value){
			formData.append("photo" + photoId, value);
			photoId++;
		});
		formData.append("lat", currentLocation.coords.latitude);
		formData.append("lng", currentLocation.coords.longitude);
		formData.append("altitude", currentLocation.coords.altitude);
		var address = locationLabel.innerHTML;
		formData.append("time", timeLabel.innerHTML);
		formData.append("address", address);
		
		var request = $.ajax({
			url: "event",
			type: "POST",
			data: formData,
			cache: false,
			processData: false,
			contentType: false
		});
		request.done(function(resp) {
			hidePageBusy();
		});
		request.fail(function(xhr, status){
			alert("無法上傳，請稍後再試");
			hidePageBusy();
		});
		
	}
	
	function numberToString(number) {
		var s = "" + number;
		if (s.length < 2) {
			s = "0" + s;
		}
		return s;
	}
	
	function currentTimestampString() {
		var now = new Date();
		var year = now.getFullYear();
		var month = now.getMonth() + 1;
		var date = now.getDate();
		var hour = now.getHours();
		var minute = now.getMinutes();
		var timestampString = now.getFullYear() + "/" + numberToString(month) + "/" + numberToString(date) + " " + numberToString(hour) + ":" + numberToString(minute);
		return timestampString; 
	}
	
	function init(event, ui) {
		btnTakePicture = $("#btnTakePicture");
		btnGetLocation = $("#btnGetLocation");
		btnUpload = $("#btnUpload");
		timeLabel = $("#timeLabel")[0];
		locationLabel = $("#locationLabel")[0];
		photoPicker = $('#photoPicker');
		photoCanvas = $("#photoCanvas")[0];
		var vwidth = viewWidth();
		$("#photoContainer").css({
			"width": vwidth + "px",
			"height": vwidth + "px",
			"border": "3px dashed gray",
			"border-radius": "10px",
			"margin-top": "5px",
			"margin-left": "auto",
			"margin-right": "auto"
		});
		var ts = currentTimestampString();
		timeLabel.innerHTML = ts;
		locationLabel.innerHTML = "定位中­...";
		getLocation(false);
	};
	
	$(document)
		.on("pagecreate", "#rootpage", init)
		.on("click", "#btnTakePicture", btnTakePicturePressed)
		.on("click", "#btnGetLocation", btnGetLocationPressed)
		.on("click", "#btnUpload", btnUploadPressed)
		.on("click", "#photoContainer", btnTakePicturePressed)
		.on("change", "#photoPicker", photoPickerChanged);
	
</script>

</head>
<body>


	<div id="rootpage" data-role="page">
	
		<div data-role="main" class="ui-content">
			<div id="timeLabel" style="text-align: center"></div>
			<div id="photoContainer" style="width: 200px; height: 200px; margin: 2px; overflow: hidden; background-position: center center; background-size: cover;">
			</div>
			<div style="width: 0; height: 0; overflow: hidden;">
				<input id="photoPicker" type="file" accept="image/*">
				<button id="btnTakePicture">拍照</button>
			</div>
			<div data-role="footer" data-position="fixed">
				<div id="locationLabel" style="text-align: center">定位中...</div>
				<button id="btnGetLocation">定位</button>
				<button id="btnUpload">上傳</button>
			</div>
		</div>
	</div>

</body>
</html>