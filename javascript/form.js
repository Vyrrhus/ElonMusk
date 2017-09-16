//Déclaration des nodes input & select
var formStart = document.getElementById('form_start');
var origine = formStart.elements['origine'];
var inclination = formStart.elements['input_inclination'];
var longitude = formStart.elements['input_longitude'];
var periapsis = formStart.elements['input_periapsis'];
var apoapsis = formStart.elements['input_apoapsis'];
var semi_majoraxis = formStart.elements['input_semi_majoraxis'];
var eccentricity = formStart.elements['input_eccentricity'];
var argument_periapsis = formStart.elements['input_argument_periapsis'];
var true_anomaly = formStart.elements['input_true_anomaly'];
var parameter = [periapsis, apoapsis, semi_majoraxis, eccentricity];
var inputs = [inclination, longitude, periapsis, apoapsis, semi_majoraxis, eccentricity, argument_periapsis, true_anomaly];
var optionEarth = document.getElementById('planet_default');

//Déclaration des nodes span
var angular_unit = document.getElementsByName('angular_unit');
var length_unit_ini = document.getElementsByName('length_unit_ini');
var alt = document.getElementsByName('alt');

//Déclaration des boutons
var reset_button = document.getElementById('reset');

//Déclaration des variables globales
var body = planets[0];
var UA = 149597870.7; // km
var Pi = Math.PI;
var inputCheck = [false, false, false, false];

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

function belongsTo(element, isAltitudeSet, min, max) {
    var value = parseFloat(element.value);
    var unit = unitIs(element);
    var rayon = body.radius;
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

function swapAltitude(element, unit, isAltitudeSet) {
    var value = parseFloat(element.value);
    var rayon = body.radius;
    if (isNaN(value) || !isNumber(element)) {
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

function isEnough() {
    var result=0;
    inputCheck.forEach(function (element) {
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

function isComputable(notNegative) {
    var error = 0;
    for (let k=0, c = inputCheck.length ; k < c ; k++) {
        if (!inputCheck[k]) {
            disable(parameter[k]);
        }
        else {
            if (!isNumber(parameter[k], notNegative)) {
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

function setArgumentPeriapsis(bypass) {
    if (parseFloat(parameter[3].value) == 0 || parameter[3].value == '' || bypass) {
        disable(argument_periapsis);
        reset(argument_periapsis);
        removeWarning(argument_periapsis);
    }
    else {
        enable(argument_periapsis);
    }
}

function compute(isAltitudeSet) {
    var unit = unitIs(periapsis);
    var rayon = body.radius;
    if (!isAltitudeSet) {
        rayon = 0;
    }
    if (unit == 'UA') {
        rayon = convert(rayon, 'km');
    }
    for (let k = 0, c = parameter.length ; k < c ; k++) {
        if (!inputCheck[k]) {
            disable(parameter[k]);
        }
    }
    switch(inputCheck.join(', ')) {
        case 'true, true, false, false' :
            var Pe = parseFloat(periapsis.value) + rayon;
            var Ap = parseFloat(apoapsis.value) + rayon;
            var a = (Ap + Pe) / 2;
            var e = (Ap - Pe) / (Ap + Pe);
            if (Pe > Ap) {
                reset(semi_majoraxis, eccentricity);
                setWarning(periapsis, ' ');
                setWarning(apoapsis, ' ');
            }
            else {
                removeWarning(periapsis);
                removeWarning(apoapsis);
                semi_majoraxis.value = a;
                eccentricity.value = e;
            }
            break;
        case 'true, false, true, false' :
            var Pe = parseFloat(periapsis.value) + rayon;
            var a = parseFloat(semi_majoraxis.value);
            var Ap = 2*a - Pe;
            var e = (Ap-Pe)/(2*a);
            if (Pe > Ap) {
                reset(apoapsis, eccentricity);
                setWarning(periapsis, ' ');
                setWarning(semi_majoraxis, ' ');
            }
            else {
                removeWarning(periapsis);
                removeWarning(semi_majoraxis);
                apoapsis.value = Ap - rayon;
                eccentricity.value = e;
            }
            break;
        case 'true, false, false, true' :
            var Pe = parseFloat(periapsis.value)+rayon;
            var e = parseFloat(eccentricity.value);
            var Ap = Pe*(1+e)/(1-e);
            var a = (Ap+Pe)/2;
            apoapsis.value = Ap - rayon;
            semi_majoraxis.value = a;
            break;
        case 'false, true, true, false' :
            var Ap = parseFloat(apoapsis.value) + rayon;
            var a = parseFloat(semi_majoraxis.value);
            var Pe = 2*a-Ap;
            var e = (Ap-Pe)/(Ap+Pe);
            if (Pe > Ap || Pe < rayon) {
                reset(periapsis, eccentricity);
                setWarning(apoapsis, ' ');
                setWarning(semi_majoraxis, ' ');
            }
            else {
                removeWarning(apoapsis);
                removeWarning(semi_majoraxis);
                periapsis.value = Pe - rayon;
                eccentricity.value = e;
            }
            break;
        case 'false, true, false, true' :
            var Ap = parseFloat(apoapsis.value) + rayon;
            var e = parseFloat(eccentricity.value);
            var Pe = Ap*(1-e)/(1+e);
            var a = (Ap+Pe)/2;
            if (Pe > Ap ||Pe < rayon) {
                reset(periapsis, semi_majoraxis);
                setWarning(apoapsis, ' ');
                setWarning(eccentricity, ' ');
            }
            else {
                removeWarning(apoapsis);
                removeWarning(eccentricity);
                periapsis.value = Pe - rayon;
                semi_majoraxis.value = a;
            }
            break;
        case 'false, false, true, true' :
            var a = parseFloat(semi_majoraxis.value);
            var e = parseFloat(eccentricity.value);
            var Ap = a*(1+e);
            var Pe = a*(1-e);
            if (Pe > Ap || Pe < rayon) {
                reset(apoapsis, periapsis);
                setWarning(semi_majoraxis, ' ');
                setWarning(eccentricity, ' ');
            }
            else {
                removeWarning(semi_majoraxis);
                removeWarning(eccentricity);
                periapsis.value = Pe - rayon;
                apoapsis.value = Ap - rayon;
            }
    }
}

//Déclaration du popover
$(document).ready(function() {
    $('[data-toggle="popover"]').popover();
});

//Déclaration des events :
// SELECT
origine.addEventListener('change', function() {
    body = origine.value;
    parameter.forEach(function(element) {
        enable(element);
        reset(element);
    });
    reset(argument_periapsis);
    disable(argument_periapsis);
    inputCheck = [false, false, false, false];
    for (let k = 0, c = planets.length ; k < c ; k++) {
        if (planets[k].name == body) {
            body = planets[k];
            return false;
        }
    }
})

//INPUT
inclination.addEventListener('keyup', function() {
    var unit = unitIs(this);
    var min = -180;
    var max = 180;
    if (!isNumber(this)) {
        setWarning(this,"Vous devez entrer un angle !");
        disable(longitude);
        reset(longitude);
    }
    else {
        if (!belongsTo(this, true, min, max)) {
            switch (unit) {
                case '°':
                    setWarning(this, "L'angle doit être compris entre -180° et 180° !");
                    break;
                case 'rad':
                    setWarning(this, "L'angle doit être compris entre -π et π rad !");
            }
            disable(longitude);
            reset(longitude);
        }
        else {
            value = parseFloat(this.value);
            removeWarning(this);
            if (isNull(this) || parseFloat(this.value) == 0 || this.value == '-') {
                disable(longitude);
                reset(longitude);
            }
            else {
                enable(longitude);
            }
        }
    }
});

longitude.addEventListener('keyup', function() {
    var unit = unitIs(this);
    var min = 0;
    var max = 360;
    if (!isNumber(this, true)) {
        setWarning(this,"Vous devez entrer un angle positif !");
    }
    else {
        if (!belongsTo(this, true, min, max)) {
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

periapsis.addEventListener('keyup', function() {
    if (isNull(this)) {
        removeWarning(this);
        for (let k = 0, c = inputCheck.length ; k < c ; k++) {
            enable(parameter[k]);
            if (!inputCheck[k]) {
                reset(parameter[k]);
            }
            else if (parameter[k].parentNode.nextElementSibling.firstElementChild.innerHTML == ' ') {
                removeWarning(parameter[k]);
            }
        }
        inputCheck[0] = false;
    }
    else {
        inputCheck[0] = true;
        var unit = unitIs(this);
        var isAltitudeSet = false;
        if (this.parentNode.parentNode.firstElementChild.getAttribute('class') == 'altitude') {
            isAltitudeSet = true;
        }
        if (!isEnough()) {
            for (let k = 0, c = inputCheck.length ; k < c ; k++) {
                enable(parameter[k]);
            }
            if (isNumber(this, true)) {
                if (belongsTo(this, isAltitudeSet, 0)) {
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
            if (isComputable(true)) {
                removeWarning(this);
                compute(isAltitudeSet);
            }
            else {
                for (let k = 0, c = inputCheck.length ; k < c ; k++) {
                    if (!inputCheck[k]) {
                        reset(parameter[k]);
                    }
                }
                if (isNumber(this, true)) {
                    if (belongsTo(this, isAltitudeSet, 0)) {
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
    setArgumentPeriapsis();
});

apoapsis.addEventListener('keyup', function() {
    if (isNull(this)) {
        removeWarning(this);
        for (let k = 0, c = inputCheck.length ; k < c ; k++) {
            enable(parameter[k]);
            if (!inputCheck[k]) {
                reset(parameter[k]);
            }
            else if (parameter[k].parentNode.nextElementSibling.firstElementChild.innerHTML == ' ') {
                removeWarning(parameter[k]);
            }
        }
        inputCheck[1] = false;
    }
    else {
        inputCheck[1] = true;
        var unit = unitIs(this);
        var isAltitudeSet = false;
        if (this.parentNode.parentNode.firstElementChild.getAttribute('class') == 'altitude') {
            isAltitudeSet = true;
        }
        if (!isEnough()) {
            for (let k = 0, c = inputCheck.length ; k < c ; k++) {
                enable(parameter[k]);
            }
            if (isNumber(this, true)) {
                if (belongsTo(this, isAltitudeSet, 0)) {
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
            if (isComputable(true)) {
                removeWarning(this);
                compute(isAltitudeSet);
            }
            else {
                for (let k = 0, c = inputCheck.length ; k < c ; k++) {
                    if (!inputCheck[k]) {
                        reset(parameter[k]);
                    }
                }
                if (isNumber(this, true)) {
                    if (belongsTo(this, isAltitudeSet, 0)) {
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
    setArgumentPeriapsis();
});

semi_majoraxis.addEventListener('keyup', function() {
    if (isNull(this)) {
        removeWarning(this);
        for (let k = 0, c = inputCheck.length ; k < c ; k++) {
            enable(parameter[k]);
            if (!inputCheck[k]) {
                reset(parameter[k]);
            }
            else if (parameter[k].parentNode.nextElementSibling.firstElementChild.innerHTML == ' ') {
                removeWarning(parameter[k]);
            }
        }
        inputCheck[2] = false;
    }
    else {
        inputCheck[2] = true;
        var unit = unitIs(this);
        var isAltitudeSet = false;
        if (periapsis.parentNode.parentNode.firstElementChild.getAttribute('class') == 'altitude') {
            isAltitudeSet = true;
        }
        if (!isEnough()) {
            for (let k = 0, c = inputCheck.length ; k < c ; k++) {
                enable(parameter[k]);
            }
            if (isNumber(this, true)) {
                if (belongsTo(this, false, 0)) {
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
            if (isComputable(true)) {
                removeWarning(this);
                compute(isAltitudeSet);
            }
            else {
                for (let k = 0, c = inputCheck.length ; k < c ; k++) {
                    if (!inputCheck[k]) {
                        reset(parameter[k]);
                    }
                }
                if (isNumber(this, true)) {
                    if (belongsTo(this, false, 0)) {
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
    setArgumentPeriapsis();
});

eccentricity.addEventListener('keyup', function() {
    var bypass = false;
    if (isNull(this)) {
        removeWarning(this);
        for (let k = 0, c = inputCheck.length ; k < c ; k++) {
            enable(parameter[k]);
            if (!inputCheck[k]) {
                reset(parameter[k]);
            }
            else if (parameter[k].parentNode.nextElementSibling.firstElementChild.innerHTML == ' ') {
                removeWarning(parameter[k]);
            }
        }
        inputCheck[3] = false;
    }
    else {
        inputCheck[3] = true;
        var unit = unitIs(this);
        var isAltitudeSet = false;
        if (periapsis.parentNode.parentNode.firstElementChild.getAttribute('class') == 'altitude') {
            isAltitudeSet = true;
        }
        if (!isEnough()) {
            for (let k = 0, c = inputCheck.length ; k < c ; k++) {
                enable(parameter[k]);
            }
            if (isNumber(this, true)) {
                if (belongsTo(this, true, 0, 1)) {
                    removeWarning(this);
                }
                else {
                    setArgumentPeriapsis(true);
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
            if (isComputable(true)) {
                removeWarning(this);
                compute(isAltitudeSet);
            }
            else {
                for (let k = 0, c = inputCheck.length ; k < c ; k++) {
                    if (!inputCheck[k]) {
                        reset(parameter[k]);
                    }
                }
                if (isNumber(this, true)) {
                    if (belongsTo(this, true, 0, 1)) {
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
    setArgumentPeriapsis(bypass);
});

argument_periapsis.addEventListener('keyup', function() {
    var unit = unitIs(this);
    var min = 0;
    var max = 360;
    if (!isNumber(this, true)) {
        setWarning(this,"Vous devez entrer un angle positif !");
    }
    else {
        if (!belongsTo(this, true, min, max)) {
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

true_anomaly.addEventListener('keyup', function() {
    var unit = unitIs(this);
    var min = 0;
    var max = 360;
    if (!isNumber(this, true)) {
        setWarning(this,"Vous devez entrer un angle positif !");
    }
    else {
        if (!belongsTo(this, true, min, max)) {
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

length_unit_ini.forEach(function(element) {
    element.addEventListener('click', function() {
        var unit = this.innerHTML;
        length_unit_ini.forEach(function(element) {
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

alt.forEach(function(element) {
    element.addEventListener('click', function() {
        var type = element.getAttribute('class');
        alt.forEach(function(element) {
            if (type == 'altitude') {
                element.firstElementChild.setAttribute('data-content', 'Distance au foyer');
                element.setAttribute('class', 'foyer');
                var input = element.nextElementSibling.firstElementChild;
                var unit = input.nextElementSibling.innerHTML;
                swapAltitude(input, unit, true);
            }
            else {
                element.firstElementChild.setAttribute('data-content', 'Altitude');
                element.setAttribute('class', 'altitude');
                var input = element.nextElementSibling.firstElementChild;
                var unit = input.nextElementSibling.innerHTML;
                swapAltitude(input, unit, false);
            }
        });
    });
});

// BUTTON
reset_button.addEventListener('click', function() {
    inputs.forEach(function(element) {
        enable(element);
        reset(element);
        removeWarning(element);
    });
    disable(longitude);
    disable(argument_periapsis);
    inputCheck = [false, false, false, false];
    origine.selectedIndex = optionEarth.index;
    alt.forEach(function(element) {
        element.firstElementChild.setAttribute('data-content', 'Altitude');
        element.setAttribute('class', 'altitude');
    });
    angular_unit.forEach(function(element) {
        element.innerHTML = '°';
    });
    length_unit_ini.forEach(function(element) {
        element.innerHTML = "km";
    });
});

/*  
- BUTTON
    * add_body

RESET : corriger le selectedIndex pour qu'il corresponde toujours à la Terre
INPUTs : corriger les bugs liés au changement d'unité 
*/
