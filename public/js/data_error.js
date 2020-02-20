function Print_No_Data_Warning(){
	var a = lasHeader_C;
	var s = '<h4>Logs in ' + FILENAME_LAS + '</h4>';
	s += '<table class="table table-hover table-condensed">';
	s += '<thead><tr><th>Name</th><th>Description</th></tr></thead><tbody>';
	
	for (var i=1; i<a.length; i++) 
		s += '<tr><td><b>' + a[i].Element + '</b></td><td>' + a[i].Description + '</td></tr>';
	s += '</tbody></table>';
	
	var b = LAS_TRACKS;
	var t = '<h4>Logs that can be viewed</h4>';
	t += '<table class="table table-hover table-condensed">';
	t += '<thead><tr><th>Name</th><th>Description</th></tr></thead><tbody>';
	
	for (i=0; i<b.length; i++){
		for (var j=0; j<b[i].Elements.length; j++){
			t += '<tr><td><b>' + (b[i].Elements)[j].Element + '</b></td><td>' + (b[i].Elements)[j].Description + '</td></tr>';
		}
	} 
	t += '</tbody></table>';
	
	$('#errorLoglistCurrent').html(s);
	$('#errorLoglist').html(t);

    $('#modalError').modal('show');
    
    //$("#errorTitle").html("Sorry. No logs in the LAS file, <b><u>" + $("#fileInput")[0].files[0].name + "</u></b>, can be plotted. Only the following logs can be viewed.");
    $("#errorTitle").html("Sorry. No logs in <b><u>" + FILENAME_LAS + "</u></b> can be viewed. Only the following logs can be viewed.");
    
	$("#modalError").on('hide.bs.modal', function(e){
		$("#loadingWindow").css("display","block");
		$("#icProgress").css("visibility", "hidden");
	});
	
	$("#modalError").on('hidden.bs.modal', function(e){
		$("#loadingWindow").css("display","block");
		$("#icProgress").css("visibility", "hidden");
	});
    
}
