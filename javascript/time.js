// All time functions relative to J2000 epoch (reference).

// Date = [yyyy-mm-dd] and hour = [hh:mm:ss], for year between 1801 and 2099 (Gregorian years)
function getTime_from_date(date, hour) {
	var data = date.split('-');
	var y = parseFloat(data[0]);
	var m = parseFloat(data[1]);
	var d = parseFloat(data[2]);
	if (hour != undefined) {
		var data2 = hour.split(':');
		var h = parseFloat(data2[0]);
		var mn = parseFloat(data2[1]);
		var s = parseFloat(data2[2]);
	}
	
	//Boulet (1991) formula :
	var julianDayNumber = (367*y - Math.floor(7*(y+Math.floor((m+9)/12))/4) + Math.floor(275*m/9) + d + 1721013.5)*86400;
	var julianDaySecond = 0;
	if (!isNaN(h)) {
		julianDaySecond = h*3600;
		if (!isNaN(mn)) {
			julianDaySecond += mn*60;
			if (!isNaN(s)) {
				julianDaySecond += s;
			}
		}
	}
	return julianDayNumber + julianDaySecond - 43200 * Math.sign(100*y+m-190002.5) + 43200;
}

function convert_time(value, unit) {
	
}

function getDate_from_time(nb_JD) {
	
}

function time_convert(amount, term) {
	var result;
	switch(term) {
		case 'days':
			result = 86400*amount;
			break;
		case 'weeks':
			result = 86400*7*amount;
			break;
		case 'months':
			result = 86400*365.25/12*amount;
			break;
		case 'years':
			result = 86400*365.25*amount;
			break;
		case 'hours':
			result = 3600*amount;
			break;
	}
	return result;
}
