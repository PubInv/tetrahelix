(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*

    Copyright 2017, Robert L. Read

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

"use strict";

module.exports.red_phase = 0;
module.exports.yellow_phase = 1;
module.exports.blue_phase = 2;

// Fundamental constanstants for the Boerdijk-Coxeter Helix
module.exports.BCtheta = Math.acos(-2/3);
module.exports.BCrho = 3*this.BCtheta - 2 * Math.PI;
module.exports.BCh = (1/Math.sqrt(10));
module.exports.BCd = (3/Math.sqrt(10));
module.exports.BCr = (3 * Math.sqrt(3) / 10);

// The Equitetrabeam
module.exports.EQTBr =  (2/3)*Math.sqrt(2/3);
module.exports.EQTBd = 1;
module.exports.EQTBrho = 0;

module.exports.USE_OPTIMAL_RADIUS = true;


// This from https://github.com/josdejong/Mathjs/blob/develop/lib/utils/bignumber/nearlyEqual.js
module.exports.nearlyEqual = (x, y, epsilon) => {
    // if epsilon is null or undefined, test whether x and y are exactly equal
    if (epsilon == null) {
	return x === y;
    }

    // use "==" operator, handles infinities
    if (x == y) {
	return true;
    }

    // NaN
    if (isNaN(x) || isNaN(y)) {
	return false;
    }

    // check numbers are very close, needed when comparing numbers near zero
    var diff = Math.abs(x-y);
    if (diff == 0) {
	return true;
    }
    else {
	if (diff < epsilon)
	    return true;
    }

    // Infinite and Number or negative Infinite and positive Infinite cases
    return false;
};


module.exports.find_drho_from_r_el = (rho,r,el) => {
    var sin_r_2 = Math.sin(rho/2);
    var d = Math.sqrt(el*el - 4 * r * r * sin_r_2 * sin_r_2);
    return d;
}

module.exports.find_rrho_from_d_el = (rho,d,el) => {
    var sin_r_2 = Math.sin(rho/2);
    var r = Math.sqrt(el*el - d*d) / (2 * sin_r_2);
    return r;
}
module.exports.find_drho_from_r = (rho,r) =>    {
    return this.find_drho_from_r_el(rho,r,1)
}

module.exports.find_rrho_from_d = (rho,d) => {
    return this.find_rrho_from_d_el(rho,d,1);
}

// Tha abs should not be needed here, as thise functions are even..
module.exports.optimal_radius = (rho,el) =>
// function optimal_radius(rho,el)
{
    var rho_abs = Math.abs(rho);
    var numer = 2*el;
    var t1 = Math.sqrt(3) * Math.sin(rho_abs/3);
    var t2 = Math.cos(rho_abs/3);
    var t3 = Math.cos(rho_abs);
    var t4 = 8;
    var denom = Math.sqrt(9*(t1 + t2)/2 + t3 + t4);
    return numer/denom;
}

module.exports.one_hop = (r,rho,el) => {
    var arho = Math.abs(rho);
    var as = Math.sign(rho);
    var t1 = el*el/9;
    var t2 = -4*Math.sin(rho/2)*Math.sin(rho/2)/9;
    var t3 = Math.sin(rho/3 + 2*Math.PI/3);
    var t4 = (1 - Math.cos(rho/3 + 2*Math.PI/3));
    return Math.sqrt(t1 + r*r*(t2 + t3*t3 + t4*t4));
}

module.exports.two_hop = (r,rho,el) => {
    var arho = Math.abs(rho);
    var as = Math.sign(rho);    
    var t1 = el*el*4/9;
    var t2 = -16*Math.sin(rho/2)*Math.sin(rho/2)/9;
    var t3 = Math.sin(2*rho/3 + 4*Math.PI/3);
    var t4 = (1 - Math.cos(2*rho/3 + 4*Math.PI/3));
    return Math.sqrt(t1 + r*r*(t2 + t3*t3 + t4*t4));
}
Math.distance3 = function(p0,p1) {
    x = p0[0] - p1[0];
    y = p0[1] - p1[1];
    z = p0[2] - p1[2];        
    return Math.sqrt(x*x + y*y + z*z);
}
// I have forgotten what this is supposed to test.
function test_optimal_radius() {
    var MAX_DEGREES = 45;
    for(var i = 0; i < 100;i++) {
	var rho = Math.PI*(i*MAX_DEGREES/100)/180;
	var r = optimal_radius(rho,1.0);
	var h1 = one_hop(r,rho,1.0);
	var h2 = two_hop(r,rho,1.0);
	console.log(180*rho/Math.PI,r,h1,h2-h1);
    }
}

// Copute the optimal distance as a function of rho
// (not using optimal_radius, because we want an independent check).
module.exports.optimal_distance = (rho,el) => {
    var num = 16*Math.sin(rho/2)*Math.sin(rho/2);
    var t1 = Math.cos(rho);
    var t2 = 9*(Math.sqrt(3)*Math.sin(rho/3)+Math.cos(rho/3))/2;
    var t3 = 8;
    var den = t1+t2+t3;
    return el*Math.sqrt(1 - num/den);
}
function test_one_hop() {
    var rho = BCrho;
    rho = BCrho/2;
    var len = 0.5;
    var r_opt = optimal_radius(rho,len);
    var d_opt = optimal_distance(rho,len);
    console.log(rho,len,r_opt,d_opt);
    var onehop = one_hop(r_opt,rho,len);
    var p1 = H_general(0,0,BCrho,d_opt,r_opt);
    var p2 = H_general(0,1,BCrho,d_opt,r_opt);
    var distance = Math.distance3(p1,p2);
    console.log(p1,p2);
    console.log(onehop,distance,onehop-distance);
    
}

function test_optimal_d() {
    	var r = optimal_radius(BCrho,1.0);
    	var dbc = optimal_distance(BCrho,1.0);
	// Now check that d_opt matches...
	var dp = find_drho_from_r_el(BCrho,r,1);
    console.log(180*BCrho/Math.PI,r,dbc,dp);
    
   var MAX_DEGREES = 45;
    for(var i = 0; i < 100;i++) {
	var rho = Math.PI*(i*MAX_DEGREES/100)/180;
	var r = optimal_radius(rho,1.0);
	var d = optimal_distance(rho,1.0);
	// Now check that d_opt matches...
	var dp = find_drho_from_r_el(rho,r,1);
	console.log(180*rho/Math.PI,r,d,dp-d);
    }
}

function test_assert_optimal_radius_even() {
    var MAX_DEGREES = 45;
    for(var i = 0; i < 100;i++) {
	var rho = Math.PI*(i*MAX_DEGREES/100)/180;
	var rp = optimal_radius(rho,1.0);
	var rn = optimal_radius(-rho,1.0);
//	assert(rp == rn,'evenness of optimal_radius failed','spud');
	console.log(rho,rp,rn);
    }
}

module.exports.H_general = (chi,n,c,rho,d,r) => {
//    console.log("params",chi,n,c,rho,d,r);
    if (chi != 1 && chi != -1) {
	console.log("chirality must be 1 or -1!");
	return null;
    }
    if (rho < 0) {
	console.log("rho must be non-negative!");
	return null;
    }
    var pnt = [];
    var kappa = n+ c/3.0;
    var rk = rho*kappa;
    var angle = chi*(rk + c*2*Math.PI/3);
//    console.log("rk",rk*180/Math.PI);
//    console.log("angle",angle*180/Math.PI);
    
    pnt[0] = r*Math.cos(angle);
    pnt[1] = r*Math.sin(angle);
    pnt[2] = d*kappa;
//    console.log("pnt",pnt);
    return pnt;
}

function test_BC_unity() {
    var rho = BCrho;
    var len = 1.0;
    var r_opt = optimal_radius(rho,len);
    var d_opt = optimal_distance(rho,len);
    var pnts = [];
    for(var i = 0; i < 4; i++) {
	var num = Math.floor(i / 3);
	var rail = i % 3;
	var q = H_general(1,num,rail,rho,d_opt,r_opt);
	pnts.push(q);
    }
    console.log(pnts);    
    for(var i = 0; i < 4; i++) {
	var p0 = pnts[i];
	var p1 = pnts[(i+1) % 4];
	var distance = Math.distance3(p0,p1);
	// All distances should be 1 here...
	console.log(p0,p1,distance);
    }

}

function test_evenness_H_general() {
    var rho = BCrho;
    var len = 1.0;
    var r_opt = optimal_radius(rho,len);
    var d_opt = optimal_distance(rho,len);
    console.log(rho,len,r_opt,d_opt);    
    var p1 = H_general(1,0,0,BCrho,d_opt,r_opt);
    var p2 = H_general(1,0,1,BCrho,d_opt,r_opt);
    var distance1 = Math.distance3(p1,p2);
    console.log(p1,p2,distance1);

    var p3 = H_general(-1,0,BCrho,d_opt,r_opt);
    var p4 = H_general(-1,1,BCrho,d_opt,r_opt);
    var distance2 = Math.distance3(p3,p4);
    console.log(p3,p4,distance2);


}
function H_bc(n,c) {
    var BCr = find_rrho_from_d(BCrho,BCd);
    return H_general(1,n,c,BCrho,BCd,BCr);
}

function H_bc_el(n,c,el) {
    var BCdl = BCd*el;
    var BCrl = el * find_rrho_from_d(BCrho,BCd);
    return H_general(1,n,c,BCrho,BCdl,BCrl);
}


function H_bc_eqt_lambda(n,c,lambda) {
    // Note this is a particular scheme for parametrization.
    // Now we must compute r and h....
    // "0" is the equitetrabeam
    // "1" is the BC helix
    var r0 = EQTBr;
    var d0 = EQTBd;
    var rho0 = EQTBrho;
    
    var r1 = BCr;
    var d1 = BCd;
    var rho1 = BCrho;

    return H_interp_lambda(lambda,n,c,rho0,d0,r0,rho1,d1,r1);
}

function rho_opt_interp(lambda) {
   var alambda = Math.abs(lambda);
    var rho0 = EQTBrho;
    var rho1 = BCrho;
    var rhoi = (lambda > 0) ? (rho1 - rho0)*alambda + rho0 : -((rho1 - rho0)*alambda + rho0);    
    return rhoi;
}
// Interpolate between (rho0,d0,r0,l0) and (rho1,d1,r1,l1)
function H_interp_lambda(lambda,n,c,rho0,d0,r0,rho1,d1,r1) {
    var alambda = Math.abs(lambda);


    if (USE_OPTIMAL_RADIUS) {
	var rhoi = rho_opt_interp(lambda);
	var ropt = optimal_radius(rhoi,1);
	var dopt = optimal_distance(rhoi,1)
	console.log(lambda,rhoi,dopt,ropt);    	
	return H_general(1,n,c,rhoi,dopt,ropt);	
    } else {
	var rhoi = (lambda > 0) ? (rho1 - rho0)*alambda + rho0 : -((rho1 - rho0)*alambda + rho0);    
	var ropt = optimal_radius(rhoi,1);
	var dopt = optimal_distance(rhoi,1)
	var di = (d1 - d0)*alambda + d0;	
	var rinterp = (r1 - r0)*alambda + r0;		
	return H_general(1,n,c,rhoi,di,rinterp);	
    }
}

function test_rail_angle_formula_against_BC() {
    var BCr_check = find_rrho_from_d(BCrho,BCd);
    var BCd_check = find_drho_from_r(BCrho,BCr);
    assert(nearlyEqual(BCr,BCr_check,0.0000001),
	   'BCr nearly equal fail '+BCr+', BCr_check == '+BCr_check);    
    assert(nearlyEqual(BCd,BCd_check,0.0000001),
	   'BCd == '+BCd+', BCd_check == '+BCd_check);
}

function test_H_general_against_BC() {
    var R0 = H_bc(0,0);
    var R1 = H_bc(1,0);
    var Y0 = H_bc(0,1);
    var B0 = H_bc(0,2);
    assert(nearlyEqual(Math.distance(R0,R1),1,0.0000001),"\n R0 = " + R0 +"\n R1 = " + R1 +"\n distance =" + Math.distance(R0,R1));
    assert(nearlyEqual(Math.distance(R0,Y0),1,0.0000001),"\n R0 = " + R0 +"\n Y0 = " + Y0 +"\n distance =" + Math.distance(R0,Y0));
    assert(nearlyEqual(Math.distance(R0,B0),1,0.0000001),"\n R0 = " + R0 +"\n B0 = " + B0 +"\n distance =" + Math.distance(R0,B0));

}

function major_test() {
    var reds = [];
    var otherreds = [];
    var blues = [];
    var otheryells = [];
    var yells = [];
    var otherblues = [];
    // var lambda = 1.0;
    var lambda = 1.0;
    var third = 120*Math.PI/180.0;    
    for(var i = 0; i < 4; i++) {
	var red = H_bc_lambda(i,red_phase,lambda);    
	var yell = H_bc_lambda(i,yellow_phase,lambda);        
	var blue = H_bc_lambda(i,blue_phase,lambda);    
	
	reds.push(red);
	yells.push(yell);    
	blues.push(blue);
	//    console.log(red,yell,blue);
    }
    console.log("reds");
    console.log(reds);

    console.log("yells");
    console.log(yells);
    console.log("blues");
    console.log(blues);

    
}

//test_rail_angle_formula_against_BC();
//test_H_general_against_BC();

module.exports.pitchForOptimal = (rho,len) => {
    var dopt = this.optimal_distance(rho,len);
    return Math.PI*2*dopt/rho;
}

module.exports.pitch_min = (len) => {
    return this.pitchForOptimal(this.BCrho,len);
}

module.exports.inradius_assumption1 = (rho,r) => {
    return r*Math.sin((Math.PI - rho)/6);
}


},{}],2:[function(require,module,exports){

var tm = require("./tetrahelix_math.js");
UGLY_GLOBAL_SINCE_I_CANT_GET_MY_MODULE_INTO_THE_BROWSER = tm;

},{"./tetrahelix_math.js":1}]},{},[2]);
