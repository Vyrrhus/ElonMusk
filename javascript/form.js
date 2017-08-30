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

inc.addEventListener('keyup', function(){
    var inclinaison = parseInt(inc.value, 10);
    var bool = isNaN(inclinaison);
    if(inclinaison == 0 || bool) {
        W.setAttribute('disabled','true');
        W.value = '';
    }
    else {
        W.removeAttribute('disabled');
    }
});

hPeri.addEventListener('keyup', function parametre() {
    var Apo = parseInt(hApo.value, 10) + rayon;
    var Peri = parseInt(hPeri.value, 10) + rayon;
    if (Peri <= Apo) {
    departForm.elements['ecc'].value = (Apo - Peri) / (Apo + Peri) ;
    departForm.elements['demiaxe'].value = (Apo + Peri) / 2 ;
    }
    else {
        hApo.value=hPeri.value;
        parametre()
    }
});

hApo.addEventListener('keyup', function parametre() {
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

