var oldValue = new Array();
var oldTrack_log = Object.create(track_log_new);
var oldTrack_log1 = $.extend(true, {}, track_log_new);

function Print_Unploted_Log_List(){
	track_log_new = track_log_current;
	var a = lasHeader_C;
	var b = track_log_current;
	var s = '<div style="line-height: 35px;height: 35px;font-size: 14px; font-style: italic; color:#A6A53B; background-color: rgb(243, 247, 232)">File name: ' + FILENAME_LAS + '</div>';
	s += '<table class="table table-hover table-condensed">';
	//s += '<thead><tr><th width="75">Name</th><th width="250">Description</th><th width="235">Track List<span id="helpTrackList" class="glyphicon glyphicon-cog active-tooltip" style="margin-left: 20px" data-toggle="tooltip" data-placement="left" title="Tooltip on left"></span></th><th width="210">Configuration <span id="helpConfig" class="glyphicon glyphicon-cog" style="margin-left: 20px"></th></tr></thead><tbody>';
	s += '<thead><tr><th width="100">Name</th><th width="225">Description</th><th width="250">Tracks<span id="helpTrackList" class="glyphicon glyphicon-wrench" style="margin-left: 20px; " data-toggle="popover" data-placement="bottom" data-content="A track can hold up to 5 logs. "></span></th>' + 
	     '<th width="195">Scale Range<span id="helpConfig" class="glyphicon glyphicon-wrench" style="margin-left: 20px;" data-toggle="popover" data-placement="bottom" data-content="The min and max values in the boxes are based on the value of the corresponding log in the LAS file."></th></tr></thead><tbody>';
	
	var Aht_or_Dual = "";
	if (b.hasOwnProperty("AHT Resistivity")) 
		Aht_or_Dual = "AHT Resistivity";
	else
		Aht_or_Dual = "Dual Induction";
	
	var ploted=false;
	var trackName = "";
	
	var excel_fields = a.length - EXCEL_PLOT_INDEX.length;
	
	for (var i=1; i<a.length; i++)					// the first element in the data segment is depth.
	{
		if (i == excel_fields) {
			s += '<tr style="background-color: rgb(243, 247, 232);"><td colspan="4"><span style="font-size: 14px; font-style: italic; color:#A6A53B;">File name: ' + FILENAME_EXCEL + '</span></td></tr>';
		}
		
		ploted = false;
		for (var key in b){
			if ( b[key].indexOf(i)>-1 ){
				ploted = true;
				trackName = key;
				break;
			}	
		}
		
		var d;
		if (!ploted){
			d = '<select id="dd_list_' + i + '"  class="form-control myDropDown" style="font-size: 12px">'+
	  			'<option value="0*' + i + '"  selected>Select a Track</option>' +
	  			'<option value="' + TRACK_NAME.Reference + '*' + i + '">' + TRACK_NAME.Reference + '</option>' +
	  			'<option value="' + TRACK_NAME.DualInduction + '*' + i + '">' + TRACK_NAME.DualInduction + '</option>' +
				'<option value="' + TRACK_NAME.LithoDensity + '*' + i + '">' + TRACK_NAME.LithoDensity + '</option>' +
				'<option value="' + TRACK_NAME.SpectralGR + '*' + i + '">' + TRACK_NAME.SpectralGR + '</option>' +
				'<option value="' + TRACK_NAME.Custom1 + '*' + i + '">' + TRACK_NAME.Custom1 + '</option>' +
				'</select>';
			oldValue[i] = 0;
		}
		else
		{
			if (trackName == TRACK_NAME.Reference){
				d = '<select id="dd_list_' + i + '"  class="form-control myDropDown" style="font-size: 12px">'+
		  			'<option value="0*' + i + '">Select a Track</option>' +
	  				'<option value="' + TRACK_NAME.Reference + '*' + i + '" selected>' + TRACK_NAME.Reference + '</option>' +
		  			'<option value="' + TRACK_NAME.DualInduction + '*' + i + '">' + TRACK_NAME.DualInduction + '</option>' +
					'<option value="' + TRACK_NAME.LithoDensity + '*' + i + '">' + TRACK_NAME.LithoDensity + '</option>' +
					'<option value="' + TRACK_NAME.SpectralGR + '*' + i + '">' + TRACK_NAME.SpectralGR + '</option>' +
					'<option value="' + TRACK_NAME.Custom1 + '*' + i + '">' + TRACK_NAME.Custom1 + '</option>' +
					'</select>';
				oldValue[i] = 1
			}
			if (trackName == TRACK_NAME.DualInduction ){
				d = '<select id="dd_list_' + i + '"  class="form-control myDropDown" style="font-size: 12px">'+
		  			'<option value="0*' + i + '">Select a Track</option>' +
		  			'<option value="' + TRACK_NAME.Reference + '*' + i + '">' + TRACK_NAME.Reference + '</option>' +
		  			'<option value="' + TRACK_NAME.DualInduction + '*' + i + '" selected>' + TRACK_NAME.DualInduction + '</option>' +
					'<option value="' + TRACK_NAME.LithoDensity + '*' + i + '">' + TRACK_NAME.LithoDensity + '</option>' +
					'<option value="' + TRACK_NAME.SpectralGR + '*' + i + '">' + TRACK_NAME.SpectralGR + '</option>' +
					'<option value="' + TRACK_NAME.Custom1 + '*' + i + '">' + TRACK_NAME.Custom1 + '</option>' +
					'</select>';
				oldValue[i] = 2;
			}
			if (trackName == TRACK_NAME.LithoDensity){
				d = '<select id="dd_list_' + i + '"  class="form-control myDropDown" style="font-size: 12px">'+
		  			'<option value="0*' + i + '">Select a Track</option>' +
		  			'<option value="' + TRACK_NAME.Reference + '*' + i + '">' + TRACK_NAME.Reference + '</option>' +
		  			'<option value="' + TRACK_NAME.DualInduction + '*' + i + '">' + TRACK_NAME.DualInduction + '</option>' +
					'<option value="' + TRACK_NAME.LithoDensity + '*' + i + '" selected>' + TRACK_NAME.LithoDensity + '</option>' +
					'<option value="' + TRACK_NAME.SpectralGR + '*' + i + '">' + TRACK_NAME.SpectralGR + '</option>' +
					'<option value="' + TRACK_NAME.Custom1 + '*' + i + '">' + TRACK_NAME.Custom1 + '</option>' +
					'</select>';
				oldValue[i] = 3;
			}
			if (trackName == TRACK_NAME.SpectralGR){
				d = '<select id="dd_list_' + i + '"  class="form-control myDropDown" style="font-size: 12px">'+
		  			'<option value="0*' + i + '">Select a Track</option>' +
		  			'<option value="' + TRACK_NAME.Reference + '*' + i + '">' + TRACK_NAME.Reference + '</option>' +
		  			'<option value="' + TRACK_NAME.DualInduction + '*' + i + '">' + TRACK_NAME.DualInduction + '</option>' +
					'<option value="' + TRACK_NAME.LithoDensity + '*' + i + '">' + TRACK_NAME.LithoDensity + '</option>' +
					'<option value="' + TRACK_NAME.SpectralGR + '*' + i + '" selected>' + TRACK_NAME.SpectralGR + '</option>' +
					'<option value="' + TRACK_NAME.Custom1 + '*' + i + '">' + TRACK_NAME.Custom1 + '</option>' +
					'</select>';
				oldValue[i] = 4;
			}
			if (trackName == TRACK_NAME.Custom1){
				d = '<select id="dd_list_' + i + '"  class="form-control myDropDown" style="font-size: 12px">'+
		  			'<option value="0*' + i + '">Select a Track</option>' +
		  			'<option value="' + TRACK_NAME.Reference + '*' + i + '">' + TRACK_NAME.Reference + '</option>' +
		  			'<option value="' + TRACK_NAME.DualInduction + '*' + i + '">' + TRACK_NAME.DualInduction + '</option>' +
					'<option value="' + TRACK_NAME.LithoDensity + '*' + i + '">' + TRACK_NAME.LithoDensity + '</option>' +
					'<option value="' + TRACK_NAME.SpectralGR + '*' + i + '">' + TRACK_NAME.SpectralGR + '</option>' +
					'<option value="' + TRACK_NAME.Custom1 + '*' + i + '" selected>' + TRACK_NAME.Custom1 + '</option>' +
					'</select>';
				oldValue[i] = 5;
			}
		}
		s += '<tr><td><b>' + a[i].Element + '</b></td><td>' + a[i].Description + '</td><td>' + d;
		
		s += '<span id="warning_' + i + '"  class="alert alert-warning" style="display:none; padding:5px; margin-bottom:2px; vertical-align:top; align:right;">Warning: the selected track reaches max. of 5 logs and the selection is reverted.</span>';
		s += '</td>';
		
		if (!ploted){
			s += '<td><input type="checkbox" id="ckbx_' + i + '" disabled>Set Left/Right';
		}
		else{
			s += '<td><input type="checkbox" id="ckbx_' + i + '">Set Left/Right';
		}
		
		s += ( ('<form class="form-inline" role="form" id="span_' + i + '" style="display:none; width:175px">') +
				('<i>Current left/right: (' + MIN_MAX_LOG_CURRENT[i][0] + ',' + MIN_MAX_LOG_CURRENT[i][1] + ')</i>') + 
				('<div class="form-group">') + 
				('<label for="txtmin_' + i + '">Left:</label>') +
	   			('<input type="text" size="5" class="form-control minmaxInput" id="txtmin_' + i + '" placeholder="' + MIN_MAX_LOG[i][0] + '" style="font-size:12px; padding:1px 1px; width:55px; height:20px;">') + 
				('</div><div class="form-group">')+
	   			('<label for="txtmin_' + i + '">Right:</label>') +
	   			('<input type="text" size="5" class="form-control minmaxInput" id="txtmax_' + i + '" placeholder="' + MIN_MAX_LOG[i][1] + '" style="font-size:12px; padding:1px 1px; width:55px; height:20px;">') + 
				('</div></form></td></tr>'));
		
		s += ('<tr id="warning_row_' + i + '" style="display:none"></tr>');
	}

	ploted = false;
	trackName = "";

	s += '</tbody></table>';
	$('#unLogList').html(s);

	//for (var i=1; i<(a.length+EXCEL_PLOT_INDEX.length); i++) {
	for (var i=1; i<a.length; i++) {
		$('#ckbx_' + i).on('change', function(e){
			var logindex = ((this.id).split("_"))[1];
			
			if ($(this).is(':checked')) {
				$('#span_' + logindex).css('display', 'block');
			}
			else
			{
				$('#span_' + logindex).css('display', 'none');
			}
		});
				
		$('#dd_list_'+ i).on('change', function(e) {
			var sjfs = (this.value).split("*")
			var tkName = sjfs[0];
			var logIndex = sjfs[1];

			if (tkName == "0"){									// if a log has no track selected, do two things: (1) disable its options on setting min/max
																//			(2) check its previous track is empty or not: 
																//			(2.1) if that track is empty, remove the track from the track_log_new variable 
																
				$('#ckbx_' +logIndex).attr("disabled", true);   /* option 1 is done*/
				
				RemoveEmptyTrack( parseInt(logIndex) );								// function defined at the end of this file
				
			} else {
				$('#ckbx_' +logIndex).removeAttr('disabled');
				
				//if ( track_log_new.hasOwnProperty(tkName) && $('#ckbx_' +logIndex).attr("disabled") == "disabled"){}
				
				if  ( !track_log_new.hasOwnProperty(tkName) ){
					track_log_new[tkName] = [];					
				}
			}
			
			if (track_log_new.hasOwnProperty(tkName)) {						// If the track has log(s)
				if (track_log_new[tkName].length >= CURVE_PER_TRACK){
					//alert('The ' + tkName + ' track cannot have more than five logs.\nYour choice has been reverted back.');
					
					var logindex = ((this.id).split("_"))[2];
					$('#warning_'+ logIndex).css('display','block');
					
					$(this).prop("selectedIndex", oldValue[logindex]);
					if ($(this).prop("selectedIndex") == 0) 
						$('#ckbx_' +logIndex).attr("disabled", true);
					
					setTimeout(function(){
						$('#warning_'+ logIndex).css('display','none');
					}, 5000);
						
					return false;					
				}
				else {
					// next step is to remove the log from the previous log
					removeElement(logIndex);
					track_log_new[tkName].push(Number(logIndex));
				}
			}
			else {															// If the track has no logs
				if ( tkName != "0"){					// The log has tracks assigned
					removeElement(logIndex);
					track_log_new[tkName] = new Array();
					
					track_log_new[tkName].push(Number(logIndex));
				}
			}
		});
	}
    
    $('#modalExcel').modal('hide');
    $('#modalLogList').modal('show');
    $("#modalLogList").draggable({
    	handle: ".modal-header"
	});
    
    $('#modalLogList').on('shown.bs.modal', function(e){
    	$('[data-toggle="popover"]').popover({
    		trigger:'hover focus'
    	});	
    });
    
    //$("#errorTitle").html("Sorry. No logs in the LAS file, <b><u>" + $("#fileInput")[0].files[0].name + "</u></b>, can be plotted. Only the following logs can be viewed.");
    $("#errorTitle").html("Sorry. No logs in <b><u>" + FILENAME_LAS + "</u></b> can be viewed. Only the following logs can be viewed.");
}

// remove tracks that is empty
function RemoveEmptyTrack(oldLogIndex){
	var i=0;
	
	if (track_log_new.hasOwnProperty(TRACK_NAME.Reference)){
		i = track_log_new[TRACK_NAME.Reference].indexOf(oldLogIndex);
		if (i!=-1) 	track_log_new[TRACK_NAME.Reference].splice(i,1);
		
		if (track_log_new[TRACK_NAME.Reference].length == 0) delete track_log_new[TRACK_NAME.Reference];
	}
	if (track_log_new.hasOwnProperty(TRACK_NAME.DualInduction)){
		i = track_log_new[TRACK_NAME.DualInduction].indexOf(oldLogIndex);
		if (i!=-1) 	track_log_new[TRACK_NAME.DualInduction].splice(i,1);

		if (track_log_new[TRACK_NAME.DualInduction].length == 0) delete track_log_new[TRACK_NAME.DualInduction];
	}
	if (track_log_new.hasOwnProperty(TRACK_NAME.LithoDensity)){
		i = track_log_new[TRACK_NAME.LithoDensity].indexOf(oldLogIndex);
		if (i!=-1) 	track_log_new[TRACK_NAME.LithoDensity].splice(i,1);

		if (track_log_new[TRACK_NAME.LithoDensity].length == 0) delete track_log_new[TRACK_NAME.LithoDensity];
	}
	if (track_log_new.hasOwnProperty(TRACK_NAME.SpectralGR)){
		i = track_log_new[TRACK_NAME.SpectralGR].indexOf(oldLogIndex);
		if (i!=-1) 	track_log_new[TRACK_NAME.SpectralGR].splice(i,1);

		if (track_log_new[TRACK_NAME.SpectralGR].length == 0) delete track_log_new[TRACK_NAME.SpectralGR];
	}
	if (track_log_new.hasOwnProperty(TRACK_NAME.Custom1)){
		i = track_log_new[TRACK_NAME.Custom1].indexOf(oldLogIndex);
		if (i!=-1) 	track_log_new[TRACK_NAME.Custom1].splice(i,1);

		if (track_log_new[TRACK_NAME.Custom1].length == 0) delete track_log_new[TRACK_NAME.Custom1];
	}
}

function removeElement(idx){
	var i = 0;
	var matched = false;
	for (var key in track_log_new){
		i = track_log_new[key].indexOf(Number(idx));
		
		if (i>-1) {
			matched = true;
			break;
		}
	}
	
	if (matched) track_log_new[key].splice(i,1);
}

function isNumberKey(evt)
{
	var charCode = (evt.which) ? evt.which : event.keyCode
	if (charCode > 31 && (charCode < 48 || charCode > 57))
		return false;

	return true;
}
