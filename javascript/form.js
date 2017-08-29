var departForm = document.getElementById('form_depart');

var i = departForm.elements['inclinaison'];
var W = departForm.elements['longitude'];
var hPeri = departForm.elements['perigee'];
var hApo = departForm.elements['apogee'];
var e = departForm.elements['ecc'];
var p = departForm.elements['parameter'];
var w = departForm.elements['argument'];
var v = departForm.elements['anomaly'];
var rayon = 6371.008;


hPeri.addEventListener('blur', function parametre() {
    var Apo = parseInt(hApo.value, 10) + rayon;
    var Peri = parseInt(hPeri.value, 10) + rayon;
    if (Peri <= Apo) {
    departForm.elements['ecc'].value = (Apo - Peri) / (Apo + Peri) ;
    departForm.elements['parameter'].value = (2 * Apo * Peri)/(Apo + Peri) ;
    }
    else {
        hPeri.value=hApo.value;
        parametre()
    }
});

hApo.addEventListener('blur', function parametre() {
    var Apo = parseInt(hApo.value, 10) + rayon;
    var Peri = parseInt(hPeri.value, 10) + rayon;
    if (Peri <= Apo) {
    departForm.elements['ecc'].value = (Apo - Peri) / (Apo + Peri) ;
    departForm.elements['parameter'].value = (2 * Apo * Peri)/(Apo + Peri) ;
    }
    else {
        hApo.value=hPeri.value;
        parametre()
    }
});

