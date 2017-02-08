---
layout: default
title: Chaos Pendulum
---
    
    
     
<div id="content-wrapper">
      <div class="inner clearfix">
        <section id="main-content">
    <section id="visualsection" style="{border: red;}">
    </section>
    <section id="textsection" style="{border: red;}">
      <h1 id="message_banner">
    Untwisting the Tetrahelix </h1>

    A mathematical investigation of the Tetrahelix and Boerdijk-Coxeter helix, which provides a new
    formulaic way of producing a continuum of untwisted tetrahelices.
    <h2 id="sub_message">    
    </h2>
    

    <p>
    <label for="lambda_val">Lambda (BC helix-Equitetrabeam) (100ths)</label>
  <input type="text" id="lambda_val" readonly style="border:0; color:#f6931f; font-weight:bold;">
    <div id="lambda_slider"></div>
    </p>

<p>
    <label for="tet_distance_val">Distance (1 Tet)</label>
  <input type="text" id="tet_distance_val" readonly style="border:0; color:#f6931f; font-weight:bold;">
    <div id="tet_distance"></div>
</p>    

    <p>
    <label for="helix_radius_val">Helix Radius</label>
  <input type="text" id="helix_radius_val" readonly style="border:0; color:#f6931f; font-weight:bold;">
    <div id="helix_radius"></div>
</p>    

<p>
    <label for="rail_angle_rho">Rail Angle Rho (degrees)</label>
  <input type="text" id="rail_angle_rho" readonly style="border:0; color:#f6931f; font-weight:bold;">
    <div id="trial_length_max"></div>
</p>
    

    <button onclick="start_trial()">Start New Trial!</button>
    <button onclick="pause()">Pause</button>
    <button onclick="my_clear()">Clear Traces</button>
    <button onclick="toggle_sound()">Toggle Sound</button>
    <button onclick="toggle_bracelet()">Toggle Bracelet Debug Lines</button>
    <button onclick="toggle_single()">Toggle Single Pendulum</button>

    <section id="stats" style="{border: red;}">
    
<div id="table-wrapper">
  <div id="table-scroll">
    <table id="trialrecords">
     <tr>
    <th>rho </th>
    <th>r</th>
    <th>h</th>
    <th>delta</th>
    </tr>
    </table>
  </div>
</div>    
    
    </section>
	
        <script>

var HELIX_RADIUS = 34;
var RAIL_ANGLE_RHO = 34;

var MAX_NUM_TICKS = 34;
var DEGREES_OF_VARIATION_A_S = 34;

var LAMBDA = 34;

var TET_DISTANCE = 34;



function register_trials(trial,angle,time,divergence_length) {
    var table = document.getElementById("trialrecords");

    var row = table.insertRow(1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    cell1.innerHTML = ""+trial;
    cell2.innerHTML = ""+angle.toFixed(4);    
    cell3.innerHTML = ""+time.toFixed(2) ;
    cell4.innerHTML = ""+divergence_length.toFixed(2) ;

}



var paused = false;
function pause() {
    paused = !paused;
    if (!paused) 
        requestAnimationFrame(animate);    
}
var origin = [0,0];

$(function() {
    $( "#tet_distance" ).slider({
      range: "max",
      min: 0,
      max: 100,
      value: 70,
      slide: function( event, ui ) {
	  $( "#tet_distance_val" ).val( ui.value );
	  TET_DISTANCE = ui.value;
      }
    });
    $( "#tet_distance_val" ).val( $( "#tet_distance" ).slider( "value" ) );
  });



$(function() {
    $( "#helix_radius" ).slider({
      range: "max",
      min: 0.0,
      max: 100.0,
      value: HELIX_RADIUS * 100,
      slide: function( event, ui ) {
	  $( "#helix_radius_val" ).val( ui.value );
	  HELIX_RADIUS = ui.value / 100.0;
      }
    });
    $( "#helix_radius_val" ).val( $( "#helix_radius" ).slider( "value" ) );
  });


$(function() {
    $( "#trial_length_max" ).slider({
      range: "max",
      min: 2,
      max: 100,
      value: 20,
      slide: function( event, ui ) {
	  $( "#rail_angle_rho" ).val( ui.value );
	  RAIL_ANGLE_RHO = ui.value;
      }
    });
    $( "#rail_angle_rho" ).val( $( "#trial_length_max" ).slider( "value" ) );
  });


$(function() {
    $( "#lambda_slider" ).slider({
      range: "max",
      min: 0,
      max: 100,
      value: 100,
      slide: function( event, ui ) {
	  $( "#lambda_val" ).val( ui.value );
	  LAMBDA = ui.value/ 100;
      }
    });
    $( "#lambda_val" ).val( $( "#lambda_slider" ).slider( "value" ) );
  });



    </script>

  

