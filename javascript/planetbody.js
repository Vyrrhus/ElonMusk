// Constructeur pour les planètes
function Planet(name, referenceBody, mass, radius, i, W, a, e, w) {
    this.name = name;
    this.referenceBody = referenceBody;
    this.mass = mass; //kg
    this.radius = radius; //km radius is mean radius
    this.i = i; //°
    this.W = W; //°
    this.a = a; // UA
    this.e = e; // rad
    this.w = w; //°
}

var planets = [
    new Planet('Terre', 'Soleil', 5.97219e24, 6371.008, -0.00001531, 0, 1.00000261, 0.01671123, 102.93768193), // Earth-Moon Barycenter for those calculations ; always first element of [planets]
    new Planet('Soleil', null, 1.9891e30, 6.957e5, null, null, null, null, null),
    new Planet('Mercure', 'Soleil', 0.330104e24, 2439.7, 7.00497902, 48.33076593, 0.38709927, 0.20563593, 77.45779628),
    new Planet('Vénus', 'Soleil', 4.86732e24, 6051.8, 3.39467605, 76.67984255, 0.72333566, 0.00677672, 131.60246718),
    new Planet('Lune', 'Terre', 7.3477e22, 1737.5, 5.16, 125.08, 0.00256956, 0.0554, 318.15),
    new Planet('Mars', 'Soleil', 0.641693e24, 3389.5, 1.84969142, 49.55953891, 1.52371034, 0.09339410, 336.05637041),
    new Planet('Jupiter', 'Soleil', 1898.13e24, 69911, 1.30439695, 100.47390909, 5.202887, 0.04838624, 14.72847983),
    new Planet('Io', 'Jupiter', 8.9319e22, 1821.6, 0.036, 43.977, 0.00281956, 0.0041, 84.129),
    new Planet('Europe', 'Jupiter', 4.7998e22, 1560.8, 0.466, 219.106, 0.00448603, 0.0094, 88.97),
    new Planet('Ganymède', 'Jupiter', 1.4819e23, 2631.2, 0.177, 63.552, 0.00715518, 0.0013, 192.417),
    new Planet('Callisto', 'Jupiter', 1.0759e23, 2410.3, 0.192, 298.848, 0.01258507, 0.0074, 52.643),
    new Planet('Saturne', 'Soleil', 568.319e24, 58232, 2.48599187, 113.66242448, 9.53667594, 0.05386179, 92.59887831),
    new Planet('Titan', 'Saturne', 1.3455e23, 2574.73, 0.306, 28.06, 0.00816766, 0.0288, 180.532),
    new Planet('Encelade', 'Saturne', 1.0794e20, 252.1, 0.003, 342.507, 0.00159121, 0, 0.076),
    new Planet('Uranus', 'Soleil', 86.8103e24, 25362, 0.77263783, 74.01692503, 19.18916464, 0.04725744, 170.95427630),
    new Planet('Neptune', 'Soleil', 102.410e24, 24622, 1.77004347, 131.78422574, 30.06992276, 0.00859048, 44.96476227),
    new Planet('Pluton', 'Soleil', 0.01309e24, 1151, 17.14001206, 110.30393686, 39.48211675, 0.24882730, 224.06891629),
    new Planet('Halley', 'Soleil', NaN, 5.5, 162.262690579161, 58.42008097656843, 17.8341442925537, 0.967142908462304, 111.3324851045177),
    new Planet('Encke', 'Soleil', NaN, 2.4, 11.78097275032633, 334.5686339568253, 2.215113638558109, 0.8482963013530403, 186.5420298916183),
    new Planet('Churyumov-Gerasimenko', 'Soleil', NaN, 2, 7.043680712713979, 50.18004588418096, 3.464737502510219, 0.6405823233437267, 12.69446409956478),
    ];

/* Values obtained from :
- https://ssd.jpl.nasa.gov
- https://solarsystem.nasa.gov

Theses values are valid for the time-interval 1800 AD - 2050 AD.
*/