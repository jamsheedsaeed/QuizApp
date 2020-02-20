/*
 * Process data for the Lithology Gamma Ray track
 */

var datacontent = "";

function processLasfile2(str) {
  datacontent = str;

  console.log(currentTime() + ". Begins ->Reading raw data ...");
  //alert(str);

  // The position where the real data starts, including the field name
  var posDataSegement = str.indexOf("~A");

  var dataStr = str.substring(posDataSegement + 2, str.length);

  // The first row of the raw data is the field name row
  var i = dataStr.indexOf("\n");

  var headerStr = str.substring(0, posDataSegement - 1);
  
  // populate EXCEL_FIELDS
  idLogNames(headerStr);
  
  // To populate EXCEL_logLine_Name after remove the non-numeric fields
  // function defined in las_excel.js.
  // EXCEL_NUMERIC_FLDS is also populated in this function
  IdentifyNumericFields();
  
  $("#sheet_name").find("option").remove().end();
  $("#sheet_name").append('<option value="">--LAS file has no sheet to specify --</option>');
  
  $("#fldNameStep").find("option").remove().end();
  $("#fldNameStep").append('<option value="">--STEP of LAS file is detected as ' + DEPTH_STEP_EXCEL.value + ' (' + DEPTH_STEP_EXCEL.unit + ') --</option>');
  $("#divStepFld").css("display", "block");
  
  $("#fldNameDepth").find("option").remove().end();
  $("#fldNameDepth").append('<option value="">--DEPTH of LAS file is the first column. --</option>');
  $("#divDepthFld").css("display", "block");
  
  $("#sheet_fields").empty();
            
  $("#ExcelUpdate1").css("visibility", "visible");
  $("#excelFieldList").css("display", "block");

  var sf = '<table class="table table-striped table-condensed" style="width:400px; text-align: center;"><thead><tr><th>Field Name</th></tr><thead><tbody>';

  for (var i = 0; i < EXCEL_FIELDS.length; i++) {
    if (EXCEL_NUMERIC_FLDS[i] && EXCEL_FIELDS[i]!=this.value && EXCEL_FIELDS[i]!=$("#fldNameStep").val()) {
      sf += ('<tr><td style="text-align: left; padding:3px;">' + EXCEL_FIELDS[i] + '</td></tr>');
    }
  }
  sf += ('</tbody></table>');
  $("#sheet_fields").html(sf);
          
  $(loadingWindow).jqxWindow('close');
  $("#modalExcel").modal('show');

  EXCEL_TEMP_ARRAY.length = 0;
  var data = dataStr.split("\n");
  for (i=1; i<data.length; i++){
    var strrr = data[i].replace(/\s+/g, " ").trim();
    var attr = strrr.split(" ");
    var o = {};
    
    // make sure the data line has the amount of attributes as the amount of fields in EXCEL_FIELDS
    if ( attr.length == EXCEL_FIELDS.length ){
      for (var j=0; j<attr.length; j++){
        o[EXCEL_FIELDS[j]] = Number(attr[j]);
      }
      
      EXCEL_TEMP_ARRAY.push(o);
    }
  }
  
  var newStep = 0;
  // Compare the Step value from the new dataset with the existing dataset
  // Scenario 1. if the new step is smaller than the existing one. Interpolation will be used.
  if ( DEPTH_STEP_EXCEL.value<=DEPTH_STEP.value ){
    newStep = DEPTH_STEP_EXCEL.value;
    dataInterpolate();
  }
          
  // Scenario 2. if the new step is larger than the existing one. Resampling will be used.
  if ( DEPTH_STEP_EXCEL.value>DEPTH_STEP.value ){
    newStep = DEPTH_STEP.value;
  } 
  // end of Compare STEP
  
  //ProcessExcelArray(EXCEL_TEMP_ARRAY, newStep);
  console.log("Second Las file loaded successsfully.");
}

function idLogNames(headers){
  var temp = headers.split("\n~W");
  var t = temp[1].split("\n");

  // well identification segment
  var mTop = -1;
  for (j = 1; j < t.length; j++) {        // The first line is definitely not the inforamtion part but just the header of the segmennt
    mTop = (t[j].trim().toUpperCase()).indexOf("#~TOPS");   // those two lines is to identify whether this segment is TOPS or not
    if ( mTop==0 ) break;
        
    if (t[j].trim().indexOf("#") != 0) {    // if the segment begins with "#", it's a comment.
      var o123 = {};
      t2 = new Array();
      t3 = new Array();
      t2 = t[j].split(":");
          
      var t4 = t2[0].trim();
      if ( t2.length>2 ){
        t2.pop();
        t4 = t2.join(": ");
      }
          
      t3 = t4.split(".");     // if there is a "." sign and there should be a "." by LAS file standards the stuff before the sign is the name of the curve element;
                        // and the stuff after the sign is element unit and data. 
                        // To seperat unit and data which are optional, the whitespace(s) should be used. 
  
      ss = "";
      pi = -1;
      if ( t3.length>1 ) {              // "." exists
        o123["Element"] = t3[0].trim();
         
        var iii = WELL_NUMERICAL.indexOf(o123["Element"]);
            
        if ( iii==-1 ){
          t3.shift();
              
          o123["Unit"] = "";
          o123["Data"] = (t3.join(". ")).trim();
              
          if ( o123["Element"].toLowerCase()=="step" ){
            DEPTH_STEP_EXCEL = {value: Number(o123["Data"]), unit: "F"};
          }
        } else {
          var jj = t4.substring(t4.indexOf(".")+1,t4.length).split(" ");
          o123["Unit"] = jj[0];
          jj.shift();
          o123["Data"] = (jj.join(" ")).trim();
             
          if ( o123["Element"].toLowerCase()=="step" ){
            DEPTH_STEP_EXCEL = {value: Number(o123["Data"]), unit: o123["Unit"]};
          }
        }
      } 
    }
  }
    
  
  temp = headers.split("\n~C");
  t = temp[1].split("\n");
  
  EXCEL_FIELDS = new Array();
  
  EXCEL_DEPTH_FLD = "DEPT";
  
  // The first line is definitely not the inforamtion part but just the header of the segmennt
  for (var j = 1; j < t.length; j++) {
    
    // if the segment begins with "#", it's comment
    if (t[j].trim().indexOf("#") != 0) {    
      if (t[j-1].trim().indexOf("#") == 0){
        t[j].split(".")[1].trim().charAt(0).toUpperCase()=="F" ? WELL_DEPTH_UNIT = 'ft': WELL_DEPTH_UNIT = 'm';     
      }
        
      o123 = {};
      t2 = new Array();
      t2 = t[j].split(".");             // If there is a "." sign (and there should be a "." by LAS file standards),  
                                        //    the texts before the sign is the name of the curve element,
                                        //        and the texts after the sign is element unit and api.
                                        // 
                                        // To seperat the unit and the api which is optional, the whitespace(s) should be used. 
  
      ss = "";
      pi = -1;
      var nm = "";
      if ( t2.length>0 ) {            // "." exists
        nm = standardizeCurveName(t2[0].trim());
        EXCEL_FIELDS.push(nm);
      } 
    }
  }
  
}
