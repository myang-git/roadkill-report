function renderTopReporters(topReporters) {
	var topReporterRows = $(".topReporterRow");
	var topReporterNames = $(".topReporterName");
	var topReporterProfilePictures = $(".topReporterProfilePicture");
	var topReporterReportCount = $(".topReporterReportCount");
	topReporterRows.each(function(index, rowElement) {
		if(index < topReporters.length) {
			topReporter = topReporters[index];
			var jqRowElement = $(rowElement);
			jqRowElement.css({
				"display": ""
			});
			var jqNameElement = $(topReporterNames[index]); 
			jqNameElement.html(topReporter.name);
			var jqReportCountElement = $(topReporterReportCount[index]);
			jqReportCountElement.html("" + topReporter.reportcount + " / " + topReporter.reportcountpercent + "%");
			jqProfilePictureElement = $(topReporterProfilePictures[index]);
			jqProfilePictureElement.attr("src", "http://graph.facebook.com/" + topReporter.fbid + "/picture");
		}
	});
}

function renderTopCities(totalReportCount, topCities) {
	var topCityRows = $(".topCityRow");
	var topCityNames = $(".topCityName");
	var topCityReportCount = $(".topCityReportCount");
	topCityRows.each(function(index, rowElement) {
		if(index < topCities.length) {
			var topCity = topCities[index];
			var jqRowElement = $(rowElement);
			jqRowElement.css({
				"display": ""
			});
			var jqNameElement = $(topCityNames[index]); 
			jqNameElement.html(topCity.name);
			var jqReportCountElement = $(topCityReportCount[index]);
			jqReportCountElement.html("" + topCity.count + " / " + Math.round(topCity.count / totalReportCount * 100) + "%");
		}
	});
}

function renderReportCount(count) {
	$("#reportCount").html("" + count);
}

function queryStats(event, ui) {
	var request = $.ajax({
		url: "stats.json",
		type: "GET",
		beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));},
		cache: false,
		timeout: 120000
	});
	
	request.done(function(stats){
		var reportCount = stats.report_count;
		var topReporters = stats.top_reporters;
		var topCities = stats.top_cities;
		
		renderReportCount(reportCount);
		renderTopReporters(topReporters);
		renderTopCities(reportCount, topCities);
		loadGeochart(topCities);

	});
	
	request.fail(function(xhr, status) {
		
	});
}

function drawRegionsMap(topCities) {

	var array = [
		['City', 'Count'],
	];
	
	for(var i = 0; i < topCities.length; i++) {
		array.push([topCities[i].name, topCities[i].count]); 
	}
	
	var data = google.visualization.arrayToDataTable(array);

    var options = {region: "TW", displayMode: "markers", colorAxis: {colors: ['yellow', 'red']}};

    var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

    chart.draw(data, options);
}

function loadGeochart(topCities) {
	function callback() {
		drawRegionsMap(topCities);
	}
	setTimeout(function(){
		google.load('visualization', '1', {'callback':callback, 'packages':['geochart']});
	}, 500);
}      

function init() {
	queryStats();
}

$(document).on("pagecreate", "#stats", init);
