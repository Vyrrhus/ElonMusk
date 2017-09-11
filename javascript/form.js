//Déclaration des variables globales
var formStart = document.getElementById('form_start');
var origine_data = [0,0,0,0,0,0,0,0,0,6371.008]; //origine_data [name, reference_body, i, W, a, e, w, v, masse, radius]; //d'où on extrait le rayon
var rayon = 6371.008; // à supprimer après je pense
var UA = 149597870.7;
var inputCheck = [false, false, false, false];

//Déclaration des nodes input & select
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

//Déclaration des nodes span
var angular_unit = document.getElementsByName('angular_unit');
var length_unit_ini = document.getElementsByName('length_unit_ini');
var alt = document.getElementsByName('alt');

//Déclaration des boutons
var reset_button = document.getElementById('reset');

//Déclaration des fonctions
function isNumber(element, notNegative) {
    var value = element.value;
    var condition = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '-'];
    if (notNegative) {
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

function belongsTo(element, min, max) {
    var value = parseFloat(element.value);
    if ((value <= max && value >= min) || isNaN(value)) {
        return true;
    }
    else {
        return false;
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

function convert(element, unit) {
    var Pi = Math.PI;
    var value = parseFloat(element.value);
    if (isNaN(value) || !isNumber(element)) {
        element.value = '';
        removeWarning(element);
        return false;
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
    element.value = value;
}

function swap(element, unit, isAltitude) {
    var value = parseFloat(element.value);
    if (isNaN(value) || !isNumber(element)) {
        element.value = '';
        removeWarning(element);
        return false;
    }
    if (isAltitude) {
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

function disable(element) {
    element.setAttribute('disabled', 'true');
}

function enable(element) {
    element.removeAttribute('disabled');
}

function reset(element) {
    element.value = '';
    removeWarning(element);
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

function setArgumentPeriapsis() {
    if (parseFloat(parameter[3].value) == 0 || parameter[3].value == '' ) {
        disable(argument_periapsis);
        reset(argument_periapsis);
        removeWarning(argument_periapsis);
    }
    else {
        enable(argument_periapsis);
    }
}
    

function compute(fromGround) {
    switch (inputCheck.join(', ')) {
        case 'true, true, false, false' :
            disable(semi_majoraxis);
            disable(eccentricity);
            Pe = parseFloat(periapsis.value);
            Ap = parseFloat(apoapsis.value);
            if (fromGround) {
                Pe += rayon;
                Ap += rayon;
            }
            if (Pe > Ap) {
                reset(semi_majoraxis);
                reset(eccentricity);
                setWarning(periapsis, ' ');
                setWarning(apoapsis, ' ');
                return false;
            }
            else {
                removeWarning(periapsis);
                removeWarning(apoapsis);
            }
            a = (Ap + Pe) / 2;
            e = (Ap - Pe) / ( 2 * a);
            semi_majoraxis.value = a;
            eccentricity.value = e;
            break;
            
        case 'true, false, true, false' :
            disable(apoapsis);
            disable(eccentricity);
            Pe = parseFloat(periapsis.value);
            a = parseFloat(semi_majoraxis.value);
            if (fromGround) {
                Pe += rayon;
            }
            Ap = 2 * a - Pe;
            e = (Ap - Pe) / (2*a);
            if (fromGround) {
                Ap -= rayon;
                Pe -= rayon;
            }
            if (Ap < Pe) {
                reset(apoapsis);
                reset(eccentricity);
                setWarning(periapsis, ' ');
                setWarning(semi_majoraxis, ' ');
                return false;
            }
            else {
                removeWarning(periapsis);
                removeWarning(semi_majoraxis);
            }
            apoapsis.value = Ap;
            eccentricity.value = e;
            break;
            
        case 'true, false, false, true' :
            disable(apoapsis);
            disable(semi_majoraxis);
            Pe = parseFloat(periapsis.value);
            e = parseFloat(eccentricity.value);
            if (fromGround) {
                Pe += rayon;
            }
            Ap = Pe * (1+e) / (1-e);
            a = (Ap + Pe) / 2;
            if (inputUnit == 'km') {
                Ap -= rayon;
                Pe -= rayon;
            }
            apoapsis.value = Ap;
            semi_majoraxis.value = a;
            break;
            
        case 'false, true, true, false' :
            disable(periapsis);
            disable(eccentricity);
            Ap = parseFloat(apoapsis.value);
            a = parseFloat(semi_majoraxis.value);
            if (fromGround) {
                Ap += rayon;
            }
            Pe = 2*a - Ap;
            e = (Ap - Pe) / (2*a);
            if (fromGround) {
                Pe -= rayon;
                Ap -= rayon;
            }
            if (Pe > Ap || Pe < 0 || (!fromGround && Pe < rayon/UA )) {
                reset(periapsis);
                reset(eccentricity);
                setWarning(semi_majoraxis, ' ');
                setWarning(apoapsis, ' ');
                return false;
            }
            else {
                removeWarning(semi_majoraxis);
                removeWarning(apoapsis);
            }
            periapsis.value = Pe;
            eccentricity.value = e;
            break;
            
        case 'false, true, false, true' :
            disable(periapsis);
            disable(semi_majoraxis);
            Ap = parseFloat(apoapsis.value);
            e = parseFloat(eccentricity.value);
            if (fromGround) {
                Ap += rayon;
            }
            Pe = Ap * (1-e) / (1+e);
            a = (Ap + Pe) / 2;
            if (fromGround) {
                Pe -= rayon;
                Ap -= rayon;
            }
            if (Pe < 0 || Pe > Ap || (!fromGround && Pe < rayon/UA )) {
                reset(periapsis);
                reset(semi_majoraxis);
                setWarning(apoapsis, ' ');
                setWarning(eccentricity, ' ');
                return false;
            }
            else {
                removeWarning(apoapsis);
                removeWarning(eccentricity);
            }
            periapsis.value = Pe;
            semi_majoraxis.value = a;
            break;
            
        case 'false, false, true, true' :
            disable(periapsis);
            disable(apoapsis);
            a = parseFloat(semi_majoraxis.value);
            e = parseFloat(eccentricity.value);
            Ap = a * (1+e);
            Pe = a * (1-e);
            if (fromGround) {
                Ap -= rayon;
                Pe -= rayon;
            }
            if (Pe < 0 || Pe > Ap || (!fromGround && Pe < rayon/UA )) {
                reset(periapsis);
                reset(apoapsis);
                setWarning(semi_majoraxis, ' ');
                setWarning(eccentricity, ' ');
                return false;
            }
            else {
                removeWarning(semi_majoraxis);
                removeWarning(eccentricity);
            }
            periapsis.value = Pe;
            apoapsis.value = Ap;
            break;
    }
    return true;
}

function origine_data() {
    
}

//Déclaration du popover
$(document).ready(function() {
    $('[data-toggle="popover"]').popover();
});

//Déclaration des events :
//INPUT

inclination.addEventListener('keyup', function() {
    var unit = unitIs(this);
    switch (unit) {
        case '°':
            var min = -180;
            var max = 180
            break;
        case 'rad':
            var min = - Math.PI;
            var max = Math.PI;
            break;
    }
    if (!isNumber(this)) {
        setWarning(this,"Vous devez entrer un angle !");
        disable(longitude);
        reset(longitude);
        removeWarning(longitude);
    }
    else {
        if (!belongsTo(this, min, max)) {
            switch (unit) {
                case '°':
                    setWarning(this, "L'angle doit être compris entre -180° et 180° !");
                    break;
                case 'rad':
                    setWarning(this, "L'angle doit être compris entre -π et π rad !");
            }
            disable(longitude);
            reset(longitude);
            removeWarning(longitude);
        }
        else {
            value = parseFloat(this.value);
            removeWarning(this);
            if (isNaN(value) || value == 0) {
                disable(longitude);
                reset(longitude);
                removeWarning(longitude);
            }
            else {
                enable(longitude);
            }
        }
    }
});

longitude.addEventListener('keyup', function() {
    var unit = unitIs(this);
    switch (unit) {
        case '°':
            var min = 0;
            var max = 360;
            break;
        case 'rad':
            var min = 0;
            var max = 2 * Math.PI;
            break;
    }
    if (!isNumber(this, true)) {
        setWarning(this,"Vous devez entrer un angle positif !");
    }
    else {
        if (!belongsTo(this, min, max)) {
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
        }
        inputCheck[0] = false;
    }
    else {
        inputCheck[0] = true;
        if (!isEnough()) {
            for (let k = 0, c = inputCheck.length ; k < c ; k++) {
                enable(parameter[k]);
            }
            if (isNumber(this, true)) {
                var unit = unitIs(this);
                if (unit == 'UA' && parseFloat(this.value) < rayon/UA) {
                    setWarning(this, "Le périgée est plus petit que le rayon du corps d'origine !");
                }
                else {
                    removeWarning(this);
                }
            }
            else {
                setWarning(this, "Vous devez entrer un nombre positif !");
            }
        }
        else {
            if (isComputable(true)) {
                removeWarning(this);
                var unit = unitIs(this);
                compute(unit);
            }
            else {
                for (let k = 0, c = inputCheck.length ; k < c ; k++) {
                    if (!inputCheck[k]) {
                        reset(parameter[k]);
                    }
                }
                if (isNumber(this, true)) {
                    removeWarning(this);
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
        }
        inputCheck[1] = false;
    }
    else {
        inputCheck[1] = true;
        if (!isEnough()) {
            for (let k = 0, c = inputCheck.length ; k < c ; k++) {
                enable(parameter[k]);
            }
            if (isNumber(this, true)) {
                removeWarning(this);
            }
            else {
                setWarning(this, "Vous devez entrer un nombre positif !");
            }
        }
        else {
            if (isComputable(true)) {
                removeWarning(this);
                var unit = unitIs(this);
                compute(unit);
            }
            else {
                for (let k = 0, c = inputCheck.length ; k < c ; k++) {
                    if (!inputCheck[k]) {
                        reset(parameter[k]);
                    }
                }
                if (isNumber(this, true)) {
                    removeWarning(this);
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
        }
        inputCheck[2] = false;
    }
    else {
        inputCheck[2] = true;
        if (!isEnough()) {
            for (let k = 0, c = inputCheck.length ; k < c ; k++) {
                enable(parameter[k]);
            }
            if (isNumber(this, true)) {
                removeWarning(this);
            }
            else {
                setWarning(this, "Vous devez entrer un nombre positif !");
            }
        }
        else {
            if (isComputable(true)) {
                removeWarning(this);
                var unit = unitIs(this);
                compute(unit);
            }
            else {
                for (let k = 0, c = inputCheck.length ; k < c ; k++) {
                    if (!inputCheck[k]) {
                        reset(parameter[k]);
                    }
                }
                if (isNumber(this, true)) {
                    removeWarning(this);
                }
                else {
                    setWarning(this, "Vous devez entrer un nombre positif !");
                }
            }
        }
    }
    setArgumentPeriapsis();
});

// Rajouter la gestion du rayon pour le semi-major-axis

eccentricity.addEventListener('keyup', function() {
    if (isNull(this)) {
        removeWarning(this);
        for (let k = 0, c = inputCheck.length ; k < c ; k++) {
            enable(parameter[k]);
            if (!inputCheck[k]) {
                reset(parameter[k]);
            }
        }
        inputCheck[3] = false;
        disable(argument_periapsis);
        reset(argument_periapsis);
        removeWarning(argument_periapsis);
    }
    else {
        inputCheck[3] = true;
        if (!isEnough()) {
            for (let k = 0, c = inputCheck.length ; k < c ; k++) {
                enable(parameter[k]);
            }
            if (isNumber(this, true)) {
                if (belongsTo(this, 0, 1)) {
                    removeWarning(this);
                }
                else {
                    setWarning(this, "L'excentricité ne peut pas dépasser 1 !")
                }
                enable(argument_periapsis);
            }
            else {
                setWarning(this, "Vous devez entrer un nombre positif !");
                disable(argument_periapsis);
                reset(argument_periapsis);
                removeWarning(argument_periapsis);
            }
        }
        else {
            if (isComputable(true)) {
                if (belongsTo(this, 0, 1)) {
                    removeWarning(this);
                    var unit = unitIs(periapsis);
                    compute(unit);
                }
                else {
                    setWarning(this, "L'excentricité ne peut pas dépasser 1 !")
                }
            }
            else {
                for (let k = 0, c = inputCheck.length ; k < c ; k++) {
                    if (!inputCheck[k]) {
                        reset(parameter[k]);
                    }
                }
                if (isNumber(this, true)) {
                    if (belongsTo(this, 0, 1)) {
                        removeWarning(this);
                    }
                    else {
                        setWarning(this, "L'excentricité ne peut pas dépasser 1 !")
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

argument_periapsis.addEventListener('keyup', function() {
    var unit = unitIs(this);
    switch (unit) {
        case '°':
            var min = 0;
            var max = 360;
            break;
        case 'rad':
            var min = 0;
            var max = 2 * Math.PI;
            break;
    }
    if (!isNumber(this, true)) {
        setWarning(this,"Vous devez entrer un angle positif !");
    }
    else {
        if (!belongsTo(this, min, max)) {
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
    switch (unit) {
        case '°':
            var min = 0;
            var max = 360;
            break;
        case 'rad':
            var min = 0;
            var max = 2 * Math.PI;
            break;
    }
    if (!isNumber(this, true)) {
        setWarning(this,"Vous devez entrer un angle positif !");
    }
    else {
        if (!belongsTo(this, min, max)) {
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
        convert(input_element, unit);
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
            convert(input_element, unit);
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
        var type = element.firstElementChild.getAttribute('data-content');
        alt.forEach(function(element) {
            if (type == 'Altitude') {
                element.firstElementChild.setAttribute('data-content', 'Distance au foyer');
                var input = element.nextElementSibling.firstElementChild;
                var unit = input.nextElementSibling.innerHTML;
                swap(input, unit, true);
            }
            else {
                element.firstElementChild.setAttribute('data-content', 'Altitude');
                var input = element.nextElementSibling.firstElementChild;
                var unit = input.nextElementSibling.innerHTML;
                swap(input, unit, false);
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
    origine.selectedIndex = 3;
});
