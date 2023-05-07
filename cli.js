#!/usr/bin/env node

import minimist from 'minimist';
import moment from 'moment-timezone';
import fetch from 'node-fetch';

var argv = minimist(process.argv.slice(2));

const helpMenu = `Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    -j            Echo pretty JSON from open-meteo API and exit.`;

if (argv.h || argv.help) {
	console.log(helpMenu);
	process.exit(0);
}

const timezone = moment.tz.guess();
const lati = argv.n || (-1 * argv.s);
const longi = argv.e || (-1 * argv.w);

const apiResponse = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + lati + '&longitude=' + longi + '&daily=temperature_2m_max,precipitation_hours,windspeed_10m_max&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=' + timezone);
const apiData = await(apiResponse.json())

if (argv.j) {
	console.log(apiData);
	process.exit(0);
}

let days;
if (argv.d == null) {
	days = 1;
} else {
	days = argv.d;
}

if (apiData.daily.precipitation_hours[days] != null) {
	var output = "The temperature is " + apiData.daily.temperature_2m_max[days] +
				" degrees Fahrenheit with a windspeed of " + apiData.daily.windspeed_10m_max[days] +
				" MPH and " + apiData.daily.precipitation_hours[days] + " inches of precipitation " +
				"in " + days + " days.";
} else {
	var output = "The temperature is " + apiData.daily.temperature_2m_max[days] + apiData.daily.temperature_unit +
				" with a windspeed of " + apiData.daily.windspeed_10m_max[days] + apiData.daily.windspeed_unit +
				"in " + days + " days.";
}

console.log(output)
