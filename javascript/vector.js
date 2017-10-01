// Constantes globales
var G = 6.67408e-20; // km3/kg/s2
var Pi = Math.PI;
var UA = 149597870.7; // km

// Fonctions
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
// renvoie la valeur convertie d'une unité à l'autre => développer cette fonction davantage :
// s en j, m en km en UA, m/s en km/s, °/s en °/j, etc.

function getModule(vector) {
	var result = 0
	for (let k = 0, c = vector.length ; k < c ; k++) {
		result += Math.pow(vector[k],2);
	}
	result = Math.sqrt(result);
	return result;
}
// renvoie le module du vecteur

function getUnitVector(vector) {
	var module = getModule(vector);
	return vector / module;
}
// renvoie le vecteur normalisé (de module 1)




// Elements qui seront généraux (utilisés par tous les autres scripts)



// Fonctions vues en cours

function getForce(body) {
	var referenceBody = body.orbit.referenceBody;
	var r = getRelativePosition(body);
	var force = - G * body.mass * referenceBody.mass / Math.pow(getModule(r)) * getUnitVector(r);
	return force;
}
// Assumption : getRelativePosition(a) renvoie le vecteur de l'origine (référence) au corps
// 				+ on considère qu'on s'intéresse au corps et à son corps de référence
// body est un objet Planet[], Force est la force exercée sur le corps par l'origine

function getAcceleration(body) {
	var force = getForce(body);
	var r = getRelativePosition(body);
	var acc = - referenceBody.gravitationalParameter / Math.pow(getModule(r), 3) * r;
	return acc;
}
// Ceci est une approximation sur un problème à 2 corps (ici, le corps et son referenceBody)

function getPeriod(orbit) {
	var period = 2 * Math.PI * Math.sqrt(Math.pow(convert(orbit.semiMajorAxis, 'UA'), 3) / orbit.referenceBody.gravitationalParameter); //s
}
// Gives the period of an orbit ==> need to make new orbit for each time it's needed
