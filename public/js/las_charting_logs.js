/**
 * creating different logs for different tracks
 */

/*
 * Function:
 */


function Set_Highchart_Options(){
	Highcharts.setOptions({
		chart: {
			zoomType : 'x',
			isZoomed : false ,
			inverted : true,
			marginTop : TRACK_MARGIN_TOP,
			resetZoomButton : {
				position : {
					x : 0,
					y : 0
				},
				theme : {
					display: 'none'
				},
				relativeTo: 'plot'
			},/*
			events: {
				load: function(event){
					$(document).resize();
				}
			}*/
		},
		title : {
			y : 0,
			style : {
				color : "#000000",
				fontSize : CHART_TITLE_FONT_SIZE + 'px',
				fontWeight : 'bold'
			}
		},
		xAxis : {
			/*
			events : {
				setExtremes : function(e){
					$('#busyModal').modal('show');
				},
				afterSetExtremes : function(e){
					$('#busyModal').modal('hide');
				}			
			}
			*/
		},
		tooltip : {
			animation : false,
			shared : false,
			enabled : true,
			useHTML : true,
			style : {
				padding : '2px',
				fontSize : '10px',
			},
			formatter : function() {
				var a = 'Depth: ' + parseFloat(this.x).toFixed(2) + ' ' + WELL_DEPTH_UNIT + '<br />';
				//a += '----------<br />';
				var i = this.series.name.indexOf('_residual');
				
				a += i>0 ? this.series.name.substring(0,i) : this.series.name;
				
				a += ': ' + parseFloat( (this.y + (i>0 ? this.series.yAxis.max:0) ) ).toFixed(3);
				/*$.each(this.points, function (i, point){
					if (point.series.name.indexOf("_residual")==-1){
						a += '<br />' +  point.series.name + ': <b>' + parseFloat(point.y).toFixed(3) + '</b>';
					}
				});
				*/
				
				return a;
			}
		},
		legend : {
			enabled : false,
			layout : 'vertical',
			align : 'right',
			x : 0,
			y : 0,
			verticalAlign : 'top',
			floating : true,
			backgroundColor : '#FFFFFF'
		},
		exporting : {
			enabled : false,
		},
		credits : {
			enabled : false
		}
	})
}

function depth_grid(chart, dDiv){
	console.log(currentTime() + ". Begins -> Depth Grid charting.");
	Set_Highchart_Options();
	
	chart0 = new Highcharts.Chart({
		chart : {
			renderTo : dDiv,
			marginTop : 0,
			spacingRight : 0,
			spacingLeft : 0,
			events : {
				selection : function(event) {
					$('#busyModal').modal('show');
					setTimeout(function (){
						synZoom(event,0, 'block');
					}, 1000);
				}
			}
		},
		title : {
			text : ''
		},
		xAxis : [{
			categories : las_data_processed[0],
			gridLineWidth : 1,
			tickInterval : INTERVAL_ELEVATION,
			labels : {
				enabled : true,
				align : 'left',
				rotation : 0,
				step : 10,
				x : 5,
				y : 12,
				style : {
					color : 'black',
					fontFamily : LABEL_FONT,
					fontSize : '12px',
					fontWeight : 'bold'
				},
				formatter : function() {
					return Math.floor(this.value);
				}
			},
			title : logLine_Name[0]
		}],
		yAxis : [{// Primary yAxis
			min : 0,
			max : 1,
			labels : {
				enabled : false,
			},
			title : {
				text : "",
			},
			reversed : true,
			opposite : true
		}],
		tooltip : {
			enabled : false,
		},
		series : [{
			lineWidth : 1,
			data : las_data_processed[0],
			marker : {
				enabled : false
			},
			turboThreshold : TURBO_SHRESHHOLD
		}]
	}, function(chart) {
		//syncronizeCrossHairs(chart);
	});
	console.log(currentTime() + ". Ends -> Depth Grid charting.");	
}

function track_log_Lithology_GR(cChart, dDiv, logList) {
	console.log(currentTime() + ". Begins -> Lithogy Gamma Ray charting.");
	chart1 = new Highcharts.Chart({
		chart : {
			renderTo : dDiv,
			marginTop : 0,
			spacingRight : 0,
			spacingLeft : 0,
			events : {
				selection : function(event) {
					$('#busyModal').modal('show');
					setTimeout(function (){
						synZoom(event,1, 'block');
					}, 1000);
				}
			}
		},
		title : {
			text : ""
		},
		xAxis : [{
			categories : las_data_processed[0],
			gridLineWidth : 0,
			gridLineColor : GRIDLINE_COLOR,
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
			labels : {
				enabled : false,
			},
			reversed : true,
			opposite : true
		}],
		series : [{
			id : "series_" + logList[0],
			type : 'column',
			lineWidth : 1,
			name : logLine_Name[index_LithoGR],
			data : aLithoGammaRay,
			marker : {
				enabled : true
			},
			turboThreshold : TURBO_SHRESHHOLD
		}],
		tooltip : {
			enabled : false
		},
		plotOptions : {
			series : {
				pointPadding : 0,
				groupPadding : 0,
				borderWidth : 0,
				shadow : false,
				connectNulls: true // by default
			}
		}
	}, function(chart) {
		this.hideLoading();
	});

	console.log(currentTime() + ". Ends -> Lithogy Gamma Ray charting.");
}

function track_log_Reference(cChart, dDiv, logList) {
	console.log(currentTime() + ". Begins -> Reference charting.");
	
	//if (MIN_MAX_LOG[logList][2] == 1)
	var obj = findMaxMinTicpos(logList[0]);
	var max2 = obj["MAX"], min2 = obj["MIN"], tickPos = obj["TICPOS"];
	var minTickInterval = (max2-min2) / 20;

	var markerEnabled = false;							// the default marker (for standard LAS file) for every value is disabled: false
	if ( logLine_SourceType[logList[0]] == "excel" )
		markerEnabled = true;							// for the excel data, the markers need to be enabled: true;
	
	chart2 = new Highcharts.Chart({
		//$('#secondColumn').highcharts({
		chart : {
			renderTo : dDiv,
			marginTop : 0,
			type : 'spline',
			events : {
				selection : function(event) {
					$('#busyModal').modal('show');
					setTimeout(function (){
						synZoom(event,2, 'block');
					}, 1000);
				}
			}
		},
		title : {
			text : ''
		},
		xAxis : [{
			categories : las_data_processed[0],
			gridLineWidth : 1,
			tickInterval : INTERVAL_ELEVATION,
			tickWidth : 1,
			tickLength : 0,
			labels : {
				enabled : false,
			},
			title : logLine_Name[0],
			opposite : true
		}],
		yAxis : [{// Primary yAxis
			id : logLine_Name[logList[0]],
			min : min2,
			max : max2,
			tickPositions : tickPos,
			gridLineColor : GRIDLINE_COLOR,
			minorTickInterval : minTickInterval,
			linewidth : 1,
			labels : {	enabled : false },
			title : { enabled : false },
			opposite : true

		}],
		tooltip: {
		},
		series : [{
			id : "series_" + logLine_Name[logList[0]],
			type : 'spline',
			lineWidth : 1,
			name : logLine_Name[logList[0]],
			color : color_Track_Log[0],
			yAxis : 0,
			data : las_data_original[logList[0]], //las_data_original[1],
			marker : { 
				enabled : markerEnabled, 
				states : { 
					hover : {	
						enabled : true	
					} 
				}, 
				symbol : PLOT_SYMBOL[0]
			},
			turboThreshold : TURBO_SHRESHHOLD
		},{
			id : "series_residual_" + logLine_Name[logList[0]],
			type : 'spline',
			lineWidth : 1,
			name : logLine_Name[logList[0]],
			color : color_Track_Log[0],
			yAxis : 0,
			data : las_data_residual[logList[0]], //las_data_original[1],
			marker : { 
				enabled : markerEnabled, 
				states : { 
					hover : {	
						enabled : true	
					} 
				}, 
				symbol : PLOT_SYMBOL[0]
			},
			turboThreshold : TURBO_SHRESHHOLD
		}],
		plotOptions: {
            series: {
            	stickyTracking : false,
                connectNulls: true // by default
            }
        }
	}, function(chart) {
    });
	
	chart2.showLoading("Getting data...");
	
	for (var i=1; i<logList.length; i++){
		obj = findMaxMinTicpos(logList[i]);
		var max2 = obj["MAX"], min2 = obj["MIN"], tickPos = obj["TICPOS"];

		markerEnabled = false;							// the default (for standard LAS file) plot type is "spline";
		if ( logLine_SourceType[logList[i]] == "excel" )
			markerEnabled = true;
		
		chart2.addAxis({
			id : logLine_Name[logList[i]],
			min : min2,
			max : max2,
			tickPositions : tickPos,
			
			linewidth : 0,
			labels : { enabled : false },
			title : { enabled : false },
			opposite : true
		});
		chart2.addSeries({
			id : "series_" + logLine_Name[logList[i]],
			type : 'spline',
			lineWidth : 1,
			name : logLine_Name[logList[i]],
			color : color_Track_Log[i],
			yAxis : logLine_Name[logList[i]],
			data : las_data_processed[logList[i]], //las_data_original[1],
			marker : { 
				enabled : markerEnabled, 
				states : { 
					hover : {	
						enabled : true	
					} 
				}, 
				symbol : PLOT_SYMBOL[i]
			},
			turboThreshold : TURBO_SHRESHHOLD
		});
		chart2.addSeries({
			id : "series_residual_" + logLine_Name[logList[i]],
			type : 'spline',
			lineWidth : 1,
			name : logLine_Name[logList[i]],
			color : color_Track_Log[i],
			yAxis : logLine_Name[logList[i]],
			data : las_data_residual[logList[i]], //las_data_original[1],
			marker : { 
				enabled : markerEnabled, 
				states : { 
					hover : {	
						enabled : true	
					} 
				}, 
				symbol : PLOT_SYMBOL[i]
			},
			turboThreshold : TURBO_SHRESHHOLD
		});
	}
	
	chart2.hideLoading();
	console.log(currentTime() + ". Ends -> Reference charting.");
}

function track_log_Dual_Induction(cChart, dDiv, logList) {
	console.log(currentTime() + ". Begins -> Dual Induction charting.");
	var max2 = 1000, min2 = 1;

	var markerEnabled = false;							// the default marker (for standard LAS file) for every value is disabled: false
	if ( logLine_SourceType[logList[0]] == "excel" )
		markerEnabled = true;							// for the excel data, the markers need to be enabled: true;

	chart3 = new Highcharts.Chart({
		chart : {
			renderTo : dDiv,
			type : 'spline',
			marginTop : 0,
			events : {
				selection : function(event) {
					$('#busyModal').modal('show');
					setTimeout(function (){
						synZoom(event,3, 'block');
					}, 1000);
				}
			}
		},
		title : {
			text : ''//'Dual Induction'
		},
		xAxis : [{
			categories : las_data_processed[0],
			gridLineWidth : 1,
			tickInterval : INTERVAL_ELEVATION,
			tickWidth : 0,

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
			minorTickInterval : 0.1,
			labels : { enabled : false },
			title : { enabled : false },
			opposite : true
		}],
		series : [{
			id : "series_" + logLine_Name[logList[0]],
			type : 'spline',
			lineWidth : 1,
			name : logLine_Name[logList[0]],
			color : color_Track_Log[0],
			yAxis : 0,
			data : las_data_original[logList[0]], //las_data_original[1],
			marker : {
				enabled : markerEnabled
			},
			turboThreshold : TURBO_SHRESHHOLD
		},{
			id : "series_residual_" + logLine_Name[logList[0]],
			type : 'spline',
			lineWidth : 1,
			name : logLine_Name[logList[0]],
			color : color_Track_Log[0],
			yAxis : 0,
			data : las_data_residual[logList[0]], //las_data_original[1],
			marker : {
				enabled : markerEnabled
			},
			turboThreshold : TURBO_SHRESHHOLD
		}]
	}, function(chart) {
		//syncronizeCrossHairs(chart);
	});
	
	for (var i=1; i<logList.length; i++){
		markerEnabled = false;							// the default (for standard LAS file) plot type is "spline";
		if ( logLine_SourceType[logList[i]] == "excel" )
			markerEnabled = true;
		
		chart3.addAxis({
			id : logLine_Name[logList[i]],
			type : 'logarithmic',
			gridLineWidth : 0,
			/*gridLineColor : '#FEFEFE',*/
			min : min2,
			max : max2,
			linewidth : 1,
			labels : { enabled: false },
			title : { enabled : false },
			opposite : true

		});
		
		chart3.addSeries({
			id : "series_" + logLine_Name[logList[i]],
			type : 'spline',
			lineWidth : 1,
			name : logLine_Name[logList[i]],
			color : color_Track_Log[i],
			yAxis : logLine_Name[logList[i]],
			data : las_data_original[logList[i]], //las_data_original[1],
			marker : {
				enabled : markerEnabled
			},
			turboThreshold : TURBO_SHRESHHOLD
		});
		
		chart3.addSeries({
			id : "series_residual_" + logLine_Name[logList[i]],
			type : 'spline',
			lineWidth : 1,
			name : logLine_Name[logList[i]],
			color : color_Track_Log[i],
			yAxis : logLine_Name[logList[i]],
			data : las_data_residual[logList[i]], //las_data_original[1],
			marker : {
				enabled : markerEnabled
			},
			turboThreshold : TURBO_SHRESHHOLD
		});

	}
	console.log(currentTime() + ". Ends -> Dual Induction charting.");
}

function track_log_Litho_Density(cChart, dDiv, logList) {
	console.log(currentTime() + ". Begins -> Litho Density charting.");

	var obj = findMaxMinTicpos(logList[0]);
	var max2 = obj["MAX"], min2 = obj["MIN"], tickPos = obj["TICPOS"];
	var minTickInterval = ( max2 - min2 ) / 20;

	var reversed1 = false;
	
	var t = logLine_Name[logList[0]].toUpperCase();
	if ( t == "DPHI" || t == "NPHI" ) {
		reversed1 = true;
		
		if ( t == "DPHI") {
			var ca = new Array(); 			//cross of DPHI and NPHI
			ca = getCrossArea();
		}
	}
	
	var markerEnabled = false;							// the default marker (for standard LAS file) for every value is disabled: false
	if ( logLine_SourceType[logList[0]] == "excel" )
		markerEnabled = true;							// for the excel data, the markers need to be enabled: true;

	chart4 = new Highcharts.Chart({
		//$('#secondColumn').highcharts({
		chart : {
			renderTo : dDiv,
			marginTop : 0,
			events : {
				selection : function(event) {
					$('#busyModal').modal('show');
					setTimeout(function (){
						synZoom(event,4, 'block');
					}, 1000);
				}
			}
		},
		title : {
			text : ''//'Litho-Density'
		},
		xAxis : [{
			categories : las_data_processed[0],
			gridLineWidth : 1,
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
			gridLineColor : GRIDLINE_COLOR,
			minorTickInterval : minTickInterval,
			linewidth : 1,

			labels : { enabled : false },
			title : { enabled : false },
			reversed : reversed1,
			opposite : true

		}],
		series : [{
			id : "series_" + logLine_Name[logList[0]],
			type : 'spline',
			lineWidth : 1,
			name : logLine_Name[logList[0]],
			color : color_Track_Log[0],
			yAxis : 0,
			data : las_data_processed[logList[0]],
			marker : {
				enabled : markerEnabled
			},
			turboThreshold : TURBO_SHRESHHOLD
		},{
			id : "series_residual_" + logLine_Name[logList[0]],
			type : 'spline',
			lineWidth : 1,
			name : logLine_Name[logList[0]],
			color : color_Track_Log[0],
			linkedTo : "series_" + logLine_Name[logList[0]],
			yAxis : 0,
			data : las_data_residual[logList[0]], //las_data_original[1],
			marker : {
				enabled : markerEnabled
			},
			turboThreshold : TURBO_SHRESHHOLD
		}]
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

		markerEnabled = false;							// the default (for standard LAS file) plot type is "spline";
		if ( logLine_SourceType[logList[i]] == "excel" )
			markerEnabled = true;

		t = logLine_Name[logList[i]].toUpperCase();
		if ( t == "DPHI" || t == "NPHI" ) {
			reversed1 = true;
			
			if ( t == "DPHI") {
				var ca = new Array(); 			//cross of DPHI and NPHI
				ca = getCrossArea();
			}
		}

		chart4.addAxis({
			id : logLine_Name[logList[i]],
			min : min2,
			max : max2,
			tickPositions : tickPos,
			linewidth : 0,

			labels : { enabled : false },
			title : { enabled : false },
			reversed : reversed1,
			opposite : true
		});
		
		chart4.addSeries({
			id : "series_" + logLine_Name[logList[i]],
			type : 'spline',
			lineWidth : 1,
			name : logLine_Name[logList[i]],
			color : color_Track_Log[i],
			yAxis : logLine_Name[logList[i]],
			data : las_data_processed[logList[i]], //las_data_original[1],
			marker : {
				enabled : markerEnabled
			},
			turboThreshold : TURBO_SHRESHHOLD
		})
		
		chart4.addSeries({
			id : "series_residual_" + logLine_Name[logList[i]],
			type : 'spline',
			lineWidth : 1,
			name : logLine_Name[logList[i]],
			color : color_Track_Log[i],
			yAxis : logLine_Name[logList[i]],
			linkedTo : "series_" + logLine_Name[logList[i]],
			data : las_data_residual[logList[i]], //las_data_original[1],
			marker : {
				enabled : markerEnabled
			},
			turboThreshold : TURBO_SHRESHHOLD
		})
	};
	
	reversed1 = true;
	tickPos = [-0.1, 0.1, 0.3, 0.5, 0.7];
	chart4.addAxis({
		id : "DPHI_NPHI_CROSS",
		min : -0.1,
		max : 0.7,
		tickPositions : tickPos,
		gridLineColor : GRIDLINE_COLOR,
		linewidth : 1,
		
		labels : {
			enabled : false
		},
		title : {
			text : " "
		},
		reversed : reversed1,
		opposite : true
	});
		
	chart4.addSeries({
		type : 'arearange',
		data : ca,
		lineWidth: 0,
		linkedTo: "series_NPHI", //':previous',
		color: "#FF0000",
		fillOpacity: 0.5,
		yAxis : "DPHI_NPHI_CROSS",
		marker : {
			enabled : false
		},
		turboThreshold : TURBO_SHRESHHOLD
	});
	
	console.log(currentTime() + ". Ends -> Litho Density charting.");
}


function track_log_Spectral_GR(cChart, dDiv, logList) {
	console.log(currentTime() + ". Begins -> Spectral Gamma Ray charting.");

	var obj = findMaxMinTicpos(logList[0]);
	var max2 = obj["MAX"], min2 = obj["MIN"], tickPos = obj["TICPOS"];
	var minTickInterval = (max2-min2)/20;

	var markerEnabled = false;							// the default marker (for standard LAS file) for every value is disabled: false
	if ( logLine_SourceType[logList[0]] == "excel" )
		markerEnabled = true;							// for the excel data, the markers need to be enabled: true;

	chart7 = new Highcharts.Chart({
		chart : {
			renderTo : dDiv,
			marginTop : 0,
			/*type : 'spline',
			alignTicks: true,*/
			events : {
				selection : function(event) {
					$('#busyModal').modal('show');
					setTimeout(function (){
						synZoom(event,7, 'block');
					}, 1000);
				}
			}
		},
		title : {
			text : ''//'Spectral GR'
		},
		xAxis : [{
			categories : las_data_processed[0],
			gridLineWidth : 1,
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
			
			gridLineColor : GRIDLINE_COLOR,
			minorTickInterval : minTickInterval,
			linewidth : 1,
			
			labels : { enabled : false },
			title : { enabled : false },
			opposite : true

		}],
		series : [{
			id : "series_" + logLine_Name[logList[0]],
			type : 'spline',
			lineWidth : 1,
			name : logLine_Name[logList[0]],
			color : color_Track_Log[0],
			yAxis : 0,
			data : las_data_processed[logList[0]], //las_data_original[1],
			marker : { 
				enabled : markerEnabled, 
				states : { 
					hover : {	
						enabled : true	
					} 
				}, 
				symbol : PLOT_SYMBOL[0]
			},
			turboThreshold : TURBO_SHRESHHOLD
		},
		{
			id : "series_residual_" + logLine_Name[logList[0]],
			type : 'spline',
			lineWidth : 1,
			name : logLine_Name[logList[0]] + "_residual",
			color : color_Track_Log[0],
			yAxis : 0,
			data : las_data_residual[logList[0]],
			marker : { 
				enabled : markerEnabled, 
				states : { 
					hover : {	
						enabled : true	
					} 
				}, 
				symbol : PLOT_SYMBOL[0]
			},
			turboThreshold : TURBO_SHRESHHOLD
		}],
		plotOptions: {
            series: {
            	stickyTracking : false,
                connectNulls: false // by default
            }
        }
		
	}, function(chart) {
		//syncronizeCrossHairs(chart);
	});
	
	for (var i=1; i<logList.length; i++){
		seriesMarker = '{ enabled : false, states : { hover : {	enabled : true	} }, symbol :"' +  PLOT_SYMBOL[i] + '"}';

		obj = findMaxMinTicpos(logList[i]);
		max2 = obj["MAX"];
		min2 = obj["MIN"]; 
		tickPos = obj["TICPOS"];

		markerEnabled = false;							// the default (for standard LAS file) plot type is "spline";
		if ( logLine_SourceType[logList[i]] == "excel" )
			markerEnabled = true;

		chart7.addAxis({
			id : logLine_Name[logList[i]],
			min : min2,
			max : max2,
			tickPositions : tickPos,
			
			linewidth : 0,
			labels : { enabled : false },
			title : { enabled : false },
			opposite : true
		});
		
		chart7.addSeries({
			id : "series_" + logLine_Name[logList[i]],
			type : 'spline',
			lineWidth : 1,
			name : logLine_Name[logList[i]],
			color : color_Track_Log[i],
			yAxis : logLine_Name[logList[i]],
			data : las_data_processed[logList[i]], //las_data_original[1],
			marker : { 
				enabled : markerEnabled, 
				states : { 
					hover : {	
						enabled : true	
					} 
				}, 
				symbol : PLOT_SYMBOL[i]
			},
			turboThreshold : 10000
		});
		chart7.addSeries({
			id : "series_residual_" + logLine_Name[logList[i]],
			type : 'spline',
			lineWidth : 1,
			name : logLine_Name[logList[i]] + "_residual",
			color : color_Track_Log[i],
			yAxis : logLine_Name[logList[i]],
			data : las_data_residual[logList[i]], //las_data_original[1],
			marker : { 
				enabled : markerEnabled, 
				states : { 
					hover : {	
						enabled : true	
					} 
				}, 
				symbol : PLOT_SYMBOL[i]
			},
			turboThreshold : TURBO_SHRESHHOLD
		});
	}
	console.log(currentTime() + ". Ends -> Spectral Gamma Ray charting.");
}

function track_log_Spectral_GR_Ratio(cChart, dDiv, logList) {
	console.log(currentTime() + ". Begins -> Spectral Gamma Ray Ratio charting.");
	var max2 = MAX_SPECTRAL_GR_RATIO_TU, min2 = MIN_SPECTRAL_GR_RATIO_TU;
	var seriesMarker = '{ enabled : false, states : { hover : {	enabled : true	} }, symbol :"' +  PLOT_SYMBOL[0] + '"}';

	var markerEnabled = false;							// the default marker (for standard LAS file) for every value is disabled: false
	if ( logLine_SourceType[logList[0]] == "excel" )
		markerEnabled = true;							// for the excel data, the markers need to be enabled: true;

	chart8 = new Highcharts.Chart({
		chart : {
			renderTo : dDiv,
			marginTop : 0,
			type : 'spline',
			events : {
				selection : function(event) {
					$('#busyModal').modal('show');
					setTimeout(function (){
						synZoom(event,8, 'block');
					}, 1000);
				}
			}
		},
		title : {
			text : ''//'Spectral GR Ratio',
		},
		xAxis : [{
			categories : las_data_processed[0],
			gridLineWidth : 1,
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

			gridLineWidth : 1,
			gridLineColor : GRIDLINE_COLOR,
			minorTickInterval : 0.1,
			linewidth : 1,
			plotBorderWidth : 1,
			labels : { enabled : false },
			title : { enabled : false },
			opposite : true

		}],
		series : [{
			id : "series_" + logList[0],
			type : 'spline',
			lineWidth : 1,
			name : logLine_Name_DERIVED[0],
			color : color_Track_Log[0],
			yAxis : 0,
			data : las_data_DERIVED[0], //las_data_original[1],
			marker : { 
				enabled : markerEnabled, 
				states : { 
					hover : {	
						enabled : true	
					} 
				}, 
				symbol : PLOT_SYMBOL[0]
			},
			turboThreshold : TURBO_SHRESHHOLD
		}],
		plotOptions: {
            series: {
            	stickyTracking : false,
                connectNulls: false // by default
            }
        }
	}, function(chart) {
		//syncronizeCrossHairs(chart);
	});
	
	if ( las_data_residual_exist_DERIVED[0] ){
		chart8.addSeries({
			type : 'spline',
			lineWidth : 1,
			name : logLine_Name_DERIVED[0] + "_residual",
			color : color_Track_Log[0],
			/*yAxis : logLine_Name_DERIVED[0],*/
			data : las_data_residual_DERIVED[0],
			marker : { 
				enabled : false, 
				states : { 
					hover : {	
						enabled : true	
					} 
				}, 
				symbol : PLOT_SYMBOL[0]
			},
			turboThreshold : TURBO_SHRESHHOLD
		});		
	}
	
	for (var i=1; i<logList.length; i++){
		seriesMarker = '{ enabled : false, states : { hover : {	enabled : true	} }, symbol :"' +  PLOT_SYMBOL[i] + '"}';

		markerEnabled = false;							// the default (for standard LAS file) plot type is "spline";
		if ( logLine_SourceType[logList[i]] == "excel" )
			markerEnabled = true;

		chart8.addAxis({
			/*id : logLine_Name_DERIVED[i],*/
			type : 'logarithmic',
			gridLineWidth : 0,
			gridLineColor : GRIDLINE_COLOR,
			min : min2,
			max : max2,
			linewidth : 1,
			labels : {
				step : 3,
				overflow: 'justify',
				style : {
					color : color_Track_Log[i],
					fontSize : '10px'
				},
				rotation : 0
			},
			title : {
				margin : -15,
				text : logLine_Name_DERIVED[i],
				style : {
					color : color_Track_Log[i],
					fontSize : CHART_LOG_FONT_SIZE + 'px',
					fontWeight : 'bold'
				}
			},
			opposite : true

		});
		
		chart8.addSeries({
			id : "series_" + logList[i],
			type : 'spline',
			lineWidth : 1,
			name : logLine_Name_DERIVED[i],
			color : color_Track_Log[i],
			/*yAxis : logLine_Name_DERIVED[i],*/
			data : las_data_DERIVED[i], 
			marker : { 
				enabled : markerEnabled, 
				states : { 
					hover : {	
						enabled : true	
					} 
				}, 
				symbol : PLOT_SYMBOL[i]
			},
			turboThreshold : TURBO_SHRESHHOLD
		});
		if ( las_data_residual_exist_DERIVED[i] ){
			chart8.addSeries({
				type : 'spline',
				lineWidth : 1,
				name : logLine_Name_DERIVED[i] + "_residual",
				color : color_Track_Log[i],
				/*yAxis : logLine_Name_DERIVED[i],*/
				data : las_data_residual_DERIVED[i],
				marker : { 
					enabled : false, 
					states : { 
						hover : {	
							enabled : true	
						} 
					}, 
					symbol : PLOT_SYMBOL[i]
				},
				turboThreshold : TURBO_SHRESHHOLD
			});
		}
	}
	console.log(currentTime() + ". Ends -> Spectral Gamma Ray Ratio charting.");
}

function track_log_custom1(cChart, dDiv, logList) {
	console.log(currentTime() + ". Begins -> Customized Track charting.");

	var obj = findMaxMinTicpos(logList[0]);
	var max2 = obj["MAX"], min2 = obj["MIN"], tickPos = obj["TICPOS"];
	var minTickInterval = (max2-min2)/20;

	var markerEnabled = false;							// the default marker (for standard LAS file) for every value is disabled: false
	if ( logLine_SourceType[logList[0]] == "excel" )
		markerEnabled = true;							// for the excel data, the markers need to be enabled: true;

	chart9 = new Highcharts.Chart({
		chart : {
			renderTo : dDiv,
			marginTop : 0,
			/*type : 'spline',
			alignTicks: true,*/
			events : {
				selection : function(event) {
					$('#busyModal').modal('show');
					setTimeout(function (){
						synZoom(event,9, 'block');
					}, 1000);
				}
			}
		},
		title : {
			text : ''//'Spectral GR'
		},
		xAxis : [{
			categories : las_data_processed[0],
			gridLineWidth : 1,
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
			
			gridLineColor : GRIDLINE_COLOR,
			minorTickInterval : minTickInterval,
			linewidth : 1,
			
			labels : { enabled : false },
			title : { enabled : false },
			opposite : true

		}],
		series : [{
			id : "series_" + logLine_Name[logList[0]],
			type : 'spline',
			lineWidth : 1,
			name : logLine_Name[logList[0]],
			color : color_Track_Log[0],
			yAxis : 0,
			data : las_data_processed[logList[0]], //las_data_original[1],
			marker : { 
				enabled : markerEnabled, 
				states : { 
					hover : {	
						enabled : true	
					} 
				}, 
				symbol : PLOT_SYMBOL[0]
			},
			turboThreshold : TURBO_SHRESHHOLD
		},
		{
			id : "series_residual_" + logLine_Name[logList[0]],
			type : 'spline',
			lineWidth : 1,
			name : logLine_Name[logList[0]] + "_residual",
			color : color_Track_Log[0],
			yAxis : 0,
			data : las_data_residual[logList[0]],
			marker : { 
				enabled : markerEnabled, 
				states : { 
					hover : {	
						enabled : true	
					} 
				}, 
				symbol : PLOT_SYMBOL[0]
			},
			turboThreshold : TURBO_SHRESHHOLD
		}],
		plotOptions: {
            series: {
            	stickyTracking : false,
                connectNulls: true // false by default
            }
        }
		
	}, function(chart) {
		//syncronizeCrossHairs(chart);
	});
	
	for (var i=1; i<logList.length; i++){
		seriesMarker = '{ enabled : false, states : { hover : {	enabled : true	} }, symbol :"' +  PLOT_SYMBOL[i] + '"}';

		obj = findMaxMinTicpos(logList[i]);
		max2 = obj["MAX"];
		min2 = obj["MIN"]; 
		tickPos = obj["TICPOS"];

		markerEnabled = false;							// the default (for standard LAS file) plot type is "spline";
		if ( logLine_SourceType[logList[i]] == "excel" )
			markerEnabled = true;

		chart9.addAxis({
			id : logLine_Name[logList[i]],
			min : min2,
			max : max2,
			tickPositions : tickPos,
			
			linewidth : 0,
			labels : { enabled : false },
			title : { enabled : false },
			opposite : true
		});
		
		chart9.addSeries({
			id : "series_" + logLine_Name[logList[i]],
			type : 'spline',
			lineWidth : 1,
			name : logLine_Name[logList[i]],
			color : color_Track_Log[i],
			yAxis : logLine_Name[logList[i]],
			data : las_data_processed[logList[i]], //las_data_original[1],
			marker : { 
				enabled : markerEnabled, 
				states : { 
					hover : {	
						enabled : true	
					} 
				}, 
				symbol : PLOT_SYMBOL[i]
			},
			turboThreshold : 10000
		});
		chart9.addSeries({
			id : "series_residual_" + logLine_Name[logList[i]],
			type : 'spline',
			lineWidth : 1,
			name : logLine_Name[logList[i]] + "_residual",
			color : color_Track_Log[i],
			yAxis : logLine_Name[logList[i]],
			data : las_data_residual[logList[i]], //las_data_original[1],
			marker : { 
				enabled : markerEnabled, 
				states : { 
					hover : {	
						enabled : true	
					} 
				}, 
				symbol : PLOT_SYMBOL[i]
			},
			turboThreshold : TURBO_SHRESHHOLD
		});
	}
	console.log(currentTime() + ". Ends -> Customized Track charting.");	
}

function track_log_CTUK(cChart, dDiv, logList) {
	console.log(currentTime() + ". Begins -> CTUK charting.");
	chart16 = new Highcharts.Chart({
		chart : {
			renderTo : dDiv,
			marginTop : 0,
			zoomType : 'x',
			events : {
				selection : function(event) {
					$('#busyModal').modal('show');
					setTimeout(function (){
						synZoom(event,16, 'block');
					}, 1000);
				}
			}
		},
		title : {
			text : '',
		},
		xAxis : [{
			categories : las_data_original[0],
			gridLineWidth : 0,
			gridLineColor : GRIDLINE_COLOR,
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
			gridLineWidth : 0,
			gridLineColor : GRIDLINE_COLOR,
			tickInterval : 5,
			linewidth : 1,
			labels : { enabled : false },
			title : { enabled : false },
			reversed : true,
			opposite : true

		}],
		series : [{
			type : 'column',
			lineWidth : 1,
			data : las_data_CTUK,
			marker : {
				enabled : true
			},
			turboThreshold : TURBO_SHRESHHOLD
		}],
		tooltip : {
			enabled : false
		},
		plotOptions : {

			series : {
				stickyTracking : false,
				pointPadding : 0,
				groupPadding : 0,
				borderWidth : 0,
				shadow : false
			},
		}
	}, function(chart) {
		///syncronizeCrossHairs(chart);
	});
	
	console.log(currentTime() + ". Ends -> CTUK charting.");

}

function formation_charting(){
	var itemDiv18;
	if (las_data_formation.length>0){
		GRAPH_WIDTH += 120;
		ResetDivWidth();

		$('#chart_18_formation').css({"border-width":"1px", "width":"120px"});
		$('#chart_18_formation_0').css({"border-width":"1px", "width":"120px"});
		$('#chart_18_formation_0').addClass('plotHeader_border');
		track_log_formation(chart18, "chart_18_formation", logLine_Name_DERIVED);
		track_log_formation_0(chart18_0, "chart_18_formation_0", logLine_Name_DERIVED);

		createChkbox_Track_Log(itemDiv18, chart_18_formation, "Stratigraphic Units - Formations", "Horizons");
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
}
		

function track_log_formation(cChart, dDiv, logList) {
	console.log(currentTime() + ". Begins -> Formation charting.");
	
	chart18 = new Highcharts.Chart({
		chart : {
			renderTo : dDiv,
			marginTop : 0,
			zoomType : 'x',
			events : {
				selection : function(event) {
					$('#busyModal').modal('show');
					setTimeout(function (){
						synZoom(event,18, 'block');
					}, 1000);
				}
			}
		},
		title : {
			text : '' //'Stratigraphic Units'
		},
		xAxis : [{
			categories : las_data_processed[0],
			gridLineWidth : 1,
			gridLineColor : GRIDLINE_COLOR,
			tickInterval : INTERVAL_ELEVATION,
			tickWidth : 0,
			lineWidth : 1,

			labels : {
				enabled : false,
			},
			title : logLine_Name[0]
		}],
		yAxis : [{// Primary yAxis
			min : 0,
			max : 1,
			gridLineWidth : 1,
			tickInterval : 1,
			lineColor : '#000000',
			linewidth : 1,
			labels : { enabled : false },
			title : { enabled : false },
			reversed : true,
			opposite : true

		}],
		series : [{
			type : 'column',
			lineWidth : 1,
			name : logLine_Name[index_LithoGR],
			data : las_data_formation,
			marker : {
				enabled : true
			},
			turboThreshold : TURBO_SHRESHHOLD
		}],
		tooltip : {
			enabled : false
		},
		plotOptions : {

			series : {
				pointPadding : 0,
				groupPadding : 0,
				borderWidth : 0,
				shadow : false,
				
				dataLabels: {
					enabled: true,
					color : 'black',
					borderRadius: 0,
					backgroundColor: 'rgba(252, 255, 197, 0.8)',
                    borderWidth: 1,
                    borderColor: '#AAA',
					padding : 0,
					style: {
						fontWeight : 'bold'
					},
					formatter : function(){
						//for(var i=this.point.x;i<this.series.data.length;i++){
							if (las_data_formation2[this.point.x] != null){
								return las_data_formation2[this.point.x];
								//break;
							}
						//}
					}
				}
				
			},
		}
	}, function(chart) {
		//syncronizeCrossHairs(chart);
	});
	
	console.log(currentTime() + ". Ends -> Formation charting.");
}

function regularChart(cChart, dDiv, logList){
	var cChart1 = new Highcharts.Chart({
		chart : {
			renderTo : dDiv,
			type : 'spline',
			events : {
				selection : function(event) {
					synZoom(event,8, 'block');
				}
			}
		},
		title : {
			text : 'Spectral GR Ratio',
		},
		xAxis : [{
			categories : las_data_processed[Number(logList[0])],
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
			id : logLine_Name[Number(logList[0])],
			type : 'logarithmic',
			/*min : min2,
			max : max2,*/

			gridLineWidth : 1,
			gridLineColor : GRIDLINE_COLOR,
			minorTickInterval : 0.1,
			linewidth : 1,
			plotBorderWidth : 1,
			labels : {
				step : 3,
				overflow: 'false',
				style : {
					color : color_Track_Log[0],
					fontSize : '10px'
				},
				rotation : 0
			},
			title : {
				margin : -15,
				text : logLine_Name[Number(logList[0])],
				style : {
					color : color_Track_Log[0],
					fontSize : CHART_LOG_FONT_SIZE + 'px',
					fontWeight : 'bold'
				}
			},
			opposite : true

		}],
		/*series : [{
			type : 'spline',
			lineWidth : 1,
			name : logLine_Name[Number(logList[0])],
			color : color_Track_Log[0],
			yAxis : 0,
			data : las_data_processed[Number(logList[0])],
			marker : {
				enabled : false
			},
			turboThreshold : 10000
		}],*/
		plotOptions: {
            series: {
                connectNulls: false // by default
            }
        }
	}, function(chart) {
		//syncronizeCrossHairs(chart);
	});
	
}

/*
 * chartInitialize: initialize a chart before plotting data
 */
function chartInitialize(nmChart, nmDiv, nmTitle){
	var chart;
	chart = new Highcharts.Chart({
		chart : {
			renderTo : nmDiv,
			zoomType : 'x',
			inverted : true,
			marginTop : TRACK_MARGIN_TOP,
			spacingRight : 0,
			isZoomed : false,
			resetZoomButton : {
				position : {
					// align: 'right', // by default
					// verticalAlign: 'top', // by default
					x : 0,
					y : -30
				}
			}
		},
		title : {
			text : nmTitle,
			rotation : 90,
			align : 'left',
			margin : 0,
			x : 0,
			style : {
				color : "#000000",
				fontSize : '10px'
			}
		},
		xAxis : [{
			categories : las_data_processed[0],
			gridLineWidth : 0,
			tickInterval : 10,
			tickPixelInterval : INTERVAL_ELEVATION,
			tickWidth : 1,

			startOnTick : true,
			endOnTick : true,
			showLastLabel : true,

			labels : {
				enabled : true,
				rotation : 0,
				step : 10,
				style : {
					fontFamily : LABEL_FONT,
					fontSize : '11px',
					fontWeight : 'bold'
				},
				formatter : function() {
					return Math.floor(this.value);
				}
			},
			title : logLine_Name[0]
		}],
		yAxis : [{// Primary yAxis
			gridLineWidth : 0,
			min : 0,
			max : 15,
			tickInterval : 5,
			lineColor : '#000000',
			linewidth : 1,
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
				text : "",
				style : {
					color : '#89A54E'
				}
			},
			reversed : true,
			opposite : true

		}],
		/*series : [{
		}],*/
		tooltip : {
			shared : true,
			enabled : true,
			useHTML : true,
			style : {
				padding : 0
			},
			formatter : function() {
				return '<font size="1">Depth: ' + parseFloat(this.x).toFixed(1) + ' ft<br>Gamma Ray:' + this.y + '</font>';
			}
		},
		legend : {
			layout : 'vertical',
			align : 'left',
			x : 120,
			y : 80,
			verticalAlign : 'top',
			floating : true,
			backgroundColor : '#FFFFFF'
		},
		loading : {
			labelStyle: {
				fontWeight: 'bold',
				position: 'relative',
				top: '1em',
				color: 'black'
			}
		},
		plotOptions : {

			series : {
				pointPadding : 0,
				groupPadding : 0,
				borderWidth : 0,
				shadow : false
			},
		},
		navigation : {
			buttonOptions : {
				symbolY : 10,
				y : -10
			}
		},
		credits : {
			enabled : false
		}

	}, function(chart) {
		///syncronizeCrossHairs(chart);
	});
	
	return chart;
}

function synZoom(e, n, resetbutton_dispaly){
	var cIndex1 = [0,1,2,3,4,7,8,9,16,18];
	var cIndex2 = new Array();
	for (var i=0; i<cIndex1.length ; i++){
		if ( cIndex1[i]!= n ) cIndex2.push(cIndex1[i]);
	}
	
	$('#btnResetZoom').css("display",resetbutton_dispaly);
	if (resetbutton_dispaly == "block")
		$('#btnResetZoom').css("visibility","visible");

	var xMin=0, xMax=0;
	
	if ( e== null || e.xAxis == undefined){
		//chart1.xAxis[0].setExtremes(null, null);
		//chart2.xAxis[0].setExtremes(null, null);
		
		xMin = null;
		xMax = null;
	} else {
		xMin = e.xAxis[0].min;
		xMax = e.xAxis[0].max;
	}
	//var gli = computeTickInterval(xMin, xMax)
	//chart2.xAxis[0].setExtremes(xMin, xMax, true);

	for (i=0; i<cIndex2.length; i++){
		if ( (chart0 != undefined) && (cIndex2[i]==0) ) {
			if (Object.getOwnPropertyNames(chart0).length>0) chart0.xAxis[0].setExtremes(xMin, xMax, true);
		}
		if ( (chart1 != undefined) && (cIndex2[i]==1) ) {
			if (Object.getOwnPropertyNames(chart1).length>0) chart1.xAxis[0].setExtremes(xMin, xMax, true);
		}
		if ( (chart2 != undefined) && (cIndex2[i]==2) ) {
			if (Object.getOwnPropertyNames(chart2).length>0) chart2.xAxis[0].setExtremes(xMin, xMax, true);
		}
		if ( (chart3 != undefined) && (cIndex2[i]==3) ) {
			if (Object.getOwnPropertyNames(chart3).length>0) chart3.xAxis[0].setExtremes(xMin, xMax, true);
		}
		if ( (chart4 != undefined) && (cIndex2[i]==4) ) {
			if (Object.getOwnPropertyNames(chart4).length>0) chart4.xAxis[0].setExtremes(xMin, xMax, true);
		}
		if ( (chart7 != undefined) && (cIndex2[i]==7) ) {
			if (Object.getOwnPropertyNames(chart7).length>0) chart7.xAxis[0].setExtremes(xMin, xMax, true);
		}
		if ( (chart8 != undefined) && (cIndex2[i]==8) ) {
			if (Object.getOwnPropertyNames(chart8).length>0) chart8.xAxis[0].setExtremes(xMin, xMax, true);
		}
		if ( (chart9 != undefined) && (cIndex2[i]==9) ) {
			if (Object.getOwnPropertyNames(chart9).length>0) chart9.xAxis[0].setExtremes(xMin, xMax, true);
		}
		if ( (chart16 != undefined) && (cIndex2[i]==16) ) {
			if (Object.getOwnPropertyNames(chart16).length>0) chart16.xAxis[0].setExtremes(xMin, xMax, true);
		}
		if ( (chart18 != undefined) && (cIndex2[i]==18) ) {
			if (Object.getOwnPropertyNames(chart18).length>0) chart18.xAxis[0].setExtremes(xMin, xMax, true);
		}
	}
	
	$('#busyModal').modal('hide');

}

//compute a reasonable tick interval given the zoom range -
//have to compute this since we set the tickIntervals in order
//to get predictable synchronization between 3 charts with
//different data.
function computeTickInterval(xMin, xMax) {
	var zoomRange = xMax - xMin;

	if (zoomRange <= 100)
		currentTickInterval = 1;
	else if (zoomRange <= 500)
		currentTickInterval = 5;
	//else if (zoomRange <= 600)
	//	currentTickInterval = 4;
	//else if (zoomRange <= 800)
	//	currentTickInterval = 6;
	else if (zoomRange <= 1000)
		currentTickInterval = 10;
	//else if (zoomRange <= 1200)
	//	currentTickInterval = 10;
	//else if (zoomRange <= 1400)
	//	currentTickInterval = 12;
	else if (zoomRange <= 1500)
		currentTickInterval = 15;
	//else if (zoomRange <= 1800)
	//	currentTickInterval = 16;
	//else if (zoomRange <= 2000)
	//	currentTickInterval = 18;
	//else if (zoomRange <= 2200)
	//	currentTickInterval = 20;
	else
		currentTickInterval = 20;
		
	return currentTickInterval;
}


//explicitly set the tickInterval for the 3 charts - based on
//selected range
function setTickInterval(event) {
	var xMin = event.xAxis[0].min;
	var xMax = event.xAxis[0].max;
	computeTickInterval(xMin, xMax);

	chart1.xAxis[0].options.tickInterval = currentTickInterval;
	chart1.xAxis[0].isDirty = true;
	chart2.xAxis[0].options.tickInterval = currentTickInterval;
	chart2.xAxis[0].isDirty = true;
	//chart3.xAxis[0].options.tickInterval = currentTickInterval;
	//chart3.xAxis[0].isDirty = true;
}
