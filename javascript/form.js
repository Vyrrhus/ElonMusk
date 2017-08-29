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
        alert("Tu crois sérieusement que le périgée peut être plus grand que l'apogée ?");
        hApo.value=hPeri.value;
        parametre()
    }
    var a = Apo + Peri;
    var periode = 2 * Math.PI * Math.sqrt(a*a*a/398600.4418);
    document.getElementById('periode').innerHTML = periode + "s";
});

hApo.addEventListener('blur', function parametre() {
    var Apo = parseInt(hApo.value, 10) + rayon;
    var Peri = parseInt(hPeri.value, 10) + rayon;
    if (Peri <= Apo) {
    departForm.elements['ecc'].value = (Apo - Peri) / (Apo + Peri) ;
    departForm.elements['parameter'].value = (2 * Apo * Peri)/(Apo + Peri) ;
    }
    else {
        alert("Tu crois sérieusement que l'apogée peut être plus petit que le périgée ?");
        hPeri.value=hApo.value;
        parametre()
    }
    var a = Apo + Peri;
    var periode = 2 * Math.PI * Math.sqrt(a*a*a/398600.4418);
    document.getElementById('periode').innerHTML = periode + "s" ;
});

