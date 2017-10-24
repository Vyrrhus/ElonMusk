// Declaration boutons & elements
var button_plot = document.getElementById('plot');
var graph = document.getElementById('graph');

// Fonctions
{
// Renvoie true si les deux forms sont remplis, ou les remplis éventuellement
function isFilled() {
	for (let k=0, c = inputs.length; k < c ; k++) {
		// On commence par vérifier que y'a aucun warning sur les inputs
		if (!inputs[k][0].parentNode.nextElementSibling.getAttribute('hidden') || !inputs[k][1].parentNode.nextElementSibling.getAttribute('hidden')) {
			return false;
		}
		
		// On vérifie ensuite que tout est rempli, et on remplit le cas échéant
		
		for (let i = 0 ; i < 2 ; i++) {
			if (!inputs[k][i].value) {
				switch (k) {
					case 0:
						inputs[k][i].value = 0;
						break;
					case 1:
						inputs[k][i].value = 0;
						break;
					case 2:
						return false;
						break;
					case 3:
						if (orbit_type[i].value == 'ellipse') {
							return false;
						}
						break;
					case 4:
						if (orbit_type[i].value != 'parabola') {
							return false;
						}
						break;
					case 5:
						return false;
						break;
					case 6:
						inputs[k][i].value = 0;
						break;
					case 7:
						inputs[k][i].value = 0;
						break;
				}
			}
		}
	}
	
	// On renvoie true à la fin
	return true;
}
// Print :
function print(patchMatrix, date1, date2) {
	var dep_table_date = document.getElementById('dep_table_date');
	var arr_table_date = document.getElementById('arr_table_date');
	var dep_table_initialVelocity = document.getElementById('dep_table_initialVelocity');
	var arr_table_initialVelocity = document.getElementById('arr_table_initialVelocity');
	var dep_table_manoeuverVelocity = document.getElementById('dep_table_manoeuverVelocity');
	var arr_table_manoeuverVelocity = document.getElementById('arr_table_manoeuverVelocity');
	var dep_table_finalVelocity = document.getElementById('dep_table_finalVelocity');
	var arr_table_finalVelocity = document.getElementById('arr_table_finalVelocity');
	var table_dV = document.getElementById('table_dV');
	var table_i = document.getElementById('table_i');
	var table_longitude = document.getElementById('table_longitude');
	var table_e = document.getElementById('table_e');
	var table_a = document.getElementById('table_a');
	var table_argument = document.getElementById('table_argument');
		
	dep_table_date.innerHTML = date1;
	dep_table_initialVelocity.innerHTML= module(patchMatrix[0][0]);
	dep_table_initialVelocity.setAttribute('data-content', '<table><tr><td>Vx</td><td>' & patchMatrix[0][0][0] & '</td></tr><tr><td>Vy</td><td>' & patchMatrix[0][0][1] & '</td></tr><tr><td>Vz</td><td>' & patchMatrix[0][0][2] & '</td></tr></table>');
	dep_table_manoeuverVelocity.innerHTML= module(patchMatrix[0][1]);
	dep_table_manoeuverVelocity.setAttribute('data-content', '<table><tr><td>Vx</td><td>' & patchMatrix[0][1][0] & '</td></tr><tr><td>Vy</td><td>' & patchMatrix[0][1][1] & '</td></tr><tr><td>Vz</td><td>' & patchMatrix[0][1][2] & '</td></tr></table>');
	dep_table_finalVelocity.innerHTML= module(patchMatrix[0][2]);
	dep_table_finalVelocity.setAttribute('data-content', '<table><tr><td>Vx</td><td>' & patchMatrix[0][2][0] & '</td></tr><tr><td>Vy</td><td>' & patchMatrix[0][2][1] & '</td></tr><tr><td>Vz</td><td>' & patchMatrix[0][2][2] & '</td></tr></table>');
	arr_table_date.innerHTML= date2;
	arr_table_initialVelocity.innerHTML= module(patchMatrix[1][0]);
	arr_table_initialVelocity.setAttribute('data-content', '<table><tr><td>Vx</td><td>' & patchMatrix[1][0][0] & '</td></tr><tr><td>Vy</td><td>' & patchMatrix[1][0][1] & '</td></tr><tr><td>Vz</td><td>' & patchMatrix[1][0][2] & '</td></tr></table>');
	arr_table_manoeuverVelocity.innerHTML= module(patchMatrix[1][1]);
	arr_table_manoeuverVelocity.setAttribute('data-content', '<table><tr><td>Vx</td><td>' & patchMatrix[1][1][0] & '</td></tr><tr><td>Vy</td><td>' & patchMatrix[1][1][1] & '</td></tr><tr><td>Vz</td><td>' & patchMatrix[1][1][2] & '</td></tr></table>');
	arr_table_finalVelocity.innerHTML= module(patchMatrix[1][2]);
	arr_table_finalVelocity.setAttribute('data-content', '<table><tr><td>Vx</td><td>' & patchMatrix[1][2][0] & '</td></tr><tr><td>Vy</td><td>' & patchMatrix[1][2][1] & '</td></tr><tr><td>Vz</td><td>' & patchMatrix[1][2][2] & '</td></tr></table>');
	table_dV.innerHTML= patchMatrix[2];
	table_i.innerHTML= patchMatrix[3].inclination;
	table_longitude.innerHTML= patchMatrix[3].longitude_NA;
	table_e.innerHTML= patchMatrix[3].eccentricity;
	table_a.innerHTML= convert(patchMatrix[3].semiMajorAxis, 'UA');
	table_argument.innerHTML= patchMatrix[3].longitude_peri;
}
}
// Graphes
function orbit_plot() {
	// On plot chaque arg ()
	graph.innerHTML = "<h3>Pour l'instant y'a rien, mais SOON, de BEAUX GRAPHES</h3><p>De.<br>Beaux.<br>Beaux ?<br>Beaux ?!!</p><h1>BEAUX BEAUX BEAUX</h1><h2>PLOTS</h2>"
}

// Events d'execution
// Popovers :
$(document).ready(function(){
    $('[data-toggle="popover"]').popover(); 
});

// Execution :

button_plot.addEventListener('click', function() {
	if (isFilled()) {
		var orbit_departure = new Orbit(body[0], parseFloat(inclination[0].value), parseFloat(longitude[0].value), convert(parseFloat(semi_majoraxis[0].value), 'km'), parseFloat(eccentricity[0].value), parseFloat(argument_periapsis[0].value), parseFloat(true_anomaly[0].value));
		var orbit_arrival = new Orbit(body[1], parseFloat(inclination[1].value), parseFloat(longitude[1].value), convert(parseFloat(semi_majoraxis[1].value), 'km'), parseFloat(eccentricity[1].value), parseFloat(argument_periapsis[1].value), parseFloat(true_anomaly[1].value));
		var date = getTime_from_date(departure.value, departure_hour.value);		// JD
		var time = time_convert(parseFloat(window_range.value), window_unit.innerHTML); // secondes
		var date_arrival = getDate_from_time(date + convert(time, 's'))				// date
		date = getDate_from_time(date);												// date
		var patchedConics_Matrix = patching_conics(orbit_departure, orbit_arrival, date, time);
		print(patchedConics_Matrix, date, date_arrival);
		var orbit_transfert = patchedConics_Matrix[3];
		orbit_plot(orbit_departure, orbit_arrival, orbit_transfert);
	}
	else {
		console.log('oupsie');
	}
});