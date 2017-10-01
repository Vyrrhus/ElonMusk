//Constructeur orbites
function Orbit(referenceBody, inclination, longitudeOfAscendingNode, semiMajorAxis, ecc, argumentOfPeriapsis, meanAnomalyAtEpoch) {
	// Propriétés
	{
	this.referenceBody = referenceBody;
	this.inclination = inclination; //°
	this.longitudeOfAscendingNode = longitudeOfAscendingNode; //°
	this.semiMajorAxis = semiMajorAxis; //UA
	this.ecc = ecc;
	this.argumentOfPeriapsis = argumentOfPeriapsis; //°
	this.meanAnomalyAtEpoch = meanAnomalyAtEpoch; //°
	this.semiparameter = semiMajorAxis * (1-Math.pow(ecc, 2)); //semilatus rectum, UA
	this.c = ecc * semiMajorAxis; // UA
	this.semiMinorAxis = semiMajorAxis * Math.sqrt(1 - Math.pow(ecc, 2)); // UA
	this.flattening = (semiMajorAxis - this.semiMinorAxis) / semiMajorAxis; // [] noté f
	this.period = 2*Math.PI*Math.sqrt(Math.pow(convert(this.semiMajorAxis, 'UA'), 3)/this.referenceBody.gravitationalParameter); //s
	this.meanMotion = 360 / this.period; // °/s
	}
	
	// Méthodes
	{
	this.getMeanAnomaly = function(time) {
		var meanAnomaly = meanAnomalyAtEpoch + this.meanMotion * (time);
		// La méthode nécessite de calculer en amont le temps passé en seconde depuis l'epoch (time est en réalité un dT entre la date souhaitée et celle de l'epoch)
		// Cela nécessite un timeOfEpoch commun à tous les corps
		meanAnomaly %= 360;
		return meanAnomaly;
	}
	// Mean Anomaly in °, time in s from Epoch
	this.getEccentricAnomaly = function(time) {
		var meanAnomaly = this.getMeanAnomaly(time);
		var epsilon = 1e-6;
		function f(meanAnomaly, eccentricAnomaly) {
			var result = eccentricAnomaly - ecc * Math.sin(eccentricAnomaly) - meanAnomaly;
			return result;
		}
		function df(eccentricAnomaly) {
			var result = 1 - ecc * Math.cos(eccentricAnomaly);
			return result;
		}
		var eccentricAnomaly = meanAnomaly;
		while (Math.abs(f(meanAnomaly, eccentricAnomaly)) >= epsilon) {
			eccentricAnomaly = eccentricAnomaly - f(meanAnomaly, eccentricAnomaly) / df(eccentricAnomaly);
		}
		return eccentricAnomaly;
	}
	// Eccentric Anomaly in °, time from Epoch in s
	this.getTrueAnomaly = function (time) {
		var E = this.getEccentricAnomaly(time) / 180 * Math.PI;
		var e = this.ecc;
		var sinusV = (Math.sin(E) * Math.sqrt(1 - Math.pow(e,2))) / (1 - e * Math.cos(E));
		var cosinusV = (Math.cos(E) - e) / (1 - e*Math.cos(E));
		var trueAnomaly = 0;
		if (sinusV >= 0) {
			trueAnomaly = Math.acos(cosinusV);
		}
		else {
			trueAnomaly = 2 * Math.PI - Math.acos(cosinusV);
		}
		trueAnomaly = trueAnomaly / Math.PI * 180;
		return trueAnomaly;
	}
	// True anomaly in °, time from Epoch in s
	this.getRadius = function (time) {
		var eccentricAnomaly = this.getEccentricAnomaly(time);
		var radius = semiMajorAxis * (1 - ecc * Math.cos(eccentricAnomaly));
		return radius;
	}
	// Radius in UA, Eccentric Anomaly in °
	this.getTimeToPeriapsis = function (time) {
		var meanAnomaly = this.getMeanAnomaly(time);
		var timeToPeriapsis = (360 - meanAnomaly) / 360 * this.period;
		return timeToPeriapsis;
	}
	// TimeToPeriapsis in s, time in s
	this.getTimeToApoapsis = function (time) {
		var meanAnomaly = this.getMeanAnomaly(time);
		if (meanAnomaly > 180) {
			var degreeToApoapsis = 360 + 180 - meanAnomaly;
		}
		else {
			var degreeToApoapsis = 180 - meanAnomaly;
		}
		var timeToApoapsis = degreeToApoapsis / 360 * this.period;
		return timeToApoapsis;
	}
	// TimeToApoapsis in s, time in s
	}
}
// obtenir les vecteurs position & vitesse :)


// Constructeur planètes
function Planet(name, mass, radius, orbit) {
	//Propriétés
	{
    this.name = name;
    this.mass = mass; //kg
    this.radius = radius; //km - (radius is mean radius)
	this.orbit = orbit;
	this.gravitationalParameter = G * mass; // km3/s²
	this.specificOrbitalEnergy = - this.gravitationalParameter / (2*this.orbit.semiMajorAxis); // MJ/kg
	this.radiusSOI = Math.pow(mass / this.orbit.referenceBody.mass, 2/5) * convert(this.orbit.semiMajorAxis, 'UA'); //km
	}
	
	//Méthodes
	{
	this.getAcceleration = function (radius) {
		var r = convert(radius, 'UA');
		var acceleration = this.gravitationalParameter / Math.pow(r, 2);
		return acceleration;
	}
	// acceleration in km/s², radius in UA
	this.getVelocity = function (radius) {
		var a = convert(this.orbit.semiMajorAxis, 'UA');
		var g = this.orbit.referenceBody.gravitationalParameter;
		var r = convert(radius, 'UA');
		var velocity = Math.sqrt(g * ((2 / r) - (1 / a))); // vis-viva equation
		return velocity;
	}
	// velocity in km/s, radius in UA
	this.getCircularVelocity = function (radius) {
		var r = convert(radius, 'UA');
		var g = this.orbit.referenceBody.gravitationalParameter;
		var circularVelocity = Math.sqrt( g / r );
		return circularVelocity;
	}
	// circularVelocity in km/s, radius in UA
	this.getEscapeVelocity = function (radius) {
		var r = convert(radius, 'UA');
		var g = this.orbit.referenceBody.gravitationalParameter;
		var escapeVelocity = Math.sqrt(2 * g / r);
		return escapeVelocity;
	}
	// escapeVelocity in km/s, radius in UA
	this.getKineticEnergy = function(radius) {
		var velocity = this.getVelocity(radius);
		var kineticEnergy = Math.pow(velocity, 2) / 2;
		return kineticEnergy;
	}
	// kineticEnergy in MJ/kg, radius in UA
	this.getPotentialEnergy = function(radius) {
		var potentialEnergy = - this.gravitationalParameter / convert(radius, 'UA');
		return potentialEnergy;
	}
	// potentialEnergy in MJ/kg, radius in UA
	this.getEnergy = function (radius) {
		var r = convert(radius, 'UA');
		var g = this.orbit.referenceBody.gravitationalParameter;
		var energy = Math.pow(getVelocity(radius), 2) / 2 - g / r;
		return energy;
	}
	// energy in MJ/kg, radius in UA
	}
} 

function Star(name, mass, radius) {
	//Propriétés
	{
	this.name = name;
    this.mass = mass; //kg
    this.radius = radius; //km - (radius is mean radius)
	this.gravitationalParameter = G * mass; // km3/s²
	}
	//Méthodes
	{
		
	}
}



// Corriger les orbites pour y mettre le MeanAnomalyAtEpoch (et non true anomaly)

// Définition des corps de base utilisés
// Planète = [name], [masse], [radius], Orbit : [reference], [i], [W], [a], [e], [w], [v]
{
var Soleil = new Star('Soleil', 1.9891e30, 6.957e5);
var Mercure = new Planet('Mercure', 0.330104e24, 2439.7, new Orbit(Soleil, 7.003938621978453, 4.830840964417403E+01, 3.870978660388905E-01, 2.056385802768018E-01, 2.917450639154915E+01, 1.034534549156763E+02));
var Vénus = new Planet('Vénus', 4.86732e24, 6051.8, new Orbit(Soleil, 3.394490723804590E+00, 7.662845580893872E+01, 7.233304294142561E-01, 6.801883435239245E-03, 5.476413547432202E+01, 1.442517569276391E+02));
var Terre = new Planet('Terre', 5.97219e24, 6371.008, new Orbit(Soleil, 1.442517569276391E+02, 2.109010444915891E+02, 9.990472190345268E-01, 1.578453256417450E-02, 2.525270024725202E+02, 3.568366379975838E+02)); // Earth-Moon Barycenter for those calculations ; always first element of [planets]
var Mars = new Planet('Mars', 0.641693e24, 3389.5, new Orbit(Soleil, 1.848339620191774E+00, 4.950783226093129E+01, 1.523746511931863E+00, 9.341780050323115E-02, 2.866026779027202E+02,	2.176767558580171E+02));
var Jupiter = new Planet('Jupiter', 1898.13e24, 69911, new Orbit(Soleil, 1.303637966856463E+00, 1.005213157189207E+02, 5.202542422947007E+00, 4.885927439345982E-02, 2.736042883561856E+02,	2.041846436041122E+02));
var Saturne = new Planet('Saturne', 568.319e24, 58232, new Orbit(Soleil, 2.487689401889006E+00, 1.136052151676273E+02, 9.572140096816266E+00, 5.155881895496966E-02, 3.399985499049498E+02, 1.766618534596307E+02));
var Uranus = new Planet('Uranus', 86.8103e24, 25362, new Orbit(Soleil, 7.700798753715145E-01, 7.412911928059437E+01, 1.913232112250847E+01, 4.929510554854896E-02, 9.930241211616277E+01, 2.136359804981328E+02));
var Neptune = new Planet('Neptune', 102.410e24, 24622, new Orbit(Soleil, 1.777597703201860E+00, 1.319250489390328E+02, 3.004852847210088E+01, 6.477639267230120E-03, 2.694963452560274E+02, 3.019029128867259E+02));
var Pluton = new Planet('Pluton', 0.01309e24, 1151, new Orbit(Soleil, 1.723730762109442E+01, 1.102860666329842E+02, 3.946862916026242E+01, 2.522778195718353E-01, 1.127647308059285E+02, 6.264626398677877E+01));



var Lune = new Planet('Lune', 7.3477e22, 1737.5, new Orbit(Terre, 5.196960685321760E+00, 1.351208912106474E+02, 2.579309287237687E-03, 7.618173744911751E-02, 3.249459462415981E+02, 3.443568163820373E+02));
var Io = new Planet('Io', 8.9319e22, 1821.6, new Orbit(Jupiter, 2.202703864911423E+00, 3.385425331807581E+02, 2.821039215496194E-03, 3.768236108797693E-03, 2.402957809630536E+02, 2.371258545024796E+02));
var Europe = new Planet('Europe', 4.7998e22, 1560.8, new Orbit(Jupiter, 2.683895950717743E+00, 3.364082945913950E+02, 4.486843999106538E-03, 9.700145315441250E-03, 6.569752966635679E+01, 2.978505344627345E+02));
var Ganymède = new Planet('Ganymède', 1.4819e23, 2631.2, new Orbit(Jupiter, 2.295592704652490E+00, 3.406626851721088E+02, 7.155930235487599E-03, 2.016085670322323E-03, 3.177399158899967E+02, 2.544874399432277E+02));
var Encelade = new Planet('Encelade', 1.0794e20, 252.1, new Orbit(Saturne, 2.805649671811507E+01, 1.695411966560971E+02, 1.593711800889939E-03, 6.417148409504786E-03, 1.926819986280434E+02, 2.280121924070831E-01));
var Halley = new Planet('Halley', NaN, 5.5, new Orbit(Soleil, 162.262690579161, 58.42008097656843, 17.8341442925537, 0.967142908462304, 111.3324851045177,						));
var Encke = new Planet('Encke', NaN, 2.4, new Orbit(Soleil, 11.78097275032633, 334.5686339568253, 2.215113638558109, 0.8482963013530403, 186.5420298916183,	));
var Churyumov = new Planet('Churyumov-Gerasimenko', NaN, 2, new Orbit(Soleil, 7.043680712713979, 50.18004588418096, 3.464737502510219, 0.6405823233437267, 12.69446409956478,		));
var Callisto = new Planet('Callisto', 1.0759e23, 2410.3, new Orbit(Jupiter, 0.192, 298.848, 0.01258507, 0.0074, 52.643,							));

var Titan = new Planet('Titan', 1.3455e23, 2574.73, new Orbit(Saturne, 0.306, 28.06, 0.00816766, 0.0288, 180.532,								));


var planets = [Terre, Soleil, Mercure, Vénus, Mars, Jupiter, Saturne, Uranus, Neptune, Pluton, Io, Europe, Ganymède, Callisto, Titan, Encelade, Halley, Encke, Churyumov];
}
// Informations computed with Horizons (telnet horizons.jpl.nasa.gov)
// Date de référence : 2018-Jan-01 00:00 pour les orbites
