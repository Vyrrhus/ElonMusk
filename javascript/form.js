//Déclaration
//Nodes div
{
var formStart = document.getElementById('form_start');
var formEnd = document.getElementById('form_end');
var formModal = document.getElementById('form_modal');
var infoModal = document.getElementById('infoModal');
}
//Nodes input & select
{
var origine = [formStart.elements['origine'], formEnd.elements['origine'], formModal.elements['origine']];
var orbit_type = [formStart.elements['orbit_type'], formEnd.elements['orbit_type']];
var inclination = [formStart.elements['input_inclination'], formEnd.elements['input_inclination'], formModal.elements['inclination']];
var longitude = [formStart.elements['input_longitude'], formEnd.elements['input_longitude'], formModal.elements['longitude']];
var periapsis = [formStart.elements['input_periapsis'], formEnd.elements['input_periapsis']];
var apoapsis = [formStart.elements['input_apoapsis'], formEnd.elements['input_apoapsis']];
var semi_majoraxis = [formStart.elements['input_semi_majoraxis'], formEnd.elements['input_semi_majoraxis'], formModal.elements['semimajoraxis']];
var eccentricity = [formStart.elements['input_eccentricity'], formEnd.elements['input_eccentricity'], formModal.elements['eccentricity']];	
var argument_periapsis = [formStart.elements['input_argument_periapsis'], formEnd.elements['input_argument_periapsis'], formModal.elements['argument']];
var true_anomaly = [formStart.elements['input_true_anomaly'], formEnd.elements['input_true_anomaly'], formModal.elements['anomaly']];

var modal_name = formModal.elements['name'];
var modal_mass = formModal.elements['mass'];
var radius = formModal.elements['radius'];
var modal_epoch = formModal.elements['epoch'];
var departure = document.getElementById('departure');
var departure_hour = document.getElementById('departure_hour');
var window_range = document.getElementById('window_range');

var parameter = [periapsis, apoapsis, semi_majoraxis, eccentricity];
var inputs = [inclination, longitude, periapsis, apoapsis, semi_majoraxis, eccentricity, argument_periapsis, true_anomaly];
var optiondefault = [document.getElementById('select_default_start'), document.getElementById('select_default_end'), document.getElementById('select_modal')];
var hiddenOption = document.getElementsByName('hidden_body'); 
}
//Nodes span
{
var angular_unit = document.getElementsByName('angular_unit');
var length_unit = [document.getElementsByName('length_unit_ini'), document.getElementsByName('length_unit_fin'), document.getElementsByName('length_unit_modal')];
var alt = [document.getElementsByName('alt_start'), document.getElementsByName('alt_end')];
var menu = document.getElementsByName('menu');
var window_unit = document.getElementById('window_unit');
}
//Buttons
{
var reset_button = [formStart.elements['reset'], formEnd.elements['reset']];
var add_body = [formStart.elements['add_body'], formEnd.elements['add_body']];
var info_body = [formStart.elements['info_body'], formEnd.elements['info_body']];
var submit_button = formModal.elements['submit_add'];
}
//Variables globales
{
var body = [planets[0], planets[0], planets[1]]; // correspond au corps d'arrivée, de départ et du modal
var inputCheck = [[false, false, false, false], [false, false, false, false]]; // permet en cas d'orbit elliptique d'obtenir les infos nécessaires
var range = ['days', 'weeks','months', 'years', 'hours'];
}
//Fonctions
{
// Computing parameters
function isEnough(indexForm) {
    var result=0;
    inputCheck[indexForm].forEach(function (element) {
        if (element) {
            result++;
        }
    });
    if (result == 2) {
        return true;
    }
    else {
        return false;
    }
}
function isComputable(notNegative, indexForm) {
    var error = 0;
    for (let k=0, c = inputCheck[indexForm].length ; k < c ; k++) {
        if (!inputCheck[indexForm][k]) {
            disable(parameter[k][indexForm]);
        }
        else {
            if (!isNumber(parameter[k][indexForm], notNegative)) {
                error++;
            }
        }
    }
    if (error > 0) {
        return false;
    }
    else {
        return true;
    }
}
function compute(isAltitudeSet, indexForm, isHyperbolic) {
	if (isHyperbolic == undefined) {
		isHyperbolic = false;
	}
    var unit = unitIs(periapsis[indexForm]);
    var rayon = body[indexForm].radius;
    if (unit == 'UA') {
        rayon = convert(rayon, 'km');
    }
    var critere = rayon;
    if (!isAltitudeSet) {
        rayon = 0;
    } else {
        critere = 0;
    }
    for (let k = 0, c = parameter.length ; k < c ; k++) {
        if (!inputCheck[indexForm][k]) {
            disable(parameter[k][indexForm]);
        }
    }
    switch(inputCheck[indexForm].join(', ')) {
        case 'true, true, false, false' :
            var Pe = parseFloat(periapsis[indexForm].value) + rayon;
            var Ap = parseFloat(apoapsis[indexForm].value) + rayon;
            var a = (Ap + Pe) / 2;
            var e = (Ap - Pe) / (Ap + Pe);
            if (Pe > Ap || Pe < critere) {
                reset(semi_majoraxis[indexForm], eccentricity[indexForm]);
                setWarning(periapsis[indexForm], ' ');
                setWarning(apoapsis[indexForm], ' ');
            }
            else {
                removeWarning(periapsis[indexForm]);
                removeWarning(apoapsis[indexForm]);
                semi_majoraxis[indexForm].value = a;
                eccentricity[indexForm].value = e;
            }
            break;
        case 'true, false, true, false' :
            var Pe = parseFloat(periapsis[indexForm].value) + rayon;
            var a = parseFloat(semi_majoraxis[indexForm].value);
            var Ap = 2*a - Pe;
            var e = (Ap-Pe)/(2*a);
            if ((Pe > Ap && !isHyperbolic) || Pe < critere) {
                reset(apoapsis[indexForm], eccentricity[indexForm]);
                setWarning(periapsis[indexForm], ' ');
                setWarning(semi_majoraxis[indexForm], ' ');
            }
            else {
                removeWarning(periapsis[indexForm]);
                removeWarning(semi_majoraxis[indexForm]);
                apoapsis[indexForm].value = Ap - rayon;
                eccentricity[indexForm].value = e;
            }
            break;
        case 'true, false, false, true' :
            var Pe = parseFloat(periapsis[indexForm].value)+rayon;
            var e = parseFloat(eccentricity[indexForm].value);
            var Ap = Pe*(1+e)/(1-e);
            var a = (Ap+Pe)/2;
            if (Pe < critere) {
                reset(apoapsis[indexForm], semi_majoraxis[indexForm]);
                setWarning(periapsis[indexForm], ' ');
                setWarning(eccentricity[indexForm], ' ');
            }
            else {
                removeWarning(periapsis[indexForm]);
                removeWarning(eccentricity[indexForm]);
                apoapsis[indexForm].value = Ap - rayon;
                semi_majoraxis[indexForm].value = a;
            }
            break;
        case 'false, true, true, false' :
            var Ap = parseFloat(apoapsis[indexForm].value) + rayon;
            var a = parseFloat(semi_majoraxis[indexForm].value);
            var Pe = 2*a-Ap;
            var e = (Ap-Pe)/(Ap+Pe);
            if (Pe > Ap || Pe < critere) {
                reset(periapsis[indexForm], eccentricity[indexForm]);
                setWarning(apoapsis[indexForm], ' ');
                setWarning(semi_majoraxis[indexForm], ' ');
            }
            else {
                removeWarning(apoapsis[indexForm]);
                removeWarning(semi_majoraxis[indexForm]);
                periapsis[indexForm].value = Pe - rayon;
                eccentricity[indexForm].value = e;
            }
            break;
        case 'false, true, false, true' :
            var Ap = parseFloat(apoapsis[indexForm].value) + rayon;
            var e = parseFloat(eccentricity[indexForm].value);
            var Pe = Ap*(1-e)/(1+e);
            var a = (Ap+Pe)/2;
            if (Pe > Ap || Pe < critere) {
                reset(periapsis[indexForm], semi_majoraxis[indexForm]);
                setWarning(apoapsis[indexForm], ' ');
                setWarning(eccentricity[indexForm], ' ');
            }
            else {
                removeWarning(apoapsis[indexForm]);
                removeWarning(eccentricity[indexForm]);
                periapsis[indexForm].value = Pe - rayon;
                semi_majoraxis[indexForm].value = a;
            }
            break;
        case 'false, false, true, true' :
            var a = parseFloat(semi_majoraxis[indexForm].value);
            var e = parseFloat(eccentricity[indexForm].value);
            var Ap = a*(1+e);
            var Pe = a*(1-e);
            if ((Pe > Ap && !isHyperbolic) || Pe < critere) {
                reset(apoapsis[indexForm], periapsis[indexForm]);
                setWarning(semi_majoraxis[indexForm], ' ');
                setWarning(eccentricity[indexForm], ' ');
            }
            else {
                removeWarning(semi_majoraxis[indexForm]);
                removeWarning(eccentricity[indexForm]);
                periapsis[indexForm].value = Pe - rayon;
                apoapsis[indexForm].value = Ap - rayon;
            }
    }
}
function isSubmittable() {
	var modalInputCheck = [modal_mass, radius, inclination[2], longitude[2], semi_majoraxis[2], eccentricity[2], argument_periapsis[2], true_anomaly[2]];
	if (modal_name.value == '') {
		return false
	}
	for (let k=0, c=modalInputCheck.length ; k < c ; k++) {
		if (!modalInputCheck[k].parentNode.nextElementSibling.getAttribute('hidden')) {
			return false
		}
	}
	return true;
}
	
// Setting elements
function swapAltitude(element, unit, isAltitudeSet, indexForm) {
    var value = parseFloat(element.value);
    if (indexForm == 2) {
        return false
    }
    var rayon = body[indexForm].radius;
    if (isNaN(value) || !isNumber(element, true)) {
        element.value = '';
        removeWarning(element);
        return false;
    }
    if (isAltitudeSet) {
        if (unit == 'km') {
            value += rayon;
        }
        else {
            value += rayon/UA;
        }
    }
    else {
        if (unit == 'km') {
            value -= rayon;
        }
        else {
            value -= rayon/UA;
        }
    }
    element.value = value;
}
function setWarning(element, text) {
    var div_parent = element.parentNode.parentNode.parentNode;
    var div_hidden = div_parent.lastElementChild.lastElementChild;
    div_parent.setAttribute('class', 'form-group has-error');
    div_hidden.removeAttribute('hidden');
    if (text) {
        div_hidden.lastElementChild.innerHTML = text;
    }
}
function removeWarning(element) {
    var div_parent = element.parentNode.parentNode.parentNode;
    var div_hidden = div_parent.lastElementChild.lastElementChild;
    div_parent.setAttribute('class', 'form-group');
    div_hidden.setAttribute('hidden', 'true');
}
function disable() {
    for (let k = 0, c = arguments.length ; k < c ; k++) {
        arguments[k].setAttribute('disabled', 'true');
    }
}
function enable() {
    for (let k = 0, c = arguments.length ; k < c ; k++) {
        arguments[k].removeAttribute('disabled');
    }
}
function reset() {
    for (let k = 0, c = arguments.length ; k < c ; k++) {
        arguments[k].value = '';
        removeWarning(arguments[k]);
    }
}
	
// Math / physic test
function isNumber(element, notNegative) {
	var value = element.value;
	var caracter = ['0','1','2','3','4','5','6','7','8','9','e','.', 'e', 'E', '+', '-'];
	var error = 0;
	for (let k=0, c=value.length ; k < c ; k++) {
		if (!caracter.includes(value[k])) {
			error++;
		} // Faux si autres caractères que ceux acceptés
		if (value[k] == '.') {
			if (k == 0) {
				error++;
			}
			else {
				if (value[k-1] == '-') {
					error++;
				}
				else {
					for (let j=0 ; j < k ; j++) {
						if (value[j] == 'e' || value[j] == 'E' || value[j] == '.') {
							error++;
						}
					}
				}
			}
		} // Gestion des coma
		if (value[k] == '-') {
			if (k == 0) {
				if (notNegative) {
					error++;
				}
			}
			else {
				if (value[k-1] != 'E' && value[k-1] != 'e') {
				error++;
				}
			}
		} // Gestion du négatif
		if (value[k] == '+') {
			if (k != 0) {
				if (value[k-1] != 'E' && value[k-2] != 'e') {
					error++;
				}
			}
		} // Gestion du "+"
		if (value[k] == 'e' || value[k] == 'E') {
			if (k == 0) {
				error++;
			}
			else {
				if (value[k-1] == '.' || value[k-1] == '-') {
					error++;
				}
				for (let j=0 ; j < k ; j++) {
					if (value[j] == 'e' || value[j] =='E') {
						error++;
					}
				}
			}
		} // Gestion des puissances
		if (k == c-1) {
			if (value[k] == 'e' || value[k] == 'E') {
				error++;
			}
		}
	}
	if (error > 0) {
		return false;
	}
	else {
		return true;
	}
}
function unitIs(input_element) {
    var span = input_element.nextElementSibling;
    if (span) {
        return span.innerHTML;
    }
    else {
        return null;
    }
}
function belongsTo(element, isAltitudeSet, indexForm, min, max) {
    var value = parseFloat(element.value);
    var unit = unitIs(element);
	var rayon = body[indexForm].radius;
    if (unit == 'UA') {
        min = convert(min, 'km');
        max = convert(max, 'km');
        rayon = convert(rayon, 'km');
    }
    if (unit == "rad") {
        min = convert(min,'°');
        max = convert(max, '°');
    }
    if (!isAltitudeSet) {
        min += rayon;
    }
    if (value > max || value < min) {
        return false;
    }
    else {
        return true;
    }
}
function isNull(element) {
    var value = element.value;
    if (value == '') {
        return true;
    }
    else {
        return false;
    }
}
function scientific(value) {
	var parts = value.toString().split('.');
	var result;
	// Integer part
	var int = parts[0].length;
	// Decimal part
	var dec = parts[1].length;
	if (int > 1) {
		result = parts[0][0] + '.';
		for (let k = 1 ; k < int && k < 15 ; k++) {
			result += parts[0][k];
		}
		for (let k = 0, c = 15 - int ; k < dec && k < c; k++) {
			result += parts[1][k];
		}
		result += 'e' + (int-1);
		return result;
	}
	else {
		return value;
	}
}
}
//Déclaration des events :
// SELECT
{
for (let indexForm = 0 ; indexForm < 3 ; indexForm++) {
    origine[indexForm].addEventListener('change', function() {
    body[indexForm] = origine[indexForm].value;
	if (indexForm != 2) {
    	inputs.forEach(function(element) {
        	enable(element[indexForm]);
			reset(element[indexForm]);
    	});
		if (orbit_type[indexForm].value == 'Parabola') {
			eccentricity[indexForm].value = 1;
			disable(eccentricity[indexForm]);
		}
    	inputCheck[indexForm] = [false, false, false, false];
	}
    for (let k = 0, c = planets.length ; k < c ; k++) {
        if (planets[k].name == body[indexForm]) {
            body[indexForm] = planets[k];
            return false;
        }
    }
})
}
for (let indexForm = 0 ; indexForm < 2 ; indexForm++) {
	orbit_type[indexForm].addEventListener('change', function() {
		var type = orbit_type[indexForm].value;
		for (let k=0, c=parameter.length ; k < c ; k++) {
			reset(parameter[k][indexForm]);
			enable(parameter[k][indexForm]);
		}
		if (type == 'Hyperbola' || type == 'Parabola') {
			apoapsis[indexForm].parentNode.parentNode.parentNode.setAttribute('hidden', 'true');
		}
		else {
			apoapsis[indexForm].parentNode.parentNode.parentNode.removeAttribute('hidden');
		}
		inputCheck[indexForm]=[false, false, false, false];
		if (type == 'Parabola') {
			eccentricity[indexForm].value = 1;
			disable(eccentricity[indexForm]);
			inputCheck[indexForm][3] = true;
			semi_majoraxis[indexForm].parentNode.parentNode.parentNode.setAttribute('hidden', 'true');
		}
		else {
			semi_majoraxis[indexForm].parentNode.parentNode.parentNode.removeAttribute('hidden');
		}
	});
}
}
//INPUT
{
modal_mass.addEventListener('keyup', function() {
	if (!isNumber(this, true)) {
		setWarning(this, "Mass MUST be a positive number !");
	}
	else {
		removeWarning(this);
	}
});

radius.addEventListener('keyup', function() {
	if (!isNumber(this, true)) {
		setWarning(this, "Radius MUST be a positive number !");
	}
	else {
		removeWarning(this);
	}
})

for (let indexForm = 0 ; indexForm < 3 ; indexForm++) {
    inclination[indexForm].addEventListener('keyup', function() {
    var unit = unitIs(this);
    var min = -180;
    var max = 180;
    if (!isNumber(this)) {
        setWarning(this,"You must set an angle !");
    }
    else {
        if (!belongsTo(this, true, indexForm, min, max)) {
            switch (unit) {
                case '°':
                    setWarning(this, "Inclination must lie between -180° and 180°");
                    break;
                case 'rad':
                    setWarning(this, "Inclination must lie between -π and π rad");
            }
        }
        else {
            value = parseFloat(this.value);
            removeWarning(this);
        }
    }
});
	longitude[indexForm].addEventListener('keyup', function() {
    var unit = unitIs(this);
    var min = 0;
    var max = 360;
    if (!isNumber(this, true)) {
        setWarning(this,"You must set a positive angle !");
    }
    else {
        if (!belongsTo(this, true, indexForm, min, max)) {
            switch (unit) {
                case '°':
                    setWarning(this, "Longitude of Ascending Node must lie between 0° and 360°");
                    break;
                case 'rad':
                    setWarning(this, "Longitude of Ascending Node must lie between 0 and 2π rad");
            }
        }
        else {
            value = parseFloat(this.value);
            removeWarning(this);
        }
    }
});
	semi_majoraxis[indexForm].addEventListener('keyup', function() {
    if (indexForm == 2) {
        if (isNull(this)) {
            removeWarning(this);
        }
        else {
            if (isNumber(this, true)) {
                if (belongsTo(this, false, indexForm, 0)) {
                    removeWarning(this);
                }
                else {
                    setWarning(this, "The orbit is under the surface !")
                }
            }
            else {
                setWarning(this, "Semi major-axis must be a positive number")
            }
        }
        return false;
    }
	var type = orbit_type[indexForm].value;
	var isHyperbolic = false;
	if (type == 'Hyperbola') {
		isHyperbolic = true;
	}
    if (isNull(this)) {
        removeWarning(this);
        for (let k = 0, c = inputCheck[indexForm].length ; k < c ; k++) {
            enable(parameter[k][indexForm]);
            if (!inputCheck[indexForm][k]) {
                reset(parameter[k][indexForm]);
            }
            else if (parameter[k][indexForm].parentNode.nextElementSibling.firstElementChild.innerHTML == ' ') {
                removeWarning(parameter[k][indexForm]);
            }
        }
        inputCheck[indexForm][2] = false;
    }
    else {
        inputCheck[indexForm][2] = true;
        var unit = unitIs(this);
        var isAltitudeSet = false;
        if (periapsis[indexForm].parentNode.parentNode.parentNode.firstElementChild.getAttribute('class') == 'altitude') {
            isAltitudeSet = true;
        }
        if (!isEnough(indexForm)) {
            for (let k = 0, c = inputCheck[indexForm].length ; k < c ; k++) {
                enable(parameter[k][indexForm]);
            }
            if (isNumber(this, true)) {
                if (belongsTo(this, false, indexForm, 0)) {
                    removeWarning(this);
                }
                else {
                    setWarning(this, "The orbit is under the surface !")
                }
            }
            else {
                setWarning(this, "Semi major-axis must be a positive number");
            }
        }
        else {
            if ((isComputable(true, indexForm) && type == 'Ellipse') || (isComputable(false, indexForm) && type == 'Hyperbola')) {
                removeWarning(this);
                compute(isAltitudeSet, indexForm, isHyperbolic);
            }
            else {
                for (let k = 0, c = inputCheck[indexForm].length ; k < c ; k++) {
                    if (!inputCheck[indexForm][k]) {
                        reset(parameter[k][indexForm]);
                    }
                }
                if ((isNumber(this, true) && type == 'Ellipse') || (isNumber(this, false) && type == 'Hyperbola')) {
                    if (belongsTo(this, false, indexForm, 0)) {
                        removeWarning(this);
                    }
                    else {
                        setWarning(this, "The orbit is under the surface !")
                    }
                }
                else {
                    setWarning(this, "Semi major-axis must be a positive number");
                }
            }
        }
    }
});
	eccentricity[indexForm].addEventListener('keyup', function() {
	// Define if the orbit is an ellipse/parabola (true) or hyperbola (false)
	if (indexForm != 2) {
		var type = orbit_type[indexForm].value;
	}
	// For modal only (with return at the end)
    if (indexForm == 2) {
        if (isNull(this)) {
            removeWarning(this);
        }
        else {
            if (isNumber(this, true)) {
                if ((belongsTo(this, true, indexForm, 0, 1) && type) || (belongsTo(this, true, indexForm, 1) && !type)) {
                    removeWarning(this);
                }
                else {
					if (type) {
						setWarning(this, "You set a non-elliptic trajectory");
					}
					else {
						setWarning(this, "You set a non-hyperbolic trajectory");
					}
                }
            }
            else {
				setWarning(this, "Eccentricity must be a positive number");
            }
        }
        return false;
    }
		
	// For other forms
    if (isNull(this)) {
        removeWarning(this);
        for (let k = 0, c = inputCheck[indexForm].length ; k < c ; k++) {
            enable(parameter[k][indexForm]);
            if (!inputCheck[indexForm][k]) {
                reset(parameter[k][indexForm]);
            }
            else if (parameter[k][indexForm].parentNode.nextElementSibling.firstElementChild.innerHTML == ' ') {
                removeWarning(parameter[k][indexForm]);
            }
        }
        inputCheck[indexForm][3] = false;
    }
	// Filling eccentricity input :
    else {
        inputCheck[indexForm][3] = true;
        var unit = unitIs(this);
        var isAltitudeSet = false;
		// Altitude or distance from the center
        if (periapsis[indexForm].parentNode.parentNode.parentNode.firstElementChild.getAttribute('class') == 'altitude') {
            isAltitudeSet = true;
        }
		
		// Then :
        if (!isEnough(indexForm)) {
            for (let k = 0, c = inputCheck[indexForm].length ; k < c ; k++) {
                enable(parameter[k][indexForm]);
            }
            if (isNumber(this, true)) {
				if (((belongsTo(this, true, indexForm, 0, 1) && type == 'Ellipse') || (belongsTo(this, true, indexForm, 1) && type == "Hyperbola")) && this.value != 1) {
                    removeWarning(this);
                }
                else {
					if (type == 'Ellipse') {
						setWarning(this, "You set a non-elliptic trajectory");
					}
					else {
						setWarning(this, "You set a non-hyperbolic trajectory");
					}
                }
            }
            else {
                setWarning(this, "Eccentricity must be a positive number");
            }
        }
        else {
            if (isComputable(true, indexForm)) {
                removeWarning(this);
                compute(isAltitudeSet, indexForm);
            }
            else {
                for (let k = 0, c = inputCheck[indexForm].length ; k < c ; k++) {
                    if (!inputCheck[indexForm][k]) {
                        reset(parameter[k][indexForm]);
                    }
                }
                if (isNumber(this, true)) {
                    if (((belongsTo(this, true, indexForm, 0, 1) && type == 'Ellipse') || (belongsTo(this, true, indexForm, 1) && type == "Hyperbola")) && this.value != 1) {
                        removeWarning(this);
                    }
                    else if (type == 'Ellipse') {
                        setWarning(this, "You set a non-elliptic trajectory");
                    }
					else {
						setWarning(this, "You set a non-hyperbolic trajectory");
					}
                }
            }
        }
    }
});
	argument_periapsis[indexForm].addEventListener('keyup', function() {
    var unit = unitIs(this);
    var min = 0;
    var max = 360;
    if (!isNumber(this, true)) {
        setWarning(this,"Argument of periapsis must be a positive angle !");
    }
    else {
        if (!belongsTo(this, true, indexForm, min, max)) {
            switch (unit) {
                case '°':
                    setWarning(this, "Argument of periapsis must lie between 0° and 360°");
                    break;
                case 'rad':
                    setWarning(this, "Argument of periapsis must lie between 0 and 2π rad");
            }
        }
        else {
            value = parseFloat(this.value);
            removeWarning(this);
        }
    }
});
	true_anomaly[indexForm].addEventListener('keyup', function() {
    var unit = unitIs(this);
    var min = 0;
    var max = 360;
    if (!isNumber(this, true)) {
        setWarning(this,"True anomaly must be a positive number !");
    }
    else {
        if (!belongsTo(this, true, indexForm, min, max)) {
            switch (unit) {
                case '°':
                    setWarning(this, "True anomaly must lie between 0° and 360°");
                    break;
                case 'rad':
                    setWarning(this, "True anomaly must lie between 0 and 2π rad");
            }
        }
        else {
            value = parseFloat(this.value);
            removeWarning(this);
        }
    }
});
}

for (let indexForm = 0 ; indexForm < 2 ; indexForm++) {
    periapsis[indexForm].addEventListener('keyup', function() {
    if (isNull(this)) {
        removeWarning(this);
        for (let k = 0, c = inputCheck[indexForm].length ; k < c ; k++) {
            enable(parameter[k][indexForm]);
            if (!inputCheck[indexForm][k]) {
                reset(parameter[k][indexForm]);
            }
            else if (parameter[k][indexForm].parentNode.nextElementSibling.firstElementChild.innerHTML == ' ') {
                removeWarning(parameter[k][indexForm]);
            }
        }
        inputCheck[indexForm][0] = false;
    }
    else {
        inputCheck[indexForm][0] = true;
        var unit = unitIs(this);
        var isAltitudeSet = false;
        if (this.parentNode.parentNode.parentNode.firstElementChild.getAttribute('class') == 'altitude') {
            isAltitudeSet = true;
        }
        if (!isEnough(indexForm)) {
            for (let k = 0, c = inputCheck[indexForm].length ; k < c ; k++) {
                enable(parameter[k][indexForm]);
            }
            if (isNumber(this, true)) {
                if (belongsTo(this, isAltitudeSet, indexForm, 0)) {
                    removeWarning(this);
                }
                else {
                    setWarning(this, "Periapsis is under the surface !")
                }
            }
            else {
                setWarning(this, "Periapsis must be a positive number !");
            }
        }
        else {
            if (isComputable(true, indexForm)) {
                removeWarning(this);
                compute(isAltitudeSet, indexForm);
            }
            else {
                for (let k = 0, c = inputCheck[indexForm].length ; k < c ; k++) {
                    if (!inputCheck[indexForm][k]) {
                        reset(parameter[k][indexForm]);
                    }
                }
                if (isNumber(this, true)) {
                    if (belongsTo(this, isAltitudeSet, indexForm, 0)) {
                        removeWarning(this);
                    }
                    else {
                        setWarning(this, "Periapsis is under the surface !")
                    }
                }
                else {
                    setWarning(this, "Periapsis must be a positive number !");
                }
            }
        }
    }
	if (orbit_type[indexForm].value == 'Parabola') {
		eccentricity[indexForm].value == 1;
		disable(eccentricity[indexForm]);
	}
});
	apoapsis[indexForm].addEventListener('keyup', function() {
    if (isNull(this)) {
        removeWarning(this);
        for (let k = 0, c = inputCheck[indexForm].length ; k < c ; k++) {
            enable(parameter[k][indexForm]);
            if (!inputCheck[indexForm][k]) {
                reset(parameter[k][indexForm]);
            }
            else if (parameter[k][indexForm].parentNode.nextElementSibling.firstElementChild.innerHTML == ' ') {
                removeWarning(parameter[k][indexForm]);
            }
        }
        inputCheck[indexForm][1] = false;
    }
    else {
        inputCheck[indexForm][1] = true;
        var unit = unitIs(this);
        var isAltitudeSet = false;
        if (this.parentNode.parentNode.parentNode.firstElementChild.getAttribute('class') == 'altitude') {
            isAltitudeSet = true;
        }
        if (!isEnough(indexForm)) {
            for (let k = 0, c = inputCheck[indexForm].length ; k < c ; k++) {
                enable(parameter[k][indexForm]);
            }
            if (isNumber(this, true)) {
                if (belongsTo(this, isAltitudeSet, indexForm, 0)) {
                    removeWarning(this);
                }
                else {
                    setWarning(this, "Apoapsis is under the surface !")
                }
            }
            else {
                setWarning(this, "Apoapsis must be a positive number !");
            }
        }
        else {
            if (isComputable(true, indexForm)) {
                removeWarning(this);
                compute(isAltitudeSet, indexForm);
            }
            else {
                for (let k = 0, c = inputCheck[indexForm].length ; k < c ; k++) {
                    if (!inputCheck[indexForm][k]) {
                        reset(parameter[k][indexForm]);
                    }
                }
                if (isNumber(this, true)) {
                    if (belongsTo(this, isAltitudeSet, indexForm, 0)) {
                        removeWarning(this);
                    }
                    else {
                        setWarning(this, "Apoapsis is under the surface !")
                    }
                }
                else {
                    setWarning(this, "Apoapsis must be a positive number !");
                }
            }
        }
    }
});
}
}
// SPAN
{
	
menu.forEach(function(element) {
	element.addEventListener('click', function() {
		var text = this.nextElementSibling;
		var menu_right = this.firstElementChild;
		var menu_down = menu_right.nextElementSibling;
		if (text.getAttribute('hidden')) {
			menu_right.setAttribute('hidden', 'true');
			menu_down.removeAttribute('hidden');
			text.removeAttribute('hidden');
		}
		else {
			text.setAttribute('hidden', 'true');
			menu_right.removeAttribute('hidden');
			menu_down.setAttribute('hidden', 'true');
		}
		
	});
});
angular_unit.forEach(function(element) {
    element.addEventListener('click', function() {
        var unit = this.innerHTML;
        var input_element = this.previousElementSibling;
        input_element.value = convert(parseFloat(input_element.value), unit);
        if (unit == '°') {
            unit = 'rad';
            this.innerHTML = unit;
        }
        else {
            unit = '°';
            this.innerHTML = unit;
        }
    });
});

for (let indexForm = 0 ; indexForm < 3 ; indexForm++) {
    length_unit[indexForm].forEach(function(element) {
    element.addEventListener('click', function() {
        var unit = this.innerHTML;
        length_unit[indexForm].forEach(function(element) {
            var input_element = element.previousElementSibling;
            input_element.value = convert(parseFloat(input_element.value), unit);
            if (unit == 'km') {
                element.innerHTML = 'UA';
            }
            else {
                element.innerHTML = 'km';
            }
        });
    });
});
}

for (let indexForm = 0 ; indexForm < 2 ; indexForm++) {
    alt[indexForm].forEach(function(element) {
    element.addEventListener('click', function() {
        var type = element.getAttribute('class');
        alt[indexForm].forEach(function(element) {
			var input = element.nextElementSibling.firstElementChild.firstElementChild;
            var unit = input.nextElementSibling.innerHTML;
            if (type == 'altitude') {
                element.firstElementChild.setAttribute('title', 'Distance au foyer');
                element.setAttribute('class', 'foyer');
				input.setAttribute('placeholder', 'Distance au foyer');
                swapAltitude(input, unit, true, indexForm);
            }
            else {
                element.firstElementChild.setAttribute('title', 'Altitude');
                element.setAttribute('class', 'altitude');
				input.setAttribute('placeholder', 'Altitude');
                swapAltitude(input, unit, false, indexForm);
            }
        });
    });
});
}
	
window_unit.addEventListener('click', function() {
	for (let k=0, c = range.length ; k < c ; k++) {
		if (range[k] == window_unit.innerHTML) {
			if (k < c-1) {
				window_unit.innerHTML = range[k+1];
			}
			else {
				window_unit.innerHTML = range[0];
			}
			return true;
		}
	}
})
}
// BUTTON
{
submit_add.addEventListener('click', function() {
	if (isSubmittable()) {
		var result = [[origine[2].value,null],
					  [modal_name.value, null], 
					  [parseFloat(modal_mass.value), unitIs(modal_mass)], 
					  [parseFloat(radius.value), unitIs(radius)], 
					  [parseFloat(inclination[2].value), unitIs(inclination[2])], 
					  [parseFloat(longitude[2].value), unitIs(longitude[2])], 
					  [parseFloat(semi_majoraxis[2].value), unitIs(semi_majoraxis[2])], 
					  [parseFloat(eccentricity[2].value), unitIs(eccentricity[2])], 
					  [parseFloat(argument_periapsis[2].value), unitIs(argument_periapsis[2])], 
					  [parseFloat(true_anomaly[2].value), unitIs(true_anomaly[2])], 
					  [modal_epoch.value, null]];
		for (let k = 0, c = result.length ; k < c ; k++) {
			if (result[k][1] == 'rad') {
				result[k][0] = convert(result[k][0], 'rad');
			}
		}
		if (result[6][1] == 'km') {
			result[6][0] = convert(result[6][0], 'km');
		}
		for (let k = 0, c = planets.length ; k < c ; k++) {
			if (result[0][0] == planets[k].name) {
				body[2] = planets[k];
				result[0][0] = body[2];
			}
		}
		var add_planet = new Planet(result[1][0], result[2][0], result[3][0], new Orbit(result[0][0], result[4][0], result[5][0], result[6][0], result[7][0], result[8][0], result[9][0]));
		planets.push(add_planet);
		hiddenOption.forEach(function(element) {
			element.removeAttribute('hidden');
			element.innerHTML = element.innerHTML + "<option>" + modal_name.value + "</option>";
		});
		reset(modal_name, modal_mass, radius, inclination[2], longitude[2], semi_majoraxis[2], eccentricity[2], argument_periapsis[2], true_anomaly[2], modal_epoch);
		origine[2].selectIndex = optiondefault[2].index;
	}
	else {
		console.log('unhappy though ?');
	}
});

for (let indexForm = 0; indexForm < 2 ; indexForm++) {
	reset_button[indexForm].addEventListener('click', function() {
        for (let k = 0, c = inputs.length ; k < c ; k++) {
            enable(inputs[k][indexForm]);
            reset(inputs[k][indexForm]);
            removeWarning(inputs[k][indexForm]);
        }
        inputCheck[indexForm] = [false, false, false, false];
        origine[indexForm].selectedIndex = optiondefault[indexForm].index;
        alt[indexForm].forEach(function(element) {
            element.firstElementChild.setAttribute('title', 'Altitude');
            element.setAttribute('class', 'altitude');
        });
        angular_unit.forEach(function(element) {
            element.innerHTML = '°';
        });
        length_unit[indexForm].forEach(function(element) {
            element.innerHTML = "km";
        });
        body[indexForm] = planets[0];
	});
	info_body[indexForm].addEventListener('click', function() {
		function textLines() {
			var text = arguments[0];
			for (let k = 1, c = arguments.length ; k < c ; k++) {
				text = text + "<br>" + arguments[k];
			}
			return text;
		}
		var infoName = document.getElementById('infoBodyModal');
		infoName.innerHTML = body[indexForm].name;
		var infoSection = document.getElementById('infoSectionModal');
		var text = textLines("<h4><b>Paramètres généraux</b></h4>masse  " + body[indexForm].mass + " kg", "rayon " + body[indexForm].radius + " km", "paramètre gravitationnel " + body[indexForm].gravitationalParameter + " km3/s²");
		if (body[indexForm].name != "Soleil") {
			text = textLines(text, "SOI	" + body[indexForm].radiusSOI + " km", "Energie mécanique spé. " + body[indexForm].specificOrbitalEnergy + " MJ/kg", "<br><h4><b>Paramètres orbitaux :</b></h4>corps attracteur : " + body[indexForm].orbit.referenceBody.name, "inclinaison " + body[indexForm].orbit.inclination + " °", "longitude du noeud asc. " + body[indexForm].orbit.longitudeOfAscendingNode + " °", "demi grand-axe " + body[indexForm].orbit.semiMajorAxis + " UA", "demi petit-axe	" + body[indexForm].orbit.semiMinorAxis + " UA", "excentricité " + body[indexForm].orbit.ecc, "semilatus " + body[indexForm].orbit.semiparameter + " UA", "période " + body[indexForm].orbit.period / 86400 + " j");
		}
		infoSection.innerHTML = text;
	});
}
}
	
// revoir les modals qui sont moches
// retirer le blocage de w et W (en raison de la précision des unités)
// bloquer la précision des unités à 10e-15 ? avec une fonction ou directement via isNumber (arrondi dans isNumber) ou alors arrondir les résultats computés, directement en manipulant l'input ?
// Ajouter des animations pour faire pop les formulaires ?
// mettre en place un fichier js quaternion pour gérer les vecteurs, leur manipulation, etc
// mettre en place un fichier js pour toutes les fonctions mathématiques :)
