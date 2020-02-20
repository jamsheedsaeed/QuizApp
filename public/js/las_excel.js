var app = angular.module("App", []);

app.factory("XLSXReaderService", ['$q', '$rootScope',
function($q, $rootScope) {
	var service = function(data) {
		angular.extend(this, data);
	};

	service.readFile = function(file, readCells, toJSON) {
		var deferred = $q.defer();
		toJSON = false;

		XLSXReader(file, readCells, toJSON, function(data) {
			$rootScope.$apply(function() {
				deferred.resolve(data);
				EXCEL_CONTENT = data.sheets;
			});
		});

		return deferred.promise;
	};

	return service;
}]);

app.controller('ngCtrl_viewerdata', function($scope, XLSXReaderService) {
	$scope.showPreview = true;
	$scope.showJSONPreview = true;
	$scope.json_string = "";

	$scope.fileChanged = function(files) {
		$scope.isProcessing = true;
		$scope.sheets = [];
		$scope.excelFile = files[0];
		XLSXReaderService.readFile($scope.excelFile, $scope.showPreview, $scope.showJSONPreview)
							.then(function(xlsxData) {
			EXCEL_CONTENT = xlsxData.sheets;
			
			$scope.sheets = xlsxData.sheets;
			$scope.isProcessing = false;
		});
	};

	$scope.updateJSONString = function() {
		$scope.json_string = JSON.stringify($scope.sheets[$scope.selectedSheetName], null, 2);
	};

	$scope.showPreviewChanged = function() {
		if ($scope.showPreview) {
			$scope.showJSONPreview = false;
			$scope.isProcessing = true;
			XLSXReaderService.readFile($scope.excelFile, $scope.showPreview, $scope.showJSONPreview)
								.then(function(xlsxData) {
				$scope.sheets = xlsxData.sheets;
				$scope.isProcessing = false;
			});
		}
	};
});

function convertExcelToArray(sheet){
	var col_size = sheet.col_size;
	
	// data is the sheet data; and the first row is the field name
	var data = sheet.data;						
	
	var tempp = new Array();
	
	// EXCEL data is saved in an associative array for sorting purpose: on a specific field
	for(i=1; i<data.length; i++){							
		var o = {};
		for(var j=0; j<EXCEL_FIELDS.length; j++) {
		  // otherwise, write the data for charting.
			var s = data[i][j];
			
			if (s == undefined)
				o[EXCEL_FIELDS[j]] = null;
			else {
				s = (s+"").trim();
				
				if ( s=="" )
					o[EXCEL_FIELDS[j]] = null;
				else {
					if ( isNaN(s) )
						o[EXCEL_FIELDS[j]] = s;
					else
						o[EXCEL_FIELDS[j]] = parseFloat(s);
				}
			}	
		}
		tempp.push(o);
	}
	return tempp;	
}


function IdentifyNumericFields(){
	//EXCEL_TEMP_ARRAY
	var numberField = true;
	EXCEL_NUMERIC_FLDS.length = 0;
	
	for (var i=0; i<EXCEL_FIELDS.length; i++){
		numberField = true;
		
		for ( var j=0; j<EXCEL_TEMP_ARRAY.length; j++){
			if ( isNaN(EXCEL_TEMP_ARRAY[j][EXCEL_FIELDS[i]]) ){
				numberField = false;
				break;
			}
		}
		
		EXCEL_NUMERIC_FLDS[i] = numberField;
	}
	
	EXCEL_logLine_Name.length = 0;
	// populate the plottable fields: EXCEL_logLine_Name
	for (i=0; i<EXCEL_NUMERIC_FLDS.length; i++){
		if (EXCEL_NUMERIC_FLDS[i]) EXCEL_logLine_Name.push(EXCEL_FIELDS[i]);
	}
}

function ResetExcelLogLine () {
	EXCEL_logLine_Name.length = 0;
	
	for (var i=0; i<EXCEL_FIELDS.length; i++){
		if ( EXCEL_NUMERIC_FLDS[i] && EXCEL_FIELDS[i]!=EXCEL_DEPTH_FLD && EXCEL_FIELDS[i]!=EXCEL_STEP_FLD)	{
			EXCEL_logLine_Name.push(EXCEL_FIELDS[i]);
		}
	}
} 

function ProcessExcelArray(EXCEL_TEMP_ARRAY, step){
	NO_CURVE_TO_PLOT = false;
	
	EXCEL_TEMP_ARRAY.sort(function(a,b){
		return (a[EXCEL_DEPTH_FLD] - b[EXCEL_DEPTH_FLD]);
	});
	
	// round down depth to nearest 10s
	var b10 = Math.floor(EXCEL_TEMP_ARRAY[0][EXCEL_DEPTH_FLD]/10) * 10;
	var o = {};
	for(var k=0; k<EXCEL_FIELDS.length; k++){						// for the newIndex'th index, copy the corresponding EXCEL value
		o[EXCEL_FIELDS[k]] = null;
	}
	o[EXCEL_DEPTH_FLD] = b10;
	EXCEL_TEMP_ARRAY.unshift(o);
	
	// idenfity the depth step
	//IdentifyDepthStep();
	
	EXCEL_PLOT_INDEX.length = 0;
	for (var i=0; i<EXCEL_NUMERIC_FLDS.length; i++) 
		if ( EXCEL_NUMERIC_FLDS[i] && EXCEL_FIELDS[i]!=EXCEL_DEPTH_FLD && EXCEL_FIELDS[i]!=EXCEL_STEP_FLD ) EXCEL_PLOT_INDEX.push(i);
	
	// global variable: MIN_MAX_LOG[0] contains the min and max of the well depth
	// Excel file min depth needs to be extended or not.
	//         true:   means Excel file has bigger value on min depth than LAS file. The Program need to extend the Excel min depth value to the same value as LAS min depth.
	//         false:  means Excel file has smaller value on min depth than LAS file. The Program need to extend the LAS min depth value to the same value as Excel min depth.
	EXCEL_MIN_EXTEND = false;

	// Excel file max depth needs to be extended or not.
  //         true:   means Excel file has bigger value on max depth than LAS file. The Program need to extend the LAS max depth value to the same value as Excel max depth.
  //         false:  means Excel file has smaller value on min depth than LAS file. The Program need to extend the LAS max depth value to the same value as Excel max depth.
	EXCEL_MAX_EXTEND = false;
	
	if (MIN_MAX_LOG.length>0) {
		EXCEL_MIN_EXTEND = (MIN_MAX_LOG[0][0] < EXCEL_TEMP_ARRAY[0][EXCEL_DEPTH_FLD]);
		EXCEL_MAX_EXTEND = (MIN_MAX_LOG[0][1] > EXCEL_TEMP_ARRAY[EXCEL_TEMP_ARRAY.length-1][EXCEL_DEPTH_FLD]);
	}
	
	// the appended graph is within the current graph limit
	EXCEL_DATA_raw = new Array();
	
	// This step is to combine two datasets. 
	// 		There are four situations.
	//		las excel	las excel	  las excel   las excel
	//		  (1)  	  (2)	    (3)     (4)
	//			|  			  |			|  			  |
	//			| |			| |			| |			| |
	//			| |			| |			| |			| |
	//			| |			| |			| |			| |
	//			| |			| |			| |			| |
	//			| |			| |			| |			| |
	//			| |			| |			| |			| |
	//			| |			| |			| |			| |
	//			|  			  |			| |			| |
	//			|  			  |			  |			|  
	//
	//
	//	For case 1: the new dataset needs to be extended on both end.
	//	For case 2: the old dataset needs to be extended on both end.
	//	For case 3: the new dataset needs to be extended on shallower end, and the old dataset needs to be extended on the deeper end
	//	For case 4: the old dataset needs to be extended on shallower end, and the new dataset needs to be extended on the deeper end
	
	var idx = 0, upper_l = 0, upper_e = 0, bottom_l = 0, bottom_e = 0, dd = 0, newIndex = 1, k = 0;
	o = {}; 
	
	/* verified
	* Case 1: the new dataset needs to be extended on both end
	*		  las excel 
	*		(1)   		
	*			|  
	*			| |
	*			| |
	*			| |
	*			| |
	*			| |
	*			| |
	*			| |
	*			|  
	*			|    
	*
	*/
	if ( MIN_MAX_LOG.length>0 && (EXCEL_MIN_EXTEND && EXCEL_MAX_EXTEND) )
	{
		idx = 0;
		upper_e = EXCEL_TEMP_ARRAY[EXCEL_TEMP_ARRAY.length-1][EXCEL_DEPTH_FLD];
		upper_l = MIN_MAX_LOG[0][0];												// MIN_MAX_LOG include the min and the max of the LAS dataset.
																					// MIN_MAX_LOG[0] is the DEPTH field
																					// MIN_MAX_LOG[0][0] is the MIN value of DEPTH field
																					
		// part 1: reproduce EXCEL data
		var o = {};
		for(var k=0; k<EXCEL_FIELDS.length; k++){
			o[EXCEL_FIELDS[k]] =  EXCEL_TEMP_ARRAY[0][EXCEL_FIELDS[k]];
		}
		o[EXCEL_DEPTH_FLD] = upper_l;
		EXCEL_DATA_raw.push(o);

		for (i=0; i<EXCEL_TEMP_ARRAY.length; i++){									// the number of data in the EXCEL data sheet
			dd = EXCEL_TEMP_ARRAY[i][EXCEL_DEPTH_FLD] - upper_l; 					// difference between the current depth and the current min depth of the current graph
			newIndex = Math.round(dd / step);							// how many depth/steps will be assisgned to null due to lack of data
			
			if ( newIndex > 0 ) {
				for (j=idx+1; j<idx+newIndex; j++){									// assisgn null to depth that have no data: 0 -> newIndex - 1
					o = {};
					for(k=0; k<EXCEL_FIELDS.length; k++){
						o[EXCEL_FIELDS[k]] = null;					
					}
					o[EXCEL_DEPTH_FLD] = upper_l + step * (j-idx);
					EXCEL_DATA_raw.push(o);
				}
				
				o = {};
				for(k=0; k<EXCEL_FIELDS.length; k++){								// for the newIndex'th index, copy the corresponding EXCEL value
					o[EXCEL_FIELDS[k]] = EXCEL_TEMP_ARRAY[i][EXCEL_FIELDS[k]];
				}
				o[EXCEL_DEPTH_FLD] = upper_l + step * newIndex;			
				EXCEL_DATA_raw.push(o);
	
				upper_l += ( (newIndex)*step );							// after one EXCEL value inserted, the current min depth increases
				
				idx += ( newIndex );												//		and the current array index increases
			}
		}
		
		// part 2: extend EXCEL data to the same depth as the LAS data
		var current_depth = EXCEL_DATA_raw[EXCEL_DATA_raw.length-1][EXCEL_DEPTH_FLD];
		
		for (i=EXCEL_DATA_raw.length; i<las_data_processed[0].length; i++){
			o = {};
			for(k=0; k<EXCEL_FIELDS.length; k++){
				o[EXCEL_FIELDS[k]] = null;					
			}
			current_depth += step;
			o[EXCEL_DEPTH_FLD] = current_depth;
			EXCEL_DATA_raw.push(o);
		}
	}

	/* 
	* verified
	* Case 2: the old dataset needs to be extended on both end
	*  	  las excel 
	*		(2)
	*			  |
	*			| |
	*			| |
	*			| |
	*			| |
	*			| |
	*			| |
	*			| |
	*			  |
	*			  |  
	*
	*/
	if ( MIN_MAX_LOG.length>0 && (!EXCEL_MIN_EXTEND && !EXCEL_MAX_EXTEND) )
	{
		idx = 0;
		var a = EXCEL_TEMP_ARRAY[0][EXCEL_DEPTH_FLD];
		var jump = 1/step;
		
		a = parseFloat( Math.round( (a*jump) / jump ).toFixed(1) );
		EXCEL_TEMP_ARRAY[0][EXCEL_DEPTH_FLD] = a;
		 
		upper_e = a;																//
		upper_l = MIN_MAX_LOG[0][0];												// 
		
		// part 1: extend LAS data to shallower side
		for ( i=( (upper_l-upper_e)/step - 1 ); i>-1; i-- ) {
			las_data_processed[0].unshift(upper_e+i*step);				// las_data_processed[0][i-1] + step;
			las_data_original[0].unshift(upper_e+i*step);				// las_data_processed[0][i-1] + step;
			//las_data_residual[0].unshift(upper_e+i*step);
			aLithoGammaRay.unshift( null );											// data for plotting V-Shale
			
			if (las_data_DERIVED.length > 1) {
				for (var ka = 0; ka<las_data_DERIVED.length; ka++)
					las_data_DERIVED[ka].unshift( null );							// data fro plotting Spectral_GR_Ratio
					las_data_residual_DERIVED.unshift( null );
			}
				
			if (las_data_CTUK.length > 1) las_data_CTUK.unshift( null );			// CTUK
			if (las_data_formation.length > 1) las_data_formation.unshift( null );	// formation
			
			for (ka=1; ka<las_data_processed.length; ka++){
				las_data_processed[ka].unshift( null );
				las_data_original[ka].unshift( null );
				las_data_residual[ka].unshift( null );
			}
		}
		
		// part 2: reproduce EXCEL data
		var o = {};
		for(var k=0; k<EXCEL_FIELDS.length; k++){
			o[EXCEL_FIELDS[k]] =  EXCEL_TEMP_ARRAY[0][EXCEL_FIELDS[k]];;					
		}
		o[EXCEL_DEPTH_FLD] = upper_e;
		EXCEL_DATA_raw.push(o);
																					
		for (i=1; i<EXCEL_TEMP_ARRAY.length; i++){									// the number of data in the EXCEL data sheet
			dd = EXCEL_TEMP_ARRAY[i][EXCEL_DEPTH_FLD] - upper_e; 					// difference between the current depth and the current min depth of the current graph
			newIndex = Math.round(dd / step);							// how many depth/steps will be assisgned to null due to lack of data
			
			if ( newIndex > 0 ) {
				for (j=idx+1; j<idx+newIndex; j++){									// assisgn null to depth that have no data: 0 -> newIndex - 1
					o = {};
					for(k=0; k<EXCEL_FIELDS.length; k++){
						o[EXCEL_FIELDS[k]] = null;					
					}
					o[EXCEL_DEPTH_FLD] = upper_e + step * (j-idx);
					EXCEL_DATA_raw.push(o);
				}
				
				o = {};
				for(k=0; k<EXCEL_FIELDS.length; k++){							// for the newIndex'th index, copy the corresponding EXCEL value
					o[EXCEL_FIELDS[k]] = EXCEL_TEMP_ARRAY[i][EXCEL_FIELDS[k]];
				}
				o[EXCEL_DEPTH_FLD] = upper_e + step * newIndex;			
				EXCEL_DATA_raw.push(o);
	
				upper_e += ( (newIndex)*step );						// after one EXCEL value inserted, the current min depth increases
				
				idx += ( newIndex );												//		and the current array index increases
			}
		}
		
		// part 3: extend LAS data to the same depth as EXCEL depth
		for (i=las_data_processed[0].length; i<EXCEL_DATA_raw.length; i++){
			las_data_processed[0][i] 	= las_data_processed[0][i-1] + step;
			las_data_original[0][i] 	= las_data_original[0][i-1] + step;
			las_data_residual[0][i]		= las_data_residual[0][i-1] + step;
			aLithoGammaRay[i] 			= null;										// data for plotting V-Shale
			
			if (las_data_DERIVED.length > 1) {
				for (var ka = 0; ka<las_data_DERIVED.length; ka++)
					las_data_DERIVED[ka][i]	= null;									// data fro plotting Spectral_GR_Ratio
					//las_data_residual_DERIVED[ka][i] = null;
			}
				
			if (las_data_CTUK.length > 1) las_data_CTUK[i]				= null;		// CTUK
			if (las_data_formation.length > 1) las_data_formation[i]	= null;		// formation
			
			for (ka=1; ka<las_data_processed.length; ka++){
				las_data_processed[ka][i] = null;
				las_data_original[ka][i] = null;
				las_data_residual[ka][i] = null;
			}
		}
	}

	/* Case 3: the new dataset needs to be extended on shallower end, and the old dataset needs to be extended on the deeper end
	*  	  LAS Excel 
	*		(3) |  	
	*			|  
	*			| |
	*			| |
	*			| |
	*			| |
	*			| |
	*			| |
	*			| |
	*			| |
	*			  |  
	*/
	if ( MIN_MAX_LOG.length>0 && (EXCEL_MIN_EXTEND && !EXCEL_MAX_EXTEND) )
	{
		idx = 0;
		upper_l = MIN_MAX_LOG[0][0];												// MIN_MAX_LOG include the min and the max of the LAS dataset.
																					// MIN_MAX_LOG[0] is the DEPTH field
																					// MIN_MAX_LOG[0][0] is the MIN value of DEPTH field
																					
		
		for (i=0; i<EXCEL_TEMP_ARRAY.length; i++){												// the number of data in the EXCEL data sheet
			dd = EXCEL_TEMP_ARRAY[i][EXCEL_DEPTH_FLD] - upper_l;								// difference between the current depth and the current min depth of the current graph
			newIndex = Math.round(dd / step);							// how many depth/steps will be assisgned to null due to lack of data
			
			if ( newIndex > -1 ) {
				for (j=idx; j<idx+newIndex; j++){									// assisgn null to depth that have no data: 0 -> newIndex - 1
					var o = {};
					for(var k=0; k<EXCEL_FIELDS.length; k++){
						o[EXCEL_FIELDS[k]] = null;					
					}
					o[EXCEL_DEPTH_FLD] = upper_l + step * (j-idx);
					EXCEL_DATA_raw.push(o);
				}
				
				o = {};
				for(var k=0; k<EXCEL_FIELDS.length; k++){						// for the newIndex'th index, copy the corresponding EXCEL value
					o[EXCEL_FIELDS[k]] = EXCEL_TEMP_ARRAY[i][EXCEL_FIELDS[k]];
				}
				o[EXCEL_DEPTH_FLD] = MIN_MAX_LOG[0][0] + step * j;			
				EXCEL_DATA_raw.push(o);
	
				upper_l += ( (newIndex+1)*step );						// after one EXCEL value inserted, the current min depth increases
				idx += ( newIndex+1 );												//		and the current array index increases
			}
		}
		
		for (i=las_data_processed[0].length; i<EXCEL_DATA_raw.length; i++){
			las_data_processed[0][i] 	= las_data_processed[0][i-1] + step;
			las_data_original[0][i] 	= las_data_processed[0][i-1] + step;
			aLithoGammaRay[i] 			= null;										// data for plotting V-Shale
			
			if (las_data_DERIVED.length > 1) {
				for (var ka = 0; ka<las_data_DERIVED.length; ka++)
					las_data_DERIVED[ka][i]	= null;									// data fro plotting Spectral_GR_Ratio
			}
				
			if (las_data_CTUK.length > 1) las_data_CTUK[i]				= null;		// CTUK
			if (las_data_formation.length > 1) las_data_formation[i]	= null;		// formation
			
			for (ka=1; ka<las_data_processed.length; ka++){
				las_data_processed[ka][i] = null;
				las_data_original[ka][i] = null;
			}
		}
	}

	/* verified case 4
	* Case 4: the old dataset needs to be extended on both end
	*		  LAS Excel
	*		(4)	  |
	*			  |
	*			| |
	*			| |
	*			| |
	*			| |
	*			| |
	*			| |
	*			| |
	*			| |
	*			|  
	*/
	if ( MIN_MAX_LOG.length>0 && (!EXCEL_MIN_EXTEND && EXCEL_MAX_EXTEND) )
	{
		idx = 0;
		var a = EXCEL_TEMP_ARRAY[0][EXCEL_DEPTH_FLD];
		var jump = 1/step;
		
		a = parseFloat( Math.round( (a*jump) / jump ).toFixed(1) );
		EXCEL_TEMP_ARRAY[0][EXCEL_DEPTH_FLD] = a;
		 
		upper_e = a;																//
		upper_l = MIN_MAX_LOG[0][0];												// 
		
		// part 1: extend LAS data to shallower side
		for ( i=( (upper_l-upper_e)/step - 1 ); i>-1; i-- ) {
			las_data_processed[0].unshift(upper_e+i*step);				// las_data_processed[0][i-1] + step;
			las_data_original[0].unshift(upper_e+i*step);				// las_data_processed[0][i-1] + step;
			//las_data_residual[0].unshift(upper_e+i*step);
			aLithoGammaRay.unshift( null );											// data for plotting V-Shale
			
			if (las_data_DERIVED.length > 1) {
				for (var ka = 0; ka<las_data_DERIVED.length; ka++)
					las_data_DERIVED[ka].unshift( null );							// data for plotting Spectral_GR_Ratio
					las_data_residual_DERIVED.unshift( null );						// data for plotting residuals
			}
				
			if (las_data_CTUK.length > 1) las_data_CTUK.unshift( null );			// CTUK
			if (las_data_formation.length > 1) las_data_formation.unshift( null );	// formation
			
			for (ka=1; ka<las_data_processed.length; ka++){
				las_data_processed[ka].unshift( null );								
				las_data_original[ka].unshift( null );
				las_data_residual[ka].unshift( null );
			}
		}
		
		
		// part 2: reproduce EXCEL data
		var o = {};
		for(var k=0; k<EXCEL_FIELDS.length; k++){
			o[EXCEL_FIELDS[k]] =  EXCEL_TEMP_ARRAY[0][EXCEL_FIELDS[k]];;					
		}
		o[EXCEL_DEPTH_FLD] = upper_e;
		EXCEL_DATA_raw.push(o);
																								
		for (i=1; i<EXCEL_TEMP_ARRAY.length; i++){									// the number of data in the EXCEL data sheet
			dd = EXCEL_TEMP_ARRAY[i][EXCEL_DEPTH_FLD] - upper_e; 					// difference between the current depth and the current min depth of the current graph
			newIndex = Math.round(dd / step);							// how many depth/steps will be assisgned to null due to lack of data
			
			if ( newIndex > 0 ) {
				for (j=idx+1; j<idx+newIndex; j++){									// assisgn null to depth that have no data: 0 -> newIndex - 1
					o = {};
					for(k=0; k<EXCEL_FIELDS.length; k++){
						o[EXCEL_FIELDS[k]] = null;					
					}
					o[EXCEL_DEPTH_FLD] = upper_e + step * (j-idx);
					EXCEL_DATA_raw.push(o);
				}
				
				o = {};
				for(k=0; k<EXCEL_FIELDS.length; k++){								// for the newIndex'th index, copy the corresponding EXCEL value
					o[EXCEL_FIELDS[k]] = EXCEL_TEMP_ARRAY[i][EXCEL_FIELDS[k]];
				}
				o[EXCEL_DEPTH_FLD] = upper_e + step * newIndex;			
				EXCEL_DATA_raw.push(o);
	
				upper_e += ( (newIndex)*step );							// after one EXCEL value inserted, the current min depth increases
				
				idx += ( newIndex );												//		and the current array index increases
			}
		}
		
		// part 3: extend EXCEL data to the same depth as the LAS data
		var current_depth = EXCEL_DATA_raw[EXCEL_DATA_raw.length-1][EXCEL_DEPTH_FLD];
		
		for (i=las_data_processed[0].length; i>EXCEL_DATA_raw.length; i--){
			o = {};
			for(k=0; k<EXCEL_FIELDS.length; k++){
				o[EXCEL_FIELDS[k]] = null;					
			}
			current_depth += step;
			o[EXCEL_DEPTH_FLD] = current_depth;
			EXCEL_DATA_raw.push(o);
		}
		
	}

	/* if no LAS data pre-exists, the EXCEL data will be standardized:
	 * 		(1) standardize the data by step: 0.5 foot is the default depth
	 * 		(2) create a DEPT (depth) field at the beginning of the data arrary and the logline array
	 */
	if ( MIN_MAX_LOG.length==0 ){
		
		/*
		 * step 1: standardize the data
		 */
		EXCEL_DATA_raw.length = 0;
		//DEPTH_STEP = {value: 0.5, unit: "F"};
		var ll = EXCEL_TEMP_ARRAY.length;
		var jump = 1/step;

		// standardize the depth by step/interval
		for(i=0; i<EXCEL_TEMP_ARRAY.length; i++){
			a = parseFloat( Math.round( (EXCEL_TEMP_ARRAY[i][EXCEL_DEPTH_FLD]*jump) / jump ).toFixed(1) );
			EXCEL_TEMP_ARRAY[i][EXCEL_DEPTH_FLD] = a;
		}
		
		idx = 1;
		
		var o = {};
		for(var k=0; k<EXCEL_FIELDS.length; k++){										// for the newIndex'th index, copy the corresponding EXCEL value
			o[EXCEL_FIELDS[k]] = EXCEL_TEMP_ARRAY[0][EXCEL_FIELDS[k]];
		}
		o[EXCEL_DEPTH_FLD] = EXCEL_TEMP_ARRAY[0][EXCEL_DEPTH_FLD];			
		EXCEL_DATA_raw.push(o);
				
		for ( i=1; i<ll; i++ ) {
			dd = EXCEL_TEMP_ARRAY[i][EXCEL_DEPTH_FLD] - EXCEL_TEMP_ARRAY[i-1][EXCEL_DEPTH_FLD];		// difference between the current depth and the current min depth of the current graph
			newIndex = Math.round(dd / step);											// how many depth/steps will be assisgned to null due to lack of data
			
			if ( newIndex > 0 ) {
				for (j=1; j<newIndex; j++){
					o = {};													// assisgn null to depth that have no data: 0 -> newIndex - 1
					for(var k=0; k<EXCEL_FIELDS.length; k++){
						o[EXCEL_FIELDS[k]] = null;					
					}
					o[EXCEL_DEPTH_FLD] = EXCEL_TEMP_ARRAY[i-1][EXCEL_DEPTH_FLD] + step * j;
					EXCEL_DATA_raw.push(o);
				}
				
				o = {};
				for(var k=0; k<EXCEL_FIELDS.length; k++){										// for the newIndex'th index, copy the corresponding EXCEL value
					o[EXCEL_FIELDS[k]] = EXCEL_TEMP_ARRAY[i][EXCEL_FIELDS[k]];
				}
				o[EXCEL_DEPTH_FLD] = EXCEL_TEMP_ARRAY[i-1][EXCEL_DEPTH_FLD] + step * j	;		
				EXCEL_DATA_raw.push(o);
	
				idx += ( newIndex+1 );															//		and the current array index increases
			}
		}
		
		/*
		 * Step 2: reate a DEPT (depth) field at the beginning of the data arrary and the logline array
		 */
		EXCEL_logLine_Name.unshift("DEPT");
	}
	
	// break the associative array, EXCEL_DATA_raw, to two dimension array, EXCEL_data
	var idx = 0;
	for ( i=0;i<EXCEL_FIELDS.length; i++ ) {
		//if ( EXCEL_NUMERIC_FLDS[i]) {
			EXCEL_data[idx] = new Array();

			for ( j=0; j<EXCEL_DATA_raw.length; j++ ) {
				EXCEL_data[i].push( EXCEL_DATA_raw[j][EXCEL_FIELDS[i]] );	
			}
			idx += 1;
		//}
	}
	
	// append new selected EXCEL fields to the existing LAS file data, including following tasks:
	//	1. appending new EXCEL data to "las_data_processed" holder.
	//	2. appending the names of the selected fields to variable "logLine_Name"
	//	3. appending the min/max value of the selected fields to variable "MIN_MAX_LOG"
	//	4. appending the current min/max value, as "null", of the selected fields to variable "MIN_MAX_LOG_CURRENT" 
	var l1 = 0;
	if ( las_data_processed.length > 0) l1 = las_data_processed[0].length; 
	l2 = EXCEL_data[0].length;
	
	// if NO las file exist
	if ( l1 == 0 ) {
		for (i=0; i<EXCEL_FIELDS.length; i++) {
			if ( EXCEL_FIELDS[i] == EXCEL_DEPTH_FLD)
				break;
		}
		
		logLine_Name.push("DEPT");
		lasHeader_C.push({Element: "DEPT", Description: "data from new dataset",Api: " ", Unit: " "});
		las_data_processed.push(EXCEL_data[i]);
		
		MIN_MAX_LOG.push( [ Math.min.apply(Math, las_data_processed[0]), Math.max.apply(Math, las_data_processed[0]) ] );
		MIN_MAX_LOG_CURRENT.push([null,null,0]);
		
		MIN_ELEVATION 		= las_data_processed[0][0];
		MAX_ELEVATION 		= las_data_processed[0][las_data_processed[0].length-1];
		NUM_TOTAL_RECORDS	= las_data_processed[0].length;
		INTERVAL_ELEVATION 	= Number( ( Math.floor(NUM_TOTAL_RECORDS / NUM_GRID_ELEVATION) ).toFixed(0) );
	}

	track_log_current[TRACK_NAME["Custom1"]] = [];
	var a = {};
	for ( i=0; i<EXCEL_PLOT_INDEX.length; i++ ){
		las_data_processed.push(EXCEL_data[EXCEL_PLOT_INDEX[i]]);

		a = {};
		a = {Element: EXCEL_FIELDS[EXCEL_PLOT_INDEX[i]], Description: "data from new dataset",Api: " ", Unit: " "};
		lasHeader_C.push(a);
		
		logLine_Name.push(EXCEL_FIELDS[EXCEL_PLOT_INDEX[i]]);
		logLine_SourceType.push("excel");									// the current log is sourced as "excel".
		if (i<5) track_log_current[TRACK_NAME["Custom1"]].push(logLine_SourceType.length);
		
		var t = copyArray(EXCEL_data[EXCEL_PLOT_INDEX[i]]);
		MIN_MAX_LOG.push( [ Math.min.apply(Math, t), Math.max.apply(Math, t) ] );
		MIN_MAX_LOG_CURRENT.push([null,null,0]);
	}
}

// functionp: GetNewStep ==> retrieve the step value from the file that is uploaded for appending purpose,
//                          and remove the step field/property from the dataset
//      one parameters: type => two options: LAS (meaning the second file is a LAS file) or EXCEL (meaning the second file is an EXCEL file) 
// 
// The new Step value will be used to generate the chart
// The existing chart data will be re-sampled
//    
function GetNewStepValue(type){
  // For an Excel array (which is genereate in convertExcelToArray function), it is an object array.
  // That means: each array member is an object, and this object has the property of each row of the Excel file. Also, the object properties' name are sorted alphabetically. 
  //    For example,  Array[0]: {"Al":8.7413, "Ca":0.6179, "Depth": 7447.2, "Si":27.3653, "Si/Al":3.1305, "Step":0.05, "Ti": 0.3334, "Ti/Al": 0.0473, "Zr":119"}
  //                  Array[1]: {"Al":8.7913, "Ca":1.6179, "Depth": 7447.2, "Si":20.3653, "Si/Al":3.1785, "Step":"Ft", "Ti": 0.9780, "Ti/Al": 0.6971, "Zr":20"}
  //        from the 3rd element (the index number is 2), the Step information will not be there.
  //        for the function to retrieve new Step information, we just need to check the first two elements in the array
  if (type=="EXCEL") {
    var stepFld = $("#fldNameStep").val();
    
    if ( stepFld=="" ) {
      DEPTH_STEP_EXCEL.value = 0.5;
      DEPTH_STEP_EXCEL.unit = "F";
    }
    
    var o = EXCEL_TEMP_ARRAY[0];
    for (var k in o){
      if (stepFld==k){
        DEPTH_STEP_EXCEL.value = o[k];
        /*  
        if ( EXCEL_TEMP_ARRAY[1][k] && EXCEL_TEMP_ARRAY[1][k].trim().length>0 )
          DEPTH_STEP_EXCEL.unit = EXCEL_TEMP_ARRAY[1][k].trim();
        else*/
          DEPTH_STEP_EXCEL.unit = "F";
      }
    }
    
    // delete the STEP property from the Excel array
    for (var i=0;i<EXCEL_TEMP_ARRAY.length; i++){
      delete EXCEL_TEMP_ARRAY[i][stepFld];
    }
  }
  
  else if (type="LAS"){ 
    
  }
  
}

// the step value of a LAS value is stored in array variable: lasHeader_W
function IdentifyDepthStep(){
	// lasHeader_W
	DEPTH_STEP.value = 0.5;
	DEPTH_STEP.unit	= "F";
	/*
	for (var i=0; i<lasHeader_W.length; i++){
		if ( lasHeader_W[i].Element.toUpperCase() == "STEP" ){
			DEPTH_STEP.value = parseFloat(lasHeader_W[i].Data);
			DEPTH_STEP.unit	= lasHeader_W[i].Unit;
		}		
	}
	*/
}

function copyArray_excel_array(a) {
	var b = new Array();

	for (var i = 0; i < a.length; i++) {
		if ( a[i] != undefined)
			b[i] = a[i];
	}

	return b;
}
