---
layout: default
title: Untwisting the Tetrahelix
---
    
    
     
<div id="content-wrapper">
    <div class="inner clearfix">

        <section id="main-content">
    <section id="visualsection" style="{border: red;}">
    </section>

    <table id="trialrecord">
    <tr>
    <th>trial </th>
    <th>optimal </th>        
    <th>rho </th>
    <th>r</th>
    <th>len</th>
    <th>d</th>    
    <th>one-hop</th>
    <th>two-hop</th>
    <th>pitch</th>
    <th>inradius</th>
    <th>minmax ratio (%)</th>
    </tr>
    </table>

<p>
    <label for="rail_angle_rho">Rail Angle Rho (degrees)</label>
  <input type="text" id="rail_angle_rho" readonly style="border:0; color:#f6931f; font-weight:bold;">
    <div id="rail_angle_slider"></div>
</p>

    <p>
    <div id ="validpitch">
    <label for="pitch_input_min">Minimum Pitch (meters)</label>
    <input type="text" size="6" id="pitch_input_min" readonly style="border:0; color:#f6931f; font-weight:bold;">
    <label for="pitch_input">Pitch Above Minimum (meters)</label>
  <input type="text" size="6" id="pitch_input" readonly style="border:0; color:#f6931f; font-weight:bold;">
    <label for="actual_pitch">Actual Pitch (meters)</label>
  <input type="text" size="6"  id="actual_pitch" readonly style="border:0; color:#f6931f; font-weight:bold;">
    <div id="pitch_input_slider"></div>
    </div>
    <div id="pitchundefined" display="hidden">
    PITCH IS UNDEFINED WHEN RHO = 0
    </div>
</p>


    <p>
    <label for="helix_radius_val">Helix Radius (meters)</label>
  <input type="text" id="helix_radius_val" readonly style="border:0; color:#f6931f; font-weight:bold;">
    <div id="helix_radius"></div>
</p>    


<p>
    <label for="tet_distance_val">Rail Edge (meters)</label>
  <input type="text" id="tet_distance_val" readonly style="border:0; color:#f6931f; font-weight:bold;">
    <div id="tet_distance"></div>
</p>    

<table style="width:100%">
  <tr>
    <td>
      <fieldset id="chiralityfs">
    <legend>Chirality: </legend>
    <label for="chi-1">Counter-Clockwise</label>
    <input type="radio" name="chi" id="chi-1" >
    <label for="chi-2">Clockwise</label>
    <input type="radio" name="chi" id="chi-2" checked="true">
    </fieldset>
    </td>
    <td>
<fieldset>
  <legend>Optimality: </legend>
  <label for="optimal-1">Optimal</label>
  <input type="radio" name="optimal" id="optimal-1" checked="true">
  <label for="optimal-2">Free</label>
  <input type="radio" name="optimal" id="optimal-2">
</fieldset>
    </td>
  </tr>
</table>
 

<div id="table-wrapper">
  <div id="table-scroll">
    <table id="trialrecords">
    <tr>
    <th>trial </th>
    <th>optimal </th>
    <th>rho </th>
    <th>r</th>
    <th>len</th>
    <th>d</th>    
    <th>one-hop</th>
    <th>two-hop</th>
    <th>pitch</th>
    <th>inradius</th>    
    <th>minmax ratio (%)</th>            
    </tr>
    </table>
  </div>
</div>    
    
        <section id="textsection" style="{border: red;}">
      <h1 id="message_banner">
    Untwisting the Tetrahelix </h1>
<p>
    A mathematical investigation of the Tetrahelix and Boerdijk-Coxeter helix, which provides a new
formulaic way of producing a continuum of untwisted tetrahelices.
    </p>
<p>
    All of the code on this site is released under the GNU General Public License, and I hope you will reuse it.
    </p>
    <h2> Motivation </h2>

Tetrahelixes are cool. Further motivation is described in an academic paper we are preparing that will
be linked in draft form here.

    <h2> How to Use </h2>
    <p>
    The site uses the so-called THREE.js "orbit" control.  Click on the scene and drag and you will find your self
rotating, always looking at approximately the center point. Moving the middle mouse wheel or the Mac scrolling
pattern will zoom you in or out.
</p>


    <h2> Accessing the Math  </h2>

<p>
    This site is coded in the file <a href="https://pubinv.github.io/tetrahelix/index.md">index.md</a>,
which has the THREE.js rendering code and
code to to use the fundamental math.  The math from our paper, however, is in
    <a href="https://pubinv.github.io/tetrahelix/js/tetrahelix_math.js">tetrahelix_math.js</a>.
    You are welcome to use tetrahelix_math.js in for your own purposes, such as in a computer game or to
design your own physical structures.
    </p>
<p>
    <h2> Running the Test </h2>
<p>
    Although it is currently a work in progress, my goal is to make tetrahelix_math.js testable via
Mocha. You will need to install npm, node, and <a href="https://mochajs.org/">mocha</a> for this to work.
    </p>

    <p>
    I am not a node expert, but basically I did:
> npm install -g browserify
> npm install -g mocha

    In order to use the tetrahelix_math module in the browser.
    I build the browser ready file with:
> browserify tm_shim.js  -o bundle.js
    </p>


</section>

	<script type="x-shader/x-vertex" id="vertexShader">

			varying vec3 vWorldPosition;

			void main() {

				vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
				vWorldPosition = worldPosition.xyz;

				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			}

		</script>

		<script type="x-shader/x-fragment" id="fragmentShader">

			uniform vec3 topColor;
			uniform vec3 bottomColor;
			uniform float offset;
			uniform float exponent;

			varying vec3 vWorldPosition;

			void main() {

				float h = normalize( vWorldPosition + offset ).y;
				gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );

			}


		</script>	
    <script>
    var tm = UGLY_GLOBAL_SINCE_I_CANT_GET_MY_MODULE_INTO_THE_BROWSER;

$( "input[type='radio']" ).checkboxradio();

var OPTIMALITY = true;
function handleOptimalityChange(e) {
    var target = $( e.target );
    OPTIMALITY = (target[0].id == "optimal-1") ;
    if (OPTIMALITY) {
	HELIX_RADIUS = tm.optimal_radius(RAIL_ANGLE_RHO*Math.PI/180,TET_DISTANCE);
	$("#helix_radius").slider('value',HELIX_RADIUS.toFixed(4));
	$("#helix_radius_val" ).val( HELIX_RADIUS.toFixed(4) );
    }
    draw_central();
    console.log(OPTIMALITY);
    return true;
}

$( "[name='optimal']").on( "change", handleOptimalityChange );

var CHIRALITY_CCW = 1;
function handleChiralityChange(e) {
    var target = $( e.target );
    CHIRALITY_CCW = (target[0].id == "chi-1") ? -1 : 1;
    draw_central();
    console.log(CHIRALITY_CCW);
    return true;
}

$( "[name='chi']").on( "change", handleChiralityChange );


function insert_trail_row(table,trial,optimal,angle,radius,d,len,one_hop,two_hop,pitch,inradius,score) {
    var row = table.insertRow(1);
    var cells = [];
    for (var i = 0; i < 11; i++) {
	cells[i] = row.insertCell(i);	
    }
    cells[0].innerHTML = ""+trial;
    cells[1].innerHTML = ""+optimal;    
    cells[2].innerHTML = ""+angle.toFixed(4);    
    cells[3].innerHTML = ""+radius.toFixed(4) ;
    cells[4].innerHTML = ""+len.toFixed(4) ;
    cells[5].innerHTML = ""+d.toFixed(4) ;    
    cells[6].innerHTML = ""+one_hop.toFixed(4) ;
    cells[7].innerHTML = ""+two_hop.toFixed(4) ;    
    cells[8].innerHTML = ""+pitch.toFixed(4);
    cells[9].innerHTML = ""+inradius.toFixed(4);
    cells[10].innerHTML = ""+score.toFixed(4);
}

function register_recent_trial(trial,optimal,angle,radius,d,len,one_hop,two_hop,pitch,inradius,score) {
    var table = document.getElementById("trialrecord");
    if (table.rows.length > 1) 
	table.deleteRow(1);
    insert_trail_row(table,trial,optimal,angle,radius,d,len,one_hop,two_hop,pitch,inradius,score);
}
function register_trials(trial,optimal,angle,radius,d,len,one_hop,two_hop,pitch,inradius,score) {
    var table = document.getElementById("trialrecords");
    insert_trail_row(table,trial,optimal,angle,radius,d,len,one_hop,two_hop,pitch,inradius,score);
    register_recent_trial(trial,optimal,angle,radius,d,len,one_hop,two_hop,pitch,inradius,score);
}


var RAIL_ANGLE_RHO = tm.BCrho*180/Math.PI;
var LAMBDA = 0;
var TET_DISTANCE = 0.5;
var HELIX_RADIUS = tm.optimal_radius(RAIL_ANGLE_RHO*Math.PI/180,TET_DISTANCE);
var MIN_PITCH = tm.pitch_min(TET_DISTANCE);
var MAX_PITCH = 30;
var ADD_PITCH = tm.pitchForOptimal(RAIL_ANGLE_RHO*Math.PI/180,TET_DISTANCE) - MIN_PITCH;
var PITCH = MIN_PITCH + ADD_PITCH;



$( "#pitch_input" ).val( ADD_PITCH.toFixed(4));
$("#pitch_input_min").val(MIN_PITCH.toFixed(4));
$("#actual_pitch").val(PITCH.toFixed(4));	    

var origin = [0,0];

function show_pitch() {
    if (RAIL_ANGLE_RHO < 0.3) {
	$("#pitchundefined").show();
	$("#validpitch").hide();
    } else {
	$("#pitchundefined").hide();
	$("#validpitch").show();
    }
}
show_pitch();
$(function() {
    $( "#rail_angle_slider" ).slider({
	range: "max",
	min: 0,
	max: tm.BCrho*180/Math.PI,
	value: RAIL_ANGLE_RHO,
	step: 0.001,	
	slide: function( event, ui ) {
	    $( "#rail_angle_rho" ).val( ui.value );
	    RAIL_ANGLE_RHO = ui.value;
	    show_pitch();
	    if (OPTIMALITY) {
		HELIX_RADIUS = tm.optimal_radius(RAIL_ANGLE_RHO*Math.PI/180,TET_DISTANCE);
		$( "#helix_radius" ).slider('value',HELIX_RADIUS.toFixed(4));
		$( "#helix_radius_val" ).val( HELIX_RADIUS.toFixed(4) );
		if (RAIL_ANGLE_RHO != 0); {
		    PITCH = tm.pitchForOptimal(RAIL_ANGLE_RHO*Math.PI/180,TET_DISTANCE);
		    ADD_PITCH = PITCH-MIN_PITCH;
		}
		$( "#pitch_input" ).val(ADD_PITCH.toFixed(4) );
		$( "#pitch_input_min" ).val( MIN_PITCH.toFixed(4) );
		$("#actual_pitch").val(PITCH.toFixed(4));
		$( "#pitch_input_slider" ).slider('value',ADD_PITCH.toFixed(4));		
	    }
	    draw_central();
	}
    });
    $( "#rail_angle_rho" ).val( $( "#rail_angle_slider" ).slider( "value" ) );
});


// A pitch too big produces and Equitetrabeam....there is no provision in here
// for that.  Also, very small pitches are deeply weird.
// In the case of optimality we should limit the Rail angle to the BC Continuum.
$(function() {
    $( "#pitch_input_slider" ).slider({
	range: "max",
	min: 0,
	max: 30,
	value: ADD_PITCH,
	step: 0.01,	
	slide: function( event, ui ) {
	    $( "#pitch_input" ).val( ui.value );
	    ADD_PITCH = ui.value;
	    PITCH = MIN_PITCH + ADD_PITCH;
	    $("#actual_pitch").val(PITCH.toFixed(4));
	    $("#pitch_input").val(ADD_PITCH.toFixed(4));	    	    
	    if (OPTIMALITY) {
		var rho_for_pitch_radians =
		    newtonRaphson((x) => (tm.pitchForOptimal(x,TET_DISTANCE) - PITCH),RAIL_ANGLE_RHO*Math.PI/180);
		RAIL_ANGLE_RHO = rho_for_pitch_radians*180/Math.PI;
		$( "#rail_angle_slider" ).slider('value',RAIL_ANGLE_RHO.toFixed(4));
		$( "#rail_angle_rho" ).val( RAIL_ANGLE_RHO.toFixed(4) );
		
		HELIX_RADIUS = tm.optimal_radius(RAIL_ANGLE_RHO*Math.PI/180,TET_DISTANCE);
		$( "#helix_radius" ).slider('value',HELIX_RADIUS.toFixed(4));
		$( "#helix_radius_val" ).val( HELIX_RADIUS.toFixed(4) );
	    } else {
		// here we want to make sure the pitch matches PITCH by changing the TET_DISTANCE.
		var dopt = tm.optimal_distance(RAIL_ANGLE_RHO*Math.PI/180,TET_DISTANCE);
		var desired_d = (RAIL_ANGLE_RHO*Math.PI/180) * PITCH / (2 * Math.PI);
		var len = Math.sqrt(desired_d*desired_d +
				    4 * HELIX_RADIUS * HELIX_RADIUS *
				    Math.sin(RAIL_ANGLE_RHO*Math.PI/(2*180)) * Math.sin(RAIL_ANGLE_RHO*Math.PI/(2*180)));
		console.log("NEW LEN", desired_d,len, TET_DISTANCE);		
		TET_DISTANCE = len;
		$( "#tet_distance_val" ).val( TET_DISTANCE.toFixed(4) );
		$( "#tet_distance" ).slider('value',TET_DISTANCE.toFixed(4));
	    }
	    draw_central();
	}
    });
    $( "#pitch_input" ).val( $( "#pitch_input_slider" ).slider( "value" ) );
});

$(function() {
    $( "#tet_distance" ).slider({
	range: "max",
	min: 0,
	max: 3,
	value: TET_DISTANCE,
	step: 0.01,
	slide: function( event, ui ) {
	    $( "#tet_distance_val" ).val( ui.value );
	    TET_DISTANCE = ui.value;
	    MIN_PITCH = tm.pitch_min(TET_DISTANCE);
	    $("#pitch_input_slider").slider('option',{min: 0, max: MAX_PITCH});
	    $("#pitch_input_min").val(MIN_PITCH.toFixed(4));
	    $("#actual_pitch").val(PITCH.toFixed(4));	    
	    if (OPTIMALITY) {
		HELIX_RADIUS = tm.optimal_radius(RAIL_ANGLE_RHO*Math.PI/180,TET_DISTANCE);
		$("#helix_radius").slider('value',HELIX_RADIUS.toFixed(4));
		$("#helix_radius_val" ).val( HELIX_RADIUS.toFixed(4) );

		$("#pitch_input_slider").slider('value',tm.pitchForOptimal(RAIL_ANGLE_RHO*Math.PI/180,TET_DISTANCE).toFixed(4));
	    }
	    draw_central();
	}
    });
    $( "#tet_distance_val" ).val( $( "#tet_distance" ).slider( "value" ) );
});

$(function() {
    $( "#helix_radius" ).slider({
	range: "max",
	min: 0.0,
	max: 3,
	value: HELIX_RADIUS,
	step: 0.01,	
	slide: function( event, ui ) {
	    $( "#helix_radius_val" ).val( ui.value );
	    HELIX_RADIUS = ui.value ;
	    if (OPTIMALITY) {
		// here we must compute the optimal The Rail Angle...
		var rho = RAIL_ANGLE_RHO*Math.PI/180;
		var opt_el_for_this_radius =
		    newtonRaphson((x) => (tm.optimal_radius(rho,x) - HELIX_RADIUS),rho);
		console.log("optimum edge:",opt_el_for_this_radius);
		TET_DISTANCE = opt_el_for_this_radius;
		$( "#tet_distance_val" ).val( TET_DISTANCE.toFixed(4) );
		$( "#tet_distance" ).slider('value',TET_DISTANCE.toFixed(4));

	    }
	    draw_central();	    
	}
    });
    $( "#helix_radius_val" ).val( $( "#helix_radius" ).slider( "value" ) );
});


// Detects webgl
if ( ! Detector.webgl ) {
    Detector.addGetWebGLMessage();
    document.getElementById( 'threecontainer' ).innerHTML = "";
}

function addShadowedLight(scene, x, y, z, color, intensity ) {
    var directionalLight = new THREE.DirectionalLight( color, intensity );
    directionalLight.position.set( x, y, z );
    scene.add( directionalLight );
    directionalLight.castShadow = true;
    var d = 1;
    directionalLight.shadow.camera.left = -d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = -d;
    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 4;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.bias = -0.005;
}
function createParalellepiped( sx, sy, sz, pos, quat, material ) {
    var pp = new THREE.Mesh( new THREE.BoxGeometry( sx, sy, sz, 1, 1, 1 ), material );
    pp.castShadow = false;;
    pp.receiveShadow = true;
    pp.position.set(pos.x,pos.y,pos.z);
    return pp;

}
// Not sure how to use the quaternion here,
function createSphere(r,pos,color) {
    //    var cmat = memo_color_mat(tcolor);
    var tcolor = new THREE.Color(color);
    var cmat = new THREE.MeshPhongMaterial( { color: tcolor } );
    var ball = new THREE.Mesh( new THREE.SphereGeometry( r, 18, 16 ), cmat );
    ball.position.set(pos.x,pos.y,pos.z);
    ball.castShadow = false;;
    ball.receiveShadow = true;

    return ball;
}

function get_member_color(gui,len) {
    if (len < am.MIN_EDGE_LENGTH)
	return d3.color("black");
    else if (len > am.MAX_EDGE_LENGTH)
	return d3.color("black");
    else {
	var p = (len - am.MIN_EDGE_LENGTH) / (am.MAX_EDGE_LENGTH - am.MIN_EDGE_LENGTH);
	return d3.rgb(gui.color_scale(len));
    }
}

function create_actuator(d,b_a,b_z,pos,color) {
    var len = d+ -am.JOINT_RADIUS*2;
    var quat = new THREE.Quaternion();

    //    var color = get_member_color(am,d);
    var tcolor = new THREE.Color(color.r,color.g,color.b);
    var cmat = memo_color_mat(tcolor);

    var d = new THREE.Vector3(b_z.x,b_z.y,b_z.z);
    d.sub(b_a);
    d.divideScalar(2);
    d.add(pos);
    var mesh =  createParalellepiped(
	am.INITIAL_EDGE_WIDTH,
	am.INITIAL_EDGE_WIDTH,
	len,
	pos,
	quat,
	cmat );
    
    mesh.lookAt(b_z);
    
    mesh.castShadow = false;;
    mesh.receiveShadow = true;
    am.scene.add(mesh);
    mesh.structureKind = "member";
    mesh.name = b_a.name + " " + b_z.name;
    return mesh;
}

function memo_color_mat(tcolor) {
    var string = tcolor.getHexString();
    if (!(string in am.color_material_palette)) {
	var cmat = new THREE.MeshPhongMaterial( { color: tcolor } );
	am.color_material_palette[string] = cmat;
    }
    return am.color_material_palette[string]
}
function alphabetic_name(n) {
    if (n < 26) {
	return String.fromCharCode(65+n);
    } else {
	if (n < 26*26) {
	    return alphabetic_name(Math.floor(n/26))+alphabetic_name(n % 26);
	} else {
	    return ""+n;
	}
    }
}

var scolors = [ d3.color("DarkRed"), d3.color("DarkOrange"), d3.color("Indigo") ];
var smats = [ new THREE.Color(0x8B0000),
	      new THREE.Color(0xFF8C00),
	      new THREE.Color(0x4B0082)];
function load_NTetHelix(am,helix,tets,pvec,hparams) {
    var len = hparams.len;
    var rho = hparams.rho;
    var d = hparams.d;
    var radius = hparams.radius;
    var lambda = hparams.lambda;
    var chi = hparams.chirality;
    var n = tets+3;    

    var colors = [ d3.color("red"), d3.color("yellow"), d3.color("blue") ];
    //    var scolors = [ d3.rgb("firebrick"), d3.rgb("goldenrod"), d3.rgb("indigo") ];    
    var dcolor = [null,d3.color("Green"),d3.color("purple")];
    for(var i = 0; i < n; i++) {

	var myRho = rho;
	var rail = i % 3;
	var num = Math.floor(i/3);
	var q = tm.H_general(chi,num,rail,myRho,d,radius);
	var v = new THREE.Vector3(q[0], q[1], q[2]);
	v = v.add(pvec);

	var pos = new THREE.Vector3();
	pos.set( v.x, v.y, v.z);
	var mesh = createSphere(am.JOINT_RADIUS,pos,smats[rail]);
	mesh.castShadow = false;
	mesh.receiveShadow = false;
	am.scene.add(mesh);
	
	var body = {};
	body.rail =  rail;
	body.number = i / 3;
	body.name = alphabetic_name(i);
	body.mesh = mesh;
	helix.helix_joints.push(body);
	am.push_body_mesh_pair(body,mesh);
	
	for(var k = 0; k < Math.min(3,i) && k < i; k++) {
	    var h = i-(k+1);

	    // Sadly, increasing the mass of the members seems to be
	    // necessary to keep the edges from passing through the obstacles.
	    // This is a very unfortunate tuning...I suspect it is a weakness
	    // in the solver of physics engine.
	    var pos = new THREE.Vector3();
	    var quat = new THREE.Quaternion();

	    var b_z = helix.helix_joints[i];
	    var b_a = helix.helix_joints[h];
	    var o_a = b_a.mesh.position;
	    var o_z = b_z.mesh.position;
	    
	    var v_z = new THREE.Vector3(o_a.x,o_a.y,o_a.z);
	    var v_a = new THREE.Vector3(o_z.x,o_z.y,o_z.z);
	    var dist = v_a.distanceTo(v_z);
	    
	    var v_avg = new THREE.Vector3(v_z.x,v_z.y,v_z.z);
	    v_avg.add(v_a);
	    v_avg.multiplyScalar(0.5);
	    
	    pos.set( v_avg.x, v_avg.y, v_avg.z);
            quat.set( 0, 0, 0, 1 );

	    var diff = ((b_a.rail - b_z.rail)+3) % 3;
	    var member_color = (diff != 0) ? dcolor[diff] : colors[b_a.rail];

	    var mesh = create_actuator(dist,v_a,v_z,pos,member_color);
	    if (b_a.name > b_z.name) {
		var t = b_a;
		b_a = b_z;
		b_z = t;
	    }
	    var memBody = {};
	    memBody.name = b_a.name + " " + b_z.name;
	    memBody.link_a = b_a;
	    memBody.link_z = b_z;
	    memBody.endpoints = [];
	    memBody.endpoints[0] = b_a;
	    memBody.endpoints[1] = b_z;

	    for(var x = helix.helix_members.length -1; x >= 0; x--) {
		if (helix.helix_members[x].body.name == memBody) {
		    helix.helix_member.splice(x,1);
		}
	    }
	    var link = { a: b_a, b: b_z, body: memBody};	    
	    helix.helix_members.push(link);
	    am.push_body_mesh_pair(memBody,mesh);
	}
    }
}



var AM = function() {
    this.container,
    this.stats;
    this.camera;
    this.controls;
    this.scene;
    this.sceneOrtho;
    this.renderer;
    this.textureLoader;
    this.clock = new THREE.Clock();
    this.clickRequest = false;
    this.mouseCoords = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this.ballMaterial = new THREE.MeshPhongMaterial( { color: 0x202020 } );
    this.pos = new THREE.Vector3();
    this.quat = new THREE.Quaternion();


    this.BT_CONSTRAINT_STOP_CFM = 3;
    this.BT_CONSTRAINT_STOP_ERP = 1
    this.myCFMvalue = 0.0;
    this.myERPvalue = 0.8;

    this.jointBody = null;

    this.playgroundDimensions = {
	w:10,
	d:10,
	h:3
    };
    this.GROUND_WIDTH = 1.0;

    this.gravity_on = true;
    this.margin = 0.05;

    this.armMovement = 0;

    //    this.window_height_factor = 1/4.0;
    this.window_height_factor = 0.5;
    // Sadly, this seems to do nothing!
    this.CAMERA_RADIUS_FACTOR = 1;

    this.grid_scene = null;
    // Used in manipulation of objects
    this.gplane=false;


    this.INITIAL_EDGE_LENGTH = TET_DISTANCE;
    this.INITIAL_EDGE_WIDTH = this.INITIAL_EDGE_LENGTH/40;
    this.INITIAL_HEIGHT = 3*this.INITIAL_EDGE_LENGTH/2;

    this.NUMBER_OF_TETRAHEDRA = 70;
    //       this.NUMBER_OF_TETRAHEDRA = 5;


    this.JOINT_RADIUS = 0.09*this.INITIAL_EDGE_LENGTH; // This is the current turret joint ball.

    this.LENGTH_FACTOR = 20;

    // Helices look like this...
    // {
    // 	helix_joints: [],
    // 	helix_members: []
    // }
    this.helices = [];

    
    
    this.meshes = [];
    this.bodies = [];


    // This is sometimes useful for debugging.    
    //    this.jointGeo = new THREE.BoxGeometry( this.JOINT_RADIUS*2,this.JOINT_RADIUS*2,this.JOINT_RADIUS*2);
    this.jointGeo = new THREE.SphereGeometry( this.JOINT_RADIUS,32,32);
    this.jointMaterial = new THREE.MeshPhongMaterial( { color: 0x0000ff } );
    
    this.floorTexture = new THREE.ImageUtils.loadTexture("images/logo-white-background.png");
    
    this.MIN_EDGE_LENGTH = this.INITIAL_EDGE_LENGTH/2;
    this.MAX_EDGE_LENGTH  = this.INITIAL_EDGE_LENGTH*2;
    this.color_scale = d3.scale.quantile().domain([this.MIN_EDGE_LENGTH, this.MAX_EDGE_LENGTH])
	.range(['violet', 'indigo', '#8A2BE2', 'blue', 'green', 'yellow', '#FFD700', 'orange', '#FF4500']);
    this.color_material_palette = {};

    this.GROUND_PLANE_MESH;
    this.GROUND_BODY;

    this.latestLookAt = new THREE.Vector3(0,0,0);

    this.helix_params = [];    
}
AM.prototype.push_body_mesh_pair = function(body,mesh) {
    this.meshes.push(mesh);
    this.bodies.push(body);
}
AM.prototype.remove_body_mesh_pair = function(body,mesh) {
    for(var i = this.meshes.length - 1; i >= 0; i--) {
	if(this.meshes[i].name === mesh.name) {
	    this.meshes.splice(i, 1);
	    this.bodies.splice(i, 1);
	}
    }
}

AM.prototype.clear_non_floor_body_mesh_pairs = function() {
    this.meshes = [];
    this.bodies = [];
    this.meshes.push(am.GROUND_PLANE_MESH);
    this.bodies.push(am.GROUND_BODY);
}

var am = new AM();


var bulbLight, bulbMat, ambientLight, object, loader, stats;
var ballMat, cubeMat, floorMat;
// ref for lumens: http://www.power-sure.com/lumens.htm
var bulbLuminousPowers = {
    "110000 lm (1000W)": 110000,
    "3500 lm (300W)": 3500,
    "1700 lm (100W)": 1700,
    "800 lm (60W)": 800,
    "400 lm (40W)": 400,
    "180 lm (25W)": 180,
    "20 lm (4W)": 20,
    "Off": 0
};
// ref for solar irradiances: https://en.wikipedia.org/wiki/Lux
var hemiLuminousIrradiances = {
    "0.0001 lx (Moonless Night)": 0.0001,
    "0.002 lx (Night Airglow)": 0.002,
    "0.5 lx (Full Moon)": 0.5,
    "3.4 lx (City Twilight)": 3.4,
    "50 lx (Living Room)": 50,
    "100 lx (Very Overcast)": 100,
    "350 lx (Office Room)": 350,
    "400 lx (Sunrise/Sunset)": 400,
    "1000 lx (Overcast)": 1000,
    "18000 lx (Daylight)": 18000,
    "50000 lx (Direct Sun)": 50000
};
var params = {
    shadows: true,
    exposure: 0.68,
    bulbPower: Object.keys( bulbLuminousPowers )[ 4 ],
    hemiIrradiance: Object.keys( hemiLuminousIrradiances )[0]
};


function initGraphics() {

    am.container = document.getElementById( 'threecontainer' );

    var PERSPECTIVE_NEAR = 0.3;
    am.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / (window.innerHeight * am.window_height_factor), PERSPECTIVE_NEAR, 2000 );

    am.camera.aspect = window.innerWidth / (window.innerHeight * am.window_height_factor);

    var origin = new THREE.Vector3(0,0,0);
    am.camera.lookAt(origin);
    
    //    am.camera.quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0), (Math.PI/2));
    
    am.scene = new THREE.Scene();
    am.scene.fog = new THREE.Fog( 0x000000, 500, 10000 );    

    am.camera.position.x = 0;
    am.camera.position.y = 0.5;
    am.camera.position.z =  2;

    am.controls = new THREE.OrbitControls( am.camera, am.container );
    am.controls.target.set(0,0,0);

    am.renderer = new THREE.WebGLRenderer( { antialias: true } );
    am.renderer.setClearColor( 0xffffff );
    am.renderer.autoClearColor = true;
    
    am.renderer.setPixelRatio( window.devicePixelRatio );
    am.renderer.setSize( window.innerWidth, window.innerHeight*am.window_height_factor );
    am.SCREEN_WIDTH = am.renderer.getSize().width;
    am.SCREEN_HEIGHT = am.renderer.getSize().height;
    am.camera.radius = ( am.SCREEN_WIDTH + am.SCREEN_HEIGHT ) / this.CAMERA_RADIUS_FACTOR;


    am.cameraOrtho = new THREE.OrthographicCamera( 0, am.SCREEN_WIDTH, am.SCREEN_HEIGHT, 0, - 10, 10 );
    
    hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1 );
    am.scene.add( hemiLight );

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
    directionalLight.position = new THREE.Vector3(100,5,0);
    am.scene.add( directionalLight );
    
    var ambientLight = new THREE.AmbientLight( 0x404040 );

    am.grid_scene = new THREE.Scene();
    am.grid_scene.fog = new THREE.Fog( 0x000000, 500, 10000 );    

    // GROUND
    var groundGeo = new THREE.PlaneBufferGeometry( 10000, 10000 );
    var groundMat = new THREE.MeshPhongMaterial( { color: 0x777777, specular: 0x050505 } );
    //    groundMat.color.setHSL( 0.095, 1, 0.75 );

    var ground = new THREE.Mesh( groundGeo, groundMat );
    ground.name = "GROUND";
    ground.rotation.x = -Math.PI/2;
    ground.position.y = 0;
    am.scene.add( ground );

    ground.receiveShadow = true;

    
    // HACK:  These diemensions are probably not right here!
    gridInit(am.grid_scene,am.playgroundDimensions);
    
    am.container.innerHTML = "";

    am.container.appendChild( am.renderer.domElement );

    am.sceneOrtho = new THREE.Scene();

    window.addEventListener( 'resize', onWindowResize, false );

}

AM.prototype.push_body_mesh_pair = function(body,mesh) {
    this.meshes.push(mesh);
    this.bodies.push(body);
}
AM.prototype.remove_body_mesh_pair = function(body,mesh) {
    for(var i = this.meshes.length - 1; i >= 0; i--) {
	if(this.meshes[i].name === mesh.name) {
	    this.meshes.splice(i, 1);
	    this.bodies.splice(i, 1);
	}
    }
    delete mesh["ammo_obj"];
    for(var i = this.rigidBodies.length - 1; i >= 0; i--) {
	if(this.rigidBodies[i].name === body.name) {
	    this.rigidBodies.splice(i, 1);
	}
    }
}


function onWindowResize() {
    am.camera.aspect = window.innerWidth / (window.innerHeight * am.window_height_factor);
    am.renderer.setSize( window.innerWidth, window.innerHeight * am.window_height_factor );
    
    am.camera.updateProjectionMatrix();
    am.SCREEN_WIDTH = am.renderer.getSize().width;
    am.SCREEN_HEIGHT = am.renderer.getSize().height;
    am.camera.radius = ( am.SCREEN_WIDTH + am.SCREEN_HEIGHT ) / this.CAMERA_RADIUS_FACTOR;

    am.cameraOrtho = new THREE.OrthographicCamera( 0, am.SCREEN_WIDTH, am.SCREEN_HEIGHT, 0, - 10, 10 );    
}

function animate() {
    // Seems this is likely to be a problem...
    requestAnimationFrame( animate );
    render();
}

var sprite_controls = new function () {
    this.size = 50;
    this.sprite = 0;
    this.transparent = true;
    this.opacity = 0.6;
    this.colorize = 0xffffff;
    this.textcolor = "yellow";
    this.rotateSystem = true;

    this.clear = function (x,y) {
        am.sceneOrtho.children.forEach(function (child) {
	    if (child instanceof THREE.Sprite) am.sceneOrtho.remove(child);
        })
    };

    this.draw_and_create = function (sprite,x,y,message) {
	var fontsize = 128;
	var ctx, texture,
	    spriteMaterial, 
	    canvas = document.createElement('canvas');
	ctx = canvas.getContext('2d');
	ctx.font = fontsize + "px Arial";

	// setting canvas width/height before ctx draw, else canvas is empty
	canvas.width = ctx.measureText(message).width;
	canvas.height = fontsize * 2; // fontsize * 1.5

	// after setting the canvas width/height we have to re-set font to apply!?! looks like ctx reset
	ctx.font = fontsize + "px Arial";        
	ctx.fillStyle = this.textcolor;        
	ctx.fillText(message, 0, fontsize);

	texture = new THREE.Texture(canvas);
	texture.minFilter = THREE.LinearFilter; // NearestFilter;
	texture.needsUpdate = true;

	var spriteMaterial = new THREE.SpriteMaterial({
	    opacity: this.opacity,
	    color: this.colorize,
	    transparent: this.transparent,
	    map : texture});
	
	spriteMaterial.scaleByViewport = true;
	spriteMaterial.blending = THREE.AdditiveBlending;

        if (!sprite) {
	    sprite = new THREE.Sprite(spriteMaterial);
	}
	
	sprite.scale.set(this.size, this.size, this.size);
	sprite.position.set(x, y, 0);
	
	am.sceneOrtho.add(sprite);
	return sprite;
    };
};

function render() {
    var deltaTime = am.clock.getDelta();

    sprite_controls.clear();    
    am.controls.update( deltaTime );

    // note this....
    //    am.renderer.autoClear = true;        
    am.renderer.render( am.scene, am.camera );
    am.renderer.render( am.grid_scene, am.camera);
    am.renderer.autoClear = false;        
    am.renderer.render(am.sceneOrtho, am.cameraOrtho);
}

function initiation_stuff() {
    // Initialize Three.js
    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
}


function init() {
    initGraphics();
    //    createGround(am);
}

function add_equitetrabeam_helix(am,chi,lambda,rho,radius,pvec,len) {
    am.helices.push(
	{
	    helix_joints: [],
	    helix_members: []
	});
    var onehop = tm.one_hop(radius,rho,len);
    var twohop = tm.two_hop(radius,rho,len);
    var d = tm.find_drho_from_r_el(rho,radius,len);
    var pitch = 2*Math.PI*d/rho;
    am.helix_params.push ({ rho: rho,
			    len: len,
			    chirality: chi,
			    radius: radius,
			    onehop: onehop,
			    twohop: twohop,
			    d: d,
			    pitch: pitch,
			    lambda: lambda});
    
    var hp = am.helix_params.slice(-1)[0];
    load_NTetHelix(am,am.helices.slice(-1)[0],
		   am.NUMBER_OF_TETRAHEDRA,
		   pvec,hp);
        return hp;
}

initiation_stuff();

init();
animate();

// var len = am.INITIAL_EDGE_LENGTH;


function compute_helix_minimax(helix) {
    var min = 100000000;
    var max = 0.0;
    for(var i = 0; i < Math.min(helix.helix_members.length,100); i++) {
	var member = helix.helix_members[i];
	var a = member.a.mesh.position;
	var b = member.b.mesh.position;
	var d = a.distanceTo(b);
	if (i < 100) {
	    console.log("member:",i);
	    console.log("a:",member.a.mesh.position);
	    console.log("b:",member.b.mesh.position);
	    var q0 = 180*Math.atan2(member.a.mesh.position.x,
	    			    member.a.mesh.position.y)/Math.PI;
	    var q1 = 180*Math.atan2(member.b.mesh.position.x,
	    			    member.b.mesh.position.y)/Math.PI;
	    
	    console.log("distance:",d,q1-q0);
	}
	
	if (min > d) min = d;
	if (max < d) max = d;
    }
    console.log("min, max", min, max);
    console.log("score: ", (100*max/min -100) + "%");

    return [min,max,(100*max/min -100)];
}


//  var r0 = (2/3)*Math.sqrt(2/3);
var r0 = (2/3)*Math.sqrt(2/3);
// This is the splitting difference.
// var r0 = Math.sqrt(35/9)/4;
var trial = 0;
var num = 4;
// var pvec0 = new THREE.Vector3((i - 1)*2*am.INITIAL_EDGE_LENGTH,am.INITIAL_HEIGHT,-3);
//add_equitetrabeam_helix_lambda(am, 1.0, pvec0, len);



function draw_central() {
    am.clear_non_floor_body_mesh_pairs();
    for( var i = am.scene.children.length - 1; i >= 0; i--) {
	var obj = am.scene.children[i];
	if (obj.type == "Mesh" && obj.name != "GROUND") {
	    am.scene.remove(obj);
	}
    }
    am.helices = [];
    am.helix_params = [];
    draw_and_register();
}

function draw_and_register() {
    var pvec0 = new THREE.Vector3(0,HELIX_RADIUS*3,-3);
    var hp = draw_new(pvec0);
    var h = am.helices.slice(-1)[0];
    var score = compute_helix_minimax(h)[2];
    hp.score = score;
    hp.inradius = tm.inradius_assumption1(hp.rho,hp.radius);
    register_trials(trial++,OPTIMALITY,RAIL_ANGLE_RHO,HELIX_RADIUS,hp.d,TET_DISTANCE,
		    hp.onehop,
		    hp.twohop,
		    hp.pitch,
		    hp.inradius,
		    hp.score);
}

function draw_new(pvec) {
    return add_equitetrabeam_helix(am,CHIRALITY_CCW,null,
			    RAIL_ANGLE_RHO*Math.PI/180,
			    HELIX_RADIUS,pvec,TET_DISTANCE);
}

function build_central() {
    var pvec0 = new THREE.Vector3(0,0,0);    
    add_equitetrabeam_helix(am,CHIRALITY_CCW,null,RAIL_ANGLE_RHO*Math.PI/180,HELIX_RADIUS,pvec0,TET_DISTANCE);

    // I can't figure out if HELIX_RADIUS is wrong, if
    // my formula is wrong, or if the CylinderGeometry is wrong....
    // The formula checks out in the 2-D case.
    var ir = tm.inradius_assumption1(Math.PI*RAIL_ANGLE_RHO/180,HELIX_RADIUS);


    // Why do I have to divide by 2?
    console.log("inradius", ir);
    {
	var geometry = new THREE.CylinderGeometry( ir, ir, 3, 32 );
	var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
	var cylinder = new THREE.Mesh( geometry, material );
	cylinder.rotateX(Math.PI/2);
	am.scene.add( cylinder );
    }
    // {
    // var geometry = new THREE.CylinderGeometry( HELIX_RADIUS, HELIX_RADIUS, 3, 32 );
    // var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
    // var cylinder = new THREE.Mesh( geometry, material );
    // cylinder.rotateX(Math.PI/2);
    // 	am.scene.add( cylinder );
    // }
    
}


draw_and_register();

for(var i = 0; i < am.helices.length; i++) {
    console.log(am.helix_params[i]);
    compute_helix_minimax(am.helices[i]);
    console.log(am.helix_params[i]);    
}


    </script>

  

