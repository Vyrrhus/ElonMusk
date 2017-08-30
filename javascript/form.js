// Déclaration des variables

var departForm = document.getElementById('form_depart');
var inc = departForm.elements['inclinaison'];
var W = departForm.elements['longitude'];
var hPeri = departForm.elements['perigee'];
var hApo = departForm.elements['apogee'];
var e = departForm.elements['ecc'];
var a = departForm.elements['demiaxe'];
var w = departForm.elements['argument'];
var v = departForm.elements['anomaly'];
var rayon = 6371.008;
var altitude_unit = document.getElementsByName('altitude_unit');



// Déclaration des fonctions

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




// Evenements

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
        else {
            hApo.value = valeur;
            parametre();
        }
    }
});




hApo.addEventListener('keyup', function() {
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
    }
});



hApo.addEventListener('keypress', function parametre() {
    var Apo = parseInt(hApo.value, 10) + rayon;
    var Peri = parseInt(hPeri.value, 10) + rayon;
    if (Peri <= Apo) {
    departForm.elements['ecc'].value = (Apo - Peri) / (Apo + Peri) ;
    departForm.elements['demiaxe'].value = (Apo + Peri) / 2 ;
    }
    else {
        hPeri.value=hApo.value;
        parametre()
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
    if (error > 0 || virgule > 1) {
        warning(v, true);
    }
    else {
        warning(v, false);
    }
});





for (var i=0, c=altitude_unit.length ; i < c ; i++){
    altitude_unit[i].addEventListener('click', function(){
        var unit = this.innerHTML;
        if(unit=='km'){
            document.getElementById('labelperi').innerHTML = 'Périgée';
            document.getElementById('labelapo').innerHTML = 'Apogée';
            for(var j=0; j<c ; j++){
                altitude_unit[j].innerHTML='UA';
                var distance = document.getElementsByName('distance_group');
                distance[j].value = km_vers_UA(distance[j].value);
                rayon = km_vers_UA(rayon);
            }
        }
        else {
            document.getElementById('labelperi').innerHTML = 'Périgée (altitude)';
            document.getElementById('labelapo').innerHTML = 'Apogée (altitude)';
            for(var j=0; j<c ; j++){
                altitude_unit[j].innerHTML='km';
                var distance = document.getElementsByName('distance_group');
                distance[j].value = UA_vers_km(distance[j].value)
                rayon = UA_vers_km(rayon);
            }
        }
    });
}

