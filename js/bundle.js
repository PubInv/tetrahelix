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
    return this.find_drho_from_r_el(rho,r,1);
}

module.exports.find_rrho_from_d = (rho,d) => {
    return this.find_rrho_from_d_el(rho,d,1);
}

// Tha abs should not be needed here, as thise functions are even..
module.exports.optimal_radius = (rho,el) =>
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
module.exports.H_general = (chi,n,c,rho,d,r) => {
    return this.H_general_factor(chi,n,c,rho,d,r,1);
}

module.exports.H_general_factor = (chi,n,c,rho,d,r,f) => {
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
    
    pnt[0] = r*Math.cos(angle*f);
    pnt[1] = r*Math.sin(angle*f);
    pnt[2] = d*kappa;
    return pnt;
}

module.exports.H_bc = (n,c) => {
    var BCr = this.find_rrho_from_d(this.BCrho,this.BCd);
    return this.H_general(1,n,c,this.BCrho,this.BCd,this.BCr);
}

module.exports.H_bc_el = (n,c,el) => {
    var BCdl = this.BCd*el;
    var BCrl = el * this.find_rrho_from_d(this.BCrho,this.BCd);
    return this.H_general(1,n,c,this.BCrho,this.BCdl,this.BCrl);
}

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
