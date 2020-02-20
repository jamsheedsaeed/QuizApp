$(function() {
  var controllingChart;

  var defaultTickInterval = 10;
  var currentTickInterval = defaultTickInterval;

  $(document).ready(function() {
    //initialInterface();
    $('[data-toggle="popover"]').popover({
      trigger : 'hover focus',
      html : true
    });

    $('#btnResetZoom').css("display", "none");
    $('#btnResetZoom').click(function() {
      $('#btnResetZoom').css("display", "none");

      $('#busyModal').modal('show');
      setTimeout(function() {
        synZoom(null, null, 'none');
      }, 1000);
    });

    $("#aboutModal").draggable({
      handle : ".modal-header"
    });
    $("#helpDialog").draggable({
      handle : ".modal-header"
    });

    $('#iconOpenLogList').click(function() {
      Print_Unploted_Log_List();
      // in las_list.js

      //$('#modalLogList').modal('show');
    });

    $('#iconScatterPlot').click(function() {
      $('#modalScatterplot').modal('show');
      
      // populate two dropdown lists
      $("#scatterPlotX").find("option").remove().end();
      $("#scatterPlotY").find("option").remove().end();
  
      var options = "";
      for (var i=0; i<logLine_Name.length; i++){
        options += ('<option value=' + i + '>' + logLine_Name[i] + '</option>');
      }
      $("#scatterPlotX").append(options);
      $("#scatterPlotY").append(options);
    });
    
    $("#btnScatterPlot").click(function(e){
      var x = $("#scatterPlotX").val(),
          y = $("#scatterPlotY").val();
      
      $("#infoScatterPlot").css("display", "none");
      
      /*
      if ( x==y ){
        $("#infoScatterPlot").css("display", "block");
        
        return;
      }
      */
      
      // identify the length of one element.
      var l = las_data_processed[x].length;
      var data1 = [];
      for ( var k=0; k<l; k++ ){
        
        if ( las_data_processed[x][k] || las_data_processed[y][k]){
          var o = [];
          o.push(las_data_processed[x][k]);
          o.push(las_data_processed[y][k]);
          
          data1.push(o);
        }
      }

      if (chartScatter != undefined) {
        if (chartScatter.hasOwnProperty("container")) {
          chartScatter.destroy();
        }
      } 

      chartScatter = new Highcharts.Chart({
        chart: {
          renderTo: 'scatterPlotChart', 
          type: 'scatter',
          marginTop : 15,
          zoomType: 'xy',
          isZoomed : true,
          inverted : false,
          resetZoomButton : {
            position : {
              x : 0,
              y : 0
            },
            theme : {
              display: 'block',
              style : {
                fontSize:  '14px',
                fontWeight: 'bold'
              }
            },
            relativeTo: 'plot'
          }
        },
        title: {
          style : {
            padding: '0px',
            fontSize : '14px'
          },
          text: 'Scatter Plot of ' + logLine_Name[x] + " Versus " + logLine_Name[y]
        },
        xAxis: {
          title: {
            enabled: true,
            text: logLine_Name[x]
          },
          startOnTick: true,
          endOnTick: true,
          showLastLabel: true
        },
        yAxis: {
          title: {
            text: logLine_Name[y]
          }
        },
        exporting : {
          enabled : true
        },
        tooltip : {
          animation : false,
          shared : false,
          enabled : true,
          useHTML : true,
          style : {
            padding : '5px',
            fontSize : '12px',
          },
          formatter : function() {
            var a = logLine_Name[x] + ": <b>" + this.x + '</b><br />';
            a += (logLine_Name[y] + ": <b>" + this.y + '<b>');
            return a;
          }
        },
        plotOptions: {
          scatter: {
            marker: {
              radius: 5,
              states: {
                hover: {
                  enabled: true,
                  lineColor: 'rgb(100,100,100)'
                }
              }
            },
            states: {
              hover: {
                marker: {
                  enabled: false
                }
              }
            },
          }
        },
        series: [{
          color: 'rgba(119, 152, 191, .5)',
          data: data1
        }]
      });
    });

    $(icProgress).css("visibility", "hidden");

    // disable two buttons when load window is on
    $("#iconOpen").prop("disabled", true);
    $("#iconOpenLogList").prop("disabled", true);
    $("#iconScatterPlot").prop("disabled", true);
    
    $("#btnTrackNameNew").click(function(e){
      console.log($("#txtTrackNameNew").val());
      
      if ( $(".trackReference").css("display")=="block" ){
        chart2_0.setTitle({text: $("#txtTrackNameNew").val()});
      }
      if ( $(".trackDualInduction").css("display")=="block" ){
        chart3_0.setTitle({text: $("#txtTrackNameNew").val()});
      }
      if ( $(".trackLithoDensity").css("display")=="block" ){
        chart4_0.setTitle({text: $("#txtTrackNameNew").val()});
      }
      if ( $(".trackSpectralGammaRay").css("display")=="block" ){
        chart7_0.setTitle({text: $("#txtTrackNameNew").val()});
      }
      if ( $(".trackSpectralGR_Ratio").css("display")=="block" ){
        chart8_0.setTitle({text: $("#txtTrackNameNew").val()});
      }
      if ( $(".trackCustom1").css("display")=="block" ){
        chart9_0.setTitle({text: $("#txtTrackNameNew").val()});
      }
      if ( $(".trackCTUK").css("display")=="block" ){
        //chart16_0.setTitle({text: $("#txtTrackNameNew").val()});
        chart16_0.yAxis[0].update({title: {text: $("#txtTrackNameNew").val()}});
      }
      if ( $(".trackFormation").css("display")=="block" ){
        chart18_0.setTitle({text: $("#txtTrackNameNew").val()});
      }

    });

    $("#dataSourceLocal").on("click", function(e) {
      $("#icProgress").css("visibility", "hidden");
      
      if ($('#dataSourceLocal').prop('checked')) {
        $("#divLocalSource").css("display", "block");
        $("#divRemoteSource").css("display", "none");
      } else {
        $("#divLocalSource").css("display", "none");
        //$("#divRemoteSource").css("display", "");
      }
    });

    $("#dataSourceRemote").on("click", function(e) {
      $("#icProgress").css("visibility", "hidden");
      
      if ($('#dataSourceRemote').prop('checked')) {
        $("#divRemoteSource").css("display", "block");
        $("#divLocalSource").css("display", "none");
      } else {
        $("#divRemoteSource").css("display", "none");
      }
    });

    $(iconOpen).click(function() {
      // by default, the app is not going to plot EXCEL file only
      // PLOT_EXCEL_ONLY is true only when users specify it.
      PLOT_EXCEL_ONLY = false;
      
      $("#fileInput").prop("disabled", false);
      // enable fileinput button
      $("#canelFile").prop("disabled", false);
      // enable cancelfile button

      $(loadingWindow).css("display", "block");
      $("#iconOpen").prop("disabled", true);
      $("#iconOpenLogList").prop("disabled", true);
      $("#iconScatterPlot").prop("disabled", true);
    });

    $("#canelFile").click(function() {
      $(loadingWindow).jqxWindow('close');
    });

    $(loadingWindow).on("close", function() {
      $("#iconOpen").prop("disabled", false);
      if (FIRSTTIME){
        $("#iconOpenLogList").prop("disabled", true);
        $("#iconScatterPlot").prop("disabled", true);
      }
      else{
        $("#iconOpenLogList").prop("disabled", false);
        $("#iconScatterPlot").prop("disabled", false);
      }
    }); 

    $("#btnDataDownload").on("click", function(e) {
      var blob = new Blob([datacontent], {
        type : "text/plain;charset=utf-8"
      });

      saveAs(blob, FILENAME_LAS);
    });

    createPopWindow();
    // This function is in untils.js

    window.onresize = function() {
      initialInterface();
    };

    window.onload = function() {
      /*
       * This segment retrieve client ip
       */

      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "http://www.telize.com/jsonip?callback=DisplayIP";
      document.getElementsByTagName("head")[0].appendChild(script);

      // end
      /*
       $.ajax({
       type: "GET",
       url: "http://www.telize.com/jsonip",
       contentType: "application/json; charset=utf-8",
       dataType: "json",
       success: DisplayIP,
       failure: alert("askdfjsakd")
       })
       */
      var sUrlLas = location.search.substr(location.search.indexOf("?") + 1).split("=");
      if (sUrlLas.length == 2) {
        var url = sUrlLas[1];

        urlValidate(url);
      }

      $("#loadFileRemote").on("click", function() {
        var url = $("#txtRemoteFileUrl").val();
        urlValidate(url);
      });

      function urlValidate(surl) {
        var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        if (pattern.test(surl)) {
          var ft = surl.substring(surl.lastIndexOf(".") + 1, surl.length);
          
          if (ft.toUpperCase() == "LAS"){
            $("#icProgress").css("visibility", "hidden");
            
            FILENAME_LAS = surl.substring(surl.lastIndexOf("/") + 1, surl.length);
            
            readRemoteData(surl);
          } else {
            $("#icProgress").css("visibility", "visible");
            $("#txtProcess").text("Invalid LAS file.");
            return false;
          }
          
        } else {
          $("#icProgress").css("visibility", "visible");
          $("#txtProcess").text("Invalid URL.");
          return false;
        }
      }

      function readRemoteData(sUrl) {

        BEGINNING_TIME = (new Date()).getTime();

        DATASOURCE_TYPE = "online";
        NO_CURVE_TO_PLOT = true;
        
        var ft = sUrl.substring(sUrl.lastIndexOf(".") + 1, sUrl.length);
        
        if (ft.toUpperCase() == "LAS") {
          $("#btnResetZoom").css("visibility", "hiden");
          console.log("Reading remote file." + currentTime());
          $('#uploadFile').removeClass('file_error');
          //$('#loadFile').css("visibility", "visible");
          $(icProgress).css("visibility", "visible");

          var xhr = createCORSRequest('GET', sUrl);

          if (xhr) {
            xhr.send();
            xhr.onreadystatechange = function() {
              if (xhr.readyState == 4 && xhr.status == 200) {
                console.log(currentTime() + ". ->File returned from remote.");
                $(icProgress).css("visibility", "visible");
                document.getElementById("uploadFile").value = FILENAME_LAS;
                $('#loadFile').css("visibility", "hidden");
                $('#fileInput').css("visibility", "hidden");

                setTimeout(function() {
                  processLasfile(xhr.responseText);
                  chartingLasdata();
                }, 2000);
              }
              if (xhr.readyState == 1 && xhr.status == 200) {
                //$(icProgress).css("visibility", "visible");
                document.getElementById("uploadFile").value = FILENAME_LAS;
                $('#loadFile').css("visibility", "visible");
              }
            };
          }
        } else if (ft.toUpperCase() == "XLSX") {

        } else {
          $('#uploadFile').addClass('file_error');

          $('#uploadFile').val("File not supported!");
          $('#loadFile').css("visibility", "hidden");
        }

      }

      /*
       * validae the uploaded file
       */
      $("#fileInput").on("change", function() {
        TurnOffButtons();
        // the function is at the bottom of this file.

        $('#radioButtonPlotNew').prop("checked", false);
        //
        $('#radioButtonPlotAppend').prop("checked", false);
        //

        if (fileInput.files.length > 0) {
          /*document.getElementById("uploadFile").value = FILENAME_LAS;
           var file = fileInput.files[0];*/
          document.getElementById("uploadFile").value = fileInput.files[0].name;
          var file = fileInput.files[0];

          if (file != undefined) {
            var filename = file.name;
            FILE_TYPE = ( filename.substring(filename.lastIndexOf(".") + 1, filename.length) ).toUpperCase();

            if (FILE_TYPE == "LAS") {
              $("#plotOptions").css("display", "none");
              
              FILENAME_LAS = fileInput.files[0].name;

              $('#uploadFile').removeClass('file_error');
              $('#loadFile').css("visibility", "visible");
              $('#loadFile').css("display", "inline");

              $("#excelSheets").css("display", "none");
            } else if (FILE_TYPE == "XLSX" || FILE_TYPE == "XLS") {
              $("#plotOptions").css("display", "block");
              
              //$("#excelSheets").css("display", "inline");

              $("#divExcelProcessing").css("display", "block");
              FILENAME_EXCEL = fileInput.files[0].name;

              angular.element(this).scope().fileChanged(this.files);
              // AngularJS call in las_excel.js

              $("#divExcelProcessing").css("display", "none");
              if (logLine_Name.length > 0) {
                $("#plotOptions").css("display", "block");
                $('#plotOptions').css("visibility", "visible");
                $("#plotNew").css("display", "inline");
              } else {
                $('#loadFile').css("visibility", "visible");
                $('#loadFile').css("display", "inline");

                $("#plotOptions").css("display", "none");
                $("#excelSheets").css("display", "none");
              }
            } else {
              $("#plotOptions").css("display", "none");
              
              $('#uploadFile').addClass('file_error');

              $('#uploadFile').val("File not supported!");
              $('#loadFile').css("visibility", "hidden");
            }
          }
        } else {
          $('#loadFile').css("visibility", "hidden");
          $('#plotOptions').css("visibility", "hidden");
          $('#uploadFile').val("Select a file");
        }
      });

      // if the plot options change
      $("input[name=plotOptions1]:radio").on("change", function(e) {
        TurnOffButtons();
        // the function is at the bottom of this file.

        if ($("#radioButtonPlotNew").prop("checked")) {
          $('#loadFile').css("visibility", "visible");
          $('#loadFile').css("display", "inline");
        }
        if ($("#radioButtonPlotAppend").prop("checked")) {
          $('#appendStep0').css("visibility", "visible");
          $('#appendStep0').css("display", "inline");
        }
      });

      $("#appendStep0").click(function() {
        
        if (FILE_TYPE == "XLSX" || FILE_TYPE == "XLS") {
          // initialize the interface
          $("#ExcelUpdate1").css("visibility", "hidden");
          $("#excelStepField").css("display", "none");
          $("#divDepthFld").css("display", "none");
          $("#excelFieldList").css("display", "none");
  
          $("#btnResetZoom").css("visibility", "hidden");
  
          // populate the sheets list
          $("#sheet_name").find("option").remove().end();
  
          var options = '<option value="">---- Select a sheet to plot ----</option>';
          for (var sheetname in EXCEL_CONTENT) {
            options += ('<option value="' + sheetname + '">' + sheetname + '</option>');
          }
          $("#sheet_name").append(options);
  
          $("#fldNameStep").find("option").remove().end();
          $("#fldNameStep").append('<option value="">---- Select the Step value ----</option>');
  
          $("#fldNameDepth").find("option").remove().end();
          $("#fldNameDepth").append('<option value="">---- Select the Depth field ----</option>');
  
          $("#sheet_fields").empty();
  
          $(loadingWindow).jqxWindow('close');
          $("#modalExcel").modal('show');
        }
        if (FILE_TYPE == "LAS") {
            BEGINNING_TIME = (new Date()).getTime();
            NO_CURVE_TO_PLOT = true;
            var file = fileInput.files[0];
  
            // if the viewer open from third party with remote las file, this statement removes the remote file and reset the url to default.
            window.history.pushState('Home', 'WVU Well Log Viewer', 'log.html');
  
            $("#btnResetZoom").css("visibility", "hidden");
  
            $("#fileInput").prop("disabled", true);
            $("#canelFile").prop("disabled", true);
  
            $(icProgress).css("visibility", "visible");
            
            var reader2 = new FileReader();
            reader2.readAsText(file);
  
            reader2.onload = function(e) {
  
              $("#txtProcess").html("Processing data...");
              console.log(currentTime() + ". ->Uploading Data");
              setTimeout(function() {
                processLasfile2(reader2.result);
                //chartingLasdata();
              }, 500);
            };
  
            reader2.onloadend = function(e) {
              console.log(currentTime() + ". ->Data uploading successfully.");
            };
  
            reader2.onloadstart = function(e) {
              $(icProgress).css("visibility", "visible");
            };            
          
        }        
      });

      $("#sheet_name").on("change", function() {
        var t = $(this).val();

        if (t != "") {
          $('#loadFile').css("visibility", "visible");
          //$("#loadFile").css("display","block");
        } else {
          $('#loadFile').css("visibility", "hidden");
          //$("#loadFile").css("display","none");
        }

        // populate the fields list
        $("#fldNameStep").find("option").remove().end();
        $("#fldNameStep").append('<option value="">---- Select the Step value ----</option>');

        $("#fldNameDepth").find("option").remove().end();
        
        $("#sheet_fields").empty();
        var opt = '';

        //$("#fldNameDepth").find("option").remove().end();

        if (this.value != "") {
          $("#divStepFld").css("display", "block");

          var sheet = EXCEL_CONTENT[this.value];
          var col_size = sheet.col_size;

          //** add excel data for data download
          datacontent += ("\n\n");
          for (var iii = 0; iii < sheet.data.length; iii++) {
            for (var jjj = 0; jjj < col_size; jjj++) {
              datacontent += (sheet.data[iii][jjj] + "\t\t");
            }
            datacontent += ("\n");
          }
          //** end of adding

          EXCEL_FIELDS = copyArray_excel_array(sheet.data[0]);

          EXCEL_TEMP_ARRAY.length = 0;

          // function defined in las_excel.js
          EXCEL_TEMP_ARRAY = convertExcelToArray(sheet);

          // To populate EXCEL_logLine_Name after remove the non-numeric fields
          // function defined in las_excel.js
          IdentifyNumericFields();
          
          for (var i = 0; i < EXCEL_FIELDS.length; i++) {
            if (EXCEL_NUMERIC_FLDS[i])
              opt += ('<option value="' + EXCEL_FIELDS[i] + '">' + EXCEL_FIELDS[i] + '</option>');
          }
        } else {
          $("#ExcelUpdate1").css("visibility", "hidden");
          $("#divStepFld").css("display", "none");
          $("#divDepthFld").css("display", "none");
          $("#excelFieldList").css("display", "none");
        }

        $("#fldNameStep").append(opt);
      });

      $("#fldNameStep").on("change", function() {
        $("#sheet_fields").empty();

        if (this.value != "") {
          $("#fldNameDepth").find("option").remove().end();
          
          $("#divDepthFld").css("display", "block");
          var opt = '<option value="">---- Select the Depth field ----</option>';
          
          for (var i = 0; i < EXCEL_FIELDS.length; i++) {
            if (EXCEL_NUMERIC_FLDS[i] && EXCEL_FIELDS[i]!=this.value)
              opt += ('<option value="' + EXCEL_FIELDS[i] + '">' + EXCEL_FIELDS[i] + '</option>');
          }
          
          $("#fldNameDepth").append(opt);
          
        } else {
         $("#divDepthFld").css("display", "none");
        }
      });
      
      $("#fldNameDepth").on("change", function() {
        $("#sheet_fields").empty();

        if (this.value != "") {
          $("#ExcelUpdate1").css("visibility", "visible");
          $("#excelFieldList").css("display", "block");

          //var sf = '<table class="table table-striped table-condensed" style="width:400px; text-align: center;"><thead><tr><th style="width:75px; text-align: center;">Check to Select</th><th>Field Name</th></tr><thead><tbody>';
          var sf = '<table class="table table-striped table-condensed" style="width:400px; text-align: center;"><thead><tr><th>Field Name</th></tr><thead><tbody>';

          for (var i = 0; i < EXCEL_FIELDS.length; i++) {
            if (EXCEL_NUMERIC_FLDS[i] && EXCEL_FIELDS[i]!=this.value && EXCEL_FIELDS[i]!=$("#fldNameStep").val()) {
              //sf += ('<tr><td style="text-align: center; padding:1px;"><input type="checkbox" name="fieldsName" value="' + i + '" style="padding-right:5px;"></td><td style="text-align: left; padding:1px;">' + EXCEL_logLine_Name[i] + '</td></tr>');
              sf += ('<tr><td style="text-align: left; padding:3px;">' + EXCEL_FIELDS[i] + '</td></tr>');
            }
          }
          sf += ('</tbody></table>');
        } else {
          $("#ExcelUpdate1").css("visibility", "hidden");
          $("#excelFieldList").css("display", "none");
        }
        $("#sheet_fields").html(sf);
      });

      // re-organize excel data after all parameters about EXCEL are specified
      $("#ExcelUpdate1").click(function() {
        EXCEL_DEPTH_FLD = $("#fldNameDepth").val();
        EXCEL_STEP_FLD = $("#fldNameStep").val();       // defined in las_resources.js, and used in las_excel.js
        
        if ( EXCEL_DEPTH_FLD=="" ) EXCEL_DEPTH_FLD = "DEPT";

        /*
         // This segment is for users to specify the plotting fields
         EXCEL_PLOT_INDEX = new Array();
         $('input[name=fieldsName]:checked').each(function(i){
         EXCEL_PLOT_INDEX.push(parseInt($(this).val()));
         });
         */
        
        // identify the new Step value and the index of the Step filed in the Excel file
        // for an Excel file, the header is always the first row. 
        //   in this case, it is the first row in the "data" variable defined in the previous line.
        // function GetNewStep is defined at the end of this js file.
        
        // retrieve the index of STEP field.
        GetNewStepValue("EXCEL");
        
        // align the newStep to EXCEL file step initially
        var newStep = DEPTH_STEP_EXCEL.value;
        
        // if the plot is to append EXCEL to LAS chart
        if ( !PLOT_EXCEL_ONLY ){
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
        }

        // Remove the Step field from the Excel_logLine_Name list
        var index = EXCEL_logLine_Name.indexOf(EXCEL_STEP_FLD);
        if (index>-1) 
          EXCEL_logLine_Name.splice(index, 1);
        // end of Removal
               
        ResetExcelLogLine(this.value);                  // in las_excel.js
        
        // Convert Excel Reading to array
        ProcessExcelArray(EXCEL_TEMP_ARRAY, newStep);
        
        $('#modalExcel').modal('hide');
        Print_Unploted_Log_List();
      });

      /*
       * Loaded the validated file
       */
      $("#loadFile").on('click', function(e) {
        if (FILE_TYPE == "LAS") {
          
          // two scenarios that will plot the new graph:
          //      scenario 1: if the plotOption radios don't show up, the application will plot the graph as new.
          //      scenario 2: if the polotOption radios show up and the "Plot as new graph" radio is check, the application will plot the gragh as new.
          if ( $("#plotOptions").css("display")=="none" ||  ( $("#plotOptions").css("display")=="block" && $("#radioButtonPlotNew").prop("checked") ) ) {
            initialDataHolder();
  
            BEGINNING_TIME = (new Date()).getTime();
            NO_CURVE_TO_PLOT = true;
            var file = fileInput.files[0];
  
            // if the viewer open from third party with remote las file, this statement removes the remote file and reset the url to default.
            window.history.pushState('Home', 'WVU Well Log Viewer', 'log.html');
  
            $("#btnResetZoom").css("visibility", "hidden");
  
            $("#fileInput").prop("disabled", true);
            $("#canelFile").prop("disabled", true);
  
            $(icProgress).css("visibility", "visible");
            
            var reader = new FileReader();
            reader.readAsText(file);
  
            reader.onload = function(e) {
  
              $("#txtProcess").html("Processing data...");
              console.log(currentTime() + ". ->Uploading Data");
              setTimeout(function() {
                processLasfile(reader.result);
                chartingLasdata();
              }, 500);
            };
  
            reader.onloadend = function(e) {
              console.log(currentTime() + ". ->Data uploading successfully.");
            };
  
            reader.onloadstart = function(e) {
              $(icProgress).css("visibility", "visible");
            };            
          }
          
          // this the scenario that append the new graph to existing graph
          if ( $("#plotOptions").css("display")=="block" && $("#radioButtonPlotAppend").prop("checked") ) {
            initialDataHolder();
  
            BEGINNING_TIME = (new Date()).getTime();
            NO_CURVE_TO_PLOT = true;
            var file = fileInput.files[0];
  
            // if the viewer open from third party with remote las file, this statement removes the remote file and reset the url to default.
            window.history.pushState('Home', 'WVU Well Log Viewer', 'log.html');
  
            $("#btnResetZoom").css("visibility", "hidden");
  
            $("#fileInput").prop("disabled", true);
            $("#canelFile").prop("disabled", true);
  
            $(icProgress).css("visibility", "visible");
            
            var reader2 = new FileReader();
            reader2.readAsText(file);
  
            reader2.onload = function(e) {
  
              $("#txtProcess").html("Processing data...");
              console.log(currentTime() + ". ->Uploading Data");
              setTimeout(function() {
                processLasfile2(reader2.result);
                //chartingLasdata();
              }, 500);
            };
  
            reader2.onloadend = function(e) {
              console.log(currentTime() + ". ->Data uploading successfully.");
            };
  
            reader2.onloadstart = function(e) {
              $(icProgress).css("visibility", "visible");
            };            
            
          }          
        }

        if (FILE_TYPE == "XLS" || FILE_TYPE == "XLSX") {
          // indicates that the app is plotting only a EXCEL file
          PLOT_EXCEL_ONLY = true;
          
          FILENAME_LAS = FILENAME_EXCEL;

          $("#btnResetZoom").css("visibility", "hidden");

          initialDataHolder();
          // populate the sheets list

          $("#sheet_name").find("option").remove().end();

          var options = '<option value="">---- Select a sheet to plot ----</option>';
          for (var sheetname in EXCEL_CONTENT) {
            options += ('<option value="' + sheetname + '">' + sheetname + '</option>');
          }
          $("#sheet_name").append(options);

          $("#fldNameDepth").find("option").remove().end();
          $("#fldNameDepth").append('<option value="">---- Select the depth field ----</option>');

          $("#sheet_fields").empty();

          $(loadingWindow).jqxWindow('close');
          $("#modalExcel").modal('show');

          //initialize the interface
          $("#ExcelUpdate1").css("visibility", "hidden");
          $("#divStepFld").css("display", "none");
          $("#divDepthFld").css("display", "none");
          $("#excelFieldList").css("display", "none");
        }

      });
      // end

      /*
       * upload well top file
       */
      $('#fileWellTop').on('change', function(e) {
        if (fileWellTop.files.length > 0) {
          document.getElementById("uploadTopFile").value = fileWellTop.files[0].name;
          var file = fileWellTop.files[0];

          if (file != undefined) {
            var filename = file.name;
            var fileType = filename.substring(filename.lastIndexOf(".") + 1, filename.length);
            if (fileType.toUpperCase() == "TXT") {
              $('#uploadTopFile').removeClass('file_error');
              $('#loadTopFile').css("visibility", "visible");
            } else {
              $('#uploadTopFile').addClass('file_error');

              $('#uploadTopFile').val("File not supported!");
              $('#loadTopFile').css("visibility", "hidden");
            }
          }
        } else {
          $('#uploadTopFile').val("File not supported!");
          $('#loadTopFile').css("visibility", "hidden");
        }
      });

      $('#loadTopFile').on('click', function(e) {
        var file = fileWellTop.files[0];

        var reader = new FileReader();
        reader.readAsText(file);

        reader.onload = function(e) {
          setWellTop(reader.result);
        };

        reader.onloadend = function(e) {
          $('#loadingTopInfo').jqxWindow('close');
        };
      });

      $("#btnListSave").click(function() {
        for (var i = 1; i < logLine_Name.length; i++) {
          if ($('#ckbx_' + i).is(':checked')) {
            var n = Number($('#txtmin_' + i).val().trim());
            var x = Number($('#txtmax_' + i).val().trim());
            MIN_MAX_LOG_CURRENT[i] = [n, x];
          }
        }

        $('#modalLogList').modal('hide');
        $("#txtProcess1").html("Processing data...");
        $('#loading_progress').modal('show');

        BEGINNING_TIME = (new Date()).getTime();

        setTimeout(function() {
          chartingLasdata();
        }, 100);
      });

      //end
    };
    
    function read2ndLasFile(fileName){
      var reader = new FileReader();
      reader.readAsText(fileName);

      reader.onload = function(e) {

        $("#txtProcess").html("Processing data...");
        console.log(currentTime() + ". ->Uploading Data");
        setTimeout(function() {
          processLasfile(reader.result);
          chartingLasdata();
        }, 500);
      };

      reader.onloadend = function(e) {
        console.log(currentTime() + ". ->Data uploading successfully.");
        //$("#txtProcess").html("Plotting...");
        //setTimeout(function(){chartingLasdata();}, 500);
      };

      reader.onloadstart = function(e) {
        $(icProgress).css("visibility", "visible");
      }; 
    }
    
    function saveFileToServer(str) {
      var request = $.ajax({
        url : "http://157.182.212.204/LasViewer/lasFileSave.php",
        data : {
          data : str,
          filename : FILENAME
        },
        type : "POST",
        dataType : "text"
      });

      request.success(function() {
        window.location.href = 'http://wayne/lasviewer/index.html?l=http://157.182.212.204/LasViewer/data/' + FILENAME;
        //window.open('http://wayne/lasviewer/index.html?l=http://157.182.212.204/LasViewer/data/' + FILENAME,'processLas');
      });
    }

    function DisplayIP(response) {
      FILENAME = FILENAME + "_" + response.ip + ".las";
    }

    function TurnOffButtons() {
      $('#loadFile').css("visibility", "hidden");
      $('#loadFile').css("display", "none");

      $('#loadFile').css("visibility", "hidden");
      $('#loadFile').css("display", "none");

      $('#appendStep0').css("visibility", "hidden");
      $('#appendStep0').css("display", "none");

    }

  });

});

