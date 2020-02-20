/** 
	~V	- contains version and wrap mode information
	~W	- contains well identification
	~C	- contains curve information
	~P	- contains parameters or constants
	~O	- contains other information such as comments
	~A	- contains ASCII log data
 * 
 * LAS file header components
 */


function lasFile_headerProcess(str) {
	
	var headerSegments = normalizeHeader(str).split("\n~");			// use "\n~" to split the header
	
	lasFile_Header = {};
	logLine_Name = new Array();
	lasHeader_V = new Array();
	lasHeader_W = new Array();
	lasHeader_C = new Array();
	lasHeader_P = new Array();
	lasHeader_O = new Array();
	lasHeader_A = new Array();

	// if the first element has nothing but blankspaces, remove it.
	if ( ( ( headerSegments[0].replace(/\s+/g, " ") ).trim() ).length == 0 )
		headerSegments.shift();

	for (var i = 0; i < headerSegments.length; i++) {
		var t = new Array(), o123 = {}, t2 = new Array(), t3 = new Array(), ss = "", pi = -1, j = 0;
		
		t = headerSegments[i].split("\n");

		// Version segment
		if ( headerSegments[i].charAt(0).toUpperCase()=="V" ){
			for (j = 1; j < t.length; j++) {				// The first line is definitely not the inforamtion part but just the header of the segmennt
				if (t[j].trim().indexOf("#") != 0) {		// if the segment begins with "#", it's comment
					o123 = {};
					t2 = new Array();
					t3 = new Array();
					t2 = t[j].split(": ");
					o123["Description"] = t2[1];			// stuffs after ":" is the description
					
					t3 = (t2[0].trim()).split(".");			// if there is a "." sign and there should be a "." by LAS file standards the stuff before the sign is the name of the curve element;
															// and the stuff after the sign is element unit and data. 
															// To seperat unit and data which are optional, the whitespace(s) should be used. 
	
					ss = "";
					pi = -1;
					if ( t3.length>1 ) {						// "." exists
						o123["Element"] = t3[0].trim();
						o123["Info"] = t3[1];
					} 
					lasHeader_V.push(o123);
				}
			}
		}
		
		// well identification segment
		if ( headerSegments[i].charAt(0).toUpperCase()=="W" ){
			var mTop = -1;
			for (j = 1; j < t.length; j++) {				// The first line is definitely not the inforamtion part but just the header of the segmennt
				
				mTop = (t[j].trim().toUpperCase()).indexOf("#~TOPS");		// those two lines is to identify whether this segment is TOPS or not
				if ( mTop==0 ) break;
				
				if (t[j].trim().indexOf("#") != 0) {		// if the segment begins with "#", it's a comment.
					o123 = {};
					t2 = new Array();
					t3 = new Array();
					t2 = t[j].split(":");
					
					o123["Description"] = (t2[t2.length-1]).trim();			// stuffs after ":" is the description
					
					var t4 = t2[0].trim();
					if ( t2.length>2 ){
						t2.pop();
						t4 = t2.join(": ");
					}
					
					t3 = t4.split(".");			// if there is a "." sign and there should be a "." by LAS file standards the stuff before the sign is the name of the curve element;
												// and the stuff after the sign is element unit and data. 
												// To seperat unit and data which are optional, the whitespace(s) should be used. 
	
					ss = "";
					pi = -1;
					if ( t3.length>1 ) {							// "." exists
						o123["Element"] = t3[0].trim();
						
						var iii = WELL_NUMERICAL.indexOf(o123["Element"]);
						
						if ( iii==-1 ){
							t3.shift();
							
							o123["Unit"] = "";
							o123["Data"] = (t3.join(". ")).trim();
							
							if ( o123["Element"].toLowerCase()=="step" ){
							  DEPTH_STEP = {value: Number(o123["Data"]), unit: "F"};
							}
							/*
							ss = t3[1];
							pi = ss.indexOf(" ");					// identify the position of the first blankspace					
							if ( pi == -1 ){
								o123["Unit"] = ss.trim();
								o123["Data"] = " ";					// the characters after the first whitespace is api
							}
							else if (  pi == 0 ) {					// if there is/are whitespace(s) right before ".", there is no UNIT field 		
								o123["Unit"] = " ";
								o123["Data"] = ( ss.substring(pi+1, ss.length) ).trim();		// the characters after the first whitespace is Data
							}
							else {
								o123["Unit"] = ss.substring(0,pi);
								o123["Data"] = ( ss.substring(pi+1, ss.length) ).trim();		// the characters after the first whitespace is api
							} 
							*/
						} else {
							var jj = t4.substring(t4.indexOf(".")+1,t4.length).split(" ");
							o123["Unit"] = jj[0];
							jj.shift();
							o123["Data"] = (jj.join(" ")).trim();
							
							if ( o123["Element"].toLowerCase()=="step" ){
                DEPTH_STEP = {value: Number(o123["Data"]), unit: o123["Unit"]};
              }
						}
					} 
					else {											// if "." sign does not exist, there is unit specified, any characters after the first whitespace can be counted as api info.
						o123["Unit"] = " ";
						ss = t3[0].trim();
						pi = ss.indexOf(" ");
						
						if ( pi>0 ) { 								// there are some characters in the api section
							o123["Element"] = ss.substring(0,pi);
							o123["Data"] = ( ss.substring(pi+1, ss.length) ).trim();
						}
						else {
							o123["Element"] = ss;
							o123["Data"] = " ";
						}
					}
					
					if ( o123["Element"].toUpperCase()=="NULL" ) LOG_NULL_VALUE = Number((o123["Data"]).trim());
					
					lasHeader_W.push(o123);
				}
			}
			
			if ( mTop==0 ){
				var o123456 = {};
				for (var jj = j+1; jj < t.length; jj++) {
					var tjjj = (t[jj].trim()).replace(/[^a-zA-Z0-9.]/g,' ').split(" ");			// remove strange characters in the line, including tabs
					var dpth = tjjj[tjjj.length-1];
					
					tjjj.pop();								// remove depth information and leaves stone name
					var nm = (tjjj.join(" ")).trim();		// join the rest of the array and remove the leaving and ending spaces
					
					o123456[nm] = Number(dpth);
				}
				lasHeader_W.TOPS = o123456;
			}
		}

		// curve information segment
		if ( headerSegments[i].charAt(0).toUpperCase()=="C" ){
			for (var j = 1; j < t.length; j++) {			// The first line is definitely not the inforamtion part but just the header of the segmennt
				if (t[j].trim().indexOf("#") != 0) {		// if the segment begins with "#", it's comment
					if (t[j-1].trim().indexOf("#") == 0){
						t[j].split(".")[1].trim().charAt(0).toUpperCase()=="F" ? WELL_DEPTH_UNIT = 'ft': WELL_DEPTH_UNIT = 'm';			
					}
				
					o123 = {};
					t2 = new Array();
					t3 = new Array();
					t2 = t[j].split(":");
					o123["Description"] = t2[1].trim();			// stuffs after ":" is the description
					
					t3 = (t2[0].trim()).split(".");		// if there is a "." sign and there should be a "." by LAS file standards the stuff before the sign is the name of the curve element;
															// and the stuff after the sign is element unit and api. 
															// To seperat the unit and the api which is optional, the whitespace(s) should be used. 
	
					ss = "";
					pi = -1;
					var nm = "";
					if ( t3.length>1 ) {						// "." exists
						nm = standardizeCurveName(t3[0].trim());
						o123["Element"] = nm;
						logLine_Name.push(nm);

						ss = t3[1];
						pi = ss.indexOf(" ");					// identify the position of the first blankspace					
						
						if ( pi == -1 ){
							o123["Unit"] = ss.trim();
							o123["Api"] = " ";		// the characters after the first whitespace is api
						}
						else if (  pi == 0 ) {						// if there is/are whitespace(s) right before ".", there is no UNIT field 		
							o123["Unit"] = " ";
							o123["Api"] = ( ss.substring(pi+1, ss.length) ).trim();		// the characters after the first whitespace is Data
						}
						else {
							o123["Unit"] = ss.substring(0,pi);
							o123["Api"] = ( ss.substring(pi+1, ss.length) ).trim();		// the characters after the first whitespace is api
						} 
					} 
					else {										// if "." sign does not exist, there is no UNIT specified, 
																// any characters after the first whitespace can be counted as api info.
						o123["Unit"] = " ";
						ss = t3[0].trim();
						pi = ss.indexOf(" ");
						
						if ( pi>0 ) { 							// there are some characters in the api section
							nm = standardizeCurveName(ss.substring(0,pi)); 
							o123["Element"] = nm;
							
							o123["Api"] = ( ss.substring(pi+1, ss.length) ).trim();
							logLine_Name.push(nm);		// create the log name list
						}
						else {
							o123["Element"] = standardizeCurveName(ss);
							o123["Api"] = " ";

							logLine_Name.push(standardizeCurveName(ss.substring(0,pi)));		// create the log name list
						}
					}
					
					lasHeader_C.push(o123);
				}
			}
		}

		// parameters or constants segment
		if ( headerSegments[i].charAt(0).toUpperCase()=="P" ){
			for (var j = 1; j < t.length; j++) {			// The first line is definitely not the inforamtion part but just the header of the segmennt
				if (t[j].trim().indexOf("#") != 0) {		// if the segment begins with "#", it's comment
					o123 = {};
					t2 = new Array();
					t3 = new Array();
					t2 = t[j].split(":");
					o123["Description"] = t2[1].trim();			// stuffs after ":" is the description
					
					t3 = (t2[0].trim()).split(".");		// if there is a "." sign and there should be a "." by LAS file standards the stuff before the sign is the name of the curve element;
															// and the stuff after the sign is element unit and api. 
															// To seperat the unit and the api which is optional, the whitespace(s) should be used. 
	
					ss = "";
					pi = -1;
					if ( t3.length>1 ) {						// "." exists
						o123["Element"] = t3[0].trim();
						
						ss = t3[1].trim();
						pi = ss.indexOf(" ");				// the characters before the first whitespace is unit		
						o123["Unit"] = ss.substring(0,pi);
						
						o123["Value"] = ( ss.substring(pi+1, ss.length) ).trim();		// the characters after the first whitespace is api
					} 
					else {										// if "." sign does not exist, there is unit specified, any characters after the first whitespace can be counted as api info.
						o123["Unit"] = " ";
						ss = t3[0].trim();
						pi = ss.indexOf(" ");
						
						if ( pi>0 ) { 							// there are some characters in the api section
							o123["Element"] = ss.substring(0,pi);
							o123["Value"] = ( ss.substring(pi+1, ss.length) ).trim();
						}
						else {
							o123["Element"] = ss;
							o123["Value"] = " ";
						}
					}
					
					// This segment is to retrieve information for the calcuation of DPHI, which is based on NPHI.
					(o123["Element"].toUpperCase()=="NPHI")? NPHI_DESCRIPTION = o123["Description"]:"";

					lasHeader_P.push(o123);
				}
			}
		}

		if ( headerSegments[i].charAt(0).toUpperCase()=="T" ){
			var o123456 = {};
			
			for (var j = 1; j < t.length; j++) {				// The first line is definitely not the inforamtion part but just the header of the segmennt
				if (t[j].trim().indexOf("#") != 0) {		// if the segment begins with "#", it's comment
					var tjjj = t[j].trim().split("  ");
					o123456[tjjj[0]] = Number((tjjj[tjjj.length-1]).trim());
					/*for (var jj = j+1; jj < t.length; jj++) {
						var tjjj = t[jj].trim().split("  ");
						o123456[tjjj[0]] = Number((tjjj[tjjj.length-1]).trim());
					}
					*/
					
				}
			}
			lasHeader_W.TOPS = o123456;
		}

		// other information segment
		if ( headerSegments[i].charAt(0).toUpperCase()=="O" ){
			
		}
	}
	
	Is_Las_Plottable();
	idTracks_and_Logs();
	
	// Print out the well inforamtion
	//print_well_info();
	//print_well_top("none");
	
	// Identify tracks and logs from the current loading file
	// The result is recorded in global varible "track_log_current"
}

/*
 * print_well_info
 */
function print_well_info(){
	//$(lblLasViewer).css("display", 'block');
	
	$(las_Well_info).css("display", 'block');
	if ( !$(las_Well_info1).is(':empty') ){
		$(las_Well_info1).empty();
	}

	var strrrr = '<table class="table table-hover table-condensed"><tbody>';
	strrrr += '<thead><tr><th>Mnem<br>(Unit)</th><th>Data</th></tr></thead><tbody>';
	for (var i=0; i<lasHeader_W.length; i++){
		strrrr += '<tr>';
		strrrr += ("<td><b>" + lasHeader_W[i]["Element"] + "." + lasHeader_W[i]["Unit"] + "</b></td>");
		strrrr += ("<td>" + (lasHeader_W[i]["Data"] == ""?"&nbsp;":lasHeader_W[i]["Data"]) + "</td>" ); 
		strrrr += '</tr>';
	}
	strrrr += '</tbody></table>';
	var $wellInfoBody = $("<div style='margin-left:10px; display: block; width: 95%;'>" + strrrr + "</div>");
	
	$('#wellInfoHeader').click(function(){
		$wellInfoBody.toggle();
		switchPlusMinus($wellInfoBody, $('#wellInfoHeader'));
	});
	
	$(las_Well_info1).append($wellInfoBody);
}

function switchPlusMinus(o1, o2){
	if ( o1.css("display")=="block" ){
		o2.removeClass('glyphicon-chevron-right');
		o2.addClass('glyphicon-chevron-down');
	}
	else {
		o2.removeClass('glyphicon-chevron-down');
		o2.addClass('glyphicon-chevron-right');
	}
}


/*
 * Print Well Top information
 */
function print_well_top(divDisplay){
	$(las_Well_top).css("display", 'block');
	if ( !$(las_Well_top1).is(':empty') ) $(las_Well_top1).empty();
	$(wellTopHeader).off("click");
	$("#trackOrders").off("click");

	$(iconNoTopOpen).click(function(){
		$(loadingTopInfo).css("display", 'block');
	});
	
	
	var $wellTopBody;
	if (lasHeader_W.hasOwnProperty("TOPS")){				// if TOPS information exists in the LAS file
		$("#noTops").css("display", 'none');
		$(las_Well_top1).css("display", 'block');
		
		$(wellTopHeader).removeClass('glyphicon-minus');
		$(wellTopHeader).addClass('glyphicon-plus');
		
		i = 0;
		var j = Object.keys(lasHeader_W["TOPS"]).length;
		strrrr = '<table class="table table-hover table-condensed">';
		strrrr += '<thead><tr><th>Name</th><th>Depth (' + WELL_DEPTH_UNIT + ')</th></tr></thead><tbody>'; 
		for (var prop in lasHeader_W["TOPS"]){
			strrrr += '<tr>';
			strrrr += ("<td><b>" + prop + "</b></td>");
			strrrr += ("<td>" + ( lasHeader_W["TOPS"][prop] == ""?"&nbsp;": lasHeader_W["TOPS"][prop] ) + "</td>");
			strrrr += '</tr>';
		}
		
		strrrr += '</tbody></table>';
		
		
		$wellTopBody = $("<div style='margin-left:10px; width: 95%; display: " + divDisplay + "'>" + strrrr + "</div>");
		$(wellTopHeader).click(function(){
			$wellTopBody.toggle();
			
			switchPlusMinus($wellTopBody, $(wellTopHeader));
		});
			
		$(las_Well_top1).append($wellTopBody);
	} else {											// If TOPS information does not exist
		$("#noTops").css("display", 'block');
		
		$(wellTopHeader).removeClass('glyphicon-plus');
		$(wellTopHeader).addClass('glyphicon-minus');
		
		$(wellTopHeader).click(function(){
			$(noTops).toggle();
			
			switchPlusMinus($(noTops), $(wellTopHeader));
		});
		$(las_Well_top).append($wellTopBody);
	}
	
	$(trackOrders).click(function(){
		$(las_track_list1).toggle();
		switchPlusMinus($(las_track_list1), $('#trackOrders'));
	});
	
}


function print_well_curve(){
	$(las_Well_Curve_Info).css("display", 'block');
	if ( !$(las_Well_Curve_Info1).is(':empty') ) $(las_Well_Curve_Info1).empty();
	
	if (lasHeader_C.length>0){				// if TOPS information exists in the LAS file
		var s1 = "float: left; width:35px; height:18px; font-weight: bold; padding-left:5x; ";
		var s2 = "float: left; height:18px; width: 35px; ";
		var s3 = "float: left; height:18px; width: 135px;  white-space: nowrap;";
		
		var strrrr = ""; //"<div style='width:250px'><div style='width:35px'>MNEM</div><div style='width:20px'>Unit</div><div style='width:150px'>Description</div></div>";
		for (var i=0; i<lasHeader_C.length; i++){
			strrrr += ("<div style='width:205px; clear:both'><div style='border-bottom: 1px dashed black; " + s1 + "'>" + lasHeader_C[i]["Element"] + "</div>");
			strrrr += ("<div style='border-bottom: 1px dashed black; " + s2 + "'>" + lasHeader_C[i]["Unit"] + "</div>");
			strrrr += ("<div style='border-bottom: 1px dashed black; " + s3 + "'>" + lasHeader_C[i]["Description"] + "</div></div>");
		}
		var $wellCurveBody = $("<div style='margin-left:10px; display: none'>" + strrrr + "</div>");
		$(curveInfoHeader).click(function(){
			$wellCurveBody.toggle();
		});
			
		$(las_Well_Curve_Info1).append($wellCurveBody);
		$(las_Well_Curve_Info1).css("display", 'block');


	} 
}

function print_well_parameter(){
	
}

/*
 * Set the well top information based on user input
 */
function setWellTop(str){
	var t = str.split("\n");
	var o123456 = {};
	for (var jj = 0; jj < t.length; jj++) {
		var tjjj = t[jj].trim().split(":");
		o123456[tjjj[0]] = Number((tjjj[tjjj.length-1]).trim());
	}
	lasHeader_W.TOPS = o123456;
	
	setFormation();
	formation_charting();
	
	print_well_top("block");
}

/*
 * Generate Well Top Samples for user loading their own TOPs inforamtion
 * The data WELL_TOPS_SAMPLE is defined in las_resources.js.
 */
function generateWellTopSamples(){
	var str = "";
	var	s1 = "width:170px; height:18px; float: left; vertical-align: center; padding-left:5x; ";
	var	s2 = "margin-left:180px; height:18px; width: 70px; vertical-align: center; margin-right:10px;";
	
	for (var i=0; i<WELL_TOPS_SAMPLE.length; i++){
		str += ("<div style='width: 300px; margin:auto; height: 22px;'>")
		str += ("<div style='border-bottom: 1px dashed black; " + s1 + "'>" + WELL_TOPS_SAMPLE[i][0] + ":</div>");
		str += ("<div style='border-bottom: 1px dashed black; " + s2 + "'>" + WELL_TOPS_SAMPLE[i][1] + "</div>");
		str += ("</div>");
	}
	
	if ( !$(wt_sample).is(':empty') ) $(wt_sample).empty();
	var $wellSample = $("<div style='font-size:12px; margin:auto'>" + str + "</div>");
	$(wt_sample).append($wellSample);
}

/*
 * Based on available log information from a file, identify which tracks can be plotted and its logs
 */
function idTracks_and_Logs()
{
	track_log_current	= {};
	var matched = false;
	
	var sgr = 0;
	var gr = 0;
	
	for (var i=1; i<logLine_Name.length; i++){
		matched = false;
		if ( logLine_Name[i].toUpperCase() == "GR")
			gr = i;
		if ( logLine_Name[i].toUpperCase() == "SGR")
			sgr = i;
		
		for (var j=0; j<LAS_TRACKS.length; j++){
			for (var k=0; k<LAS_TRACKS[j]["Elements"].length; k++){
				if (LAS_TRACKS[j]["Elements"][k]["Element"] == logLine_Name[i]){
					matched = true;
					if (track_log_current.hasOwnProperty(LAS_TRACKS[j]["Track"]))
						track_log_current[LAS_TRACKS[j]["Track"]].push(i);
					else {
						track_log_current[LAS_TRACKS[j]["Track"]] = new Array();
						track_log_current[LAS_TRACKS[j]["Track"]].push(i);
					}
				} else {
					matched = false;
				}
				if (matched) break;
			}
			if (matched) break;				
		}
		/*
		if (!matched) {				// if a curve has not predefined and without track assignment, it will be added to a standalone curve
			track_log_current[logLine_Name[i]] = (i+" ");
		}
		*/
	}
	
	index_LithoGR = (gr!=0)?gr:sgr;								// If only one of the aboves shows up, use that one
																// If both GR and SGR shows up, use GR
}

/*
 * 
 */
function lasfile_headerPrint() {
	var htmlStr = "";
	var w = {}, i = 0; key ="";

	for (i=0; i<lasHeader_W.length; i++) {
		if ( lasHeader_W[i]["Element"].toUpperCase().indexOf("API")>-1 )
			w.API = lasHeader_W[i]["Data"];
		if ( lasHeader_W[i]["Element"].toUpperCase() == "WELL" )
			w.Name = lasHeader_W[i]["Data"];
	}
	for (i=0; i<lasHeader_P.length; i++) {
		if ( lasHeader_P[i]["Element"].toUpperCase() == "EKB" )
			w.Elevation = lasHeader_P[i]["Value"];
	}
	
	htmlStr = "Well Name: <b>" + w.Name + "</b>";
	htmlStr += "<br>&nbsp;&nbsp;&nbsp;&nbsp;<font size='2'>Well Number: <b>" + w.API + "</b>";
	if (w.hasOwnProperty("Elevation"))
		htmlStr += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Elevation: <b>" + w.Elevation + "</b></font>"

	//lasViewer_title.innerHTML = htmlStr;
}

/*
 * Normalize Header: including remove leading spaces of every line; remove the empty lines
 */
function normalizeHeader(str)
{
	var t = str.split("\n")
	var str2 = "\n";
	
	for (var i=0; i<t.length; i++){
		if ( t[i].length>0 && (t[i].trim()).length >0 ){
			if ( i==t.length-1)
				str2 += t[i].trim();
			else
				str2 += (t[i].trim()+"\n");
		}
	}
	
	return str2;
}

/*
 * 
 */
function standardizeCurveName(name){
	var key = "";
	var match = false;
	for(key in CURVE_DICTIONARY){
		if (CURVE_DICTIONARY[key].indexOf(name)>-1){
			match = true;
			break;
		}
	}
	return match? key : name;
}

/*
 * Check whether the las plotable or not
 */
function Is_Las_Plottable()
{
	//first, loop through the current curves
	for(var i=0; i<lasHeader_C.length; i++){
		// loop through the tracks that can be plotted
		for(var j=0; j<LAS_TRACKS.length; j++){
			//loop through the elements/curves of a track
			for (var k=0; k<LAS_TRACKS[j].Elements.length; k++){
				if (lasHeader_C[i].Element.toUpperCase() == LAS_TRACKS[j].Elements[k].Element.toUpperCase())
				{
					NO_CURVE_TO_PLOT = false;
					break;
				}
			}
			if (!NO_CURVE_TO_PLOT) break;
		}
		if (!NO_CURVE_TO_PLOT) break;
	}
}
