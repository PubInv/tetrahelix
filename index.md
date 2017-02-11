---
layout: default
title: Untwisting the Tetrahelix
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
    pp.castShadow = true;
    pp.receiveShadow = true;
    pp.position.set(pos.x,pos.y,pos.z);
    return pp;

}
// Not sure how to use the quaternion here,
function createSphere(r,pos,material) {
    var ball = new THREE.Mesh( new THREE.SphereGeometry( r, 18, 16 ), material );
    ball.position.set(pos.x,pos.y,pos.z);
    ball.castShadow = true;
    ball.receiveShadow = true;

    return ball;
}

function get_member_color(gui,len) {
    if (len < am.MIN_EDGE_LENGTH)
	return d3.rgb("black");
    else if (len > am.MAX_EDGE_LENGTH)
	return d3.rgb("black");
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
    
    mesh.castShadow = true;
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

function load_NTetHelix(am,helix,tets,pvec,hparams) {

    // Okay, so here we need to create the geometry of the tetrahelix.
    // This could be done in a variety of ways.
    // Probably the most mathematical is to first define a vector
    // representing the center axis, and then use a formula the nth vertex.
    // Looks like some math as been worked out by R. W. Gray:
    // http://www.rwgrayprojects.com/rbfnotes/helix/helix01.html
    // I guess I will use a CounterClockWise (ccw) tetrahelix:
    // Vn = (r cos(n*theta), r sin(n*theta), n*h)

    var len = hparams.len;
    var rho = hparams.rho;
    var d = hparams.d;
    var radius = hparams.radius;
    var lambda = hparams.lambda;
    var n = tets+3;    

    var colors = [ d3.rgb("red"), d3.rgb("yellow"), d3.rgb("blue") ];
    var dcolor = [null,d3.rgb("green"),d3.rgb("purple")];
    console.log("rho",rho);
    for(var i = 0; i < n; i++) {

	var myRho = rho;
	var rail = i % 3;
	var num = Math.floor(i/3);
	var q;
	if ((typeof lambda === 'undefined') || lambda === null) {
	    q = H_general(num,rail,myRho,d,radius);
	} else {
	    q = H_bc_eqt_lambda(num,rail,lambda);	    
	}

	
	var v = new THREE.Vector3(q[0]*len, q[1]*len, q[2]*len);
	v = v.add(pvec);

	var material = new THREE.MeshPhongMaterial( { color: colors[i % 3] } );    

	var pos = new THREE.Vector3();
	pos.set( v.x, v.y, v.z);
	var mesh = createSphere(am.JOINT_RADIUS,pos,material);

	mesh.castShadow = true;
	mesh.receiveShadow = true;
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

function compute_helix_minimax(helix) {
    var min = 100000000;
    var max = 0.0;
    for(var i = 0; i < helix.helix_members.length; i++) {
	var member = helix.helix_members[i];
	var a = member.a.mesh.position;
	var b = member.b.mesh.position;
	var d = a.distanceTo(b);
	if (i < 10) {
	console.log("member:",i);
	console.log("a:",member.a);
	console.log("b:",member.b);

	    console.log("distance:",d);
	}
	
	if (min > d) min = d;
	if (max < d) max = d;
    }
    console.log("min, max", min, max);
    console.log("score: ", (100*max/min -100) + "%");
    return [min,max];
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


    this.INITIAL_EDGE_LENGTH = 0.3;
    this.INITIAL_EDGE_WIDTH = this.INITIAL_EDGE_LENGTH/40;
    this.INITIAL_HEIGHT = 3*this.INITIAL_EDGE_LENGTH/2;

    this.NUMBER_OF_TETRAHEDRA = 70;
    //       this.NUMBER_OF_TETRAHEDRA = 5;


    this.JOINT_RADIUS = 0.03*this.INITIAL_EDGE_LENGTH; // This is the current turret joint ball.

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
    delete mesh["ammo_obj"];
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
    am.renderer.setClearColor( am.scene.fog.color );
    
    am.renderer.setPixelRatio( window.devicePixelRatio );
    am.renderer.setSize( window.innerWidth, window.innerHeight*am.window_height_factor );
    am.SCREEN_WIDTH = am.renderer.getSize().width;
    am.SCREEN_HEIGHT = am.renderer.getSize().height;
    am.camera.radius = ( am.SCREEN_WIDTH + am.SCREEN_HEIGHT ) / this.CAMERA_RADIUS_FACTOR;


    am.cameraOrtho = new THREE.OrthographicCamera( 0, am.SCREEN_WIDTH, am.SCREEN_HEIGHT, 0, - 10, 10 );
    
    am.renderer.shadowMap.enabled = true;
    am.renderer.physicallyCorrectLights = true;
    am.renderer.gammaInput = true;
    am.renderer.gammaOutput = true;

//    am.textureLoader = new THREE.TextureLoader();

    
    var bulbGeometry = new THREE.SphereGeometry( 0.02, 16, 8 );
    bulbLight = new THREE.PointLight( 0xffee88, 6 , 1000, 2 );
    bulbMat = new THREE.MeshStandardMaterial( {
	emissive: 0xffffee,
	emissiveIntensity: 1,
	color: 0xFF0000
    });

    bulbLight.power = bulbLuminousPowers[ 3];
    bulbMat.emissiveIntensity = bulbLight.intensity / Math.pow( 0.02, 2.0 ); // convert from intensity to irradiance at bulb surface

    
    bulbLight.add( new THREE.Mesh( bulbGeometry, bulbMat ) );
    bulbLight.position.set( 0, 20, 20 );
    bulbLight.castShadow = true;
    //  am.scene.add( bulbLight );

    var light = new THREE.PointLight( 0xffcccc, 100, 100 );
    light.castShadow = true;
    light.position.set( 0, 5, 0 );
    am.scene.add( light );
    
    hemiLight = new THREE.HemisphereLight( 0xddeeff, 0xffffff, 1 );
    am.scene.add( hemiLight );
/*    floorMat = new THREE.MeshStandardMaterial( {
	roughness: 0.8,
	color: 0xffffff,
	metalness: 0.2,
	bumpScale: 0.0005
    });
    ballMat = new THREE.MeshStandardMaterial( {
	color: 0xffffff,
	roughness: 0.5,
	metalness: 1.0
    });
    
    var floorGeometry = new THREE.PlaneBufferGeometry( 20, 20 );
    var floorMesh = new THREE.Mesh( floorGeometry, floorMat );
    floorMesh.receiveShadow = true;
    floorMesh.rotation.x = -Math.PI / 2.0;

    am.scene.add( floorMesh );
*/
    /*
    var ambientLight = new THREE.AmbientLight( 0x404040 );


    // lights
    var light, materials;
    am.scene.add( new THREE.AmbientLight( 0x666666 ) );
    am.scene.add( new THREE.HemisphereLight( 0x443333, 0x111122 ) );

    addShadowedLight(am.scene, 1, 1, 1, 0xffffff, 1.35 );
    addShadowedLight(am.scene, 0.5, 1, -1, 0xffaa00, 1 );

*/
    am.grid_scene = new THREE.Scene();
    am.grid_scene.fog = new THREE.Fog( 0x000000, 500, 10000 );    
    
    am.grid_scene.add( new THREE.AmbientLight( 0x666666 ) );
/*    
    light = new THREE.DirectionalLight( 0xffffff, 10 );
    var d = 20;

    light.position.set( -d, d, -d );

    light.castShadow = true;
    //light.shadow.CameraVisible = true;

    light.shadow.MapWidth = 1024;
    light.shadow.MapHeight = 1024;

    light.shadow.CameraLeft = -d;
    light.shadow.CameraRight = d;
    light.shadow.CameraTop = d;
    light.shadow.CameraBottom = -d;

    light.shadow.CameraFar = 3*d;
    light.shadow.CameraNear = d;
    light.shadow.Darkness = 0.5;
    
    am.grid_scene.add(light);
    am.scene.add(light);    

*/
    //    grid_scene.fog = new THREE.Fog( 0x000000, 500, 10000 );
//    am.grid_scene.add( new THREE.AmbientLight( 0x666666 ) );    

//    addShadowedLight(am.grid_scene, 1, 1, 1, 0xffffff, 1.35 );
    //    addShadowedLight(am.grid_scene, 0.5, 1, -1, 0xffaa00, 1 );



    
    am.scene.fog = new THREE.Fog( 0xffffff, 1, 5000 );
    am.scene.fog.color.setHSL( 0.6, 0, 1 );

    // LIGHTS
    var hemiLight,dirLight;
    
    hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
    hemiLight.color.setHSL( 0.6, 1, 0.6 );
    hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    hemiLight.position.set( 0, 500, 0 );
    am.scene.add( hemiLight );

    //

    dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
    dirLight.color.setHSL( 0.1, 1, 0.95 );
    dirLight.position.set( -1, 1.75, 1 );
    dirLight.position.multiplyScalar( 50 );
    am.scene.add( dirLight );

    dirLight.castShadow = true;

    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    var d = 50;

    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;

    dirLight.shadow.camera.far = 3500;
    dirLight.shadow.bias = -0.0001;

    // GROUND
    var groundGeo = new THREE.PlaneBufferGeometry( 10000, 10000 );
    var groundMat = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x050505 } );
    groundMat.color.setHSL( 0.095, 1, 0.75 );

    var ground = new THREE.Mesh( groundGeo, groundMat );
    ground.rotation.x = -Math.PI/2;
    ground.position.y = 0;
    am.scene.add( ground );

    ground.receiveShadow = true;
    // SKYDOME

    var vertexShader = document.getElementById( 'vertexShader' ).textContent;
    var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
    var uniforms = {
	topColor:    { value: new THREE.Color( 0x000000 ) },
	bottomColor: { value: new THREE.Color( 0xffffff ) },
	offset:      { value: 33 },
	exponent:    { value: 0.6 }
    };
    uniforms.topColor.value.copy( hemiLight.color );

    am.scene.fog.color.copy( uniforms.bottomColor.value );

    var skyGeo = new THREE.SphereGeometry( 4000, 32, 15 );
    var skyMat = new THREE.ShaderMaterial( { vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide } );

    var sky = new THREE.Mesh( skyGeo, skyMat );
    am.scene.add( sky );

    
    // HACK:  These diemensions are probably not right here!
    gridInit(am.grid_scene,am.playgroundDimensions);
    
    am.container.innerHTML = "";

    am.container.appendChild( am.renderer.domElement );

    //    stats = new Stats();
    //    stats.domElement.style.position = 'absolute';
    //    stats.domElement.style.top = '0px';
    //    container.appendChild( stats.domElement );

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

var reds = [];
var blues = [];
var yells = [];

function test_ccw_tetrahelix_formula() {
    for(var i = 0; i < 6; i = i+3) {
	var red = ccw_tetrahelix_vertex(i,1.0);
	reds[i / 3] = red;
	var yell = ccw_tetrahelix_vertex(i+1,1.0);	
	yells[i / 3] = yell;
	var blue = ccw_tetrahelix_vertex(i+2,1.0);	
	blues[i /3] = blue;
    }
    
    for(var i = 0; i < 1; i++) {
//	var v = ccw_tetrahelix_vertex(i,1.0);
	console.log("red");
	console.log(reds[i].distanceTo(reds[i+1]));
	console.log("blue");
	console.log(blues[i].distanceTo(blues[i+1]));	
	console.log("yellow");
	console.log(yells[i].distanceTo(yells[i+1]));		

    
	console.log("orangeeven");
//	console.log(Math.distanceTo(reds[i],yells[i]));
	console.log(reds[i].distanceTo(yells[i]));	
	console.log("orangeodd");
//	console.log(Math.distanceTo(yells[i],reds[i+1]));
	console.log(yells[i].distanceTo(reds[i+1]));		

	console.log("purpleeven");
//	console.log(Math.distanceTo(reds[i],blues[i]));
	console.log(reds[i].distanceTo(blues[i]));			
	console.log("purpleodd");
//	console.log(Math.distanceTo(blues[i],reds[i+1]));
	console.log(blues[i].distanceTo(reds[i+1]));				

	console.log("greeneven");
//	console.log(Math.distanceTo(yells[i],blues[i]));
	console.log(yells[i].distanceTo(blues[i]));					
	console.log("greenodd");
	console.log(blues[i].distanceTo(yells[i+1]));						
//	console.log(Math.distanceTo(blues[i],yells[i+1]));

    }
}
var radius0;
var radius1;

function add_helices(am,num) {
    for(var i = 0; i < num; i++) {
	
    var pvec = new THREE.Vector3(-4 + i*2,am.INITIAL_HEIGHT,-3);
    var len = am.INITIAL_EDGE_LENGTH/2;
    am.helices.push(
	{
	    helix_joints: [],
	    helix_members: []
	});
	am.helix_params.push ({ rho: BCrho/(i+1),
			 d: len*BCd,
			     len: len,
			     lambda: (i) / (num - 1)});
	var hp = am.helix_params[i];
	
	radius = find_rrho_from_d_el(hp.rho,hp.d,hp.len);
	
    am.helix_params[i].radius = radius;

    load_NTetHelix(am,am.helices[i],
		   am.NUMBER_OF_TETRAHEDRA,
		   pvec,hp);
    }
}

function add_equitetrabeam_helix(am,lambda,rho,radius,pvec,len) {

    am.helices.push(
	{
	    helix_joints: [],
	    helix_members: []
	});
    am.helix_params.push ({ rho: rho,
			    len: len,
			    radius: radius,
			    lambda: lambda});
    
    var hp = am.helix_params.slice(-1)[0];
//    var d = find_drho_from_r_el(hp.rho,hp.r,hp.len);
    
    hp.d = len;

    load_NTetHelix(am,am.helices.slice(-1)[0],
		   am.NUMBER_OF_TETRAHEDRA,
		   pvec,hp);
}

function add_equitetrabeam_helix_lambda(am,lambda,pvec,len) {

    am.helices.push(
	{
	    helix_joints: [],
	    helix_members: []
	});
    am.helix_params.push ({ 
			    len: len,
			    lambda: lambda});
    
    var hp = am.helix_params.slice(-1)[0];
//    var d = find_drho_from_r_el(hp.rho,hp.r,hp.len);
    
    hp.d = len;

    load_NTetHelix(am,am.helices.slice(-1)[0],
		   am.NUMBER_OF_TETRAHEDRA,
		   pvec,hp);
}

initiation_stuff();

init();
animate();
//add_helices(am,1);

var len = am.INITIAL_EDGE_LENGTH;


//  var r0 = (2/3)*Math.sqrt(2/3);
var r0 = (2/3)*Math.sqrt(2/3);
// This is the splitting difference.
// var r0 = Math.sqrt(35/9)/4;

var num = 10;
for (var i = 0; i < num+1; i++ ) {
    var pvec0 = new THREE.Vector3((i - 5)*2*am.INITIAL_EDGE_LENGTH,am.INITIAL_HEIGHT,-3);    
    add_equitetrabeam_helix_lambda(am,2 * (i - 5) / (num) ,pvec0,len);
}

 for(var i = 0; i < am.helices.length; i++) {
    console.log(am.helix_params[i]);
    compute_helix_minimax(am.helices[i]);
    console.log(am.helix_params[i]);    
 }
    </script>

  

