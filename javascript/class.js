// Different constructors

// Class : Body. Contains either Sun (solar system supposed to be isolated), planets, comets & asteroids or spacecrafts
function Body(name, orbit, mass, radius, axialTilt, atmosphere) {
	// Arguments
	{
		this.name = name;
		this.orbit = orbit;
		this.mass = mass;							// kg
		this.radius = radius;						// km
		this.axialTilt = axialTilt;					// °
		this.atmosphere = atmosphere;
	}
	
	// Properties
	{
		// rank
		if (this.orbit == null) {
			this.rank = 0;
		}
		else {
			this.rank = 1;
			let ref = orbit.referenceBody;
			while ( ref.orbit != null) {
				this.rank++;
				ref = ref.orbit.referenceBody;
			}
			
		}
		
		// number of child set as 0 ; increasing referenceBody's number of child by 1 if it exists
		this.nbChild = 0;
		if (this.rank != 0) {
			this.orbit.referenceBody.nbChild++;
		}
		
		// gravitational parameter set for a massive body (not a spacecraft nor certain kind of deep space objects - i.e. small asteroids or comets) <=> over 1e6 kg
		if (this.mass > 1e6) {
			this.gravitationalParameter = G * mass; // km3/s²
		}
		
		// specific orbital energy gives the energy of the body, assuming it has enough mass and an orbit (i.e rank != 0). Radius SOI gives the Sphere Of Influence's radius.
		if (this.mass > 1e6 && this.rank != 0) {
			this.specificOrbitalEnergy = - this.gravitationalParameter / (2*convert(this.orbit.semiMajorAxis,'UA'));				// MJ/kg
			this.radiusSOI = Math.pow(mass / this.orbit.referenceBody.mass, 2/5) * convert(this.orbit.semiMajorAxis, 'UA');			// km
		}
	}
}

// Class : Atmosphere. Contains few parameters describing one's atmosphere.
function Atmosphere() {
	
}

// Class : Orbit. Contains orbital elements given at a certain epoch of reference
function Orbit(referenceBody, inclination, longitude_NA, semiMajorAxis, eccentricity, longitude_peri, true_anomaly, epoch) {
	// Arguments
	{
		this.referenceBody = referenceBody;
		this.inclination = inclination;				// °
		this.longitude_NA = longitude_NA;			// °
		this.semiMajorAxis = semiMajorAxis;			// UA
		this.eccentricity = eccentricity;			
		this.longitude_peri = longitude_peri;		// °
		this.true_anomaly = true_anomaly;			// °
		this.epoch = epoch;							// ["yyyy-mm-dd", "hh:mm:ss"]
		if (this.epoch == 'J2000') {
			this.epoch = ['2000-01-01', '12:00:00'];
		}
	}
	
	// Properties
	{
		// Type
		if (this.eccentricity > 1) {
			this.type = 'hyperbola';
		}
		if (this.eccentricity == 1) {
			this.type = 'parabola';
		}
		if (this.eccentricity < 1) {
			this.type = 'ellipse'
		}
		
		// Other elements to caracterize the orbit : period, specific relative angular momentum, altitude of apoapsis & periapsis (km), periapsis & apoapsis (UA)
		this.h = Math.sqrt(this.referenceBody.gravitationalParameter * convert(this.semiMajorAxis, 'UA') * (1 - Math.pow(this.eccentricity, 2)));							// km²/s
		if (this.type == 'ellipse') {
			this.period = 2 * Math.PI * Math.sqrt(Math.pow(convert(this.semiMajorAxis, 'UA'), 3) / this.referenceBody.gravitationalParameter);								// s
			this.meanMotion = 360 / this.period;																															// °/s
			this.apoapsis = (1 + this.eccentricity) * this.semiMajorAxis;																									// UA
			this.altitude_apoapsis = convert(this.apoapsis, 'UA') - this.referenceBody.radius;																				// km
		}
		this.periapsis = (1- this.eccentricity) * this.semiMajorAxis;																										// UA
		this.altitude_periapsis = convert(this.periapsis, 'UA') - this.referenceBody.radius;																				// km
		
		// Geometric parameters
		this.semiMinorAxis = this.semiMajorAxis * Math.sqrt(1 - Math.pow(this.eccentricity, 2));																			// UA
		this.c = this.eccentricity * this.semiMajorAxis;																													// UA
		this.semilatus_rectum = this.semiMajorAxis * (1 - Math.pow(this.eccentricity, 2));																					// UA
		this.flattening = (this.semiMajorAxis - this.semiMinorAxis) / this.semiMajorAxis;
		if (this.type != 'ellipse') {
			this.d = this.semiMinorAxis;																																	// UA
			this.hyperbolic_angle = Math.acos( 1 / this.eccentricity);																										// °
			this.escapeVelocity = Math.sqrt(this.referenceBody.gravitationalParameter  / convert(-this.semiMajorAxis, 'UA'));												// km/s
			this.periapsisVelocity = Math.sqrt(this.referenceBody.gravitationalParameter * (2/convert(this.periapsis, 'UA') - 1 / convert(this.semiMajorAxis, 'UA')));
		}
	}
	
	// Methods
	{
		// Orbital elements corrections according to time
		// time => rate changes
		// time => anomalies
		// Given time in JD number, hence the corrected orbital elements [a, e, i, W, w, u] ==> to complete later. For now, we neglect the effect of oblateness and of centennial_rates.
		this.getCorrectedElements = function(time) {
			
		}
		
		
		// Relative to periapsis and apoapsis times given true anomaly (time in s, angles in °)
		this.getTrueAnomaly_from_time = function(time) {
			if (this.type == 'ellipse') {
				// Mean anomaly from time
				var meanAnomaly = (this.meanMotion * time)%360;																					// °
				meanAnomaly = convert(meanAnomaly, '°');																						// rad
				
				// F and dF functions for Newton-Raphson method :
				function F(eccentricAnomaly, eccentricity) {
					var result = eccentricAnomaly - eccentricity * Math.sin(eccentricAnomaly) - meanAnomaly;
					return result;
				}
				function dF(eccentricAnomaly, eccentricity) {
					var result = 1 - eccentricity * Math.cos(eccentricAnomaly);
					return result;
				}
				
				// Newton-Raphson iteration to compute E :
				var E0 = meanAnomaly;
				var E1 = meanAnomaly;
				var epsilon = 1e-15;
				do {
					E0 = E1;
					E1 = E0 - F(E0, this.eccentricity) / dF(E0, this.eccentricity);																// rad
				} while(Math.abs(E1-E0) / E0 > epsilon)
					
				// We adjust the precision of E1 converting in ° then rad
				E1 = convert(E1, 'rad');																										// °
				E1 = parseFloat(E1.toPrecision(11));
				E1 = convert(E1, '°');																											// rad
					
				// True anomaly
				var trueAnomaly = 2 * Math.atan(Math.sqrt((1+this.eccentricity)/(1-this.eccentricity)) * Math.tan(E1/2));						// rad
				trueAnomaly = convert(trueAnomaly, 'rad');																						// °
				if (trueAnomaly < 0) {
					trueAnomaly = 360 + trueAnomaly;																							// °
				}
				return trueAnomaly;
				
			}
			if (this.trype == 'parabola')  {
				// Parabolic mean anomaly from time
				var meanAnomaly = Math.pow(this.referenceBody.gravitationalParameter, 2) / Math.pow(this.h, 3) * time;
				
				// True anomaly from mean anomaly
				var Mp = 3 * meanAnomaly;
				var A = Mp + Math.sqrt(Math.pow(Mp, 2) + 1);
				var trueAnomaly = 2 * Math.atan(Math.pow(A, 1/3) - Math.pow(A, -1/3));																						// rad
				convert(trueAnomaly, 'rad');																																// °
				return trueAnomaly;
			}
			if (this.type == 'hyperbola') {
				// Hyperbolic mean anomaly from time
				var meanAnomaly = Math.pow(this.referenceBody.gravitationalParameter, 2) / Math.pow(this.h, 3) * Math.pow((Math.pow(this.eccentricity, 2) - 1), 3/2) * time;
				
				// F and dF functions for Newton-Raphson method :
				function F(eccentricAnomaly, eccentricity) {
					var result = eccentricity * Math.sinh(eccentricAnomaly) - eccentricAnomaly - meanAnomaly;
					return result;
				}
				function dF(eccentricAnomaly, eccentricity) {
					var result = eccentricity * Math.cosh(eccentricAnomaly) - 1;
					return result;
				}
				
				// Newton-Raphson iteration to compute E :
				var E0 = meanAnomaly;
				var E1 = meanAnomaly;
				var epsilon = 1e-10;
				do {
					E0 = E1;
					E1 = E0 - F(E0, this.eccentricity) / dF(E0, this.eccentricity);
				} while(Math.abs(E1-E0) / E0 > epsilon)
					
				// We adjust the precision of E converting in ° then rad
				E1 = convert(E1, 'rad');																										// °
				E1 = parseFloat(E1.toPrecision(11));
				E1 = convert(E1, '°');																											// rad
					
				// True anomaly from eccentric anomaly
				var trueAnomaly = 2 * Math.atan(Math.sqrt((this.eccentricity + 1)/(this.eccentricity - 1)) * Math.tanh(E1/2));					// rad
				trueAnomaly = convert(trueAnomaly, 'rad');																						// °
				return trueAnomaly;
			}
		}
		this.getTimeSincePeriapsis_from_trueAnomaly = function(trueAnomaly) {
			trueAnomaly = convert(trueAnomaly, '°');																							// rad
			if (this.type == 'ellipse') {
				// Eccentric anomaly from true anomaly
				var eccentricAnomaly = 2 * Math.atan(Math.sqrt((1-this.eccentricity)/(1+this.eccentricity)) * Math.tan(trueAnomaly / 2));		// rad
				
				// Mean anomaly from eccentric anomaly
				var meanAnomaly = eccentricAnomaly - this.eccentricity * Math.sin(eccentricAnomaly);											// rad
				meanAnomaly = meanAnomaly = convert(meanAnomaly, 'rad');																		// °
				
				// Time since periapsis from mean anomaly
				var time = meanAnomaly / this.meanMotion;																						// s
				if (time < 0) {
					time += this.period;																										// s
				}
				return time;
			}
			if (this.type == 'parabola') {
				// Parabolic mean anomaly from true anomaly
				var meanAnomaly = 1/2 * Math.tan(trueAnomaly/2) + 1/6 * Math.pow(Math.tan(trueAnomaly/2), 3);
				
				// Time since periapsis from mean anomaly (this may be negative if the orbit goes toward the periapsis)
				var time = meanAnomaly * Math.pow(this.h, 3) / Math.pow(this.referenceBody.gravitationalParameter, 2);														// s
				return time;
				
			}
			if (this.type == 'hyperbola') {
				// Hyperbolic eccentric anomaly from true anomaly
				var eccentricAnomaly = 2 * Math.atanh(Math.sqrt((this.eccentricity - 1) / (this.eccentricity + 1)) * Math.tan(trueAnomaly/2));
				
				// Mean anomaly from eccentric anomaly
				var meanAnomaly = this.eccentricity * Math.sinh(eccentricAnomaly) - eccentricAnomaly;
				
				// Time since periapsis from mean anomaly
				var time = meanAnomaly * Math.pow(this.h, 3) / Math.pow(this.referenceBody.gravitationalParameter, 2) * Math.pow(Math.pow(this.eccentricity - 1 ), -3/2);	// s
				return time;
			}
		}
		this.getTimeToPeriapsis = function(trueAnomaly) {
			var timeSincePeriapsis = this.getTimeSincePeriapsis_from_trueAnomaly(trueAnomaly);
			if (this.type != 'ellipse') {
				if (timeSincePeriapsis <= 0) {
					return - timeSincePeriapsis;
				}
				else {
					return null;
				}
			}
			else {
				return this.period - timeSincePeriapsis;
			}
			
		}
		this.getTimeToApoapsis = function(trueAnomaly) {
			var timeSincePeriapsis = this.getTimeSincePeriapsis_from_trueAnomaly(trueAnomaly);
			if (this.type != 'ellipse') {
				return null;
			}
			else {
				if (timeSincePeriapsis >= this.period / 2) {
					return 3/2 * this.period - timeSincePeriapsis;
				}
				else {
					return 1/2 * this.period - timeSincePeriapsis;
				}
				
			}
		}
		this.getTimeSinceApoapsis = function(trueAnomaly) {
			var timeSincePeriapsis = this.getTimeSincePeriapsis_from_trueAnomaly(trueAnomaly);
			if (this.type != 'ellipse') {
				return null;
			}
			else {
				if (timeSincePeriapsis >= this.period / 2) {
					return timeSincePeriapsis - this.period/2;
				}
				else {
					return this.period/2 + timeSincePeriapsis;
				}
			}
		}
		
		// All relative to radius, velocity and energy modules (radius in km, velocity in km/s, energy in MJ/kg)
		this.getRadius = function(trueAnomaly) {
			trueAnomaly = convert(trueAnomaly, '°');																							// rad
			var radius = Math.pow(this.h, 2) / this.referenceBody.gravitationalParameter / (1 + this.eccentricity * Math.cos(trueAnomaly));		// km
			return radius;
		}
		this.getVelocity = function(radius) {
			var velocity = Math.sqrt(this.referenceBody.gravitationalParameter * (2/radius - 1/convert(semiMajorAxis, 'UA')));
			return velocity;
		}
		this.getCircularVelocity = function(radius) {
			var velocity = Math.sqrt(this.referenceBody.gravitationalParameter / radius);
			return velocity;
		}
		this.getEscapeVelocity = function(radius) {
			var velocity = Math.sqrt(2 * this.referenceBody.gravitationalParameter / radius);
			return velocity;
		}
		this.getKineticEnergy = function(radius) {
			var velocity = this.getVelocity(radius);
			var energy = 1/2 * Math.pow(velocity, 2);
			return energy;
		}
		this.getPotentialEnergy = function(radius) {
			var energy = - this.referenceBody.gravitationalParameter / radius;
			return energy;
		}
	}
}

 