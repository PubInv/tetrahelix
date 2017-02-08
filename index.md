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
    </h1>
    <h2 id="sub_message">    
    </h2>
    <button onclick="start_trial()">Start New Trial!</button>
    <button onclick="pause()">Pause</button>
    <button onclick="my_clear()">Clear Traces</button>
    <button onclick="toggle_sound()">Toggle Sound</button>
    <button onclick="toggle_bracelet()">Toggle Bracelet Debug Lines</button>
    <button onclick="toggle_single()">Toggle Single Pendulum</button>    


<p>
    <label for="initial_angle_val">Initial Angle (If you move this, the divergence will become incorrect.)</label>
  <input type="text" id="initial_angle_val" readonly style="border:0; color:#f6931f; font-weight:bold;">
    <div id="angle_range_max"></div>
</p>    
    
<p>
    <label for="divergence_definition_val">Distance to count as Divergence (cm)</label>
  <input type="text" id="divergence_definition_val" readonly style="border:0; color:#f6931f; font-weight:bold;">
    <div id="divergence_definition"></div>
</p>    

<p>
    <label for="trial_length_val">Length of Trial (s)</label>
  <input type="text" id="trial_length_val" readonly style="border:0; color:#f6931f; font-weight:bold;">
    <div id="trial_length_max"></div>
</p>
    

<p>
    <label for="tick_time_val">Tick Time (ms)</label>
  <input type="text" id="tick_time_val" readonly style="border:0; color:#f6931f; font-weight:bold;">
    <div id="tick_time_slider"></div>
</p>


<p>
    <label for="random_angle_val">Maximum Random Start Deviation (arcminutes of degrees, 60 arcminutes = 1 degree)</label>
  <input type="text" id="random_angle_val" readonly style="border:0; color:#f6931f; font-weight:bold;">
    <div id="random_angle_slider"></div>
</p>
    

 
</section>
    
    <section id="trials" style="{border: red;}">
    
<div id="table-wrapper">
  <div id="table-scroll">
    <table id="trialrecords">
     <tr>
    <th>Trial </th>
    <th>Angle Variation</th>
    <th>Time To Divergence</th>
    <th>Divergence Def.</th>
    </tr>
    </table>
  </div>
</div>    
    
    </section>
    
    <h1> Untwisting the Tetrahelix </h1>

        </section>

        <script>

/* TODO:

-- get new and improved version of pixi.js to be able to make much better shapes???
-- Make it look prettier
-- convert to My formatting stuff.


-- draw borders around the rectangles
-- Create the trace for the single pendulum and do the same computation there.
-- Allow everything to be parameterized.
-- Add a way to set the angles by handle.
-- Say "Weclome Rascally Rabbit!"
-- Provide a way to slow things down.
-- change pointers to be pretty arrows or human figures



This stuff is harder:
-- Stop game when the trace is new and report "Congratulations, you found new trace never found before!" 
"It took X seconds".
-- need a way to store the traces

*/ 
    var w, h, canvas, ctx, circleBody;
var bodies = {};
var bgraphs = {};

// These time series will be used to compute the distance
var current_time_series = [];
var last_time_series = [];
var standard_time_series;
var best_match_series;
var best_match_time; // This is in seconds.


var renderer, stage, container,  zoom,boxShape, boxBody, planeBody, planeShape;

var trace_graphics = [];
var standard_graphics;
var best_match_graphics;


// I THINK P2.js uses the KMS system of units.
var L = 1.0; // Let's assume a 1 meter length!!!
var L1 = L/2;
var L2 = L/3;

var DEGREES_OF_VARIATION_A_S = 4*60; // This is in arc-seconds!

// This is meters!
var DIVERGENCE_DEFINITION = 0.3; 

var ANGULAR_DAMPING = 0.02; // (Between 1.0 and 0.0)
var LINEAR_DAMPING = 0.02; // (Between 1.0 and 0.0)
    
var origin = [0,0];
var SL = L*2;
var TL = 1.0;
var r1 = 6;
var r2 = 4;
var L1 = SL*TL*r1/(r1+r2); // First arm
var L2 = SL*TL*r2/(r1+r2); // Second arm

var TRIAL_LENGTH = 20; // this is in seconds
var TICK_MS = 500;
var MAX_NUM_TICKS = TRIAL_LENGTH * 1000 / TICK_MS;

var trial_number = 0;
var trial_initial_angle_diff = 0;

var initial_angle_deg = 70, // raise angle, ccw from x axis, in degrees.
    initial_angle = (initial_angle_deg/360) * 2.0 * Math.PI;

var hang_angle_deg = 270,
    hang_angle = (hang_angle_deg/360) * 2.0 * Math.PI;    

var single_arm_pos;
var d1_arm_pos;    
var d2_arm_pos;

single_arm_pos = [origin[0] + Math.cos(initial_angle)*SL/2 , origin[1] + Math.sin(initial_angle)*SL/2 ];
d1_arm_pos = [origin[0] + Math.cos(initial_angle)*L1/2 , origin[1] + Math.sin(initial_angle)*L1/2 ];
d2_arm_pos = [d1_arm_pos[0] + Math.cos(initial_angle)*L1/2 +  Math.cos(hang_angle)*(L2)/2,
	      d1_arm_pos[1] + Math.sin(initial_angle)*L1/2 +  Math.sin(hang_angle)*(L2)/2];

 var PLAYER = Math.pow(2,0),
                        SINGLE =  Math.pow(2,1),
                        DOUBLE = Math.pow(2,2)

var GRAVITY = -9.82;
// This is used to slow the system down for testing.
var GRAVITY_SLOWDOWN = 0.1;
var buttons = {
    space : false,
    left :  false,
    right : false,
}
var sarmBody;

var armBody;
var secondArmBody;

var world;
var dummyBody1;
var dummyBody2;

var divergence_interval = [-1,[]];

var NUM_TRACES_TO_SHOW = 4;

var GOOD_GREEN_COLOR = "0x00DD00";
var GOOD_RED_COLOR = "0xFF3333";
var GOOD_BLUE_COLOR = "0x3333FF";

var WORLD_STEP = 1/60;

function start_trial() {
    last_time_series = current_time_series;
    // Is this is the first one, record it as standard.
    if (!standard_time_series) {
	standard_time_series = last_time_series.slice();
    }
    current_time_series = [];
    var random_degree = (Math.random() * DEGREES_OF_VARIATION_A_S / 60.0 ) - (DEGREES_OF_VARIATION_A_S / 60.0)/2;
    trial_initial_angle_diff = random_degree;
    var random_rads = (random_degree / 360) * 2.0 * Math.PI;
    reset_single_pendulum(random_rads);
    reset_double_pendulum(random_rads);
    firstTime = null;
    lastReportedTime = null;
    ticks = null;
    lastReportTime = null;
    paused = false;
    divergence_interval = [-1,[]];
    new_trace_toggle = false;
    for(var i = 0; i < trace_graphics.length; i++) {
	if (trace_graphics[i] != best_match_graphics) {
	    trace_graphics[i].alpha *= 0.03;
	    // Let's desaturate these to make them less distracting!
//	    trace_graphics[i].tint = "0xaaaaaa";
	} 
    }
    for(var i = NUM_TRACES_TO_SHOW; i < trace_graphics.length; i++) {
	if (trace_graphics[i] != best_match_graphics) {
	    container.removeChild(trace_graphics[i]);
	}
    }
    if (best_match_graphics) {
	
	render_trace(best_match_graphics,best_match_series,GOOD_GREEN_COLOR);
    }
    trace_graphics.slice(0,NUM_TRACES_TO_SHOW-1);
    trace_graphics.unshift(new PIXI.Graphics());
    container.addChild(trace_graphics[0]);
    $("#message_banner").text("New Trial Started!");		    
}

function render_trace(graphics,time_series,color) {
    if (graphics && time_series) {
	for (var i = 0; i < time_series.length; i++) {
	    graphics.beginFill(color);
    	    graphics.lineStyle(0.01,color,1);	    
	    var pos = time_series[i][3];
	    graphics.drawRect(pos[0], pos[1], 0.01, 0.01);
	}
    }
}


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

function playSound (id) {
    if (sound_on)    
    document.getElementById(id).play();
}



var paused = false;
function pause() {
    paused = !paused;
    if (!paused) 
        requestAnimationFrame(animate);    
}
var sound_on = false;
function toggle_sound() {
    sound_on = !sound_on;
    if (!sound_on)
	playSound('ding');
}

var DRAW_BRACELET_DEBUGGING_LINES = true;
function toggle_bracelet() {
    DRAW_BRACELET_DEBUGGING_LINES = !DRAW_BRACELET_DEBUGGING_LINES;
}

var RENDER_SINGLE = false;
function toggle_single() {
    RENDER_SINGLE = !RENDER_SINGLE;
}

function my_clear() {
    for(var i = 0; i < trace_graphics.length; i++) {
	trace_graphics[i].clear();
    }
    render_trace(standard_graphics,standard_time_series,GOOD_RED_COLOR);
    render_trace(best_match_graphics,best_match_series,GOOD_GREEN_COLOR);    
}

function random_color() {
    return '0x'+Math.floor(Math.random()*16777215).toString(16);
}


function debug_time_series_distance(t1,t2) {
    for(var i = 0; i < Math.min(t1.length,t2.length); i++) {
	var a = t1[i][3];
	var b = t2[i][3];
	console.log("i = a, b : "+ i + " = " + a+" , " + b);
	console.log(distance(a,b));	
    }
}
// This could be replaced with a binary search
function get_value_from_time_series(ts,t) {
    for(var i = 0; i < ts.length; i++) {
	var entry = ts[i];
	if (entry[0] >= t) {
	    return entry;
	}
    }
    return null;
}


// Here is my attempt to develop an an online-algorithm for determining
// the point of divergence between two time series.
//
// inputs:
// ol - online time series which is growing.
// i -- the index of the point to test (probably the index of the last value in online in online usage)
// ts - the time series we are testing against.
// ds - a pair, consisting of the next index to process from, and an interval. the last region computed by diverge (i-1) (the empty set set at start).
// ds = [p,[start,finish]] --- p means the point p has start and finish interval.
// b -- the "bracelet" distance
// Note a region is an interval [j,k] where j is a contained member, but k is not.
// if j == k, there are not elmentes in the interval.
// An empty array [] corresponds to an interval with no elements.
// 
// 
// outputs:
// The regions (ds) for the new point.
//
function diverge(ol,i,ts,ds,b) {
    var p = ds[0];
    if ((ds[1].length == 0) && p >= 0) return ds;
    if (i >= ol.length) return ds;
    

    // This is weird, I should probably use an object instead of an array here..
    if (p < 0) p = 0;
    var ret = [];
    while(p <= i) {
	var x = ol[p][3][0];
	var y = ol[p][3][1];
	// first we advance the end of the interval as far as possible.
	var finish = (ds[1].length == 0) ? 0 : ds[1][1];
	var done = false;
	while(!done && finish < ts.length) {
	    var d = distance([x,y],ts[finish][3]);
	    if (d <= b) {
		finish++;
	    } else {
		done = true;
	    }
	}
	ret[1] = finish;
	// now adance the back of the interval as required.
	done = false;
    
	var start = (ds[1].length == 0) ? 0 : ds[1][0];
	var done = false;
	while(!done && start < finish) {
	    var d = distance([x,y],ts[start][3]);
	    if (d > b) {
		start++;
	    } else {
		done = true;
	    }
	}
	ds[1][0] = start;
	ds[1][1] = finish;
	ret[0] = p;
	ret[1] = [start,finish];
	p++;
    }
    if (ret[1][0] == ret[1][1]) {
	console.log(ret);
	console.log("returning nothing");
	return [p,[ret[1][0]]];
    }
    return ret;
}

Array.prototype.compare = function(testArr) {
    if (this.length != testArr.length) return false;
    for (var i = 0; i < testArr.length; i++) {
        if (this[i].compare) { 
            if (!this[i].compare(testArr[i])) return false;
        }
        if (this[i] !== testArr[i]) return false;
    }
    return true;
}



// Create two time series and see when they diverge.
function test_diverge0() {
    var t = [[0,null,null,[0,0]],
	     [1,null,null,[1,1]],
	     [2,null,null,[2,2]],
	     [3,null,null,[3,3]],
	     [4,null,null,[4,4]]	     
	    ];
    var s = [[0,null,null,[0,0]],
	     [1,null,null,[1.1,1.1]],
	     [2,null,null,[2.2,2.2]],
	     [3,null,null,[3.3,3.3]],
	     [4,null,null,[4.4,4.4]]	     
	    ];
    var ds = [-1,[]];
    var b = 0.3;
    var divergent = [];
    for(var i = 0; i < s.length; i++) {
	ds = diverge(s,i,t,ds,b);
	console.log(ds);
	if (ds[1].length != 2) {
	    divergent.push(i);
	}
    }
    if (divergent.compare([3,4])) {
	console.log("Success!");
    } else {
	console.log("Failure!");
    }
    
}

function distance(v1,v2) {
    var dx = v1[0]-v2[0];
    var dy = v1[1]-v2[1];
    return Math.sqrt(dx*dx + dy*dy);
}

var new_trace_toggle = false;

function add_row(graphics,ticks,time) {
    var table = document.getElementById("trialtable");
    var b = bodies["secondArmBody"];    
    // Note adding in Math.PI/2 here creates creates a system of positive degrees to the right, negative to the left, probably what we want...
    var s = (bodies["sarmBody"].angle + Math.PI/2) * 180 / Math.PI;
    var d = ( Math.PI/2 + Math.atan2(b.position[1],b.position[0]))*180/Math.PI;

    var row = table.insertRow(1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    cell1.innerHTML = ""+ticks;
    cell2.innerHTML = ""+time.toFixed(1);    
    cell3.innerHTML = ""+s.toFixed(0) ;
    cell4.innerHTML = ""+d.toFixed(0) ;

    var dist_string = "NA";
    var dist;
    var entry;
    if (standard_time_series) {
	var len = current_time_series.length;
	var cur = find_tip_of_second_arm(b);
	// NOTE: I should be able to use the vec2 library for this, but can't figure out how to include it!
	divergence_interval = diverge(current_time_series,len-1,standard_time_series,
				      divergence_interval,DIVERGENCE_DEFINITION);

	if (!new_trace_toggle) {
	    if (divergence_interval[1].length == 2) {
		var p = divergence_interval[0]; // this is on current_time_series		
		var start = divergence_interval[1][0];
		var finish = Math.min(divergence_interval[1][1],standard_time_series.length-1);
		var median = Math.floor((start + finish)/2); // These are indices, so must be ints.
		dist = distance(cur,standard_time_series[median][3]);

		dist_string = "" + dist.toFixed(2) + "m";

		if (DRAW_BRACELET_DEBUGGING_LINES) {
		    graphics.beginFill("0x000000");
		    graphics.lineStyle(0.02*(dist/DIVERGENCE_DEFINITION),"0x000000",1);
		    
		    graphics.moveTo(current_time_series[p][3][0],current_time_series[p][3][1]);
		    graphics.lineTo(standard_time_series[median][3][0],standard_time_series[median][3][1]);
		}
	    } else {
		var final = divergence_interval[1][0];
		var p = Math.min(current_time_series.length-1,divergence_interval[0]); // this is on current_time_series
		new_trace_toggle = true;
		// Now we need to see if this is the best trace....
		if (DRAW_BRACELET_DEBUGGING_LINES) {
		    graphics.beginFill("0xFF0000");
		    dist = distance(cur,standard_time_series[final][3]);
		    graphics.lineStyle(Math.min(0.1,0.02*(dist/DIVERGENCE_DEFINITION)),"0xFF0000",1);
		    graphics.moveTo(current_time_series[p][3][0],current_time_series[p][3][1]);
		    graphics.lineTo(standard_time_series[final][3][0],standard_time_series[final][3][1]);
		}

		var computed_time = p * WORLD_STEP;

		// now, if we have found the best trace, we will set it so...
		if (!best_match_series || (best_match_series && (best_match_time < computed_time))) {
		    best_match_series = current_time_series;
		    best_match_time = computed_time;
		    best_match_graphics = graphics;
		    $("#message_banner").text("Congrats! You've found the closest trace so far at "+computed_time.toFixed(2)+"s");
		    $("#sub_message").text("Longest Trace so far: "+best_match_time.toFixed(2)+"s");
		} else {
		    $("#message_banner").text("Trace diverged at "+computed_time.toFixed(2)+"s");		    
		}


		dist_string = "NA";
		register_trials(trial_number,trial_initial_angle_diff,computed_time,DIVERGENCE_DEFINITION);
		trial_number++;
	    }
	}
    }

    cell5.innerHTML = ""+dist_string;
    if ( new_trace_toggle) {
	row.setAttribute("class", "newtrace");
    }
    if (ticks >= MAX_NUM_TICKS) {
	start_trial();
    }
}

init();

requestAnimationFrame(animate);

function init_world() {
    world = new p2.World({
        gravity : [0,GRAVITY*GRAVITY_SLOWDOWN]
    });

    world.solver.iterations = 30;
    world.solver.tolerance = 0.01;

    // Create static dummy body that we can constrain other bodies to

    init_double_pendulum();
    init_single_pendulum();

}

function init(){

    init_world();
    // Pixi.js zoom level
    zoom = 150;

    var section = document.getElementById("visualsection");
    // Initialize the stage
    var w = section.offsetWidth;
    var h = section.offsetHeight;
    
    renderer =  PIXI.autoDetectRenderer(w, h,{backgroundColor : "0xFFFFFF"}),
    stage = new PIXI.Stage(0xFFFFFF);

    // We use a container inside the stage for all our content
    // This enables us to zoom and translate the content
    container =     new PIXI.DisplayObjectContainer(),
    
    stage.addChild(container);

    // Add the canvas to the DOM
    var section = document.getElementById("visualsection");
    section.appendChild(renderer.view);

    // Add transform to the container
    container.position.x =  renderer.width/2; // center at origin
    container.position.y =  renderer.height/2;
    container.scale.x =  zoom;  // zoom in
    container.scale.y = -zoom; // Note: we flip the y axis to make "up" the physics "up"


    // Draw the box.
    standard_graphics = new PIXI.Graphics();

    add_bodies(container,bodies);
    // Add the box to our container
    container.addChild(standard_graphics);
}
var bunny;
function add_bodies(container,bodies,standard_graphics) {
    for (var key in bodies) {
	var b = bodies[key];
        // Draw the box.
        var g = new PIXI.Graphics();
	bgraphs[key] = g;
	if (b.name == "armBody") {
	    g.beginFill(b.color);
	    var w = b.shapes[0].width;
	    var h = b.shapes[0].height;
	    g.drawRect(-w/2, -h/2, w, h);
	    // We want to replace this with the sprite!
	    container.addChild(g);
	}
	if ((b.name == "sarmBody")) {
	    g.beginFill(b.color);
	    var w = b.shapes[0].width;
	    var h = b.shapes[0].height;
	    g.drawRect(-w/2, -h/2, w, h);
	    // We want to replace this with the sprite!
	    container.addChild(g);
	}
	if (b.name == "secondArmBody") {

	// create the root of the scene graph
// var stage = new PIXI.Container();

	    // create a texture from an image path
	    var texture = PIXI.Texture.fromImage('images/noun_196907.png');
	    
	    // create a new Sprite using the texture	    
	    bunny = new PIXI.Sprite(texture);
	    bunny.anchor.x = 0.45;
	    bunny.anchor.y = 0;
	    var sc= L2/8;
	    var fudge = 1.05;
	    bunny.scale = new PIXI.Point(sc*fudge,sc*fudge);
// move the sprite to the center of the screen
	    bunny.position.x = 0;
	    bunny.position.y = 0;
	    stage.addChild(bunny);
	}
    }

}

function normalizeAngle(angle){
                        angle = angle % (2*Math.PI);
                        if(angle < 0){
                            angle += (2*Math.PI);
                        }
                        return angle;
}

function find_tip_of_second_arm(b) {
    var theta = normalizeAngle(b.angle);
    theta = normalizeAngle(theta);
    var len = L2/2;
    var pos = [b.position[0]+len*Math.cos(theta),b.position[1]+len*Math.sin(theta)];
    return pos;
}

function drawBodies(graphics,bs,gs) {
    for (var key in bodies) {
	var b = bodies[key];
	var g = gs[key];
	// Transfer positions of the physics objects to Pixi.js
	g.position.x = b.position[0];
	g.position.y = b.position[1];
	g.rotation =   b.angle;
	if (b.name == "sarmBody") {
	    g.visible = RENDER_SINGLE;
	}
	if (b.name == "secondArmBody") {
	    graphics.beginFill(b.color);
    	    graphics.lineStyle(0.01,b.color,1);	    
	    pos = find_tip_of_second_arm(b);
	    graphics.drawRect(pos[0], pos[1], 0.01, 0.01);
	    var a = new PIXI.Point(pos[0],pos[1]);
	    var c = graphics.toGlobal(a);
	    bunny.position.x = c.x;
	    bunny.position.y = c.y;
	    bunny.rotation = -b.angle + Math.PI/2;
	} 
    }
}

// all times in milliseconds, I guess.
var maxSubSteps = 5; // Max physics ticks per render frame
var fixedDeltaTime = 1 / 60; // Physics "tick" delta time
var lastReportedTime;
var lastTime;
var firstTime;
var ticks = 0;
var SOUND_ANGLE = 4.0;
var SOUND_ANGLE_SINGLE = 5.0;
// Animation loop
function animate(time){
    
    if (paused) return;
    
    time = time || 0;
    lastTime = lastTime || time;
    lastReportedTime = lastReportedTime || 0;
    firstTime = firstTime || time;

    // Now let us record the time series stuff....
    var s = (bodies["sarmBody"].angle + Math.PI/2) * 180 / Math.PI;
    var d = ( Math.PI/2 + Math.atan2(bodies["secondArmBody"].position[1],bodies["secondArmBody"].position[0]))*180/Math.PI;

    var b = bodies["secondArmBody"];
    var f = bodies["armBody"];    
    var pos = find_tip_of_second_arm(b);
    // HACK: is this right?
    current_time_series.push([(lastTime-firstTime)/TICK_MS,s,d,[pos[0],pos[1]]]);

    // Now here is a little trick -- we will play a ding when the arm is close to full extension!!
    if (Math.abs(b.angle - f.angle) < SOUND_ANGLE*Math.PI/180) {
	playSound('ding');
    }

    // Now here is a little trick -- we will play a ding when the arm is close to full extension!!
    // Note that zero is downward here.
    if (Math.abs(s) < SOUND_ANGLE_SINGLE) {
	playSound('tock');
    }

    // Now compute the next step
    
    var deltaTime = lastTime ? (time - lastTime) / 1000 : 0;
    lastTime = time;

    var cur_graphics = (trace_graphics.length == 0) ? standard_graphics : trace_graphics[0];	


    if ((lastTime - lastReportedTime) >= TICK_MS) {
	add_row(cur_graphics,ticks,(lastTime-firstTime)/1000);
	ticks++;
	lastReportedTime = lastTime;
    }
    // Make sure the time delta is not too big (can happen if user switches browser tab)
    deltaTime = Math.min(1 / 10, deltaTime);

    fixedDeltaTime = WORLD_STEP;
    // Move physics bodies forward in time
    world.step(fixedDeltaTime, deltaTime, maxSubSteps);

    if (trace_graphics.length == 0) {
	drawBodies(standard_graphics,bodies,bgraphs);
    } else {
	drawBodies(trace_graphics[0],bodies,bgraphs);	
    }
    // Render scene
    renderer.render(stage);
    
    requestAnimationFrame(animate);    
}

// Get current time, in seconds.
function time(){
    return new Date().getTime() / 1000;
}


function init_double_pendulum() 
{
    // Create arm

    // Create static dummy body that we can constrain other bodies to
    dummyBody2 = new p2.Body({
        mass: 0,
    });
    world.addBody(dummyBody2);
    
    var armShape =  new p2.Box({ width: L1, height: 0.03*L });
    armShape.collisionGroup = DOUBLE;            
    armBody = new p2.Body({
        mass: 2,
	position: [L1/2,0],
    });
    armBody.addShape(armShape,d1_arm_pos,initial_angle_deg);
    
    armBody.velocity = [0,0];
    
    armBody.angularVelocity = 0;
    

    armBody.name = "armBody";
    world.addBody(armBody);
    armBody.color =  "0xaaaaff";

    bodies[armBody.name] = armBody;

    // Constrain it to the world
    var c = new p2.RevoluteConstraint(armBody, dummyBody2, {
        worldPivot: origin,
        collideConnected: false
    });

    world.addConstraint(c);

    // SecondArm
    var secondArmShape = new p2.Box({ width: L2, height: 0.1*L });
    armShape.collisionGroup = DOUBLE;            
    secondArmBody = new p2.Body({
        mass: 2,
	position: d2_arm_pos,
	angle: 0,
    });

    secondArmBody.velocity = [0,0];
    secondArmBody.angularVelocity = 0;    

    
    armShape.collisionGroup = SINGLE;
    
    
    secondArmBody.addShape(secondArmShape);
    secondArmBody.name = "secondArmBody";
    secondArmBody.color = "0xff0000";
    world.addBody(secondArmBody);

    bodies[secondArmBody.name] = secondArmBody;    

    // Connect secondArm to arm

    var c3 = new p2.RevoluteConstraint( armBody,secondArmBody, {
        localPivotA:
	    [L1/2 ,
	     0],
	localPivotB:
	[-L2/2,0],
        collideConnected: false
    });
    world.addConstraint(c3);
    
    armBody.angle = initial_angle;
    secondArmBody.angle = hang_angle;
    world.step(WORLD_STEP);
    armBody.angle = initial_angle;
    secondArmBody.angle = hang_angle;
        world.step(WORLD_STEP);
    armBody.angle = initial_angle;
    secondArmBody.angle = hang_angle;

    secondArmBody.angularDamping = ANGULAR_DAMPING;
    secondArmBody.damping = LINEAR_DAMPING;        

    armBody.angularDamping = ANGULAR_DAMPING;
    armBody.damping = LINEAR_DAMPING;        

    
}

function init_single_pendulum()
{
    dummyBody1 = new p2.Body({
        mass: 0,
    });
    world.addBody(dummyBody1);
    
    // Create arm
    var sarmShape =  new p2.Box({ width: SL, height: 0.1*L });
    sarmShape.collisionGroup = SINGLE;        
    sarmBody = new p2.Body({
        mass:4,
	position: single_arm_pos,
    });
    sarmBody.addShape(sarmShape);
    sarmBody.color =  "0xff7777";
    sarmBody.name = "sarmBody";
    
    sarmBody.angle = initial_angle;
    
    world.addBody(sarmBody);

    bodies[sarmBody.name] = sarmBody; 
    
    // Constrain it to the world
    var c = new p2.RevoluteConstraint(sarmBody, dummyBody1, {
        worldPivot: origin,
        collideConnected: false
    });
    world.addConstraint(c);

    sarmBody.angle = initial_angle;
    sarmBody.velocity = [0,0];
    sarmBody.angularVelocity = 0;
    sarmBody.angularDamping = ANGULAR_DAMPING;
    sarmBody.damping = LINEAR_DAMPING;        
    
}

function reset_double_pendulum(random_rads)
{
    world.removeBody(armBody);
    world.removeBody(secondArmBody);    
    world.removeBody(dummyBody2);    
    init_double_pendulum();

    armBody.angle = initial_angle+random_rads;
    armBody.velocity = [0,0];
    armBody.angularVelocity = 0;
    armBody.angularDamping = ANGULAR_DAMPING;
    armBody.damping = LINEAR_DAMPING;        
    
    secondArmBody.angle = hang_angle;
    secondArmBody.velocity = [0,0];
    secondArmBody.angularVelocity = 0;
    secondArmBody.angularDamping = ANGULAR_DAMPING;
    secondArmBody.damping = LINEAR_DAMPING;            
    
    secondArmBody.color = GOOD_BLUE_COLOR;
}

function reset_single_pendulum(random_rads)
{
    world.removeBody(sarmBody);
    world.removeBody(dummyBody1);    
    init_single_pendulum();
    
    armBody.angle = initial_angle+random_rads;
}

window.onkeydown = function(event){
    switch(event.keyCode){
    case 38: // up
    case 32: // space
        if(!buttons.space){
	    start_trial();
	    buttons.space = true;
        }
        break;
    case 39: // right
        buttons.right = true;
        break;
    case 37: // left
        buttons.left = true;
        break;
    }
}

window.onkeyup = function(event){
    switch(event.keyCode){
    case 38: // up
    case 32: // space
        buttons.space = false;
        break;
    case 39: // right
        buttons.right = false;
        break;
    case 37: // left
        buttons.left = false;
        break;
    }
}




$(function() {
    $( "#angle_range_max" ).slider({
      range: "max",
      min: 30,
      max: 80,
      value: 70,
      slide: function( event, ui ) {
	  $( "#initial_angle_val" ).val( ui.value );
	  initial_angle_deg = ui.value, // raise angle, ccw from x axis, in degrees.
	  initial_angle = (initial_angle_deg/360) * 2.0 * Math.PI;
	  single_arm_pos = [origin[0] + Math.cos(initial_angle)*SL/2 , origin[1] + Math.sin(initial_angle)*SL/2 ];
	  d1_arm_pos = [origin[0] + Math.cos(initial_angle)*L1/2 , origin[1] + Math.sin(initial_angle)*L1/2 ];
	  d2_arm_pos = [d1_arm_pos[0] + Math.cos(initial_angle)*L1/2 +  Math.cos(hang_angle)*(L2)/2,
			d1_arm_pos[1] + Math.sin(initial_angle)*L1/2 +  Math.sin(hang_angle)*(L2)/2];
	  
      }
    });
    $( "#initial_angle_val" ).val( $( "#angle_range_max" ).slider( "value" ) );
  });




$(function() {
    $( "#divergence_definition" ).slider({
      range: "max",
      min: 0.0,
      max: 100.0,
      value: DIVERGENCE_DEFINITION * 100,
      slide: function( event, ui ) {
	  $( "#divergence_definition_val" ).val( ui.value );
	  DIVERGENCE_DEFINITION = ui.value / 100.0;
      }
    });
    $( "#divergence_definition_val" ).val( $( "#divergence_definition" ).slider( "value" ) );
  });


$(function() {
    $( "#trial_length_max" ).slider({
      range: "max",
      min: 2,
      max: 100,
      value: 20,
      slide: function( event, ui ) {
	  $( "#trial_length_val" ).val( ui.value );
	  TRIAL_LENGTH = ui.value;
	  MAX_NUM_TICKS = TRIAL_LENGTH * 1000 / TICK_MS;
      }
    });
    $( "#trial_length_val" ).val( $( "#trial_length_max" ).slider( "value" ) );
  });


$(function() {
    $( "#tick_time_slider" ).slider({
      range: "max",
      min: 20,
      max: 2000,
      value: 500,
      slide: function( event, ui ) {
	  $( "#tick_time_val" ).val( ui.value );
	  TICK_MS = ui.value;
	  MAX_NUM_TICKS = TRIAL_LENGTH * 1000 / TICK_MS;
      }
    });
    $( "#tick_time_val" ).val( $( "#tick_time_slider" ).slider( "value" ) );
  });

$(function() {
    $( "#random_angle_slider" ).slider({
      range: "max",
      min: 0,
      max: 480,
      value: 120,
      slide: function( event, ui ) {
	  $( "#random_angle_val" ).val( ui.value  );
	  // We are messaging this is a half-angle, so we multiply by two here!
	  DEGREES_OF_VARIATION_A_S = ui.value * 2;
      }
    });
    $( "#random_angle_val" ).val( $( "#random_angle_slider" ).slider( "value" ) );
  });


    </script>

  

