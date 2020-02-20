/**
 * creating different logs for different tracks
 */

/*
 * Function:
 */
function hideTrackHelp(){
  $('.trackReference').css("display", "none");
  $('.trackDualInduction').css("display", "none");
  $('.trackLithoDensity').css("display", "none");
  $('.trackSpectralGammaRay').css("display", "none");
  $('.trackSpectralGR_Ratio').css("display", "none");
  $('.trackCustom1').css("display", "none");
  $('.trackCTUK').css("display", "none");
  $('.trackFormation').css("display", "none");
  
  $('#txtTrackNameNew').val("");
}


function Set_Highchart_Options_0(){
	Highcharts.setOptions({
		lang: {
			help_tip: "help"
		},
		exporting : {
			enabled : true,
			
            buttons: {
            	contextButton : {
            		enabled : false
            	},
                customButton: {
                    x: 10,
                    y: -10,
                    _titleKey: "help_tip",
                    onclick: function () {
                    	$('#helpTitle').html("Reference");
                    	$('#helpBody').html(help_Reference);
                        $('#helpLogList').modal('show');
                    },
                    symbol: help_icon,
                    width: 14,
                    height : 14
                }
            }			
		},
		navigation : {
			buttonOptions : {
				symbolY : 7,
				symbolX : 7
			},
		},
	});

	$('.highcharts-axis text').click(function (e) {
		var plot = e.currentTarget.textContent;
		var s1 = chart4.get('series_' + plot);
		var s2 = chart4.get('series_residual_' + plot);
		if (s1.visible){
			$('.highcharts-axis text').css('color',"#CCCCCC");
			$('.highcharts-axis text').css('color',"#CCCCCC");
			s1.hide();
			s2.hide();
		}
		else{
			$('.highcharts-axis text').css('color',tColor[plot]);
			s1.show();
			s2.show();
		}
	});
}

function depth_grid_0(chart, dDiv){
	chart0_0 = new Highcharts.Chart({
		chart : {
			renderTo : dDiv,
			spacingRight : 0,
			spacingLeft : 0,
			height : 90,
		},
		title : {
			text : ''
		},
		xAxis : [{
			categories : las_data_processed[0],
			labels : {
				enabled : false,
			},
			title : logLine_Name[0]
		}],
		yAxis : [{
			min : 0,
			max : 1,
			labels : {
				enabled : false,
			},
			title : {
				text : "Depth(" + WELL_DEPTH_UNIT + ")",
				rotation : 90,
				margin :-65,
				/*align: 'high',*/
				style : {
					fontSize : '12px',
					color : '#000000',
					fontWeight : 'bold'
				}
			},
		}],
		tooltip : {
			enabled : false,
		},
		legend : {
			enabled : false
		},
		series : [{
			lineWidth : 1,
			marker : {
				enabled : false
			},
		}]
	}, function(chart) {
		
	});
	
}

function track_log_Lithology_GR_0(cChart, dDiv, logList, tname) {
	chart1_0 = new Highcharts.Chart({
		chart : {
			renderTo : dDiv,
			spacingRight : 0,
			spacingLeft : 0,
		},
		title : {
			text : ""
		},
		xAxis : [{
			categories : las_data_processed[0],
			labels : {
				enabled : false,
			},
		}],
		yAxis : [{
			min : 0,
			max : 15,
			labels : {
				enabled : false,
			},
			title : {
				text : tname,
				rotation : 90,
				margin : 55,
				style : {
					fontSize : '12px',
					color : '#000000',
					fontWeight : 'bold'
				}
			},
			reversed : true,
			opposite : true
		}],
		legend : {
			enabled : false
		},
		series : [{
			lineWidth : 1,
			marker : {
				enabled : false
			},
		}]
	}, function(chart) {
		
	});
}

function track_log_Reference_0(cChart, dDiv, logList, tname) {
	HEADER_LABEL_Y = 88;
	
	var obj = findMaxMinTicpos(logList[0]);
	var max2 = obj["MAX"], min2 = obj["MIN"], tickPos = obj["TICPOS"];
	var minTickInterval = ( max2 - min2 ) / 20;

	var tColor = new Object();
	var t = logLine_Name[logList[0]].toUpperCase();
	tColor[t] = color_Track_Log[0];

	chart2_0 = new Highcharts.Chart({
		//$('#secondColumn').highcharts({
		chart : {
			renderTo : dDiv,
			height : 90,
			/*spacingRight : 0,
			spacingLeft : 0,*/
			type : 'spline',
		},
		title : {
			text : tname,
			style: {
                fontSize: '11px',
                whiteSpace: 'nowrap'
            }
		},
		xAxis : [{
			categories : las_data_processed[0],
			labels : {
				enabled : false,
			},
			opposite : true
		}],
		yAxis : [{
			id : logLine_Name[logList[0]],
			min : min2,
			max : max2,
			tickPositions : tickPos,
			minorTickInterval : minTickInterval,
			labels : {
				/*y : HEADER_LABEL_Y ,*/
				step : 4,
				staggerLines : 1,
				align : 'center',
				style : {
					fontSize : '10px',
					color : color_Track_Log[0]
				},
				rotation : 0
			},
			title : {
				margin : HEADER_LABEL_INTERVAL,
				text : logLine_Name[logList[0]],
				style : {
					color : color_Track_Log[0],
					fontSize : CHART_LOG_FONT_SIZE + 'px',
					fontWeight : 'bold',
					cursor : 'pointer'
				}
			},
			opposite : true

		}],
		series : [{
		}],
		legend : {
			enabled : false
		},
		lang: {
			help_tip: "help"
		},
		exporting : {
			enabled : true,
			
            buttons: {
            	contextButton : {
            		enabled : false
            	},
                customButton: {
                    x: 10,
                    y: -10,
                    _titleKey: "help_tip",
                    onclick: function () {
                      $('#helpTitle').html(chart2_0.title.text + " - Information");
                      hideTrackHelp();
                      $('.trackReference').css("display", "block");
                      
                      $('#helpLogList').modal('show');
                    },
                    symbol: help_icon,
                    width: 14,
                    height : 14
                }
            }			
		},
		navigation : {
			buttonOptions : {
				symbolY : 7,
				symbolX : 7
			},
		},
	}, function(chart) {
	    $('.highcharts-title').click(function(){
	          //alert(chart.title.toString());
	    });	
	});
	
	//chart2.showLoading("Getting data...");
	for (var i=1; i<logList.length; i++){
		HEADER_LABEL_Y = HEADER_LABEL_Y - i*20;
		obj = findMaxMinTicpos(logList[i]);
		max2 = obj["MAX"];
		min2 = obj["MIN"]; 
		tickPos = obj["TICPOS"];

		t = logLine_Name[logList[i]].toUpperCase();
		tColor[t] = color_Track_Log[i];
		
		chart2_0.addAxis({
			min : min2,
			max : max2,
			tickPositions : tickPos,
			
			labels : {
				/*y : HEADER_LABEL_Y,*/
				step : 4,
				staggerLines : 1,
				align : 'center',
				style : {
					color : color_Track_Log[i],
					fontSize : '10px'
				},
				rotation : 0
			},
			title : {
				margin : HEADER_LABEL_INTERVAL,
				text : logLine_Name[logList[i]],
				style : {
					color : color_Track_Log[i],
					fontSize : CHART_LOG_FONT_SIZE + 'px',
					fontWeight : 'bold',
					cursor : 'pointer'
				}
			},
			opposite : true

		});
	}
	//chart2.hideLoading();
	
	$('.highcharts-axis text').click(function (e) {
		var plot = e.currentTarget.textContent;
		var s1 = chart2.get('series_' + plot);
		var s2 = chart2.get('series_residual_' + plot);
		if (s1){
			if (s1.visible){
				$(this).css('color',"#CCCCCC");
				$(this).css('fill',"#CCCCCC");
				s1.hide();
				s2.hide();
			}
			else{
				$(this).css('color',tColor[plot.toUpperCase()]);
				$(this).css('fill',tColor[plot.toUpperCase()]);
				s1.show();
				s2.show();
			}
		}
	});
}

function track_log_Dual_Induction_0(cChart, dDiv, logList, tname) {
	var max2 = 1000, min2 = 1;
	var tColor = new Object();
	
	var tColor = new Object();
	var t = logLine_Name[logList[0]].toUpperCase();
	tColor[t] = color_Track_Log[0];

	chart3_0 = new Highcharts.Chart({
		//$('#secondColumn').highcharts({
		chart : {
			renderTo : dDiv,
			type : 'spline',
		},
		title : {
			text : tname,
			style: {
                fontSize: '11px',
                whiteSpace: 'nowrap'
            }
		},
		xAxis : [{
			categories : las_data_processed[0],
			gridLineWidth : 1,
			gridLineColor : GRIDLINE_COLOR,
			tickInterval : INTERVAL_ELEVATION,
			tickWidth : 0,

			startOnTick : true,
			endOnTick : true,
			showLastLabel : true,

			labels : {
				enabled : false,
			},
			title : logLine_Name[0],
			opposite : true
		}],
		yAxis : [{// Primary yAxis
			id : logLine_Name[logList[0]],
			type : 'logarithmic',
			min : min2,
			max : max2,
			gridLineWidth : 1,
			gridLineColor : GRIDLINE_COLOR,
			/*tickPositions : [0.1, 1, 10, 100, 1000],*/
			minorTickInterval : 0.1,
			
			labels : {
				step : 3,
				staggerLines : 1,
				style : {
					color : color_Track_Log[0],
					fontSize : '10px'
				},
				rotation : 0
			},
			title : {
				margin : HEADER_LABEL_INTERVAL,
				text : logLine_Name[logList[0]],
				style : {
					color : color_Track_Log[0],
					fontSize : CHART_LOG_FONT_SIZE + 'px',
					fontWeight : 'bold',
					cursor : 'pointer'
				}
			},
			
			opposite : true
		}],
		series : [{
		}],
		legend : {
			enabled : false
		},
		lang: {
			help_tip: "help"
		},
		exporting : {
			enabled : true,
			
            buttons: {
            	contextButton : {
            		enabled : false
            	},
                customButton: {
                    x: 10,
                    y: -10,
                    _titleKey: "help_tip",
                    onclick: function () {
                      $('#helpTitle').html(chart3_0.title.text + " - Information");
                    	hideTrackHelp();
                      $('.trackDualInduction').css("display", "block");
                      $('#helpLogList').modal('show');
                    },
                    symbol: help_icon,
                    width: 14,
                    height : 14
                }
            }			
		},
		navigation : {
			buttonOptions : {
				symbolY : 7,
				symbolX : 7
			},

		},

	}, function(chart) {
		//syncronizeCrossHairs(chart);
	});
	
	for (var i=1; i<logList.length; i++){
		seriesMarker = '{ enabled : false, states : { hover : {	enabled : true	} }, symbol :"' +  PLOT_SYMBOL[i] + '"}';

		t = logLine_Name[logList[i]].toUpperCase();
		tColor[t] = color_Track_Log[i];
		chart3_0.addAxis({
			id : logLine_Name[logList[i]],
			type : 'logarithmic',
			gridLineWidth : 0.1,
			gridLineColor : '#FEFEFE',
			/*tickPositions : [0.1, 1, 10, 100, 1000],*/
			min : min2,
			max : max2,
			linewidth : 1,
			labels : {
				step : 3,
				staggerLines : 1,
				style : {
					color : color_Track_Log[i],
					fontSize : '10px'
				},
				rotation : 0
			},
			title : {
				margin : HEADER_LABEL_INTERVAL,
				text : logLine_Name[logList[i]],
				style : {
					color : color_Track_Log[i],
					fontSize : CHART_LOG_FONT_SIZE + 'px',
					fontWeight : 'bold',
					cursor : 'pointer'
				}
			},
			opposite : true

		});
	}
	
	$('.highcharts-axis text').click(function (e) {
		var plot = e.currentTarget.textContent;
		var s1 = chart3.get('series_' + plot);
		var s2 = chart3.get('series_residual_' + plot);
		if (s1){
			if (s1.visible){
				$(this).css('color',"#CCCCCC");
				$(this).css('fill',"#CCCCCC");
				s1.hide();
				s2.hide();
			}
			else{
				$(this).css('color',tColor[plot.toUpperCase()]);
				$(this).css('fill',tColor[plot.toUpperCase()]);
				s1.show();
				s2.show();
			}
		}
	});
}

function track_log_Litho_Density_0(cChart, dDiv, logList, tname) {
	var obj = findMaxMinTicpos(logList[0]);
	var max2 = obj["MAX"], min2 = obj["MIN"], tickPos = obj["TICPOS"];
	var minTickInterval = ( max2 - min2 ) / 20;

	var reversed1 = false;
	var tColor = new Object();
	
	var t = logLine_Name[logList[0]].toUpperCase();
	tColor[t] = color_Track_Log[0];

	if ( t == "DPHI" || t == "NPHI" ) {
		reversed1 = true;
	}

	chart4_0 = new Highcharts.Chart({
		//$('#secondColumn').highcharts({
		chart : {
			renderTo : dDiv,
			marginTop : 90,
			height : 90,
		},
		title : {
			text : tname,
			style: {
                fontSize: '11px',
                whiteSpace: 'nowrap'
            }
		},
		xAxis : [{
			categories : las_data_processed[0],
			labels : {
				enabled : false,
			},
			title : logLine_Name[0],
			opposite : true
		}],
		yAxis : [{// Primary yAxis
			min : min2,
			max : max2,
			tickPositions : tickPos,

			labels : {
				step : 4,
				staggerLines : 1,
				style : {
					color : color_Track_Log[0],
					fontSize : '10px'
				},
				rotation : 0
			},
			title : {
				margin : HEADER_LABEL_INTERVAL,
				text : logLine_Name[logList[0]],
				style : {
					color : color_Track_Log[0],
					fontSize : CHART_LOG_FONT_SIZE + 'px',
					fontWeight : 'bold',
					cursor : 'pointer'
				}
			},
			reversed : reversed1,
			opposite : true

		}],
		series : [{
			name : "",
		}],
		legend : {
			enabled : false
		},
		lang: {
			help_tip: "help"
		},
		exporting : {
			enabled : true,
			
            buttons: {
            	contextButton : {
            		enabled : false
            	},
                customButton: {
                    x: 10,
                    y: -10,
                    _titleKey: "help_tip",
                    onclick: function () {
                      $('#helpTitle').html(chart4_0.title.text + " - Information");
                      hideTrackHelp();
                      $('.trackLithoDensity').css("display", "block");
                        $('#helpLogList').modal('show');
                    },
                    symbol: help_icon,
                    width: 14,
                    height : 14
                }
            }			
		},
		navigation : {
			buttonOptions : {
				symbolY : 7,
				symbolX : 7
			},

		},
		
	}, function(chart) {
		//syncronizeCrossHairs(chart);
	});
	
	for (var i=1; i<logList.length; i++){

		obj = findMaxMinTicpos(logList[i]);
		max2 = obj["MAX"];
		min2 = obj["MIN"]; 
		tickPos = obj["TICPOS"];
		minTickInterval = ( max2 - min2 ) / 20;

		reversed1 = false;

		t = logLine_Name[logList[i]].toUpperCase();
		tColor[t] = color_Track_Log[i];
		
		if ( t == "DPHI" || t == "NPHI" ) {
			reversed1 = true;
		}

		chart4_0.addAxis({
			id : logLine_Name[logList[i]],
			min : min2,
			max : max2,
			tickPositions : tickPos,
			labels : {
				step : 4,
				staggerLines : 1,
				style : {
					color : color_Track_Log[i],
					fontSize : '10px'
				},
				rotation : 0
			},
			title : {
				margin : HEADER_LABEL_INTERVAL,
				text : logLine_Name[logList[i]],
				style : {
					color : color_Track_Log[i],
					fontSize : CHART_LOG_FONT_SIZE + 'px',
					fontWeight : 'bold',
					cursor : 'pointer'
				}
			},
			reversed : reversed1,
			opposite : true
		});
	};
	
	$('.highcharts-axis text').click(function (e) {
		var plot = e.currentTarget.textContent;
		var s1 = chart4.get('series_' + plot);
		var s2 = chart4.get('series_residual_' + plot);
		if (s1){
			if (s1.visible){
				$(this).css('color',"#CCCCCC");
				$(this).css('fill',"#CCCCCC");
				s1.hide();
				s2.hide();
			}
			else{
				$(this).css('color',tColor[plot.toUpperCase()]);
				$(this).css('fill',tColor[plot.toUpperCase()]);
				s1.show();
				s2.show();
			}
		}
	});
	
}


function track_log_Spectral_GR_0(cChart, dDiv, logList, tname) {
	var obj = findMaxMinTicpos(logList[0]);
	var max2 = obj["MAX"], min2 = obj["MIN"], tickPos = obj["TICPOS"];
	var minTickInterval = (max2-min2)/20;

	var tColor = new Object();
	
	var t = logLine_Name[logList[0]].toUpperCase();
	tColor[t] = color_Track_Log[0];

	chart7_0 = new Highcharts.Chart({
		chart : {
			renderTo : dDiv,
			type : 'spline',
		},
		title : {
			text : tname,
			style: {
                fontSize: '12px',
                whiteSpace: 'nowrap'
            }
		},
		xAxis : [{
			categories : las_data_processed[0],
			tickInterval : INTERVAL_ELEVATION,
			tickWidth : 0,
			labels : {
				enabled : false,
			},
			title : logLine_Name[0],
			opposite : true
		}],
		yAxis : [{// Primary yAxis
			min : min2,
			max : max2,
			tickPositions : tickPos,
			minorTickInterval : minTickInterval,
			labels : {
				step : 4,
				staggerLines : 1,
				style : {
					color : color_Track_Log[0],
					fontSize : '10px'
				},
				rotation : 0
			},
			title : {
				margin : HEADER_LABEL_INTERVAL,
				text : logLine_Name[logList[0]],
				style : {
					color : color_Track_Log[0],
					fontSize : CHART_LOG_FONT_SIZE + 'px',
					fontWeight : 'bold',
					cursor : 'pointer'
				}
			},
			opposite : true

		}],
		series : [{
		}],
		lang: {
			help_tip: "help"
		},
		exporting : {
			enabled : true,
			
            buttons: {
            	contextButton : {
            		enabled : false
            	},
                customButton: {
                    x: 10,
                    y: -10,
                    _titleKey: "help_tip",
                    onclick: function () {
                      $('#helpTitle').html(chart7_0.title.text + " - Information");
                      hideTrackHelp();
                      $('.trackSpectralGammaRay').css("display", "block");
                        $('#helpLogList').modal('show');
                    },
                    symbol: help_icon,
                    width: 14,
                    height : 14
                }
            }			
		},
		navigation : {
			buttonOptions : {
				symbolY : 7,
				symbolX : 7
			},

		},
		
	}, function(chart) {
		//syncronizeCrossHairs(chart);
	});
	
	for (var i=1; i<logList.length; i++){
		seriesMarker = '{ enabled : false, states : { hover : {	enabled : true	} }, symbol :"' +  PLOT_SYMBOL[i] + '"}';

		obj = findMaxMinTicpos(logList[i]);
		max2 = obj["MAX"];
		min2 = obj["MIN"]; 
		tickPos = obj["TICPOS"];
		minTickInterval = (max2-min2)/20;

		t = logLine_Name[logList[i]].toUpperCase();
		tColor[t] = color_Track_Log[i];

		chart7_0.addAxis({
			id : logLine_Name[logList[i]],
			min : min2,
			max : max2,
			tickPositions : tickPos,
			minorTickInterval : minTickInterval,
			labels : {
				step : 4,
				staggerLines : 1,
				style : {
					color : color_Track_Log[i],
					fontSize : '10px'
				},
				rotation : 0
			},
			title : {
				margin : HEADER_LABEL_INTERVAL,
				text : logLine_Name[logList[i]],
				style : {
					color : color_Track_Log[i],
					fontSize : CHART_LOG_FONT_SIZE + 'px',
					fontWeight : 'bold',
					cursor : 'pointer'
				}
			},
			opposite : true

		});
	}
	
	$('.highcharts-axis text').click(function (e) {
		var plot = e.currentTarget.textContent;
		var s1 = chart7.get('series_' + plot);
		var s2 = chart7.get('series_residual_' + plot);
		if (s1){
			if (s1.visible){
				$(this).css('color',"#CCCCCC");
				$(this).css('fill',"#CCCCCC");
				s1.hide();
				s2.hide();
			}
			else{
				$(this).css('color',tColor[plot.toUpperCase()]);
				$(this).css('fill',tColor[plot.toUpperCase()]);
				s1.show();
				s2.show();
			}
		}
	});
	
}

function track_log_Spectral_GR_Ratio_0(cChart, dDiv, logList, tname) {
	var max2 = MAX_SPECTRAL_GR_RATIO_TU, min2 = MIN_SPECTRAL_GR_RATIO_TU;
	var tColor = new Object();
	
	var t = logList[0];
	tColor[t] = color_Track_Log[0];

	chart8_0 = new Highcharts.Chart({
		chart : {
			renderTo : dDiv,
			type : 'spline',
		},
		title : {
			text : tname,
			style: {
                fontSize: '12px',
                whiteSpace: 'nowrap'
            }
		},
		xAxis : [{
			categories : las_data_processed[0],
			tickInterval : INTERVAL_ELEVATION,
			tickWidth : 0,

			labels : {
				enabled : false,
			},
			title : logLine_Name[0],
			opposite : true
		}],
		yAxis : [{// Primary yAxis
			id : logLine_Name_DERIVED[0],
			type : 'logarithmic',
			min : min2,
			max : max2,

			minorTickInterval : 0.1,
			plotBorderWidth : 1,
			labels : {
				step : 3,
				staggerLines : 1,
				overflow: 'false',
				style : {
					color : color_Track_Log[0],
					fontSize : '10px'
				},
				rotation : 0
			},
			title : {
				margin : HEADER_LABEL_INTERVAL,
				text : logLine_Name_DERIVED[0],
				style : {
					color : color_Track_Log[0],
					fontSize : CHART_LOG_FONT_SIZE + 'px',
					fontWeight : 'bold',
					cursor : 'pointer'
				}
			},
			opposite : true

		}],
		series : [{
		}],
		lang: {
			help_tip: "help"
		},
		exporting : {
			enabled : true,
			
            buttons: {
            	contextButton : {
            		enabled : false
            	},
                customButton: {
                    x: 10,
                    y: -10,
                    _titleKey: "help_tip",
                    onclick: function () {
                      $('#helpTitle').html(chart8_0.title.text + " - Information");
                      hideTrackHelp();
                      $('.trackSpectralGR_Ratio').css("display", "block");
                        $('#helpLogList').modal('show');
                    },
                    symbol: help_icon,
                    width: 14,
                    height : 14
                }
            }			
		},
		navigation : {
			buttonOptions : {
				symbolY : 7,
				symbolX : 7
			},

		},
		
	}, function(chart) {
		//syncronizeCrossHairs(chart);
	});
	
	for (var i=1; i<logList.length; i++){
		t = logList[i];
		tColor[t] = color_Track_Log[i];

		chart8_0.addAxis({
			/*id : logLine_Name_DERIVED[i],*/
			type : 'logarithmic',
			min : min2,
			max : max2,
			labels : {
				step : 3,
				staggerLines : 1,
				overflow: 'justify',
				style : {
					color : color_Track_Log[i],
					fontSize : '10px'
				},
				rotation : 0
			},
			title : {
				margin : HEADER_LABEL_INTERVAL,
				text : logLine_Name_DERIVED[i],
				style : {
					color : color_Track_Log[i],
					fontSize : CHART_LOG_FONT_SIZE + 'px',
					fontWeight : 'bold',
					cursor : 'pointer'
				}
			},
			opposite : true

		});
	}
	
	$('.highcharts-axis text').click(function (e) {
		var plot = e.currentTarget.textContent;
		var s1 = chart8.get('series_' + plot);
		if (s1){
			if (s1.visible){
				$(this).css('color',"#CCCCCC");
				$(this).css('fill',"#CCCCCC");
				s1.hide();
			}
			else{
				$(this).css('color',tColor[plot.toUpperCase()]);
				$(this).css('fill',tColor[plot.toUpperCase()]);
				s1.show();
			}
		}
	});
	
}

function track_log_custom1_0(cChart, dDiv, logList, tname) {
	var obj = findMaxMinTicpos(logList[0]);
	var max2 = obj["MAX"], min2 = obj["MIN"], tickPos = obj["TICPOS"];
	var minTickInterval = (max2-min2)/20;

	var tColor = new Object();
	
	var t = logLine_Name[logList[0]];
	tColor[t] = color_Track_Log[0];

	chart9_0 = new Highcharts.Chart({
		chart : {
			renderTo : dDiv,
			type : 'spline',
		},
		title : {
			text : tname,
			style: {
                fontSize: '12px',
                whiteSpace: 'nowrap'
            }
		},
		xAxis : [{
			categories : las_data_processed[0],
			tickInterval : INTERVAL_ELEVATION,
			tickWidth : 0,
			labels : {
				enabled : false,
			},
			title : logLine_Name[0],
			opposite : true
		}],
		yAxis : [{// Primary yAxis
			min : min2,
			max : max2,
			tickPositions : tickPos,
			minorTickInterval : minTickInterval,
			labels : {
				step : 4,
				staggerLines : 1,
				style : {
					color : color_Track_Log[0],
					fontSize : '10px'
				},
				rotation : 0
			},
			title : {
				margin : HEADER_LABEL_INTERVAL,
				text : logLine_Name[logList[0]],
				style : {
					color : color_Track_Log[0],
					fontSize : CHART_LOG_FONT_SIZE + 'px',
					fontWeight : 'bold',
					cursor : 'pointer'
				}
			},
			opposite : true

		}],
		series : [{
		}],
		lang: {
			help_tip: "help"
		},
		exporting : {
			enabled : true,
			
            buttons: {
            	contextButton : {
            		enabled : false
            	},
                customButton: {
                    x: 10,
                    y: -10,
                    _titleKey: "help_tip",
                    onclick: function () {
                      $('#helpTitle').html(chart9_0.title.text + " - Information");
                      hideTrackHelp();
                      $('.trackCustom1').css("display", "block");
                        $('#helpLogList').modal('show');
                    },
                    symbol: help_icon,
                    width: 14,
                    height : 14
                }
            }			
		},
		navigation : {
			buttonOptions : {
				symbolY : 7,
				symbolX : 7
			},

		},
		
	}, function(chart) {
		//syncronizeCrossHairs(chart);
	});
	
	for (var i=1; i<logList.length; i++){
		seriesMarker = '{ enabled : false, states : { hover : {	enabled : true	} }, symbol :"' +  PLOT_SYMBOL[i] + '"}';

		obj = findMaxMinTicpos(logList[i]);
		max2 = obj["MAX"];
		min2 = obj["MIN"]; 
		tickPos = obj["TICPOS"];
		minTickInterval = (max2-min2)/20;

		t = logLine_Name[logList[i]];
		tColor[t] = color_Track_Log[i];

		chart9_0.addAxis({
			id : logLine_Name[logList[i]],
			min : min2,
			max : max2,
			tickPositions : tickPos,
			minorTickInterval : minTickInterval,
			labels : {
				step : 4,
				staggerLines : 1,
				style : {
					color : color_Track_Log[i],
					fontSize : '10px'
				},
				rotation : 0
			},
			title : {
				margin : HEADER_LABEL_INTERVAL,
				text : logLine_Name[logList[i]],
				style : {
					color : color_Track_Log[i],
					fontSize : CHART_LOG_FONT_SIZE + 'px',
					fontWeight : 'bold',
					cursor : 'pointer'
				}
			},
			opposite : true

		});
	}
	
	$('.highcharts-axis text').click(function (e) {
		var plot = e.currentTarget.textContent;
		var s1 = chart9.get('series_' + plot);
		var s2 = chart9.get('series_residual_' + plot);
		if (s1){
			if (s1.visible){
				$(this).css('color',"#CCCCCC");
				$(this).css('fill',"#CCCCCC");
				s1.hide();
				s2.hide();
			}
			else{
				$(this).css('color',tColor[plot]);
				$(this).css('fill',tColor[plot]);
				s1.show();
				s2.show();
			}
		}
	});
	
}


function track_log_CTUK_0(cChart, dDiv, logList, tname) {
	chart16_0 = new Highcharts.Chart({
		chart : {
			renderTo : dDiv,
			zoomType : 'x',
		},
		title : {
			text : '',
		},
		xAxis : [{
			categories : las_data_original[0],
			tickInterval : INTERVAL_ELEVATION,
			tickWidth : 0,

			labels : {
				enabled : false,
			},
			title : logLine_Name[0]
		}],
		yAxis : [{// Primary yAxis
			min : 0,
			max : 15,
			tickInterval : 5,
			linewidth : 1,
			labels : {
				enabled : false,
			},
			title : {
				text : tname,
				rotation : 90,
				margin : 45,
				style : {
					fontFamily : LABEL_FONT,
					fontSize : '11px',
					color : '#000000',
					fontWeight : 'bold'
				}
			},
			reversed : true,
			opposite : true

		}],
		series : [{
		}],
		lang: {
			help_tip: "help"
		},
		exporting : {
			enabled : true,
			
            buttons: {
            	contextButton : {
            		enabled : false
            	},
                customButton: {
                    x: 10,
                    y: -10,
                    _titleKey: "help_tip",
                    onclick: function () {
                      $('#helpTitle').html(chart16_0.yAxis[0].axisTitle.text + " - Information");
                      hideTrackHelp();
                      $('.trackCTUK').css("display", "block");
                      $('#helpLogList').modal('show');
                    },
                    symbol: help_icon,
                    width: 14,
                    height : 14
                }
            }			
		},
		navigation : {
			buttonOptions : {
				symbolY : 7,
				symbolX : 7
			},

		},
		
	}, function(chart) {
		///syncronizeCrossHairs(chart);
	});

}

function formation_charting_0(){
	var itemDiv18;
	if (las_data_formation.length>0){
		GRAPH_WIDTH += 120;
		ResetDivWidth();

		document.getElementById('chart_18_formation').setAttribute("style","border-width:1px; width:120px");
		track_log_formation(chart18, "chart_18_formation", logLine_Name_DERIVED);

		createChkbox_Track_Log(itemDiv18, chart_18_formation, "Stratigraphic Units - Formations", "Horizons");
	} else {
		if ( chart18 != undefined ){
			document.getElementById('chart_18_formation').setAttribute("style","width:0px"); 
			chart18.destroy();
		}
	}
}
		

function track_log_formation_0(cChart, dDiv, logList, tname) {
	chart18_0 = new Highcharts.Chart({
		chart : {
			renderTo : dDiv,
			zoomType : 'x',
		},
		title : {
			text : tname
		},
		xAxis : [{
			categories : las_data_processed[0],
			tickInterval : INTERVAL_ELEVATION,
			tickWidth : 0,

			labels : {
				enabled : false,
			},
			title : logLine_Name[0]
		}],
		yAxis : [{// Primary yAxis
			min : 0,
			max : 1,
			tickInterval : 1,
			labels : {
				enabled : false,
				formatter : function() {
					return this.value;
				},
				style : {
					color : '#89A54E'
				},
				rotation : -90
			},
			title : {
				text : "Formations",
				style : {
					color : color_Track_Log[0],
					fontSize : (CHART_LOG_FONT_SIZE+2) + 'px',
					fontWeight : 'bold'
				}
			},
			reversed : true,
			opposite : true

		}],
		series : [{
		}],
		exporting : {
			enabled : true,
			
            buttons: {
            	contextButton : {
            		enabled : false
            	},
                customButton: {
                    x: 10,
                    y: -10,
                    onclick: function () {
                      $('#helpTitle').html(chart18_0.title.text + " - Information");
                      hideTrackHelp();
                      $('.trackFormation').css("display", "block");
                        $('#helpLogList').modal('show');
                    },
                    symbol: help_icon,
                    width: 14,
                    height : 14
                }
            }			
		},
		navigation : {
			buttonOptions : {
				symbolY : 7,
				symbolX : 7
			},

		},
		
	}, function(chart) {
		//syncronizeCrossHairs(chart);
	});
}
