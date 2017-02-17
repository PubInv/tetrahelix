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

var red_phase = 0;
var yellow_phase = 1;
var blue_phase = 2;

// Fundamental constanstants for the Boerdijk-Coxeter Helix
var BCtheta = Math.acos(-2/3);
var BCrho = 3*BCtheta - 2 * Math.PI;
var BCh = (1/Math.sqrt(10));
var BCd = (3/Math.sqrt(10));
var BCr = (3 * Math.sqrt(3) / 10);

// The Equitetrabeam
var EQTBr =  (2/3)*Math.sqrt(2/3);
var EQTBd = 1;
var EQTBrho = 0;

var USE_OPTIMAL_RADIUS = true;


// This from https://github.com/josdejong/Mathjs/blob/develop/lib/utils/bignumber/nearlyEqual.js
function nearlyEqual(x, y, epsilon) {
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


function find_drho_from_r_el(rho,r,el) {
    var sin_r_2 = Math.sin(rho/2);
    var d = Math.sqrt(el*el - 4 * r * r * sin_r_2 * sin_r_2);
    return d;
}

function find_rrho_from_d_el(rho,d,el) {
    var sin_r_2 = Math.sin(rho/2);
    var r = Math.sqrt(el*el - d*d) / (2 * sin_r_2);
    return r;
}
function find_drho_from_r(rho,r) {
    return find_drho_from_r_el(rho,r,1)
}

function find_rrho_from_d(rho,d) {
    return find_rrho_from_d_el(rho,d,1);
}

function optimal_radius(rho,el) {
    var numer = 2*el;
    var t1 = Math.sqrt(3) * Math.sin(rho/3);
    var t2 = Math.cos(rho/3);
    var t3 = Math.cos(rho);
    var t4 = 8;
    var denom = Math.sqrt(9*(t1 + t2)/2 + t3 + t4);
    return numer/denom;
}

function one_hop(r,rho,el) {
    var t1 = 1/9;
    var t2 = -4*Math.sin(rho/2)*Math.sin(rho/2)/9;
    var t3 = Math.sin(rho/3 + 2*Math.PI/3);
    var t4 = (1 - Math.cos(rho/3 + 2*Math.PI/3));
    return Math.sqrt(t1 + r*r*(t2 + t3*t3 + t4*t4));
}

function two_hop(r,rho,el) {
    var t1 = 4/9;
    var t2 = -16*Math.sin(rho/2)*Math.sin(rho/2)/9;
    var t3 = Math.sin(2*rho/3 + 4*Math.PI/3);
    var t4 = (1 - Math.cos(2*rho/3 + 4*Math.PI/3));
    return Math.sqrt(t1 + r*r*(t2 + t3*t3 + t4*t4));
}

function test_optimal_radius() {
    var MAX_DEGREES = 45;
    for(var i = 0; i < 100;i++) {
	var rho = Math.PI*(i*MAX_DEGREES/100)/180;
	var r = optimal_radius(rho,1.0);
	for(var j = 0; j < 10; j++) {
	    // iterate rj centered around the optimal distance.
	    var rj = r/2 + (j/10)*r;
	    var h1 = one_hop(rj,rho,1.0);
	    var h2 = two_hop(rj,rho,1.0);
	    console.log(180*rho/Math.PI,rj,h2-h1);
	}
    }
}
function H_general(n,c,rho,d,r,s) {
    return H_general_s(n,c,rho,d,r,1);
}
function H_general_s(n,c,rho,d,r,s) {
    var pnt = [];
    var kappa = n+ c/3.0;
    var rk = rho*kappa;
    var angle = rk + s*c*2*Math.PI/3;
    pnt[0] = r*Math.cos(angle);
    pnt[1] = r*Math.sin(angle);
    pnt[2] = d*kappa;
    return pnt;
}

function H_bc(n,c) {
    var BCr = find_rrho_from_d(BCrho,BCd);
    return H_general(n,c,BCrho,BCd,BCr);
}

function H_bc_el(n,c,el) {
    var BCdl = BCd*el;
    var BCrl = el * find_rrho_from_d(BCrho,BCd);
    return H_general(n,c,BCrho,BCdl,BCrl);
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

// Interpolate between (rho0,d0,r0,l0) and (rho1,d1,r1,l1)
function H_interp_lambda(lambda,n,c,rho0,d0,r0,rho1,d1,r1) {
    var alambda = Math.abs(lambda);
    var di = (d1 - d0)*alambda + d0;
    var rhoi = (lambda > 0) ? (rho1 - rho0)*alambda + rho0 : -((rho1 - rho0)*alambda + rho0);
    var rinterp = (r1 - r0)*alambda + r0;	
    var ropt = optimal_radius(rhoi,1);
    console.log(lambda,di,rinterp,ropt);    
    if (USE_OPTIMAL_RADIUS) {
	return H_general_s(n,c,rhoi,di,ropt,Math.sign(lambda) == -1 ? -1 : 1);	
    } else {
	return H_general_s(n,c,rhoi,di,rinterp,Math.sign(lambda) == -1 ? -1 : 1);	
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
