/*
 * Process data for the Lithology Gamma Ray track
 */

var datacontent = "";

function processLasfile(str) {
  datacontent = str;

  console.log(currentTime() + ". Begins ->Reading raw data ...");
  //alert(str);
  initialDataHolder();

  var posDataSegement = str.indexOf("~A");
  // The position where the real data starts, including the field name

  var dataStr = str.substring(posDataSegement + 2, str.length);
  var i = dataStr.indexOf("\n");
  // The first row of the raw data is the field name row

  var headerStr = str.substring(0, posDataSegement - 1);

  // header process
  lasFile_headerProcess(headerStr);
  lasfile_headerPrint();

  var NumberOfFields = logLine_Name.length;
  // logLine_Name is generated in file las_header.js

  logLine_SourceType.length = 0;
  for (var i1 = 0; i1 < NumberOfFields; i1++)
    logLine_SourceType.push("las");
  // "las" indicated las file; variable logLine_SourceType is defined in las_resource.js

  var strData2 = ((dataStr.substring(i + 2, dataStr.length)).replace(/\s+/g, " ")).trim();
  // The real data without field names.
  var values = strData2.split(" ");
  // The real data is not seperated by newline but by one blankspace.
  // The real data is converted into an array

  var temp_original = new Array(),
      temp_processed = new Array(),
      temp_residual = new Array();

  for (var i = 0; i < logLine_Name.length; i++) {// Create an array for each field based on the field name
    las_data_original[i] = new Array();
    las_data_processed[i] = new Array();
    las_data_residual[i] = new Array();
    
    temp_original[i] = new Array(),
    temp_processed[i] = new Array(),
    temp_residual[i] = new Array();
  }

  // Convert the real data into a two-dimention array,
  // where the first dimension is base on filed name and the second dimension is based on the value of that filed data

  // read data row by row to temporary array. the raw data might not have equal steps.
  //   next for loop will assure the row is in equal step.

  for ( i = 0; i < values.length; i++) {
    temp_original[(i % NumberOfFields)].push(Number(values[i]));

    var tt = Standardize_Las_data(Number(values[i]), i);
    temp_processed[(i % NumberOfFields)].push(tt);

    temp_residual[(i % NumberOfFields)].push(Calculate_Residual_Value(tt, i));
  }

  // force temporary array in equal step. the step value is from the LAS file header, and saved in the DEPTH_STEP.value.
  // step 1: initialize the first record
  for ( i = 0; i < NumberOfFields; i++) {
    las_data_original[i][0] = temp_original[i][0];
    las_data_processed[i][0] = temp_processed[i][0];
    las_data_residual[i][0] = temp_residual[i][0];
  }

  // step 2:  process the rest of the records.
  for (var j = 1; j < temp_original[0].length; j++) {
    // the first coloum in the row data is depth, so the first array is for depth
    var gap = temp_original[0][j] - temp_original[0][j - 1];
    var baseDepth = temp_original[0][j - 1];
    if (gap == DEPTH_STEP.value) {
      for ( i = 0; i < NumberOfFields; i++) {
        las_data_original[i].push(temp_original[i][j]);
        las_data_processed[i].push(temp_processed[i][j]);
        las_data_residual[i].push(temp_residual[i][j]);
      }
    }
    // in the raow data, if the interval between two adject depth are NOT in one step, make the final data to be in equal step, and assign null value to the non-preexisting depth
    else {
      var jumps = gap / DEPTH_STEP.value;

      // figure out how many steps are missing. for example, depth jumps from 1000 to 1001 with depth step as 0.25.
      // there are three depth needed to fill in the gap: 1000 + 0.25*1, 1000 + 0.25*2, 1000 + 0.25*3
      for (var k = 1; k < jumps; k++) {
        // the temp_original has NumberOfFields arrays in it. the first array (index 0) holds depth.
        //     In this step, the depth array will hold the depth with equal step. if a step is missed, we assign the depth programtically.
        //       With the depth array to be assigned to the equal step for the missed depth, the corresponding variable will be assigned to null.
        //       for example, 1000.25, null, null, null, ..., null
        //                   each value is in its own array, as temp_original[0], temp_original[1], temp_original[2], temp_original[3], ..., temp_original[NumberOfFields-1].
        // the same theory will be applied to temp_processed and temp_residual.
        //     step 1: assign the depth value for the missed steps
        las_data_original[0].push(baseDepth + k*DEPTH_STEP.value);
        las_data_processed[0].push(baseDepth + k*DEPTH_STEP.value);
        las_data_residual[0].push(baseDepth + k*DEPTH_STEP.value);

        //     step 2: assign the other fields/variable that have skipped steps
        //          there are two options for the values of the missing steps: null or copy values from the base depth variables 
        /*
        // option 1: null to missing step
        for ( i = 1; i < NumberOfFields; i++) {
          las_data_original[i].push(null);
          las_data_processed[i].push(null);
          las_data_residual[i].push(null);
        }
        */
        // option 2: copy values from the base depth variables
        for ( i = 1; i < NumberOfFields; i++) {
          las_data_original[i].push(temp_original[i][j-1]);
          las_data_processed[i].push(temp_processed[i][j-1]);
          las_data_residual[i].push(temp_residual[i][j-1]);
        }

      }
      
      for ( i = 0; i < NumberOfFields; i++) {
        las_data_original[i].push(temp_original[i][j]);
        las_data_processed[i].push(temp_processed[i][j]);
        las_data_residual[i].push(temp_residual[i][j]);
      }
    }
  }

  var b10 = Math.floor(las_data_original[0][0] / 10) * 10;
  var step = las_data_original[0][1] - las_data_original[0][0];
  //var intervals = (las_data_original[0][0]-b10) / step;
  var intervals = (las_data_original[0][0] - b10) / DEPTH_STEP.value;

  for ( i = 0; i < intervals; i++) {
    las_data_original[0].unshift(las_data_original[0][0] - step);
    las_data_processed[0].unshift(las_data_processed[0][0] - step);
    las_data_residual[0].unshift(null);

    for (var jjj = 1; jjj < NumberOfFields; jjj++) {
      las_data_original[jjj].unshift(null);
      las_data_processed[jjj].unshift(null);
      las_data_residual[jjj].unshift(null);
    }
  }

  MIN_ELEVATION = las_data_original[0][0];
  MAX_ELEVATION = las_data_original[0][las_data_original[0].length - 1];
  NUM_TOTAL_RECORDS = las_data_original[0].length;
  INTERVAL_ELEVATION = Number(( Math.floor(NUM_TOTAL_RECORDS / NUM_GRID_ELEVATION) ).toFixed(0));

  // generae DPHI value
  calculate_Rho_Matrix();
  if (logLine_Name.indexOf("DPHI") == -1)
    calculate_DPHI();

  calculate_SGR_Ratio();
  //

  if (logLine_Name_DERIVED.length > 0)
    calculateCTUK();

  if (lasHeader_W.hasOwnProperty("TOPS"))
    setFormation();

  processLithologyGammaRay(las_data_original[index_LithoGR]);

  processSP();

  identifyLogMinMax();

  console.log(currentTime() + ". Ends ->Data reading successfully.");

  //chartingLasdata();
}

function dataInterpolate(){
  // 1. copy the current plotting data to temporary array
  //      las_data_original, las_data_processed, las_data_residual
  var temp_original = [], temp_processed = [], temp_residual = [];
  for (var i=0; i<las_data_original.length; i++){
    temp_original[i] = [];
    temp_processed[i] = [];
    temp_residual[i] = [];
    
    for (var j=0; j<las_data_original[i].length; j++){
      temp_original[i].push(las_data_original[i][j]);
      temp_processed[i].push(las_data_processed[i][j]);
      temp_residual[i].push(las_data_residual[i][j]);
    }
  }
  
  las_data_original = [];
  las_data_processed = [];
  las_data_residual = [];

  for ( i = 0; i < temp_original.length; i++) {
    las_data_original[i] = [];
    las_data_processed[i] = [];
    las_data_residual[i] = [];

    las_data_original[i].push(temp_original[i][0]);
    las_data_processed[i].push(temp_processed[i][0]);
    las_data_residual[i].push(temp_residual[i][0]);
  }
  
  for ( j = 1; j < temp_original[0].length; j++) {
    // the first coloum in the row data is depth, so the first array is for depth
    var gap = temp_original[0][j] - temp_original[0][j - 1];
    var baseDepth = temp_original[0][j - 1];

    var jumps = gap / DEPTH_STEP_EXCEL.value;

    // figure out how many steps are missing. for example, depth jumps from 1000 to 1001 with depth step as 0.25.
    // there are three depth needed to fill in the gap: 1000 + 0.25*1, 1000 + 0.25*2, 1000 + 0.25*3
    for (var k = 1; k < jumps; k++) {
      // the temp_original has NumberOfFields arrays in it. the first array (index 0) holds depth.
      //     In this step, the depth array will hold the depth with equal step. if a step is missed, we assign the depth programtically.
      //       With the depth array to be assigned to the equal step for the missed depth, the corresponding variable will be assigned to null.
      //       for example, 1000.25, null, null, null, ..., null
      //                   each value is in its own array, as temp_original[0], temp_original[1], temp_original[2], temp_original[3], ..., temp_original[NumberOfFields-1].
      // the same theory will be applied to temp_processed and temp_residual.
      //     step 1: assign the depth value for the missed steps
      las_data_original[0].push(baseDepth + k*DEPTH_STEP_EXCEL.value);
      las_data_processed[0].push(baseDepth + k*DEPTH_STEP_EXCEL.value);
      las_data_residual[0].push(baseDepth + k*DEPTH_STEP_EXCEL.value);

      //     step 2: assign the other fields/variable that have skipped steps
      //          there are two options for the values of the missing steps: null or copy values from the base depth variables 
      /*
      // option 1: null to missing step
      for ( i = 1; i < NumberOfFields; i++) {
        las_data_original[i].push(null);
        las_data_processed[i].push(null);
        las_data_residual[i].push(null);
      }
      */
      // option 2: copy values from the base depth variables
      for ( i = 1; i < temp_original.length; i++) {
        las_data_original[i].push(temp_original[i][j-1]);
        las_data_processed[i].push(temp_processed[i][j-1]);
        las_data_residual[i].push(temp_residual[i][j-1]);
      }

    }
      
    for ( i = 0; i < temp_original.length; i++) {
      las_data_original[i].push(temp_original[i][j]);
      las_data_processed[i].push(temp_processed[i][j]);
      las_data_residual[i].push(temp_residual[i][j]);
    }
  }
}

function processLithologyGammaRay(val) {
  var NumberOfGroups = 15;
  aLithoGammaRay = new Array();

  for (var i = 0; i < val.length; i++) {
    var o = {};
    var o1 = identifyGroup_gammaray(val[i]);

    if (o1.v == null) {
      o.y = null;
      //o.y = o1.v;
      o.color = "#FFFFFF";
      aLithoGammaRay.push(o);
    } else {
      o.y = NumberOfGroups - o1.v;
      //o.y = o1.v;
      o.color = lithoGR_color[o1.g]
      aLithoGammaRay.push(o);
    }
  }
}

function processSP() {
  var i = logLine_Name.indexOf("SP");

  if (i == -1)
    return;
  else {
    var t = copyArray(las_data_processed[i]);
    t.sort(function(a, b) {
      return a - b;
    });

    MAX_REFERENCE_SP = Math.ceil((t[t.length - 1] + 1) / 10) * 10;
    MIN_REFERENCE_SP = Math.floor((t[0] - 1) / 10) * 10;

    var il = (MAX_REFERENCE_SP - MIN_REFERENCE_SP) / 4;

    TICKPOS_SP = [MIN_REFERENCE_SP, MIN_REFERENCE_SP + il, MIN_REFERENCE_SP + 2 * il, MIN_REFERENCE_SP + 3 * il, MIN_REFERENCE_SP + 4 * il];
    ;
  }
}

function Standardize_Las_data(val, i) {
  var n = logLine_Name.length;

  if (val < 0) {
    if (val == LOG_NULL_VALUE)
      return null;
    else
      return val;
  }

  var curve = logLine_Name[i % n];
  switch (curve) {
  case "POTA": {
    for (var i = 0; i < lasHeader_C.length; i++) {
      if (lasHeader_C[i]["Element"] == curve)
        break;
    }

    // If the data is in demal format, that means no sign of percent can be found,

    // the value will be converted to percent.
    if (!(lasHeader_C[i]["Unit"].toUpperCase().indexOf("PER") > -1 || lasHeader_C[i]["Unit"].toUpperCase().indexOf("%") > -1))
      return Number(parseFloat(val * 100).toFixed(3));

    // otherwise, the value stay without changes.
    else
      return Number(val);
    break;
  }
  case "NPL":
  case "NPHI": {
    for (var i = 0; i < lasHeader_C.length; i++) {
      if (lasHeader_C[i]["Element"] == curve)
        break;
    }

    // If there is any indication of percent, such as text of per, perc, percent, or sign of %,

    // the value will be converted in decimal.
    if (lasHeader_C[i]["Unit"].toUpperCase().indexOf("PER") > -1 || lasHeader_C[i]["Unit"].toUpperCase().indexOf("%") > -1)
      return Number(parseFloat(val / 100).toFixed(3));

    // otherwise, the value will stay the same
    else
      return Number(val);
    break;
  }

  default:
    return Number(val);
  }
}

/*
 * Validate value
 */
function Calculate_Residual_Value(val, i) {
  var n = logLine_Name.length;

  if (val < 0) {
    if (val == LOG_NULL_VALUE)
      return null;
    else
      return null;
  }

  switch (logLine_Name[i%n]) {
  case "GR":
  case "CGR":
  case "SGR":
    return Number(val - (MAX_REFERENCE_GR - MIN_REFERENCE_GR));
    break;
  case "CAL":
    return Number(val - (MAX_REFERENCE_CALI - MIN_REFERENCE_CALI));
    break;

  case "SFLU":
    return val > (MAX_DUAL_INDCUTION_SFLU - MIN_DUAL_INDCUTION_SFLU) ? Number(val - (MAX_DUAL_INDCUTION_SFLU - MIN_DUAL_INDCUTION_SFLU)) : 0.1;
    break;
  case "ILM":
    return val > (MAX_DUAL_INDCUTION_ILM - MIN_DUAL_INDCUTION_ILM) ? Number(val - (MAX_DUAL_INDCUTION_ILM - MIN_DUAL_INDCUTION_ILM)) : 0.1;
    break
  case "ILD":
    return val > (MAX_DUAL_INDCUTION_ILD - MIN_DUAL_INDCUTION_ILD) ? Number(val - (MAX_DUAL_INDCUTION_ILD - MIN_DUAL_INDCUTION_ILD)) : 0.1;
    break;

  case "AT10":
  case "AT30":
  case "AT60":
  case "AT90":
    return val;
    break;
  case "DPHI":
    return Number(val - (MAX_LITHO_DENSITY_DPHI - MIN_LITHO_DENSITY_DPHI));
    break;
  case "RHOB":
    return Number(val - (MAX_LITHO_DENSITY_RHOB - MIN_LITHO_DENSITY_RHOB));
    break;
  case "NPHI":
  case "NPL":
    return Number(val - (MAX_LITHO_DENSITY_NPHI - MIN_LITHO_DENSITY_NPHI));
    break;
  case "PE":
    return Number(val - (MAX_LITHO_DENSITY_PEF - MIN_LITHO_DENSITY_PEF));
    break;

  case "POTA":
    return Number(val - (MAX_SPECTRAL_GR_POTA - MIN_SPECTRAL_GR_POTA));
    break;
  case "URAN":
    return Number(val - (MAX_SPECTRAL_GR_URAN - MIN_SPECTRAL_GR_URAN));
    break;
  case "THOR":
    return Number(val - (MAX_SPECTRAL_GR_THOR - MIN_SPECTRAL_GR_THOR));
    break;

  case "Th/K":
    return Number(val - (MAX_SPECTRAL_GR_RATIO_TU - MIN_SPECTRAL_GR_RATIO_TU));
    break;
  case "Th/U":
    return Number(val - (MAX_SPECTRAL_GR_RATIO_TU - MIN_SPECTRAL_GR_RATIO_TU));
    break;

  default:
    return null;
    break;

  }
}

/*
 * Log of DPHI is calculated is calculated based on log of RHOB
 * The formula is 					[ value of stone matrix (Rho_MATRIX) - value of RHOB ]
 * 						= 	-----------------------------------------------------------------------
 * 								[ value of stone matrix (Rho_MATRIX) - value of fluid (Rho_FLUID)]
 */

var Rho_MATRIX = 2.71;
// This value relates to NAPI, and it's based on different elements, e.g. limestone(ls), sandstone(ss), dolomite (dol).
// check out another function: caculate_Rho_Matrix
var Rho_FLUID = 1;
// Rho_FLUID is a constant value based on water

function calculate_DPHI() {
  var i = 0;
  // the index of log RHOB
  var a = new Array();

  for ( i = 0; i < logLine_Name.length; i++)
    if (logLine_Name[i].toUpperCase() == "RHOB")
      break;

  if (i < logLine_Name.length) {
    logLine_Name.push("DPHI");

    track_log_current[TRACK_NAME.LithoDensity].push(logLine_Name.length - 1);

    for (var j = 0; j < las_data_original[i].length; j++) {
      var n = (Rho_MATRIX - las_data_original[i][j] ) / (Rho_MATRIX - Rho_FLUID );
      a.push(Number(n.toFixed(4)));
    }

    las_data_original.push(a);
    las_data_processed.push(a);
    las_data_residual.push(a);
  }
}

function identifyLogMinMax() {
  var c = "";

  for (var i = 0; i < las_data_original.length; i++) {
    var t = copyArray(las_data_processed[i]);
    //t.sort(function(a,b){return a-b;});
    //MIN_MAX_LOG.push( [ Number(t[0].toFixed(2)), Number(t[t.length-1].toFixed(2)) ] );

    MIN_MAX_LOG.push([Math.min.apply(Math, t), Math.max.apply(Math, t)]);

    c = logLine_Name[i];
    if (c == "GR" || c == "CGR" || c == "SGR") {
      MIN_MAX_LOG_CURRENT.push([MIN_REFERENCE_GR, MAX_REFERENCE_GR, 1]);
    } else if (c == "SFLU" || c == "ILM" || c == "ILD") {
      MIN_MAX_LOG_CURRENT.push([MIN_DUAL_INDCUTION_SFLU, MAX_DUAL_INDCUTION_SFLU, 1]);
    } else if (c == "CAL") {
      MIN_MAX_LOG_CURRENT.push([MIN_REFERENCE_CALI, MAX_REFERENCE_CALI, 1]);
    } else if (c == "PE") {
      MIN_MAX_LOG_CURRENT.push([MIN_LITHO_DENSITY_PEF, MAX_LITHO_DENSITY_PEF, 1]);
    } else if (c == "DPHI" || c == "NPHI") {
      MIN_MAX_LOG_CURRENT.push([MIN_LITHO_DENSITY_DPHI, MAX_LITHO_DENSITY_DPHI, 1]);
    } else if (c == "RHOB") {
      MIN_MAX_LOG_CURRENT.push([MIN_LITHO_DENSITY_RHOB, MAX_LITHO_DENSITY_RHOB, 1]);
    } else if (c == "URAN") {
      MIN_MAX_LOG_CURRENT.push([MIN_SPECTRAL_GR_URAN, MAX_SPECTRAL_GR_URAN, 1]);
    } else if (c == "POTA") {
      MIN_MAX_LOG_CURRENT.push([MIN_SPECTRAL_GR_POTA, MAX_SPECTRAL_GR_POTA, 1]);
    } else if (c == "THOR") {
      MIN_MAX_LOG_CURRENT.push([MIN_SPECTRAL_GR_THOR, MAX_SPECTRAL_GR_THOR, 1]);
    } else {
      MIN_MAX_LOG_CURRENT.push([null, null, 0]);
    }
  }
}

/*
 * This function is to calculate the cross area.
 * Cross Area is the area where the DPHI value is bigger than the NPHI value
 */
function getCrossArea() {
  var a = new Array();
  var d_index = logLine_Name.indexOf("DPHI");
  var n_index = logLine_Name.indexOf("NPHI");

  if (d_index < 0 || n_index < 0)
    return;

  for (var i = 0; i < las_data_residual[0].length; i++) {
    var b = las_data_processed[d_index][i] - las_data_processed[n_index][i];
    if (i == 1423) {
      var j = i;
    }

    if (b > 0)
      a.push([las_data_processed[d_index][i], las_data_processed[n_index][i]]);
    else
      a.push([null, null]);
  }

  return a;
}

/*
 * NPHI value is not in decimal format, but the number part of a percent number.
 */
function calculate_NPHI() {
  var i = 0;
  for ( i = 0; i < logLine_Name.length; i++)
    if (logLine_Name[i].toUpperCase() == "NPHI")
      break;

  for (var j = 0; j < las_data_original[i].length; j++) {
    las_data_original[i][j] = (las_data_original[i][j] / 100).toFixed(1);
    las_data_processed[i][j] = (las_data_processed[i][j] / 100).toFixed(1);
    las_data_residual[i][j] = (las_data_residual[i][j] / 100).toFixed(1);
  }
}

/*
 * Function: caculate_Rho_Matrix. Calculate Rho Matrix for the calculation of DPHI
 * NPHI_DESCRIPTION is from las_header.js
 */

function calculate_Rho_Matrix() {
  if (NPHI_DESCRIPTION.toUpperCase().indexOf("LS") > -1 || NPHI_DESCRIPTION.toUpperCase().indexOf("LST") > -1 || NPHI_DESCRIPTION.toUpperCase().indexOf("LIMESTONE") > -1)

    Rho_MATRIX = 2.71;

  if (NPHI_DESCRIPTION.toUpperCase().indexOf("SS") > -1 || NPHI_DESCRIPTION.toUpperCase().indexOf("SST") > -1 || NPHI_DESCRIPTION.toUpperCase().indexOf("SANDSTONE") > -1)

    Rho_MATRIX = 2.65;

  if (NPHI_DESCRIPTION.toUpperCase().indexOf("DOL") > -1 || NPHI_DESCRIPTION.toUpperCase().indexOf("DL") > -1 || NPHI_DESCRIPTION.toUpperCase().indexOf("DOLOMITE") > -1)

    Rho_MATRIX = 2.87;

}

/*
 * calculate_SGR_Ratio
 */

function calculate_SGR_Ratio() {
  var u = 0,
      k = 0,
      t = 0;
  var a = new Array(),
      b = new Array(),
      a1 = new Array(),
      b1 = new Array();
  var r1 = false,
      r2 = false;

  las_data_DERIVED = new Array();
  las_data_residual_DERIVED = new Array();
  las_data_residual_exist_DERIVED = new Array();
  logLine_Name_DERIVED = new Array();

  for ( i = 0; i < logLine_Name.length; i++) {
    if (logLine_Name[i].toUpperCase() == "THOR")
      t = i;
    if (logLine_Name[i].toUpperCase() == "POTA")
      k = i;
    if (logLine_Name[i].toUpperCase() == "URAN")
      u = i;
  }

  if (t != 0 && k != 0 && u != 0) {
    logLine_Name_DERIVED.push("Th/U");
    logLine_Name_DERIVED.push("Th/K");

    for ( i = 0; i < las_data_original[0].length; i++) {
      var tt1 = Number((Math.abs(las_data_original[t][i]) / Math.abs(las_data_original[u][i])).toFixed(3));
      if (las_data_original[t][i] == null || las_data_original[u][i] == null)
        tt1 = null;

      var tt2 = Number((Math.abs(las_data_original[t][i]) / Math.abs(las_data_original[k][i])).toFixed(3));
      if (las_data_original[t][i] == null || las_data_original[k][i] == null)
        tt2 = null;
      a.push(tt1);
      b.push(tt2);

      if (!r1 && tt1 > MAX_SPECTRAL_GR_RATIO_TU)
        r1 = true;
      if (!r2 && tt2 > MAX_SPECTRAL_GR_RATIO_TK)
        r2 = true;

      a1.push(tt1 > 100 ? Number((tt1 % 100).toFixed(4)) : null);
      b1.push(tt2 > 100 ? Number((tt2 % 100).toFixed(4)) : null);
    }

    las_data_residual_DERIVED.push(a1);
    las_data_residual_DERIVED.push(b1);

    las_data_DERIVED.push(a);
    las_data_DERIVED.push(b);

    las_data_residual_exist_DERIVED.push(r1);
    las_data_residual_exist_DERIVED.push(r2);
  }
}

/*
 * Function: calculateCTUK.
 */
function calculateCTUK(val) {
  var NumberOfGroups = 15;
  las_data_CTUK = new Array();

  for (var i = 0; i < las_data_original[0].length; i++) {
    var o = {};
    var o1 = identifyGroup_gammaray(las_data_original[index_LithoGR][i]);
    if (o1.v != null)
      o.y = NumberOfGroups - o1.v;
    else
      o.y = null;

    if (las_data_DERIVED[0][i] == null) {
      o.color = "#FFFFFF";
    } else if ((las_data_DERIVED[0][i] <= 2) && (las_data_DERIVED[1][i] <= 3.5)) {
      o.color = "#000000";
    } else if ((2 < las_data_DERIVED[0][i] && las_data_DERIVED[0][i] <= 7) && (las_data_DERIVED[1][i] <= 3.5)) {
      o.color = "#584100";
      //"#732600";
    } else if ((7 < las_data_DERIVED[0][i]) && (las_data_DERIVED[1][i] <= 3.5)) {
      o.color = "#FF0000";
    } else if ((las_data_DERIVED[0][i] <= 2) && (3.5 < las_data_DERIVED[1][i] && las_data_DERIVED[1][i] <= 12)) {
      o.color = "#375623";
      //"#267300";
    } else if ((2 < las_data_DERIVED[0][i] && las_data_DERIVED[0][i] <= 7) && (3.5 < las_data_DERIVED[1][i] && las_data_DERIVED[1][i] <= 12)) {
      o.color = "#7C964C";
      //"#898944";
    } else if (7 < las_data_DERIVED[0][i] && (3.5 < las_data_DERIVED[1][i] && las_data_DERIVED[1][i] <= 12)) {
      o.color = "#ED7D31";
      //"#FFAA00";
    } else if (las_data_DERIVED[0][i] <= 2 && 12 < las_data_DERIVED[1][i]) {
      o.color = "#548235";
      //"#AAFF00";
    } else if ((2 < las_data_DERIVED[0][i] && las_data_DERIVED[0][i] <= 7) && 12 < las_data_DERIVED[1][i]) {
      o.color = "#C9FC24";
      //"#AAFF00";
    } else if (7 < las_data_DERIVED[0][i] && 12 < las_data_DERIVED[1][i]) {
      o.color = "#FFFF00";
    }

    las_data_CTUK.push(o);
  }
}

/*
 * Set the formation of the LAS file if there are this information available.
 * The formation information exists in the LAS header and in the Well information.
 * Check out the information from variable: lasHeader_W.TOPS
 */
function setFormation() {
  las_data_formation = new Array();
  las_data_formation2 = new Array();
  var e = false,
      tops = false,
      cl = "#FFFFFF",
      o1 = {};

  for (var i = 0; i < las_data_original[0].length; i++) {
    e = false;

    for (var o in lasHeader_W.TOPS) {
      //if ( las_data_original[0][i] == (lasHeader_W.TOPS)[o] ){
      if ((las_data_original[0][i] <= (lasHeader_W.TOPS)[o] ) && (las_data_original[0][i + 1] >= (lasHeader_W.TOPS)[o] )) {
        e = true;
        tops = true;
        cl = getRandomColor();
        break;
      }
    }

    if (!tops) {// before reaches the top, color = null and y =0
      o1 = {
        y : 0,
        color : cl
      };
      las_data_formation.push(o1);

      las_data_formation2.push(null);
    } else {
      o1 = {
        y : 1,
        color : cl
      };
      las_data_formation.push(o1);

      if (e) {
        las_data_formation2.push(o);
      } else {
        las_data_formation2.push(null);
      }
    }
  }

}

function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.round(Math.random() * 15)];
  }
  return color;
}

/*
 function chartingLasdata() {
 // The raw data is processed in this function which is located in las_data_processed.js
 // Varibles that are from las_data_processed.js include las_data_original, las_data_processed, las_data_residual
 // Vairbles that are from las_header.js include logLine_Name, track_log_current, index_LithoGR
 $(icProgress).css("visibility", "visible");

 if (NO_CURVE_TO_PLOT) {
 $(loadingWindow).css("display","none");
 $(icProgress).css("visibility", "hidden");
 Print_No_Data_Warning();
 return;
 }

 // preparations
 // print the contral panel
 print_well_info();
 print_well_top("none");

 // have the parameters ready for plotting
 idTracks_and_Logs();
 generateWellTopSamples();
 // end of preparations

 Set_Highchart_Options();
 //Set_Highchart_Options_0();
 initialInterface();

 GRAPH_WIDTH = 25;
 ResetControlPanel();
 $(las_track_list).css("display", 'block');

 var myPlotLineId = "myPlotLine";

 var itemDiv0;
 if (1==1){
 GRAPH_WIDTH += 40;
 ResetDivWidth();

 $('#chart_0_depth').css({"border-width":"1px", "width":"40px"});
 $('#chart_0_depth_0').css({"border-width":"1px", "width":"40px"});
 $('#chart_0_depth_0').addClass('plotHeader_border');

 //$("#txtProcess").html("Plotting Depth Grid ...");
 //setTimeout(function(){
 depth_grid(chart0, "chart_0_depth",las_data_processed);		// This track is for Lithology Gamma Ray.
 depth_grid_0(chart0_0, "chart_0_depth_0",las_data_processed);		// This track is for Lithology Gamma Ray.
 //}, 1000);

 } else {
 if (chart0 != undefined) {
 $('#chart_0_depth').css({"width":"0px", "border-width":"0px"});
 $('#chart_0_depth_0').css({"width":"0px", "border-width":"0px"});

 if ( itemDiv0!=undefined ) itemDiv0.destroy();
 $itemDiv0.empty();
 $itemDiv0.remove();
 }
 }

 var itemDiv1;
 if (1==1){
 GRAPH_WIDTH += 30;
 ResetDivWidth();

 $('#chart_1_lgr').css({"border-width":"1px", "width":"30px"});
 $('#chart_1_lgr_0').css({"border-width":"1px", "width":"30px"});
 $('#chart_1_lgr_0').addClass('plotHeader_border');

 //$("#txtProcess").html("Plotting Lithology Gamma Ray ...");
 //setTimeout(function(){
 track_log_Lithology_GR(chart1, "chart_1_lgr",las_data_processed);		// This track is for Lithology Gamma Ray.
 track_log_Lithology_GR_0(chart1_0, "chart_1_lgr_0",las_data_processed);		// This track is for Lithology Gamma Ray.

 createChkbox_Track_Log(itemDiv1,chart_1_lgr, "Lithology - Gamma Ray", "Gramma Ray Lighlogy Tracks");
 //}, 1000);

 } else {
 if (chart1 != undefined) {
 $('#chart_1_lgr').css({"width":"0px", "border-width":"0px"});
 $('#chart_1_lgr_0').css({"width":"0px", "border-width":"0px"});
 if ( itemDiv1!=undefined ) itemDiv1.destroy();
 chart1.destroy();
 chart1_0.destroy();
 }
 }

 // Check variable track_log_current to see which track has logs.
 // If a track name is not listed, don't plot that track;
 // For a track, plot only the logs listed
 //		Format of the variable content
 //			track_log_current: Object
 //				Lithology Gamma Ray: "2 "
 //				Reference: "1 4 "
 //				Spectral GR: "3 5 6 "
 //
 //	The format of every track is: Track Name as Key and the log list is the value.
 if (!track_log_current.hasOwnProperty("Reference")){
 if (chart2 != undefined) {
 $('#chart_2_ref').css({"width":"0px", "border-width":"0px"});
 $('#chart_2_ref_0').css({"width":"0px", "border-width":"0px"});

 if ( itemDiv2!=undefined ) itemDiv2.destroy();
 if ( chart2.hasOwnProperty("container")) {
 chart2.destroy();
 chart2_0.destroy();
 }
 }
 };
 if (!track_log_current.hasOwnProperty("Dual Induction") || !track_log_current.hasOwnProperty("AHT Resistivity")){
 if ( chart3 != undefined ) {
 $('#chart_3_dual').css({"width":"0px", "border-width":"0px"});
 $('#chart_3_dual_0').css({"width":"0px", "border-width":"0px"});

 if ( itemDiv3!=undefined ) itemDiv3.destroy();
 if ( chart3.hasOwnProperty("container")) {
 chart3.destroy();
 chart3_0.destroy();
 }
 }
 }
 if (!track_log_current.hasOwnProperty("Litho-Density")){
 if ( chart4 != undefined ) {
 $('#chart_4_litho').css({"width":"0px", "border-width":"0px"});
 $('#chart_4_litho_0').css({"width":"0px", "border-width":"0px"});
 if ( itemDiv4!=undefined ) itemDiv4.destroy();

 if ( chart4.hasOwnProperty("container")) {
 chart4.destroy();
 chart4_0.destroy();
 }
 }
 }
 if (!track_log_current.hasOwnProperty("Spectral GR")){
 if ( chart7 != undefined ){
 $('#chart_7_sgr').css({"width":"0px", "border-width":"0px"});
 $('#chart_7_sgr_0').css({"width":"0px", "border-width":"0px"});
 if ( itemDiv7!=undefined ) itemDiv7.destroy();

 if ( chart7.hasOwnProperty("container")) {
 chart7.destroy();
 chart7_0.destroy();
 }
 }
 }
 chart = new Array();
 var iii = 0;
 for (var key in track_log_current){

 if (key == "Reference"){
 var itemDiv2;

 GRAPH_WIDTH += (150+5);
 ResetDivWidth();

 $('#chart_2_ref').css({"border-width":"1px", "width": 150+"px"});
 $('#chart_2_ref_0').css({"border-width":"1px", "width": 150+"px"});
 $('#chart_2_ref_0').addClass('plotHeader_border');

 //$("#txtProcess").html("Plotting Reference logs ...");
 //setTimeout(function(){
 track_log_Reference(chart2, "chart_2_ref", track_log_current["Reference"].trim().split(" "));
 track_log_Reference_0(chart2_0, "chart_2_ref_0", track_log_current["Reference"].trim().split(" "));

 createChkbox_Track_Log(itemDiv2,chart_2_ref, "LAS - Reference - GR, SP, CAL Logs", "");
 //},1000);
 }

 else if (key == "Dual Induction" || key == "AHT Resistivity"){
 var itemDiv3;
 GRAPH_WIDTH += (TRACK_WIDTH+5);
 ResetDivWidth();

 $('#chart_3_dual').css({"border-width":"1px", "width": TRACK_WIDTH+"px"});
 $('#chart_3_dual_0').css({"border-width":"1px", "width": TRACK_WIDTH+"px"});
 $('#chart_3_dual_0').addClass('plotHeader_border');

 //$("#txtProcess").html("Plotting Dual Induction logs ...");
 //setTimeout(function(){
 track_log_Dual_Induction(chart3, "chart_3_dual", track_log_current[key].trim().split(" "), key);
 track_log_Dual_Induction_0(chart3_0, "chart_3_dual_0", track_log_current[key].trim().split(" "), key);

 createChkbox_Track_Log(itemDiv3,chart_3_dual, "LAS - Induction Resistivity Logs", "LAS - Resistivity");
 //}, 1000);
 }

 else if (key == "Litho-Density"){
 var itemDiv4;
 GRAPH_WIDTH += (TRACK_WIDTH+5);
 ResetDivWidth();

 $('#chart_4_litho').css({"border-width":"1px", "width": TRACK_WIDTH+"px"});
 $('#chart_4_litho_0').css({"border-width":"1px", "width": TRACK_WIDTH+"px"});
 $('#chart_4_litho_0').addClass('plotHeader_border');

 //$("#txtProcess").html("Plotting Litho Density logs ...");
 //setTimeout(function(){
 track_log_Litho_Density(chart4, "chart_4_litho", track_log_current["Litho-Density"].trim().split(" "));
 track_log_Litho_Density_0(chart4_0, "chart_4_litho_0", track_log_current["Litho-Density"].trim().split(" "));

 createChkbox_Track_Log(itemDiv4, chart_4_litho, "LAS - Litho-Density - NPHI, RHOB, PE", "LAS - Porosity");
 //}, 1000);
 }

 else if (key == "Spectral GR"){
 var itemDiv7;
 GRAPH_WIDTH += (TRACK_WIDTH+5);
 ResetDivWidth();

 $('#chart_7_sgr').css({"border-width":"1px", "width": TRACK_WIDTH+"px"});
 $('#chart_7_sgr_0').css({"border-width":"1px", "width": TRACK_WIDTH+"px"});
 $('#chart_7_sgr_0').addClass('plotHeader_border');

 //$("#txtProcess").html("Plotting Spectral Gamma Ray logs ...");
 //setTimeout(function(){
 track_log_Spectral_GR(chart7, "chart_7_sgr", track_log_current["Spectral GR"].trim().split(" "));
 track_log_Spectral_GR_0(chart7_0, "chart_7_sgr_0", track_log_current["Spectral GR"].trim().split(" "));

 createChkbox_Track_Log(itemDiv7, chart_7_sgr, "LAS - Spectral Gamma Ray", "LAS - Spectral Gamma Ray");
 //}, 1000);
 }

 }

 var itemDiv8;
 if (logLine_Name_DERIVED.length>0){
 GRAPH_WIDTH += (TRACK_WIDTH+5);
 ResetDivWidth();

 $('#chart_8_sgr_ratio').css({"border-width":"1px", "width":TRACK_WIDTH+"px"});
 $('#chart_8_sgr_ratio_0').css({"border-width":"1px", "width":TRACK_WIDTH+"px"});
 $('#chart_8_sgr_ratio_0').addClass('plotHeader_border');

 //$("#txtProcess").html("Plotting Spectral Gamma Ray logs ...");
 //setTimeout(function(){
 track_log_Spectral_GR_Ratio(chart8, "chart_8_sgr_ratio", logLine_Name_DERIVED);
 track_log_Spectral_GR_Ratio_0(chart8_0, "chart_8_sgr_ratio_0", logLine_Name_DERIVED);

 createChkbox_Track_Log(itemDiv8, chart_8_sgr_ratio, "LAS - Spectral Gamma Ray Ratio", "");
 //}, 500);
 } else {
 if ( chart8 != undefined ){
 $('#chart_8_sgr_ratio').css({"width":"0px", "border-width":"0px"});
 $('#chart_8_sgr_ratio_0').css({"width":"0px", "border-width":"0px"});
 if ( itemDiv8!=undefined ) itemDiv8.destroy();
 if ( chart8.hasOwnProperty("container")) {
 chart8.destroy();
 chart8_0.destroy();
 }
 }
 }

 var itemDiv16;
 if (las_data_CTUK.length>0){
 GRAPH_WIDTH += 50;
 ResetDivWidth();

 $('#chart_16_ctuk').css({"border-width": "1px", "width":"50px"});
 $('#chart_16_ctuk_0').css({"border-width": "1px", "width":"50px"});
 $('#chart_16_ctuk_0').addClass('plotHeader_border');

 track_log_CTUK(chart16, "chart_16_ctuk", logLine_Name_DERIVED);
 track_log_CTUK_0(chart16_0, "chart_16_ctuk_0", logLine_Name_DERIVED);

 createChkbox_Track_Log(itemDiv16, chart_16_ctuk, "Colorlith Th/U - Th/K", "Spectral Gamma Ray");
 } else {
 if ( chart16 != undefined ){
 $('#chart_16_ctuk').css({"width":"0px", "border-width":"0px"});
 $('#chart_16_ctuk_0').css({"width":"0px", "border-width":"0px"});

 if ( itemDiv16!=undefined ) itemDiv16.destroy();
 if ( chart16.hasOwnProperty("container")) {
 chart16.destroy();
 chart16_0.destroy();
 }
 }
 }

 formation_charting();				// formamtion

 $(icProgress).css("visibility", "hidden");
 $('#loadFile').css("visibility", "hidden");

 $('#loadingWindow').jqxWindow('close');
 $('#loadingWindow').jqxWindow({
 showCollapseButton: true,
 showCloseButton: true
 });
 END_TIME = (new Date()).getTime();
 console.log(currentTime() + ". ->Job done.");
 console.log("Total Time: " + (END_TIME-BEGINNING_TIME)/1000 + " \n **********");
 }
 */