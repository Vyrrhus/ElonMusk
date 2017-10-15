// Constantes globales
var G = 6.67408e-20; 	// km3/kg/s2
var Pi = Math.PI;
var UA = 149597870.7; 	// km

// Physical functions
// renvoie la valeur convertie d'une unité à l'autre
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
// => développer cette fonction davantage :
// s en j, m en km en UA, m/s en km/s, °/s en °/j, etc.

// Maths functions
{
// module du vecteur
function module(vector) {
	var result = 0
	for (let k = 0, c = vector.length ; k < c ; k++) {
		result += Math.pow(vector[k],2);
	}
	result = Math.sqrt(result);
	return result;
}

// vecteur unitaire
function unitVector(vector) {
	var mod = module(vector);
	var unitVector = [];
	if (mod != 0) {
		for (let k=0, c=vector.length ; k < c ; k++) {
			unitVector[k] = vector[k] / mod;
		}
		return unitVector;
	}
	else {
		return vector;
	}
}

// produit scalaire
function dot(u, v) {
	if (u.length != v.length && u.length != undefined) {
		console.log('Les vecteurs ne sont pas de même dimension !');
		return null;
	}
	var result = 0;
	for (let k = 0, c = u.length ; k < c ; k++) {
		result += u[k] * v[k];
	}
	return result;
}

// produit vectoriel [1*3]
function cross(u, v) {
	if (u.length != v.length || u.length != 3 || v.length != 3) {
		console.log('Le produit vectoriel ne peut être calculé !');
		return null;
	}
	else {
		var x = u[1]*v[2] - u[2]*v[1];
		var y = u[2]*v[0] - u[0]*v[2];
		var z = u[0]*v[1] - u[1]*v[0];
		return [x, y, z];
	}
}

// produit d'un scalaire et d'un vecteur / matrice
function scalar(a, u) {
	if (a.length > 1) {
		console.log('a n"est pas un scalaire !');
		return null;
	}
	else {
		var row = u.length;
		var col = u[0].length;
		var result = [];
		var line
		for (let i = 0; i < row ; i++) {
			if (col == undefined) {
				result.push(a*u[i]);
			}
			else {
				line = [];
				for (let j = 0; j < col ; j++) {
					line.push(a*u[i][j]);
				}
				result.push(line);
			}
		}
		return result;
	}
}

// sommer des matrices ou des vecteurs
function sumMatrix() {
	var size_i = arguments[0].length;
	var size_j = arguments[0][0].length;
	
	// Vérifie si la somme est possible
	for (let k = 1, c = arguments.length ; k < c ; k++) {
		if (arguments[k].length != size_i) {
			console.log('Erreur de dimension');
			return null;
		}
		for (let i = 0 ; i < size_i ; i++) {
			if (arguments[k][i].length != size_j) {
				console.log('Erreur de dimension');
				return null;
			}
		}
	}
	
	// Initialisation du résultat
	var result = [];
	var line = [];
	for (let i = 0 ; i < size_i ; i++) {
		if (size_j == undefined) {
			result[i] = arguments[0][i];
		}
		else {
			for (let j = 0 ; j < size_j ; j++) {
				line.push(arguments[0][i][j]);
			}
			result.push(line);
			line = [];
		}
	}
	
	// Somme élément par élément
	for (let k = 1, c = arguments.length ; k < c ; k++) {
		for (let i = 0 ; i < size_i ; i++) {
			if (size_j >= 0) {
				for (let j = 0 ; j < size_j ; j++) {
					result[i][j] = result[i][j] + arguments[k][i][j];
				}
			}
			else {
				result[i] = result[i] + arguments[k][i];
			}
		}
	}
	
	// Résultat final
	return result;
}

// produit de 2 matrices / vecteurs
function productMatrix(A,B) {
	var size_A = A.length;
	var size_B = B.length;
	for (let k = 1 ; k < size_A ; k++) {
		if (A[k].length != A[0].length) {
			return null;
		}
	}
	for (let k = 1 ; k < size_B ; k++) {
		if (B[k].length != B[0].length) {
			return null;
		}
	}
	
	if (A[0].length != B.length) {
		console.log('Erreur de dimension');
		return null;
	}
	// check if can be computed
	
	var result = [];
	for (i=0 ; i < A.length ; i++) {
		var line = [];
		for (j=0 ; j < B[0].length ; j++) {
			line.push(0);
		}
		result.push(line);
	}
	// initialisation
	
	for (let j = 0 ; j < B[0].length ; j++) {
		for (let i = 0 ; i < A.length ; i++) {
			var inner_sum = 0;
			for (let n = 0 ; n < B.length ; n++) {
				var a = A[i][n];
				var b = B[n][j];
				inner_sum += a*b;
			}
			result[i][j] = inner_sum;
		}
	}
	return result;
}

// transposée matrice
function trans(A) {
	var size_i = A.length;
	if (size_i == undefined) {
		return A;
	}
	var size_j = A[0].length;
	var result = [];
	if (size_j == 1 && size_i == 1) {
		return A;
	}
	if (size_j == 0 || size_i == 0) {
		return null;
	}
	// check if can be computed
	
	if (size_j > 0) {
		for (let j = 0 ; j < size_j ; j++) {
			var line = [];
			for (let i = 0 ; i < size_i ; i++) {
				line.push(A[i][j]);
			}
			result.push(line);
		}
	}
	else {
		for (let k = 0 ; k < size_i ; k++) {
			result.push([A[k]]);
		}
	}
	if (size_j == 1) {
		return result[0];
	}
	else {
		return result;
	}
}
}

// Frame transfer functions
{
var I = [1,0,0];
var J = [0,1,0];
var K = [0,0,1]; 

function DCM_matrix(W, w, i, is_xX) {
	var Matrix = [
					[	-Math.sin(W) * Math.cos(i) * Math.sin(w) + Math.cos(W) * Math.cos(w), 
					 	Math.cos(W) * Math.cos(i) * Math.sin(w) + Math.sin(W) * Math.cos(w), 
					 	Math.sin(i) * Math.sin(w)
					],
			  		[	-Math.sin(W) * Math.cos(i) * Math.cos(w) - Math.cos(W) * Math.sin(w),
					 	Math.cos(W) * Math.cos(i) * Math.cos(w) - Math.sin(W) * Math.sin(w),
					 	Math.sin(i) * Math.cos(w)
					],
			  		[	Math.sin(W) * Math.sin(i),
					 	- Math.cos(W) * Math.sin(i),
						Math.cos(i)
					]
				];
	if (is_xX) {
		return Matrix;
	}
	else {
		return trans(Matrix);
	}
}
}