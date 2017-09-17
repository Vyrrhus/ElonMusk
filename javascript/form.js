//Déclaration des nodes input & select
var formStart = document.getElementById('form_start');
var formEnd = document.getElementById('form_end');
var origine = [formStart.elements['origine'], formEnd.elements['origine']];
var inclination = [formStart.elements['input_inclination'], formEnd.elements['input_inclination']];
var longitude = [formStart.elements['input_longitude'], formEnd.elements['input_longitude']];
var periapsis = [formStart.elements['input_periapsis'], formEnd.elements['input_periapsis']];
var apoapsis = [formStart.elements['input_apoapsis'], formEnd.elements['input_apoapsis']];
var semi_majoraxis = [formStart.elements['input_semi_majoraxis'], formEnd.elements['input_semi_majoraxis']];
var eccentricity = [formStart.elements['input_eccentricity'], formEnd.elements['input_eccentricity']];
var argument_periapsis = [formStart.elements['input_argument_periapsis'], formEnd.elements['input_argument_periapsis']];
var true_anomaly = [formStart.elements['input_true_anomaly'], formEnd.elements['input_true_anomaly']];
var parameter = [periapsis, apoapsis, semi_majoraxis, eccentricity];
var inputs = [inclination, longitude, periapsis, apoapsis, semi_majoraxis, eccentricity, argument_periapsis, true_anomaly];
var optionEarth = [document.getElementById('select_default_start'), document.getElementById('select_default_end')];


//Déclaration des nodes span
var angular_unit = document.getElementsByName('angular_unit');
var length_unit = [document.getElementsByName('length_unit_ini'), document.getElementsByName('length_unit_fin')];
var alt = [document.getElementsByName('alt_start'), document.getElementsByName('alt_end')];

//Déclaration des boutons
var reset_button = document.getElementById('reset');
var add_button = document.getElementById('add_body');

//Déclaration des variables globales
var body = [planets[0], planets[0]];
var UA = 149597870.7; // km
var Pi = Math.PI;
var inputCheck = [[false, false, false, false], [false, false, false, false]];

//Déclaration des fonctions
function isNumber(element, popNegative) {
    var value = element.value;
    var condition = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '-'];
    if (popNegative) {
        condition.pop();
    }
    var error = 0;
    var coma = 0;
    for (let k=0, c=value.length ; k < c ; k++) {
        if (!condition.includes(value[k])) {
            error++;
        }
        if (value[k] == '.') {
            coma++;
        }
        if (value[k] == '-' && k > 0) {
            error++;
        }
    }
    if (error > 0 || coma > 1) {
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

function convert(value, unit) {
    if (isNaN(value)) {
        return '';
    }
    switch (unit) {
        case 'km' :
            value /= UA;
            break;
        case 'UA' :
            value *= UA;
            break;
        case '°' :
            value = value * Pi / 180;
            break;
        case 'rad' :
            value = value / Pi * 180;
            break;
    }
    return value;
}

function swapAltitude(element, unit, isAltitudeSet, indexForm) {
    var value = parseFloat(element.value);
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
    var div_parent = element.parentNode.parentNode;
    var div_hidden = div_parent.lastElementChild;
    div_parent.setAttribute('class', 'form-inline form-group has-error');
    div_hidden.removeAttribute('hidden');
    if (text) {
        div_hidden.lastElementChild.innerHTML = text;
    }
}

function removeWarning(element) {
    var div_parent = element.parentNode.parentNode;
    var div_hidden = div_parent.lastElementChild;
    div_parent.setAttribute('class', 'form-inline form-group');
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

function setArgumentPeriapsis(indexForm, bypass) {
    if (parseFloat(parameter[3][indexForm].value) == 0 || parameter[3][indexForm].value == '' || bypass) {
        disable(argument_periapsis[indexForm]);
        reset(argument_periapsis[indexForm]);
        removeWarning(argument_periapsis[indexForm]);
    }
    else {
        enable(argument_periapsis[indexForm]);
    }
}

function compute(isAltitudeSet, indexForm) {
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
            if (Pe > Ap || Pe < critere) {
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
            if (Pe > Ap || Pe < critere) {
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

//Déclaration du popover
$(document).ready(function() {
    $('[data-toggle="popover"]').popover();
});

//Déclaration des events :
// SELECT
for (let indexForm = 0 ; indexForm < 2 ; indexForm++) {
    origine[indexForm].addEventListener('change', function() {
    body[indexForm] = origine[indexForm].value;
    parameter.forEach(function(element) {
        enable(element[indexForm]);
        reset(element[indexForm]);
    });
    reset(argument_periapsis[indexForm]);
    disable(argument_periapsis[indexForm]);
    inputCheck[indexForm] = [false, false, false, false];
    for (let k = 0, c = planets.length ; k < c ; k++) {
        if (planets[k].name == body[indexForm]) {
            body[indexForm] = planets[k];
            return false;
        }
    }
})
}

//INPUT
for (let indexForm = 0 ; indexForm < 2 ; indexForm++) {
    inclination[indexForm].addEventListener('keyup', function() {
    var unit = unitIs(this);
    var min = -180;
    var max = 180;
    if (!isNumber(this)) {
        setWarning(this,"Vous devez entrer un angle !");
        disable(longitude[indexForm]);
        reset(longitude[indexForm]);
    }
    else {
        if (!belongsTo(this, true, indexForm, min, max)) {
            switch (unit) {
                case '°':
                    setWarning(this, "L'angle doit être compris entre -180° et 180° !");
                    break;
                case 'rad':
                    setWarning(this, "L'angle doit être compris entre -π et π rad !");
            }
            disable(longitude[indexForm]);
            reset(longitude[indexForm]);
        }
        else {
            value = parseFloat(this.value);
            removeWarning(this);
            if (isNull(this) || parseFloat(this.value) == 0 || this.value == '-') {
                disable(longitude[indexForm]);
                reset(longitude[indexForm]);
            }
            else {
                enable(longitude[indexForm]);
            }
        }
    }
});
}

for (let indexForm = 0 ; indexForm < 2 ; indexForm++) {
    longitude[indexForm].addEventListener('keyup', function() {
    var unit = unitIs(this);
    var min = 0;
    var max = 360;
    if (!isNumber(this, true)) {
        setWarning(this,"Vous devez entrer un angle positif !");
    }
    else {
        if (!belongsTo(this, true, indexForm, min, max)) {
            switch (unit) {
                case '°':
                    setWarning(this, "L'angle doit être compris entre 0° et 360° !");
                    break;
                case 'rad':
                    setWarning(this, "L'angle doit être compris entre 0 et 2π rad !");
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
        if (this.parentNode.parentNode.firstElementChild.getAttribute('class') == 'altitude') {
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
                    setWarning(this, "Le périgée est sous la surface !")
                }
            }
            else {
                setWarning(this, "Vous devez entrer un nombre positif !");
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
                        setWarning(this, "Le périgée est sous la surface !")
                    }
                }
                else {
                    setWarning(this, "Vous devez entrer un nombre positif !");
                }
            }
        }
    }
    setArgumentPeriapsis(indexForm);
});
}

for (let indexForm = 0 ; indexForm < 2 ; indexForm++) {
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
        if (this.parentNode.parentNode.firstElementChild.getAttribute('class') == 'altitude') {
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
                    setWarning(this, "L'apogée est sous la surface !")
                }
            }
            else {
                setWarning(this, "Vous devez entrer un nombre positif !");
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
                        setWarning(this, "L'apogée est sous la surface !")
                    }
                }
                else {
                    setWarning(this, "Vous devez entrer un nombre positif !");
                }
            }
        }
    }
    setArgumentPeriapsis(indexForm);
});
}

for (let indexForm = 0 ; indexForm < 2 ; indexForm++) {
    semi_majoraxis[indexForm].addEventListener('keyup', function() {
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
        if (periapsis[indexForm].parentNode.parentNode.firstElementChild.getAttribute('class') == 'altitude') {
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
                    setWarning(this, "L'orbite est sous la surface !")
                }
            }
            else {
                setWarning(this, "Vous devez entrer un nombre positif !");
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
                    if (belongsTo(this, false, indexForm, 0)) {
                        removeWarning(this);
                    }
                    else {
                        setWarning(this, "L'orbite est sous la surface !")
                    }
                }
                else {
                    setWarning(this, "Vous devez entrer un nombre positif !");
                }
            }
        }
    }
    setArgumentPeriapsis(indexForm);
});
}

for (let indexForm = 0 ; indexForm < 2 ; indexForm++) {
    eccentricity[indexForm].addEventListener('keyup', function() {
    var bypass = false;
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
    else {
        inputCheck[indexForm][3] = true;
        var unit = unitIs(this);
        var isAltitudeSet = false;
        if (periapsis[indexForm].parentNode.parentNode.firstElementChild.getAttribute('class') == 'altitude') {
            isAltitudeSet = true;
        }
        if (!isEnough(indexForm)) {
            for (let k = 0, c = inputCheck[indexForm].length ; k < c ; k++) {
                enable(parameter[k][indexForm]);
            }
            if (isNumber(this, true)) {
                if (belongsTo(this, true, indexForm, 0, 1)) {
                    removeWarning(this);
                }
                else {
                    setArgumentPeriapsis(indexForm, true);
                    setWarning(this, "Ce n'est pas une orbite elliptique !");
                    bypass = true;
                }
            }
            else {
                setWarning(this, "Vous devez entrer un nombre positif !");
                bypass = true;
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
                    if (belongsTo(this, true, indexForm, 0, 1)) {
                        removeWarning(this);
                    }
                    else {
                        
                        setWarning(this, "Ce n'est pas une orbite elliptique !");
                        bypass = true;
                    }
                }
                else {
                    setWarning(this, "Vous devez entrer un nombre positif !");
                    bypass = true;
                }
            }
        }
    }
    setArgumentPeriapsis(indexForm, bypass);
});
}

for (let indexForm = 0 ; indexForm < 2 ; indexForm++) {
    argument_periapsis[indexForm].addEventListener('keyup', function() {
    var unit = unitIs(this);
    var min = 0;
    var max = 360;
    if (!isNumber(this, true)) {
        setWarning(this,"Vous devez entrer un angle positif !");
    }
    else {
        if (!belongsTo(this, true, indexForm, min, max)) {
            switch (unit) {
                case '°':
                    setWarning(this, "L'angle doit être compris entre 0° et 360° !");
                    break;
                case 'rad':
                    setWarning(this, "L'angle doit être compris entre 0 et 2π rad !");
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
    true_anomaly[indexForm].addEventListener('keyup', function() {
    var unit = unitIs(this);
    var min = 0;
    var max = 360;
    if (!isNumber(this, true)) {
        setWarning(this,"Vous devez entrer un angle positif !");
    }
    else {
        if (!belongsTo(this, true, indexForm, min, max)) {
            switch (unit) {
                case '°':
                    setWarning(this, "L'angle doit être compris entre 0° et 360° !");
                    break;
                case 'rad':
                    setWarning(this, "L'angle doit être compris entre 0 et 2π rad !");
            }
        }
        else {
            value = parseFloat(this.value);
            removeWarning(this);
        }
    }
});
}

// SPAN
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

for (let indexForm = 0 ; indexForm < 2 ; indexForm++) {
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
            if (type == 'altitude') {
                element.firstElementChild.setAttribute('data-content', 'Distance au foyer');
                element.setAttribute('class', 'foyer');
                var input = element.nextElementSibling.firstElementChild;
                var unit = input.nextElementSibling.innerHTML;
                swapAltitude(input, unit, true, indexForm);
            }
            else {
                element.firstElementChild.setAttribute('data-content', 'Altitude');
                element.setAttribute('class', 'altitude');
                var input = element.nextElementSibling.firstElementChild;
                var unit = input.nextElementSibling.innerHTML;
                swapAltitude(input, unit, false, indexForm);
            }
        });
    });
});
}

// BUTTON
reset_button.addEventListener('click', function() {
    for (let indexForm = 0 ; indexForm < 2 ; indexForm++) {
        for (let k = 0, c = inputs.length ; k < c ; k++) {
            enable(inputs[k][indexForm]);
            reset(inputs[k][indexForm]);
            removeWarning(inputs[k][indexForm]);
        }
        disable(longitude[indexForm]);
        disable(argument_periapsis[indexForm]);
        inputCheck[indexForm] = [false, false, false, false];
        origine[indexForm].selectedIndex = optionEarth[indexForm].index;
        alt[indexForm].forEach(function(element) {
            element.firstElementChild.setAttribute('data-content', 'Altitude');
            element.setAttribute('class', 'altitude');
        });
        angular_unit.forEach(function(element) {
            element.innerHTML = '°';
        });
        length_unit[indexForm].forEach(function(element) {
            element.innerHTML = "km";
        });
        body[indexForm] = planets[0];
    }
});
