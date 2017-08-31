// Déclaration des nodes input & select

var departForm = document.getElementById('form_depart');
var inc = departForm.elements['inclinaison'];
var W = departForm.elements['longitude'];
var hPeri = departForm.elements['perigee'];
var hApo = departForm.elements['apogee'];
var e = departForm.elements['ecc'];
var a = departForm.elements['demiaxe'];
var w = departForm.elements['argument'];
var v = departForm.elements['anomaly'];

// Déclaration des nodes span
var distance_unit_dep = document.getElementsByName('distance_unit_dep');
var angle_unit = document.getElementsByName('angle_unit');

// Déclaration des variables globales
var rayon = 6371.008;

// Déclaration des functions
function km_vers_UA(valeur) {
    var UA = 149597870.7;
    valeur /= UA;
    return valeur;
}
function UA_vers_km(valeur) {
    var UA = 149597870.7;
    valeur *= UA;
    return valeur;
}
function deg_vers_rad(valeur){
    var Pi = Math.PI;
    valeur = valeur / 180 * Pi;
    return valeur;
}
function rad_vers_deg(valeur) {
    var Pi = Math.PI;
    valeur = valeur / Pi * 180;
    return valeur;
}
function warning(elementDeReference, bool) {
    var parent = elementDeReference.parentNode;
    parent = parent.parentNode;
    var contenu = parent.getAttribute('class');
    var help = parent.lastElementChild;
    if (bool) {
        contenu += ' has-error';
        parent.setAttribute('class', contenu);
        help.removeAttribute('hidden');
    }
    else {
        parent.setAttribute('class', 'form-inline form-group');
        help.setAttribute('hidden','true');
    }
}

// Déclaration des events

inc.addEventListener('keyup', function() {
    var valeur = inc.value;
    var condition = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.','-'];
    var longueur = valeur.length;
    var error=0;
    var virgule=0;
    for (var i=0 ; i < longueur ; i++) {
        var caractere = valeur[i];
        if (!condition.includes(caractere)) {
            error++;
        }
        if (valeur[i] == '.') {
            virgule++;
        }
        if (valeur[i] == '-' && i>0) {
            error++;
        }
    }
    valeur = parseFloat(valeur);
    if (error > 0 || virgule > 1 || valeur > 180 || valeur < -180) {
        warning(inc, true);
    }
    else {
        warning(inc, false);
    }
    if(valeur == 0 || isNaN(valeur)) {
        W.setAttribute('disabled','true');
        W.value='';
    }
    else {
        W.removeAttribute('disabled');
    }
});



W.addEventListener('keyup', function() {
    var valeur = W.value;
    var condition = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
    var longueur = valeur.length;
    var error=0;
    var virgule=0;
    for (var i=0 ; i < longueur ; i++) {
        var caractere = valeur[i];
        if (!condition.includes(caractere)) {
            error++;
        }
        if (valeur[i] == '.') {
            virgule++;
        }
    }
    valeur = parseFloat(valeur);
    if (error > 0 || virgule > 1 || valeur < 0 || valeur > 360) {
        warning(W, true);
    }
    else {
        warning(W, false);
    }
});

hPeri.addEventListener('keyup', function parametre() {
    var valeur = hPeri.value;
    var condition = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
    var longueur = valeur.length;
    var error=0;
    var virgule=0;
    for (var i=0 ; i < longueur ; i++) {
        var caractere = valeur[i];
        if (!condition.includes(caractere)) {
            error++;
        }
        if (valeur[i] == '.') {
            virgule++;
        }
    }
    valeur = parseFloat(valeur);
    if (error > 0 || virgule > 1) {
        warning(hPeri, true);
    }
    else {
        warning(hPeri, false);
        var Apo = parseFloat(hApo.value, 10);
        if (valeur <= Apo) {
            e.value = (Apo - valeur) / (Apo + valeur + 2 * rayon);
            a.value = (Apo + valeur) / 2 + rayon;
        }
        else if (!isNaN(valeur)) {
            hApo.value = valeur;
            parametre();
        }
    }
});

hApo.addEventListener('keyup', function parametre() {
    var valeur = hApo.value;
    var condition = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
    var longueur = valeur.length;
    var error=0;
    var virgule=0;
    for (var i=0 ; i < longueur ; i++) {
        var caractere = valeur[i];
        if (!condition.includes(caractere)) {
            error++;
        }
        if (valeur[i] == '.') {
            virgule++;
        }
    }
    valeur = parseFloat(valeur);
    if (error > 0 || virgule > 1) {
        warning(hApo, true);
    }
    else {
        warning(hApo, false);
        var Peri = parseFloat(hPeri.value, 10);
        if (valeur >= Peri) {
            e.value = (valeur - Peri) / (valeur + Peri + 2 * rayon);
            a.value = (valeur + Peri) / 2 + rayon;
        }
        else if (!isNaN(valeur)) {
            hPeri.value=valeur;
            parametre();
        }
        else {
            hPeri.value=0;
            parametre();
        }
    }
});

w.addEventListener('keyup', function() {
    var valeur = w.value;
    var condition = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
    var longueur = valeur.length;
    var error=0;
    var virgule=0;
    for (var i=0 ; i < longueur ; i++) {
        var caractere = valeur[i];
        if (!condition.includes(caractere)) {
            error++;
        }
        if (valeur[i] == '.') {
            virgule++;
        }
    }
    valeur = parseFloat(valeur);
    if (error > 0 || virgule > 1 || valeur > 360) {
        warning(w, true);
    }
    else {
        warning(w, false);
    }
});

v.addEventListener('keyup', function() {
    var valeur = v.value;
    var condition = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
    var longueur = valeur.length;
    var error=0;
    var virgule=0;
    for (var i=0 ; i < longueur ; i++) {
        var caractere = valeur[i];
        if (!condition.includes(caractere)) {
            error++;
        }
        if (valeur[i] == '.') {
            virgule++;
        }
    }
    valeur = parseFloat(valeur);
    if (error > 0 || virgule > 1 || valeur > 360) {
        warning(v, true);
    }
    else {
        warning(v, false);
    }
});

for (let k=0, c=distance_unit_dep.length ; k < c ; k++) {
    distance_unit_dep[k].addEventListener('click', function() {
        var unit = this.innerHTML;
        if (unit == 'km') {
            rayon = km_vers_UA(rayon);
            distance_unit_dep.forEach(function (element){
                element.innerHTML='UA';
                var input = element.previousElementSibling;
                if (input.value != ''){
                    input.value = km_vers_UA(input.value);
                }
                element.setAttribute('data-content','Distance au foyer');
            });
        }
        else {
            rayon = UA_vers_km(rayon);
            distance_unit_dep.forEach(function (element) {
                element.innerHTML='km';
                var input = element.previousElementSibling;
                if (input.value != ''){
                input.value = UA_vers_km(input.value);
                }
                element.setAttribute('data-content','Altitude');
            });
        }
    });
}

for (let k=0, c=angle_unit.length ; k < c ; k++) {
    angle_unit[k].addEventListener('click', function() {
        var unit = this.innerHTML;
        if (unit == '°') {
            this.innerHTML='rad';
            var input = this.previousElementSibling;
            input.value = deg_vers_rad(input.value);
        }
        else {
            this.innerHTML='°';
            var input = this.previousElementSibling;
            input.value = rad_vers_deg(input.value);
        }
    });
}

// Déclaration du select originBody

