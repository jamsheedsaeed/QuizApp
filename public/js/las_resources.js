/*
 * 
 */

var FILENAME			= "Logfile";
var FILE_TYPE			= "LAS";					     // input file types: LAS, XLS, XLSX													

var TIMING				= "";
var BEGINNING_TIME		= 0;
var END_TIME			= 0; 

var NO_CURVE_TO_PLOT	= true;						  // Whether there are plottable fields

var DATASOURCE_TYPE		= "local";					//another one is "online"
var FILENAME_LAS		  = "";
var FILENAME_EXCEL		= "";
var LAS_TRACKS 			  = new Array();				// The predefined tracks and logs of all possiblities

var CURSOR_INFO			  = "";

var DEPTH_STEP = {value: 0.5, unit: "F"};
var LOG_NULL_VALUE		= -9999;					// This value is defined in the Well segment of the LAS file.
													// It will be replaced by the real NULL value.

var TURBO_SHRESHHOLD	= 200000;

var PLOT_EXCEL_ONLY = false;                // indicate that the plot has only EXCEL file and the excel file is not appended to LAS file

/*
 * ********** handle EXCEL file append: first used in las_excel.js
 */
var DEPTH_STEP_EXCEL  = {};                  // object holding the step's value and unit in the appended data
var EXCEL_CONTENT		  = {};						        // object holding excel file content. first populated in las_excel.js
var EXCEL_TEMP_ARRAY	= new Array();
var EXCEL_DATA_raw		= new Array();				// save the interpolated EXCEL data													
var EXCEL_data			  = new Array();				// array: used to save the specified sheet of an execel file
													// First populated in las_excel.js file.

var EXCEL_MIN_EXTEND	= false;					// new depth upper shallower than the old data 
var EXCEL_MAX_EXTEND	= false;					// new depth bottom deeper than the old data
var EXCEL_DEPTH_FLD		= "";
var EXCEL_STEP_FLD    = "";
var EXCEL_PLOT_INDEX	= new Array();				// Fields (index), in corresponding "EXCEL_logLine_Name", needed to be plotted
var EXCEL_FIELDS		= new Array();						// Fields of the EXCEL fields
var EXCEL_NUMERIC_FLDS	= new Array();

var EXCEL_logLine_Name	= new Array();				// array: used to save the tracks or logs of the all the fields in a specfied sheet
/*
 * ********* end
 */

													
/* global variables for las_header.js
 * 
 */													
var TIMEOUT_TIME		= 1000; 					// in milli-seconds

// First time to load las data?
//    The value is updated at about line #516 in las_chart.js
//    Used in las_filereader.js, las_main.js, utils.js
var FIRSTTIME			= true;						

var aLithoGammaRay 		= new Array();				// holding values for Litho Gamma Ray
var lasFile_Header 		= {};						
var grpChemicals 		= new Array();
var logLine_Name 		= new Array();				// Name of every log line
													// First populated in las_excel.js file. 
var logLine_SourceType	= new Array();				// (1) "las" indicates las file source; "excel" indicates excel file source.	
													// (2) populated in las_data.js and las_excel.js
													// (3) used in las_charting_logs.js

var track_log_current	= {};
var track_log_new 		= {};
var index_LithoGR		= 0;						// The index of log GR

var track_LithoGR 			= new Array();
var track_Ref 				= new Array();
var track_DualI 			= new Array();
var track_Litho 			= new Array();
var track_Umaa 				= new Array();
var track_NPHI 				= new Array();
var track_SpectralGR 		= new Array();
var track_SpectralGRRatio 	= new Array();

var lasHeader_V = new Array();
var lasHeader_W = new Array();
var lasHeader_C = new Array();
var lasHeader_P = new Array();
var lasHeader_O = new Array();
var lasHeader_A = new Array();

var NPHI_DESCRIPTION = "";
/*
 * end
 */


/*
 *	global variables for las_data.js 
 */
var las_data_original 		= new Array();				// The array holds the orginal data
var las_data_processed		= new Array();
var las_data_residual 		= new Array();				// The array holds the residuals of the the data after validation
var las_data_residual_exist	= new Array();				// The array records whether a log has residual or not

var las_data_sample			= new Array();
var las_data_sample_DERIVED	= new Array();

/** variables for derived logs and values */
var logLine_Name_DERIVED 			= new Array();
var las_data_DERIVED 				= new Array();
var las_data_residual_DERIVED 		= new Array();
var las_data_residual_exist_DERIVED	= new Array();				// The array records whether a log has residual or not

var las_data_CTUK					= new Array();

var las_data_formation				= new Array();
var las_data_formation2				= new Array();
/*
 *	********** end 
 */


/*
 * *********** graph plotting related parameters
 */
var HEADER_LABEL_INTERVAL	= -18;
var HEADER_LABEL_Y			= 88;
var CURVE_PER_TRACK			= 5;				// number of curves/logs per track.
var MIN_MAX_LOG				= new Array();		// this array stores the orginal min and max values of very curve/log. 
												// 		every element in this array is another array:
var MIN_MAX_LOG_CURRENT		= new Array();		// this array stores the updates min and max values of every curve/log.
												// 		every element in this array is another array: [min, max]. 
												//		if the value is null, it means means the corresponding value is not reset. 

var WELL_DEPTH_UNIT		= "ft";
var MIN_ELEVATION		= 0;
var MAX_ELEVATION		= 0;
var INTERVAL_ELEVATION	= 0;
var NUM_TOTAL_RECORDS	= 0;
var NUM_GRID_ELEVATION	= 200;

var WELL_NUMERICAL 		= ["STRT","STOP","STEP","NULL","LONG","LAT","LATI","SLAT","SLON"];
var PLOT_SYMBOL			= ["circle", "square", "diamond", "triangle"];

// min and max of reference	
var MIN_REFERENCE_GR		= 0;
var MAX_REFERENCE_GR		= 150;
var MIN_REFERENCE_CGR		= 0;
var MAX_REFERENCE_CGR		= 150;
var MIN_REFERENCE_CALI		= 6;
var MAX_REFERENCE_CALI		= 12;
var MIN_REFERENCE_SP		= 0;
var MAX_REFERENCE_SP		= 0;
var TICKPOS_SP				= new Array(5);

// min and mas of Dual induction
var MAX_DUAL_INDCUTION_SFLU	= 1000;
var MIN_DUAL_INDCUTION_SFLU	= 0.1;
var MAX_DUAL_INDCUTION_ILM	= 1000;
var MIN_DUAL_INDCUTION_ILM	= 0.1;
var MAX_DUAL_INDCUTION_ILD	= 1000;
var MIN_DUAL_INDCUTION_ILD	= 0.1;

// min and max of litho-density
var MIN_LITHO_DENSITY_DPHI		= -0.1;
var MAX_LITHO_DENSITY_DPHI		= 0.7;
var MIN_LITHO_DENSITY_PEF		= 0;
var MAX_LITHO_DENSITY_PEF		= 20;
var MIN_LITHO_DENSITY_NPHI		= -0.1;
var MAX_LITHO_DENSITY_NPHI		= 0.7;
var MIN_LITHO_DENSITY_RHOB		= 0;
var MAX_LITHO_DENSITY_RHOB		= 4;

// min and max of spectral gr
var MIN_SPECTRAL_GR_URAN		= -10;
var MAX_SPECTRAL_GR_URAN		= 30;
var MIN_SPECTRAL_GR_POTA		= -10;
var MAX_SPECTRAL_GR_POTA		= 10;
var MIN_SPECTRAL_GR_THOR		= 0;
var MAX_SPECTRAL_GR_THOR		= 80;

// min and max of rhomma umaa
var MIN_SPECTRAL_GR_RHOMAA_UMAA_RHOMAA	= 2;
var MAX_SPECTRAL_GR_RHOMAA_UMAA_RHOMAA	= 30;
var MIN_SPECTRAL_GR_RHOMAA_UMAA_UMAA	= -0.1;
var MAX_SPECTRAL_GR_RHOMAA_UMAA_UMAA	= 0.7;

// min and max of rhomma umaa
var MIN_SPECTRAL_GR_RHOMAA_NPHI_RHOMAA	= 2;
var MAX_SPECTRAL_GR_RHOMAA_NPHI_RHOMAA	= 30;
var MIN_SPECTRAL_GR_RHOMAA_NPHI_NPHI	= -0.1;
var MAX_SPECTRAL_GR_RHOMAA_NPHI_NPHI	= 0.7;

// min and max of rhomma umaa
var MIN_SPECTRAL_GR_RATIO_TU	= 0.1;
var MAX_SPECTRAL_GR_RATIO_TU	= 100;
var MIN_SPECTRAL_GR_RATIO_TK	= 0.1;
var MAX_SPECTRAL_GR_RATIO_TK	= 100;
/*
 * ************ end of graph parameter
 */


/*
 * Parameters for tracks and logs
 */
var LABEL_FONT			= 'Arial, "Times New Roman", Helvetica, Sans-Serif';
var TRACK_MARGIN_TOP 	= 90;
var TRACK_WIDTH			= 180;
var GRAPH_WIDTH			= 0;
var CHART_TITLE_FONT_SIZE		= 11;
var CHART_LOG_FONT_SIZE			= 10;

var chartScatter;

var chart0;			// The depth indicator
var chart1;
var chart2;
var chart3;
var chart4;
var chart7;
var chart8;
var chart9;
var chart10;
var chart11;
var chart12;
var chart13;
var chart14;
var chart15;
var chart16;
var chart17;
var chart18;
var chart = new Array();


var chart0_0;			// The depth indicator
var chart1_0;
var chart2_0;
var chart3_0;
var chart4_0;
var chart7_0;
var chart8_0;
var chart9_0;
var chart10_0;
var chart11_0;
var chart12_0;
var chart13_0;
var chart14_0;
var chart15_0;
var chart16_0;
var chart17_0;
var chart18_0;

var CURVE_DICTIONARY ={
	"GR": 	["GR"],
	"SGR": 	["SGR"],
	"CGR": 	["CGR"],
	"CAL": 	["CALI", "HCAL", "CAL", "CALD"],
	"SP": 	["SP"],
	
	"SFLU": ["SFLU", "SN", "RXOZ"],
	"ILM": 	["ILM", "RLA3"],
	"ILD": 	["ILD", "RILD", "LN", "RES"],

	"AT10": ["AT10"],
	"AT30": ["AT30"],
	"AT60":	["AT60"],
	"AT90":	["AT90"],

	"PE": 	["PE","PEF","PEFZ"],
	"DPHI":	["DPHI","DPHZ"],
	"RHOB": ["RHOB", "RHO"],
	"NPHI": ["NPHI", "NPL"],
	
	"POTA": ["POTA", "HFK"],
	"URAN": ["URAN", "HURA"],
	"THOR": ["THOR", "HTHO"]
	};
/* 
 * Color code for every log in every track
 */
var color_Track_Log = ["#e60000", "#00e600", "#0000e6", "#868600", "#999999"];

/*
 * Define color for Lithology Gamma Ray
 */
var lithoGR_color = ["#B0CFCF","#A9A9A9","#A8A8A8","#A7A7A7","#A6A6A6","#A5A5A5","#A4A4A4","#A3A3A3","#A2A2A2","#A1A1A1","#A0A0A0","#989892","#959494",
					"#959494","#898888","#7D7C7C","#737373","#696868","#545353","#404040","#303030","#282828","#252525","#222222","#202020"];

var GRIDLINE_COLOR = "#222222";

var UNIT_STANDARD = [{"NPHI":"DECIMAL"}];


var TRACK_NAME	= {
	"Depth"				: "Depth",
	"LithologyGR"		: "V-Shale",
	"Reference"			: "GR-SP-CAL-TEMP",
	"LithoDensity"		: "Porosity-Density-PE",
	"SpectralGR"		: "Spectral GR/Sonic",
	"SpectralGRRatio"	: "Computed Logs",
	"DualInduction"		: "Resistivity-Induction",
	"AHTResistivity"	: "Resistivity-Induction",
	"CTUK"				: "BVW - Colorlith",
	"Formation"			: "Stratigraphic Units",
	"Custom1"			: "Custom Track"
};

/*
 * Pre-define the LAS tracks and logs
 */
var obj_938 = {};

// The Reference Track
var trak = new Array();
var o_923 = {"Element" : "GR",	"Unit" : "GAPI",	"Description" : "Gamma Ray"};
trak.push(o_923);

var o_923 = {"Element" : "SGR",	"Unit" : "GAPI",	"Description" : "Standard Gamma Ray"};
trak.push(o_923);

o_923 = {"Element" : "CGR",		"Unit" : "GAPI",	"Description" : "Computed Gamma Ray"};
trak.push(o_923);

o_923 = {"Element" : "SP",		"Unit" : "GAPI",	"Description" : "Total Gamma Ray"};
trak.push(o_923);

o_923 = {"Element" : "CAL",		"Unit" : "IN",		"Description" : "Caliper"};
trak.push(o_923);

obj_938 = {"Track" : TRACK_NAME.Reference,	"Elements" : trak};
LAS_TRACKS.push(obj_938);

// The Litho-Density Track
trak = new Array();
o_923 = {"Element" : "PE",		"Unit" : "B/E",		"Description" : "Photo-Electric Index"};
trak.push(o_923);

o_923 = {"Element" : "NPHI",	"Unit" : "PERC",	"Description" : "Neutron Porosity"};
trak.push(o_923);

o_923 = {"Element" : "RHOB",	"Unit" : "GM/CC",	"Description" : "Bulk Density"};
trak.push(o_923);

o_923 = {"Element" : "DPHI",	"Unit" : "GM/CC",	"Description" : "Density Porosity"};
trak.push(o_923);

obj_938 = {"Track" : TRACK_NAME.LithoDensity,	"Elements" : trak};
LAS_TRACKS.push(obj_938);

// The Spectral GR Track
trak = new Array();
o_923 = {"Element" : "THOR",	"Unit" : "PPM",	"Description" : "Thorium"};
trak.push(o_923);

o_923 = {"Element" : "URAN",	"Unit" : "PPM",	"Description" : "Uranium"};
trak.push(o_923);

o_923 = {"Element" : "POTA",	"Unit" : "PERC","Description" : "Potassium"};
trak.push(o_923);

obj_938 = {"Track" : TRACK_NAME.SpectralGR,	"Elements" : trak};
LAS_TRACKS.push(obj_938);

// The Dual Induction Track
trak = new Array();
o_923 = {"Element" : "ILD",	"Unit" : "OHMM",	"Description" : "Deep Induction Resistivity"};
trak.push(o_923);

o_923 = {"Element" : "ILM",	"Unit" : "OHMM",	"Description" : "Medium Induction Resistivity"};
trak.push(o_923);

o_923 = {"Element" : "SFLU","Unit" : "OHMM",	"Description" : "Spherically-Focussed Resistivity"};
trak.push(o_923);

obj_938 = {"Track" : TRACK_NAME.DualInduction,	"Elements" : trak};
LAS_TRACKS.push(obj_938);

// The Dual Induction Track
trak = new Array();
o_923 = {"Element" : "AT10",	"Unit" : "OHMM",	"Description" : "Array Induction Two Foot Resistivity"};
trak.push(o_923);

o_923 = {"Element" : "AT30",	"Unit" : "OHMM",	"Description" : "Array Induction Two Foot Resistivity"};
trak.push(o_923);

o_923 = {"Element" : "AT60",	"Unit" : "OHMM",	"Description" : "Array Induction Two Foot Resistivity"};
trak.push(o_923);

o_923 = {"Element" : "AT90",	"Unit" : "OHMM",	"Description" : "Array Induction Two Foot Resistivity"};
trak.push(o_923);

obj_938 = {"Track" : TRACK_NAME.DualInduction,	"Elements" : trak};
LAS_TRACKS.push(obj_938);


/*
 * Well Top sample 
 */

var WELL_TOPS_SAMPLE = [
	["INJUN",			"815.00"],
	["DEV. SHALE",		"1460.00"],
	["BIG LIME",		"4628.00"],
	["ORDOV. SHALE",	"6971.00"],
	["BLACK RIVER",		"8880.00"],
	["ROSE RUN SD.",	"10168.00"]
];
/*
 * Define color for  
 */
var NPHI_color	= []; 

function identifyGroup_gammaray(val) {
	var v = 0;
	var g = 0;
	var o = {};

	if (val == null) {
		v = null;
		g = null;
	} else if (val <= 30) {
		v = 2;
		g = 1;
	} else if (val <= 50 && val > 30) {
		v = 2.1;
		g = 2;
	} else if (val <= 60 && val > 50) {
		v = 2.2;
		g = 3;
	} else if (val <= 66 && val > 60) {
		v = 2.3;
		g = 4;
	} else if (val <= 70 && val > 66) {
		v = 2.4;
		g = 5;
	} else if (val <= 73 && val > 70) {
		v = 2.5;
		g = 6;
	} else if (val <= 75 && val > 73) {
		v = 2.6;
		g = 7;
	} else if (val <= 76 && val > 75) {
		v = 2.7;
		g = 8;
	} else if (val <= 78 && val > 76) {
		v = 2.8;
		g = 9;
	} else if (val <= 81 && val > 78) {
		v = 2.9;
		g = 10;
	} else if (val <= 85 && val > 81) {
		v = 3.0;
		g = 11;
	} else if (val <= 91 && val > 85) {
		v = 3.1;
		g = 12;
	} else if (val <= 96 && val > 91) {
		v = 3.2;
		g = 13;
	} else if (val <= 101 && val > 96) {
		v = 5.2;
		g = 13;
	} else if (val <= 106 && val > 101) {
		v = 5.4;
		g = 14;
	} else if (val <= 111 && val > 106) {
		v = 5.6;
		g = 15;
	} else if (val <= 116 && val > 111) {
		v = 5.8;
		g = 16;
	} else if (val <= 121 && val > 116) {
		v = 6.0;
		g = 17;
	} else if (val <= 126 && val > 121) {
		v = 6.2;
		g = 18;
	} else if (val <= 131 && val > 126) {
		v = 6.4;
		g = 19;
	} else if (val <= 136 && val > 131) {
		v = 6.6;
		g = 20;
	} else if (val <= 141 && val > 136) {
		v = 7;
		g = 21;
	} else if (val <= 146 && val > 141) {
		v = 7.2;
		g = 22;
	} else if (val <= 150 && val > 146) {
		v = 7.4;
		g = 23;
	} else {
		v = 7.6;
		g = 24;
	}

	o.v = v;
	o.g = g;

	return o;
}
