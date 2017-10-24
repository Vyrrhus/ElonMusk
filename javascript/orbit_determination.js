// Get all the parameters you want so that you can define an orbit with the proper values (either state vectors or elements, who cares ?)

//Gives orbital elements from state vector & reference body (km & km/s units ==> ° & UA units)
function get_orbitalElements(r, v, referenceBody) {
	var r_module = module(r);
	var v_module = module(v);
	var v_radial = dot(r,v) / r_module;
	var h = cross(r,v);
	var h_module = module(h);
	// specific angular momentum
	
	var i = Math.acos(dot(h,K) / h_module);
	// inclination lies between 0 rad and Pi rad
	
	var N = cross(K,h);
	var N_module = module(N);
	// node-line vector
	
	var longitude = Math.acos(dot(N,I) / N_module);
	if (dot(N,J) < 0) {
		longitude = 2*Math.PI - longitude;
	}
	if (N_module == 0) {
		longitude = 0;
	}
	// longitude of ascending node lies between 0rad and 2Pi rad
	
	var mu = referenceBody.gravitationalParameter;
	var e = scalar(1/mu, sumMatrix(scalar((Math.pow(v_module,2) - mu / r_module), r), scalar(- r_module * v_radial, v)));
	var e_module = module(e);
	// eccentricity
	
	var argument_periapsis = Math.acos(dot(N,e) / N_module / e_module);
	if (dot(e,K) < 0) {
		argument_periapsis = 2*Math.PI - argument_periapsis;
	}
	if (N_module == 0) {
		argument_periapsis = 0;
	}
	// argument of periapsis lies between 0rad and 2Pi rad
	
	var true_anomaly = Math.acos(dot(e,r) / e_module / r_module);
	if (v_radial < 0) {
		true_anomaly = 2*Math.PI - true_anomaly;
	}
	true_anomaly = true_anomaly%360;
	
	if (e == 1) {
		var a = 0;
	}
	else {
		var a = Math.pow(h_module,2) / mu / (1-Math.pow(e_module,2));
	}
	a = convert(a, 'km');
	i = convert(i,'rad');
	longitude = convert(longitude, 'rad');
	argument_periapsis = convert(argument_periapsis, 'rad');
	true_anomaly = convert(true_anomaly, 'rad');
	
	var result = new Orbit(referenceBody, i, longitude, a, e_module, argument_periapsis, true_anomaly);
	return result;
}

//Gives state vector from orbital elements (° & UA units ==> km & km/s units)
function get_stateVector(orbit, true_anomaly) {
	var mu = orbit.referenceBody.gravitationalParameter;
	var i = convert(orbit.inclination, '°');
	var longitude_node = convert(orbit.longitude_NA, '°');
	var a = convert(orbit.semiMajorAxis, 'UA');
	var e = orbit.eccentricity;
	var argument_periapsis = convert(orbit.longitude_peri, '°');
	true_anomaly = convert(true_anomaly, '°');
	var h = Math.sqrt(mu) * Math.sqrt(a*(1-Math.pow(e,2)));
	
	// In perifocal frame
	var r_perifocal = scalar(Math.pow(h,2) / mu / (1 + e * Math.cos(true_anomaly)), [Math.cos(true_anomaly), Math.sin(true_anomaly), 0]);
	r_perifocal = trans(r_perifocal);
	var v_perifocal = scalar(mu / h, [- Math.sin(true_anomaly), e + Math.cos(true_anomaly), 0]);
	v_perifocal = trans(v_perifocal);
	
	// Insert correction for longitude of NA and argument of periapsis through time ( [°/Cy] for sun-centered bodies, change rate for planet-centered bodies)
	
	// DCM matrix from inertial frame to the perifocal frame (of the same referenceBody);
	var DCM = DCM_matrix(longitude_node, argument_periapsis, i, true);
	
	// In inertial frame (body-centered)
	var r_centered = productMatrix(DCM, r_perifocal);
	var v_centered = productMatrix(DCM, v_perifocal);
	var result = [r_centered, v_centered];
	return result;
}

//Gives orbital elements / state vector departure & arrival from r1, r2 and dT (r1 & r2 in km, dT in s ==> v1 & v2 in km/s)
function lambert_method(referenceBody, r_departure, r_arrival, dT, isPrograde) {
	// Global and useful constants
	var mu = referenceBody.gravitationalParameter;
	var r_departure_module = module(r_departure);
	var r_arrival_module = module(r_arrival);
	var motionSens = 1;
	if (!isPrograde) {
		motionSens = -1;
	}
	
	// Change in true anomaly :
	var cos_u = dot(r_departure, r_arrival) / r_departure_module / r_arrival_module;
	var sin_u = motionSens * Math.sqrt(1 - Math.pow(cos_u, 2));
	var u = Math.acos(cos_u); // rad
	if (sin_u < 0) {
		u = 2*Math.PI - u;
	}
	if (u < 1e-3 || u > 2*Math.PI - 1e-3 || (u > Math.PI - 1e-3) && (u < Math.PI + 1e-3)) {
		console.log('Les deux points sont égaux à 0 [Pi] : calcul impossible');
		return null;
	}
	
	// A scalar :
	var A = sin_u * Math.sqrt(r_departure_module * r_arrival_module / (1 - cos_u));
	
	// Stumpff functions :
	function C(z) {
		var result;
		if (z > 0) {
			result = (1 - Math.cos(Math.sqrt(z))) / z;
		}
		if (z < 0) {
			result = (Math.cosh(Math.sqrt(-z)) - 1) / (-z);
		}
		if (z == 0) {
			result = 1/2;
		}
		return result;
	}
	function S(z) {
		var result;
		if (z > 0) {
			result = (Math.sqrt(z) - Math.sin(Math.sqrt(z))) / Math.pow(z, 3/2);
		}
		if (z < 0) {
			result = (Math.sinh(Math.sqrt(-z)) - Math.sqrt(-z)) / Math.pow(-z, 3/2);
		}
		if (z == 0) {
			result = 1/6;
		}
		return result;
	}
	
	// y function :
	function y(z) {
		var result = r_departure_module + r_arrival_module + A * (z * S(z) - 1) / Math.sqrt(C(z));
		return result;
	}
	
	// F and dF functions for Newton-Raphson method :
	function F(z) {
		var result = Math.pow(y(z) / C(z), 3/2) * S(z) + A * Math.sqrt(y(z)) - Math.sqrt(mu) * dT;
		return result;
	}
	function dF(z, epsilon) {
		var result;
		if (Math.abs(z) > epsilon) {
			result = Math.pow(y(z) / C(z), 3/2) * (1 / (2*z) * (C(z) - 3/2 * S(z)/C(z)) + 3/4 * Math.pow(S(z),2) / C(z)) + A/8 * (3 * S(z)/C(z) * Math.sqrt(y(z)) + A * Math.sqrt(C(z) / y(z)));
		}
		else {
			result = Math.sqrt(2) / 40 * Math.pow(y(z), 3/2) + A/8 * (Math.sqrt(y(z)) + A * Math.sqrt(1 / (2 * y(z))));
		}
		return result;
	}

	// Newton-Raphson iteration to compute z :
	var z0;
	var z1 = Math.PI;
	var epsilon = 1e-10;
	do {
		z0 = z1;
		z1 = z0 - F(z0) / dF(z0, epsilon);
	} while(Math.abs((z1-z0) / z0) > epsilon)

	// Lagrange coefficients
	var f = 1 - y(z1) / r_departure_module;
	var g = A * Math.sqrt(y(z1) / mu);
	var dg = 1 - y(z1) / r_arrival_module;
	
	// Velocity vectors
	var v_departure = scalar(1/g, sumMatrix(r_arrival, scalar(-f, r_departure)));
	var v_arrival = scalar(1/g, sumMatrix(scalar(dg, r_arrival), scalar(-1, r_departure)));
	
	return [['Departure', v_departure], ['Arrival', v_arrival]];
}
