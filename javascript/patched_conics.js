// Gives the path from body A to body B, and execute all the computations needed using all the orbit_determination and database it needs

// Gives the path-matrix [referenceBody_departure, ... , referenceBody_arrival]
function find_path(body_departure, body_arrival) {
	var path_departure = [body_departure];
	var path_arrival = [body_arrival];
	var k = 0;
	while (path_departure[k] != path_arrival[0]) {
		if (path_departure[k].rank > path_arrival[0].rank) {
			path_departure.push(path_departure[k].orbit.referenceBody);
			k++;
		}
		else if (path_departure[k].rank < path_arrival[0].rank) {
			path_arrival.unshift(path_arrival[0].orbit.referenceBody);
		}
		else {
			path_departure.push(path_departure[k].orbit.referenceBody);
			path_arrival.unshift(path_arrival[0].orbit.referenceBody);
			k++;
		}
	}
	var path = path_departure;
	for (let i = 1, c = path_arrival.length ; i < c ; i++) {
		path.push(path_arrival[i]);
	}
	return path;
}

// Gives an array-information that will be used for the patched conics methods : bodies involved, orbit reference and so on.
function patching_conics(orbit_departure, orbit_arrival, date, time) {
	var body1 = orbit_departure.referenceBody;
	var body2 = orbit_arrival.referenceBody;
	var path = find_path(body1, body2);
	var size = path.length;
	if (size == 1) {
		// Hence a rendez-vous : body1 is the departure body (t = t0) ; body2 is the arrival body (t = t0 + dT)
		var true_anomaly1 = orbit_departure.true_anomaly;
		var true_anomaly2 = orbit_arrival.true_anomaly;
		
		// From the orbital elements to the state vectors of the two bodies
		var stateVector_departure = get_stateVector(orbit_departure, true_anomaly1);
		var stateVector_arrival = get_stateVector(orbit_arrival, true_anomaly2);
		var r_departure = stateVector_departure[0];
		var v_departure_ini = stateVector_departure[1];
		var r_arrival = stateVector_arrival[0];
		var v_arrival_ini = stateVector_arrival[1];
		
		// For now we assume that the motion is prograde
		var velocityVector = lambert_method(path[0], r_departure, r_arrival, time, true);
		var v_departure = velocityVector[0][1];
		var v_arrival = velocityVector[1][1];
		
		// Few more calculations to compute the magnitude of velocity changes :
		var velocity_change_departure = sumMatrix(v_departure, scalar(-1, v_departure_ini));
		var velocity_change_arrival = sumMatrix(v_arrival_ini, scalar(-1, v_arrival));
		
		// How much dV does it cost :
		var dV = module(velocity_change_departure) + module(velocity_change_arrival);
		var result = [[v_departure_ini, velocity_change_departure, v_departure], [v_arrival_ini, velocity_change_arrival, v_arrival], dV, get_orbitalElements(r_departure, v_departure, body1)]
		return result;
	}
	else {
		console.log('Sorry, this function is not yet implemented ; please avoid interplanetary orbits for now !');
	}
}