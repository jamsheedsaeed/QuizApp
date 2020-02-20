function chartingLasdata() {
	// The raw data is processed in this function which is located in las_data_processed.js
	// Varibles that are from las_data_processed.js include las_data_original, las_data_processed, las_data_residual
	// Vairbles that are from las_header.js include logLine_Name, track_log_current, index_LithoGR
	$(icProgress).css("visibility", "visible");

	if (NO_CURVE_TO_PLOT) {
		$(loadingWindow).css("display", "none");
		$(icProgress).css("visibility", "hidden");
		//Print_No_Data_Warning();
		
		NO_CURVE_TO_PLOT = false;
		Print_Unploted_Log_List();
		return;
	}

	// preparations
	// print the contral panel
	print_well_info();
	print_well_top("none");

	// have the parameters ready for plotting
	generateWellTopSamples();
	// end of preparations

	Set_Highchart_Options();
	initialInterface();
	
	GRAPH_WIDTH = 25;
	ResetPanelWidth();
	$(las_track_list).css("display", 'block');
	
	$("#txtProcess").html("Plotting Depth Grid...");
	$("#txtProcess1").html("Plotting Depth Grid...");
	setTimeout(function(){
		$("#lasPlotBody").css('visibility', 'visible');
		charting_depth_grid();					// depth grid
	}, TIMEOUT_TIME);
	
}

function charting_depth_grid() {
	var itemDiv0;
	if (1 == 1) {
		GRAPH_WIDTH += 40;
		ResetDivWidth();

		$('#chart_0_depth').css({ "border-width" : "1px", "width" : "40px"});
		$('#chart_0_depth_0').css({ "border-width" : "1px",	"width" : "40px"});
		$('#chart_0_depth_0').addClass('plotHeader_border');

		depth_grid(chart0, "chart_0_depth", las_data_processed);
		depth_grid_0(chart0_0, "chart_0_depth_0", las_data_processed);
	} else {
		if (chart0 != undefined) {
			$('#chart_0_depth').css({
				"width" : "0px",
				"border-width" : "0px"
			});
			$('#chart_0_depth_0').css({
				"width" : "0px",
				"border-width" : "0px"
			});

			if (itemDiv0 != undefined)
				itemDiv0.destroy();
			$itemDiv0.empty();
			$itemDiv0.remove();
		}
	}

	if ( aLithoGammaRay.length > 0) {
		$("#txtProcess").html("Plotting " + TRACK_NAME.LithologyGR + "...");
		$("#txtProcess1").html("Plotting " + TRACK_NAME.LithologyGR + "...");
	}
	
	setTimeout(function(){
		charting_lithology_gr();					// depth grid
	}, TIMEOUT_TIME);
}

function charting_lithology_gr() {
	var itemDiv1;
	if ( aLithoGammaRay.length > 0) {
		GRAPH_WIDTH += 30;
		ResetDivWidth();

		$('#chart_1_lgr').css({
			"border-width" : "1px",
			"width" : "30px"
		});
		$('#chart_1_lgr_0').css({
			"border-width" : "1px",
			"width" : "30px"
		});
		$('#chart_1_lgr_0').addClass('plotHeader_border');

		track_log_Lithology_GR(chart1, "chart_1_lgr", las_data_processed);
		track_log_Lithology_GR_0(chart1_0, "chart_1_lgr_0", las_data_processed, TRACK_NAME.LithologyGR);
		createChkbox_Track_Log(itemDiv1, chart_1_lgr, "V-Shale", "");

	} else {
		if (chart1 != undefined) {
			$('#chart_1_lgr').css({
				"width" : "0px",
				"border-width" : "0px"
			});
			$('#chart_1_lgr_0').css({
				"width" : "0px",
				"border-width" : "0px"
			});
			if (itemDiv1 != undefined)
				itemDiv1.destroy();
				
			if (chart1.hasOwnProperty("container")) {
				chart1.destroy();
				chart1_0.destroy();
			}
		}
	}

	if (track_log_current.hasOwnProperty(TRACK_NAME.Reference)) {
		$("#txtProcess").html("Plotting " + TRACK_NAME.Reference + "...");
		$("#txtProcess1").html("Plotting " + TRACK_NAME.Reference + "...");
	}
	setTimeout(function(){
		charting_reference();					// depth grid
	}, TIMEOUT_TIME);

}

function charting_reference() {
	var itemDiv2;
	if (track_log_current.hasOwnProperty(TRACK_NAME.Reference)) {
		//if (chart2 == undefined){
			GRAPH_WIDTH += (150 + 5);
			ResetDivWidth();
	
			$('#chart_2_ref').css({
				"border-width" : "1px",
				"width" : 150 + "px"
			});
			$('#chart_2_ref_0').css({
				"border-width" : "1px",
				"width" : 150 + "px"
			});
			$('#chart_2_ref_0').addClass('plotHeader_border');
	
			track_log_Reference(chart2, "chart_2_ref", track_log_current[TRACK_NAME.Reference]);
			track_log_Reference_0(chart2_0, "chart_2_ref_0", track_log_current[TRACK_NAME.Reference], TRACK_NAME.Reference);
			createChkbox_Track_Log(itemDiv2, chart_2_ref, TRACK_NAME.Reference, "Reference Logs");
		//}
	} else {
		if (chart2 != undefined) {
			$('#chart_2_ref').css({
				"width" : "0px",
				"border-width" : "0px"
			});
			$('#chart_2_ref_0').css({
				"width" : "0px",
				"border-width" : "0px"
			});
	
			if (itemDiv2 != undefined)
				itemDiv2.destroy();
			if (chart2.hasOwnProperty("container")) {
				chart2.destroy();
				chart2_0.destroy();
			}
		} 
	}
	
	if (track_log_current.hasOwnProperty(TRACK_NAME.DualInduction)) {
		$("#txtProcess").html("Plotting " + TRACK_NAME.DualInduction + "...");
		$("#txtProcess1").html("Plotting " + TRACK_NAME.DualInduction + "...");
	}
	
	if (track_log_current.hasOwnProperty(TRACK_NAME.DualInduction)) {
		$("#txtProcess").html("Plotting " + TRACK_NAME.DualInduction + "...");
		$("#txtProcess1").html("Plotting " + TRACK_NAME.DualInduction + "...");
	}
	
	setTimeout(function(){
		charting_dual();					// depth grid
	}, TIMEOUT_TIME);
}

function charting_dual() {
	if (track_log_current.hasOwnProperty(TRACK_NAME.DualInduction)) {
	//if (track_log_current.hasOwnProperty("Dual Induction")) {
		//if (chart3 == undefined){
			var itemDiv3;
			GRAPH_WIDTH += (TRACK_WIDTH + 5);
			ResetDivWidth();
	
			$('#chart_3_dual').css({
				"border-width" : "1px",
				"width" : TRACK_WIDTH + "px"
			});
			$('#chart_3_dual_0').css({
				"border-width" : "1px",
				"width" : TRACK_WIDTH + "px"
			});
			$('#chart_3_dual_0').addClass('plotHeader_border');
	
			track_log_Dual_Induction(chart3, "chart_3_dual", track_log_current[TRACK_NAME.DualInduction]);
			track_log_Dual_Induction_0(chart3_0, "chart_3_dual_0", track_log_current[TRACK_NAME.DualInduction], TRACK_NAME.DualInduction);
	
			createChkbox_Track_Log(itemDiv3, chart_3_dual, TRACK_NAME.DualInduction, "Resistivity and Induction Logs");
		//}
	} else {
		if (chart3 != undefined) {
			$('#chart_3_dual').css({
				"width" : "0px",
				"border-width" : "0px"
			});
			$('#chart_3_dual_0').css({
				"width" : "0px",
				"border-width" : "0px"
			});
	
			if (itemDiv3 != undefined)
				itemDiv3.destroy();
			if (chart3.hasOwnProperty("container")) {
				chart3.destroy();
				chart3_0.destroy();
			}
		} 
	}
	
	if (track_log_current.hasOwnProperty(TRACK_NAME.LithoDensity)) {
		$("#txtProcess").html("Plotting  " + TRACK_NAME.LithoDensity + "...");
		$("#txtProcess1").html("Plotting  " + TRACK_NAME.LithoDensity + "...");
	}
	setTimeout(function(){
		charting_litho_density();					// depth grid
	}, TIMEOUT_TIME);
}

function charting_litho_density() {
	if (track_log_current.hasOwnProperty(TRACK_NAME.LithoDensity)) {
		//if (chart4 == undefined){
			var itemDiv4;
			GRAPH_WIDTH += (TRACK_WIDTH + 5);
			ResetDivWidth();
	
			$('#chart_4_litho').css({
				"border-width" : "1px",
				"width" : TRACK_WIDTH + "px"
			});
			$('#chart_4_litho_0').css({
				"border-width" : "1px",
				"width" : TRACK_WIDTH + "px"
			});
			$('#chart_4_litho_0').addClass('plotHeader_border');
	
			track_log_Litho_Density(chart4, "chart_4_litho", track_log_current[TRACK_NAME.LithoDensity]);
			track_log_Litho_Density_0(chart4_0, "chart_4_litho_0", track_log_current[TRACK_NAME.LithoDensity], TRACK_NAME.LithoDensity);
	
			createChkbox_Track_Log(itemDiv4, chart_4_litho, TRACK_NAME.LithoDensity, "Litho Density Logs");
		//}
	} else {
		if (chart4 != undefined) {
			$('#chart_4_litho').css({
				"width" : "0px",
				"border-width" : "0px"
			});
			$('#chart_4_litho_0').css({
				"width" : "0px",
				"border-width" : "0px"
			});
			if (itemDiv4 != undefined)
				itemDiv4.destroy();
	
			if (chart4.hasOwnProperty("container")) {
				chart4.destroy();
				chart4_0.destroy();
			}
		} 
	}
	
	if (track_log_current.hasOwnProperty(TRACK_NAME.SpectralGR)) {
		$("#txtProcess").html("Plotting " + TRACK_NAME.SpectralGR + "...");
		$("#txtProcess1").html("Plotting " + TRACK_NAME.SpectralGR + "...");
	}
	setTimeout(function(){
		charting_spectral_gr();					// depth grid
	}, TIMEOUT_TIME);
}

function charting_spectral_gr() {
	if (track_log_current.hasOwnProperty(TRACK_NAME.SpectralGR)) {
		//if (chart7 == undefined) {
			var itemDiv7;
			GRAPH_WIDTH += (TRACK_WIDTH + 5);
			ResetDivWidth();
	
			$('#chart_7_sgr').css({
				"border-width" : "1px",
				"width" : TRACK_WIDTH + "px"
			});
			$('#chart_7_sgr_0').css({
				"border-width" : "1px",
				"width" : TRACK_WIDTH + "px"
			});
			$('#chart_7_sgr_0').addClass('plotHeader_border');
	
			track_log_Spectral_GR(chart7, "chart_7_sgr", track_log_current[TRACK_NAME.SpectralGR]);
			track_log_Spectral_GR_0(chart7_0, "chart_7_sgr_0", track_log_current[TRACK_NAME.SpectralGR], TRACK_NAME.SpectralGR);
	
			createChkbox_Track_Log(itemDiv7, chart_7_sgr, TRACK_NAME.SpectralGR, "Spectral Gamma Ray and Computed Logs");
		//}
	} else {
		if (chart7 != undefined) {
			$('#chart_7_sgr').css({
				"width" : "0px",
				"border-width" : "0px"
			});
			$('#chart_7_sgr_0').css({
				"width" : "0px",
				"border-width" : "0px"
			});
			if (itemDiv7 != undefined)
				itemDiv7.destroy();
				if (chart7.hasOwnProperty("container")) {
				chart7.destroy();
				chart7_0.destroy();
			}
		} 
	}
	if (logLine_Name_DERIVED.length > 0) {
		$("#txtProcess").html("Plotting " + TRACK_NAME.SpectralGRRatio + "...");
		$("#txtProcess1").html("Plotting " + TRACK_NAME.SpectralGRRatio + "...");
	}
	setTimeout(function(){
		charting_spectral_gr_ratio();					// depth grid
	}, TIMEOUT_TIME);
}

function charting_spectral_gr_ratio() {
	var itemDiv8;
	if (logLine_Name_DERIVED.length > 0) {
		GRAPH_WIDTH += (TRACK_WIDTH + 5);
		ResetDivWidth();

		$('#chart_8_sgr_ratio').css({
			"border-width" : "1px",
			"width" : TRACK_WIDTH + "px"
		});
		$('#chart_8_sgr_ratio_0').css({
			"border-width" : "1px",
			"width" : TRACK_WIDTH + "px"
		});
		$('#chart_8_sgr_ratio_0').addClass('plotHeader_border');

		track_log_Spectral_GR_Ratio(chart8, "chart_8_sgr_ratio", logLine_Name_DERIVED);
		track_log_Spectral_GR_Ratio_0(chart8_0, "chart_8_sgr_ratio_0", logLine_Name_DERIVED, TRACK_NAME.SpectralGRRatio);

		createChkbox_Track_Log(itemDiv8, chart_8_sgr_ratio, TRACK_NAME.SpectralGRRatio, "");
	} else {
		if (chart8 != undefined) {
			$('#chart_8_sgr_ratio').css({
				"width" : "0px",
				"border-width" : "0px"
			});
			$('#chart_8_sgr_ratio_0').css({
				"width" : "0px",
				"border-width" : "0px"
			});
			if (itemDiv8 != undefined)
				itemDiv8.destroy();
			if (chart8.hasOwnProperty("container")) {
				chart8.destroy();
				chart8_0.destroy();
			}
		}
	}

	if (track_log_current.hasOwnProperty(TRACK_NAME.Custom1)) {
		$("#txtProcess").html("Plotting " + TRACK_NAME.Custom1 + "...");
		$("#txtProcess1").html("Plotting " + TRACK_NAME.Custom1 + "...");
	}
	setTimeout(function(){
		charting_new_track();					// depth grid
	}, TIMEOUT_TIME);
}

function charting_new_track() {
	if (track_log_current.hasOwnProperty(TRACK_NAME.Custom1)) {
		var itemDiv9;
		GRAPH_WIDTH += (TRACK_WIDTH + 5);
		ResetDivWidth();
	
		$('#chart_9_custom1').css({
			"border-width" : "1px",
			"width" : TRACK_WIDTH + "px"
		});
		$('#chart_9_custom1_0').css({
			"border-width" : "1px",
			"width" : TRACK_WIDTH + "px"
		});
		$('#chart_9_custom1_0').addClass('plotHeader_border');
	
		track_log_custom1(chart9, "chart_9_custom1", track_log_current[TRACK_NAME.Custom1]);
		track_log_custom1_0(chart9_0, "chart_9_custom1_0", track_log_current[TRACK_NAME.Custom1], TRACK_NAME.Custom1);
	
		createChkbox_Track_Log(itemDiv9, chart_9_custom1, TRACK_NAME.Custom1, "New Track");
	} else {
		if (chart9 != undefined) {
			$('#chart_9_custom1').css({
				"width" : "0px",
				"border-width" : "0px"
			});
			$('#chart_9_custom1_0').css({
				"width" : "0px",
				"border-width" : "0px"
			});
			if (itemDiv9 != undefined)
				itemDiv9.destroy();
			
			if (chart9.hasOwnProperty("container")) {
				chart9.destroy();
				chart9_0.destroy();
			}
		} 
	}

	if (las_data_CTUK.length > 0) {
		$("#txtProcess").html("Plotting " + TRACK_NAME.CTUK + "...");
		$("#txtProcess1").html("Plotting " + TRACK_NAME.CTUK + "...");
	}
	setTimeout(function(){
		charting_ctuk();					// depth grid
	}, TIMEOUT_TIME);
}

function charting_ctuk() {
	var itemDiv16;
	if (las_data_CTUK.length > 0) {
		GRAPH_WIDTH += 50;
		ResetDivWidth();

		$('#chart_16_ctuk').css({
			"border-width" : "1px",
			"width" : "50px"
		});
		$('#chart_16_ctuk_0').css({
			"border-width" : "1px",
			"width" : "50px"
		});
		$('#chart_16_ctuk_0').addClass('plotHeader_border');

		track_log_CTUK(chart16, "chart_16_ctuk", logLine_Name_DERIVED);
		track_log_CTUK_0(chart16_0, "chart_16_ctuk_0", logLine_Name_DERIVED, TRACK_NAME.CTUK);

		createChkbox_Track_Log(itemDiv16, chart_16_ctuk, TRACK_NAME.CTUK, "Interpreted Logs");
	} else {
		if (chart16 != undefined) {
			$('#chart_16_ctuk').css({
				"width" : "0px",
				"border-width" : "0px"
			});
			$('#chart_16_ctuk_0').css({
				"width" : "0px",
				"border-width" : "0px"
			});

			if (itemDiv16 != undefined)
				itemDiv16.destroy();
			if (chart16.hasOwnProperty("container")) {
				chart16.destroy();
				chart16_0.destroy();
			}
		}
	}
	
	if (las_data_formation.length>0){
		$("#txtProcess").html("Plotting " + TRACK_NAME.Formation + "...");
		$("#txtProcess1").html("Plotting " + TRACK_NAME.Formation + "...");
	}
	setTimeout(function(){
		charting_formation();					// depth grid
	}, TIMEOUT_TIME);
}

function charting_formation() {
	var itemDiv18;
	if (las_data_formation.length>0){
		GRAPH_WIDTH += 120;
		ResetDivWidth();

		$('#chart_18_formation').css({"border-width":"1px", "width":"120px"});
		$('#chart_18_formation_0').css({"border-width":"1px", "width":"120px"});
		$('#chart_18_formation_0').addClass('plotHeader_border');
		track_log_formation(chart18, "chart_18_formation", logLine_Name_DERIVED);
		track_log_formation_0(chart18_0, "chart_18_formation_0", logLine_Name_DERIVED, TRACK_NAME.Formation);

		createChkbox_Track_Log(itemDiv18, chart_18_formation, "Formation Tops", TRACK_NAME.Formation);
	} else {
		if ( chart18 != undefined ){
			$('#chart_18_formation').css({"width":"0px", "border-width":"0px"}); 
			$('#chart_18_formation_0').css({"width":"0px", "border-width":"0px"});
			if ( itemDiv18!=undefined ) itemDiv18.destroy();
			
			if ( chart18.hasOwnProperty("container")) {
				chart18.destroy();
				chart18_0.destroy();
			}
		}
	}
	
	charting_end();
}

function charting_end(){
	FIRSTTIME = false;

	$('.highcharts-axis text').hover(function() {
		// Hover over code
		var title = "Click show/hide the log.";
		$(this).data('tipText', title).removeAttr('title');
		$('<p class="tooltip"></p>').text(title).appendTo('body').fadeIn('slow');
	}, function() {
		// Hover out code
		$(this).attr('title', $(this).data('tipText'));
		$('.tooltip').remove();
	}).mousemove(function(e) {
		var mousex = e.pageX + 20;
		//Get X coordinates
		var mousey = e.pageY + 10;
		//Get Y coordinates
		$('.tooltip').css({
			top : mousey,
			left : mousex
		});
	});

	$("#iconOpen").prop("disabled",false);
	$("#iconOpenLogList").prop("disabled",false);
	
	$(icProgress).css("visibility", "hidden");
	$('#loadFile').css("visibility", "hidden");
	$('#fileInput').css("visibility", "visible");
	
	$('#loading_progress').modal('hide');

	$('#loadingWindow').jqxWindow('close');
	$('#loadingWindow').jqxWindow({
		showCollapseButton : true,
		showCloseButton : true
	});
	END_TIME = (new Date()).getTime();
	console.log(currentTime() + ". ->Job done.");
	console.log("Total Time: " + (END_TIME - BEGINNING_TIME) / 1000 + " \n **********");
}
