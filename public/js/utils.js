function initialInterface() {
	var w = window.innerWidth;
	var h = window.innerHeight;

	var h1 = parseInt($("#lvHeader").css("height"));				// height of page header
	var h2 = parseInt($("#lv_toolbar").css("height"));				// height of page toolbar
	var h3 = parseInt($("#lasPlotHeader").css("height"));			// height of plot header

	$("#viewerBody").css("height", (h - h1 - h2 -8) + 'px');

	$("#lasViewer_wrapper").css("height", (h - h1 - h2 - 8) + 'px');
	$("#lasViewer_wrapper").addClass('chart_graph');
	
	$("#lasPlotBody").css("height", (h - h1 - h2 - h3 - 10) + 'px');
	
	if (FIRSTTIME) 
		$("#lasPlotBody").css('visibility', 'hidden');
	else
		$("#lasPlotBody").css('visibility', 'visible');

	$("#chart_0_depth").addClass('chart_graph');
	$("#chart_1_lgr").addClass('chart_graph');
	$("#chart_2_ref").addClass('chart_graph');
	$("#chart_3_dual").addClass('chart_graph');
	$("#chart_4_litho").addClass('chart_graph');
	$("#chart_7_sgr").addClass('chart_graph');
	$("#chart_8_sgr_ratio").addClass('chart_graph');
	$("#chart_9_custom1").addClass('chart_graph');
	$("#chart_16_ctuk").addClass('chart_graph');
	$("#chart_18_formation").addClass('chart_graph');
}

function initialDataHolder() {
	grpChemicals 		= new Array();
	logLine_Name 		= new Array();				// Name of every log line
	logLine_SourceType	= new Array();
	
	
	las_data_original 			= new Array();					// Initialize those three data arrays
	las_data_residual 			= new Array();
	las_data_processed			= new Array();
	
	MIN_MAX_LOG					= new Array();
	MIN_MAX_LOG_CURRENT			= new Array();
	
	track_log_current	= {};
	track_log_new 		= {};

	las_data_DERIVED 					= new Array();
	las_data_residual_DERIVED			= new Array();
	las_data_residual_exist_DERIVED 	= new Array();
	logLine_Name_DERIVED 				= new Array();
	
	las_data_CTUK 	= new Array();
	index_LithoGR	= 0;
	aLithoGammaRay 		= new Array();

	las_data_formation			= new Array();
	las_data_formation2			= new Array();
	
	track_LithoGR 			= new Array();
	track_Ref 				= new Array();
	track_DualI 			= new Array();
	track_Litho 			= new Array();
	track_Umaa 				= new Array();
	track_NPHI 				= new Array();
	track_SpectralGR 		= new Array();
	track_SpectralGRRatio 	= new Array();

	lasHeader_V = new Array();
	lasHeader_W = new Array();
	lasHeader_C = new Array();
	lasHeader_P = new Array();
	lasHeader_O = new Array();
	lasHeader_A = new Array();

	NPHI_DESCRIPTION = "";	
	
	
	//EXCEL_CONTENT		= {};
	EXCEL_TEMP_ARRAY	= [];
	EXCEL_DATA_raw	= new Array();													
	EXCEL_data		= new Array();

	EXCEL_MIN_EXTEND	= false; 
	EXCEL_MAX_EXTEND	= false;
	EXCEL_DEPTH_FLD		= "";
	EXCEL_PLOT_INDEX	= new Array();
	EXCEL_FIELDS		= new Array();
	EXCEL_NUMERIC_FLDS	= new Array();

	EXCEL_logLine_Name	= new Array();
}

function createPopWindow() {
	$('#loadingWindow').jqxWindow({
		resizable : false,
		width : 500,
		height : 350,
		minWidth : 500,
		maxWidth : 500,
		minHeight : 350,
		maxHeight : 350,
		theme : 'bootstrap',
		draggable : true,
		showCollapseButton : true,
		showCloseButton : true
	});

	$('#loadingTopInfo').jqxWindow({
		resizable : true,
		width : 500,
		height : 260,
		minWidth : 500,
		maxWidth : 500,
		minHeight : 280,
		maxHeight : 280,
		theme : 'bootstrap',
		draggable : true,
		showCollapseButton : true,
		showCloseButton : true
	});

	$('#loadingTopInfo').jqxWindow('close');
	$('#loadingWindow').jqxWindow('focus');
	$('#loadingTopInfo').jqxWindow('focus');
}

function createCORSRequest(method, url) {
	var xhr;
	if (window.XMLHttpRequest) {
		xhr = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
	}

	if ("withCredentials" in xhr) {
		// Check if the XMLHttpRequest object has a "withCredentials" property.
		// "withCredentials" only exists on XMLHTTPRequest2 objects.
		xhr.open(method, url, true);

	} else if ( typeof XDomainRequest != "undefined") {
		// Otherwise, check if XDomainRequest.
		// XDomainRequest only exists in IE, and is IE's way of making CORS requests.
		xhr = new XDomainRequest();
		xhr.open(method, url);
	} else {
		// Otherwise, CORS is not supported by the browser.
		xhr = null;
	}

	return xhr;
}

function createChkbox_Track_Log(myDiv, trackName, myTitle, myTab) {
	if (myTab.trim().length > 2)
		var $tab1 = $("<div class='tab1'>" + myTab + "</div>");

	$myDiv = $("<div style='margin-left:5px; height:30px;font-size:12px; font-weight:normal; overflow:hidden; padding-top:2px'></div>");
	//var $chk = $('<div class="checkbox" style="margin-top:5px;"><label><input type="checkbox" checked>' + myTitle + '</label><div>');
	var $chk = $('<input type="checkbox" checked>');

	$chk.click(function() {

		$(trackName).toggle();

		if ($(trackName)[0].id == "chart_1_lgr") {
			if ($(trackName).css("display") == "none") {
				$(lasViewer_wrapper).css("width", $(lasViewer_wrapper).width() - ($(trackName).width() - 2));
				$("#chart_1_lgr_0").css("display", "none");
			} else {
				$(lasViewer_wrapper).css("width", $(lasViewer_wrapper).width() + ($(trackName).width() + 2));
				$("#chart_1_lgr_0").css("display", "block");
			}
		}
		if ($(trackName)[0].id == "chart_2_ref") {
			if ($(trackName).css("display") == "none") {
				$(lasViewer_wrapper).css("width", $(lasViewer_wrapper).width() - ($(trackName).width() - 2));
				$("#chart_2_ref_0").css("display", "none");
			} else {
				$(lasViewer_wrapper).css("width", $(lasViewer_wrapper).width() + ($(trackName).width() + 2));
				$("#chart_2_ref_0").css("display", "block");
			}
		}
		if ($(trackName)[0].id == "chart_3_dual") {
			if ($(trackName).css("display") == "none") {
				$(lasViewer_wrapper).css("width", $(lasViewer_wrapper).width() - ($(trackName).width() - 2));
				$("#chart_3_dual_0").css("display", "none");
			} else {
				$(lasViewer_wrapper).css("width", $(lasViewer_wrapper).width() + ($(trackName).width() + 2));
				$("#chart_3_dual_0").css("display", "block");
			}
		}
		if ($(trackName)[0].id == "chart_4_litho") {
			if ($(trackName).css("display") == "none") {
				$(lasViewer_wrapper).css("width", $(lasViewer_wrapper).width() - ($(trackName).width() - 2));
				$("#chart_4_litho_0").css("display", "none");
			} else {
				$(lasViewer_wrapper).css("width", $(lasViewer_wrapper).width() + ($(trackName).width() + 2));
				$("#chart_4_litho_0").css("display", "block");
			}
		}
		if ($(trackName)[0].id == "chart_7_sgr") {
			if ($(trackName).css("display") == "none") {
				$(lasViewer_wrapper).css("width", $(lasViewer_wrapper).width() - ($(trackName).width() - 2));
				$("#chart_7_sgr_0").css("display", "none");
			} else {
				$(lasViewer_wrapper).css("width", $(lasViewer_wrapper).width() + ($(trackName).width() + 2));
				$("#chart_7_sgr_0").css("display", "block");
			}
		}
		if ($(trackName)[0].id == "chart_8_sgr_ratio") {
			if ($(trackName).css("display") == "none") {
				$(lasViewer_wrapper).css("width", $(lasViewer_wrapper).width() - ($(trackName).width() - 2));
				$("#chart_8_sgr_ratio_0").css("display", "none");
			} else {
				$(lasViewer_wrapper).css("width", $(lasViewer_wrapper).width() + ($(trackName).width() + 2));
				$("#chart_8_sgr_ratio_0").css("display", "block");
			}
		}
		if ($(trackName)[0].id == "chart_9_custom1") {
			if ($(trackName).css("display") == "none") {
				$(lasViewer_wrapper).css("width", $(lasViewer_wrapper).width() - ($(trackName).width() - 2));
				$("#chart_9_custom1_0").css("display", "none");
			} else {
				$(lasViewer_wrapper).css("width", $(lasViewer_wrapper).width() + ($(trackName).width() + 2));
				$("#chart_9_custom1_0").css("display", "block");
			}
		}
		if ($(trackName)[0].id == "chart_16_ctuk") {
			if ($(trackName).css("display") == "none") {
				$(lasViewer_wrapper).css("width", $(lasViewer_wrapper).width() - ($(trackName).width() - 2));
				$("#chart_16_ctuk_0").css("display", "none");
			} else {
				$(lasViewer_wrapper).css("width", $(lasViewer_wrapper).width() + ($(trackName).width() + 2));
				$("#chart_16_ctuk_0").css("display", "block");
			}
		}
		if ($(trackName)[0].id == "chart_18_formation") {
			if ($(trackName).css("display") == "none") {
				$(lasViewer_wrapper).css("width", $(lasViewer_wrapper).width() - ($(trackName).width() - 2));
				$("#chart_18_formation_0").css("display", "none");
			} else {
				$(lasViewer_wrapper).css("width", $(lasViewer_wrapper).width() + ($(trackName).width() + 2));
				$("#chart_18_formation_0").css("display", "block");
			}
		}
	});

	var $t2 = $('<span>' + myTitle + '</span>');

	$myDiv.append($chk);
	$myDiv.append($t2);
	$(las_track_list1).append($tab1);
	$(las_track_list1).append($myDiv);

}

function resetChartZoom() {
	if ((chart0 != undefined)) {
		chart0.xAxis[0].setExtremes(null, null);
		chart0.options.chart.isZoomed = false;
	}
	if ((chart1 != undefined)) {
		chart1.xAxis[0].setExtremes(null, null);
		chart1.options.chart.isZoomed = false;
	}
	if ((chart2 != undefined)) {
		chart2.xAxis[0].setExtremes(null, null);
		chart2.options.chart.isZoomed = false;
	}
	if ((chart3 != undefined)) {
		chart3.xAxis[0].setExtremes(null, null);
		chart3.options.chart.isZoomed = false;
	}
	if ((chart4 != undefined)) {
		chart4.xAxis[0].setExtremes(null, null);
		chart4.options.chart.isZoomed = false;
	}
	if ((chart7 != undefined)) {
		chart7.xAxis[0].setExtremes(null, null);
		chart7.options.chart.isZoomed = false;
	}
	if ((chart8 != undefined)) {
		chart8.xAxis[0].setExtremes(null, null);
		chart8.options.chart.isZoomed = false;
	}
	if ((chart9 != undefined)) {
		chart9.xAxis[0].setExtremes(null, null);
		chart9.options.chart.isZoomed = false;
	}
	if ((chart16 != undefined)) {
		chart16.xAxis[0].setExtremes(null, null);
		chart16.options.chart.isZoomed = false;
	}
	if ((chart18 != undefined)) {
		chart18.xAxis[0].setExtremes(null, null);
		chart18.options.chart.isZoomed = false;
	}

}

function ResetPanelWidth() {
	if (!$(las_track_list1).is(':empty')) {
		$(las_track_list1).empty();
	}

	if (!$(chart_0_depth_0).is(':empty')) {
		$(chart_0_depth_0).empty();

		$('#chart_2_ref_0').css({
			"width" : "0px",
			"border-width" : "0px"
		});
		$('#chart_2_ref').css({
			"width" : "0px",
			"border-width" : "0px"
		});

		if (chart0.hasOwnProperty("container")) {
			chart0.destroy();
			chart0_0.destroy();
		}
	}
	if (!$(chart_1_lgr_0).is(':empty')) {
		$(chart_1_lgr_0).empty();

		$('#chart_1_lgr_0').css({
			"width" : "0px",
			"border-width" : "0px"
		});
		$('#chart_1_lgr').css({
			"width" : "0px",
			"border-width" : "0px"
		});

		if (chart1 && chart1.hasOwnProperty("container")) {
			chart1.destroy();
			chart1_0.destroy();
		}
	}
	if (!$(chart_2_ref_0).is(':empty')) {
		$(chart_2_ref_0).empty();

		$('#chart_2_ref_0').css({
			"width" : "0px",
			"border-width" : "0px"
		});
		$('#chart_2_ref').css({
			"width" : "0px",
			"border-width" : "0px"
		});

		if (chart2 && chart2.hasOwnProperty("container")) {
			chart2.destroy();
			chart2_0.destroy();
		}
	}
	if (!$(chart_3_dual_0).is(':empty')) {
		$(chart_3_dual_0).empty();
		$('#chart_3_dual_0').css({
			"width" : "0px",
			"border-width" : "0px"
		});
		$('#chart_3_dual').css({
			"width" : "0px",
			"border-width" : "0px"
		});

		if (chart3 && chart3.hasOwnProperty("container")) {
			chart3.destroy();
			chart3_0.destroy();
		}
	}
	if (!$(chart_4_litho_0).is(':empty')) {
		$(chart_4_litho_0).empty();

		$('#chart_4_litho_0').css({
			"width" : "0px",
			"border-width" : "0px"
		});
		$('#chart_4_litho').css({
			"width" : "0px",
			"border-width" : "0px"
		});

		if (chart4 && chart4.hasOwnProperty("container")) {
			chart4.destroy();
			chart4_0.destroy();
		}
	}
	if (!$(chart_7_sgr_0).is(':empty')) {
		$(chart_7_sgr_0).empty();

		$('#chart_7_sgr_0').css({
			"width" : "0px",
			"border-width" : "0px"
		});
		$('#chart_7_sgr').css({
			"width" : "0px",
			"border-width" : "0px"
		});

		if (chart7 && chart7.hasOwnProperty("container")) {
			chart7.destroy();
			chart7_0.destroy();
		}
	}
	if (!$(chart_8_sgr_ratio_0).is(':empty')) {
		$(chart_8_sgr_ratio_0).empty();

		$('#chart_8_sgr_ratio').css({
			"width" : "0px",
			"border-width" : "0px"
		});
		$('#chart_8_sgr_ratio_0').css({
			"width" : "0px",
			"border-width" : "0px"
		});

		if (chart8 && chart8.hasOwnProperty("container")) {
			chart8.destroy();
			chart8_0.destroy();
		}
	}
	if (!$(chart_9_custom1_0).is(':empty')) {
		$(chart_9_custom1_0).empty();

		$('#chart_9_custom1').css({
			"width" : "0px",
			"border-width" : "0px"
		});
		$('#chart_9_custom1_0').css({
			"width" : "0px",
			"border-width" : "0px"
		});

		if (chart9 && chart9.hasOwnProperty("container")) {
			chart9.destroy();
			chart9_0.destroy();
		}
	}	
	if (!$(chart_16_ctuk_0).is(':empty')) {
		$(chart_16_ctuk_0).empty();

		$('#chart_16_ctuk_0').css({
			"width" : "0px",
			"border-width" : "0px"
		});
		$('#chart_16_ctuk').css({
			"width" : "0px",
			"border-width" : "0px"
		});

		if (chart16 && chart16.hasOwnProperty("container")) {
			chart16.destroy();
			chart16_0.destroy();
		}

	}
	if (!$(chart_18_formation_0).is(':empty')) {
		$(chart_18_formation_0).empty();

		$('#chart_18_formation_0').css({
			"width" : "0px",
			"border-width" : "0px"
		});
		$('#chart_18_formation').css({
			"width" : "0px",
			"border-width" : "0px"
		});

		if (chart18 && chart18.hasOwnProperty("container")) {
			chart18.destroy();
			chart18_0.destroy();
		}
	}
}

function ResetDivWidth() {
	$('#lasViewer_wrapper').css({
		"border-width" : "1px",
		"width" : (GRAPH_WIDTH + 5) + "px"
	});
	$('#viewerBody').css({
		"border-width" : "0px",
		"width" : (GRAPH_WIDTH + 315) + "px"
	});
}

function currentTime() {
	var d = new Date();
	var h = d.getHours();
	var m = d.getMinutes();
	var s = d.getSeconds();
	var ms = d.getMilliseconds();

	return h + ":" + m + ":" + s + "." + ms;
}

/*
 * find the min, max, ticposition of a log file indexed at i postion
 * 
 */
function findMaxMinTicpos(i){
	var o = {};
	/*
	var t = copyArray(las_data_processed[i]);
	t.sort(function(a,b){return a-b;});
	*/
	var s = 0, l = 0;
	
	if (MIN_MAX_LOG_CURRENT[i][0]==null)
		s = MIN_MAX_LOG[i][0];
	else
		s = MIN_MAX_LOG_CURRENT[i][0];
		
	if (MIN_MAX_LOG_CURRENT[i][1]==null)
		l = MIN_MAX_LOG[i][1];
	else
		l = MIN_MAX_LOG_CURRENT[i][1];
	
	if (l==s) {
		l = MIN_MAX_LOG[i][1];
		s = MIN_MAX_LOG[i][0];
	}
			
	o["MAX"] = l;
	o["MIN"] = s;
	/*
	o["MAX"] = Math.ceil((l+1)/10)*10;
	o["MIN"] = Math.floor( (s-1)/10) *10;
	*/
	var il = (o["MAX"] - o["MIN"])/4;
	
	o["TICPOS"] = [parseFloat(o["MIN"].toFixed(1)), parseFloat((o["MIN"]+il).toFixed(2)), parseFloat((o["MIN"]+2*il).toFixed(2)), parseFloat((o["MIN"]+3*il).toFixed(2)), parseFloat(o["MAX"].toFixed(1))];
	
	return o;
}


function copyArray(a) {
	var b = new Array();

	for (var i = 0; i < a.length; i++) {
		b[i] = a[i];
	}

	return b;
}



function compare(array, left, right) {

	var depth = 0;

	while (depth < array[left].length && depth < array[right].length) {

		if (array[left][depth] < array[right][depth])
			return 1;
		else if (array[left][depth] > array[right][depth])
			return -1;

		depth++;

	}

	return 0;

}

function qsort(array, lo, hi) {

	var low = lo;
	var high = hi;
	mid = Math.floor((low + high) / 2);

	do {
		while (compare(array, low, mid) > 0)
		low++;

		while (compare(array, high, mid) < 0)
		high--;

		if (low <= high) {
			swap(array, low, high);
			low++;
			high--;
		}

	} while ( low <= high );

	if (high > lo)
		qsort(array, lo, high);

	if (low < hi)
		qsort(array, low, hi);

}

function swap(a, i, j) {

	var tmp = a[i];
	a[i] = a[j];
	a[j] = tmp;

}
