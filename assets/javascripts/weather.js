(function(){
console.log('weather.js');
const API_KEY = '00ffe67401ef889e85434ae98183c43e';
const DEFAULT_LAT = 47.6038321;
const DEFAULT_LON = -122.330062;
const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${DEFAULT_LAT}&lon=${DEFAULT_LON}&appid=${API_KEY}&units=imperial`;

const DEFAULT_CITY = 'Seattle';
const DEFAULT_STATE = 'WA';
const LOCATION_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${DEFAULT_CITY},${DEFAULT_STATE},1&appid=${API_KEY}`;
let sunriseTime = null;
let sunsetTime = null;

// console.log('WEATHER_API_URL', WEATHER_API_URL);
// console.log('LOCATION_API_URL', LOCATION_API_URL);

async function getWeather() {
  const url = WEATHER_API_URL;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log('json', json);
    const temperature = Math.floor(json.main.temp);
    const temperatureElement = document.querySelector('#temperature').innerHTML = `${temperature} &deg;F`;

    const convertedSunrise = convertUnixTime(json.sys.sunrise);
    const convertedSunset = convertUnixTime(json.sys.sunset);
    const sunriseElement = document.querySelector('#sunrise > .label').innerHTML = convertedSunrise;
    const sunsetElement = document.querySelector('#sunset > .label').innerHTML = convertedSunset;

    const sunriseUnixTime = json.sys.sunrise;
    const sunsetUnixTime = json.sys.sunset;

    setTimeOfDay(sunriseUnixTime, sunsetUnixTime);

  } catch (error) {
    console.error(error.message);
  }
}

function setTimeOfDay(sunriseUnixTime, sunsetUnixTime) {
  console.log('get time of day');
  const date = new Date();
  const unixTime = Math.floor(Date.now() / 1000);
  const noon = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
  const noonUnixTime = Math.floor(noon.getTime() / 1000);
  const midnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const midnightUnixTime = Math.floor(midnight.getTime() / 1000);

  const oneHour = 3600;

  if(sunriseUnixTime - oneHour ) {
    console.log('before sunrise');
    document.body.className = "";
    document.body.classList.add('night');
  } else if (unixTime > sunriseUnixTime && unixTime < sunsetUnixTime) {
    console.log('daytime');
    document.body.className = "";
    document.body.classList.add('day');
  } else if (unixTime > sunsetUnixTime && unixTime < midnightUnixTime) {
    console.log('evening');
    document.body.className = "";
    document.body.classList.add('nighttime');
  }
  // console.log('unixTimestamp', unixTimestamp);

  sunrise
  noon
  sunset
  midnight

  // console.log('hours', hours);
  // console.log('minutes', minutes);
  setTimeout(setTimeOfDay, 1000);
  // // Check every 5 minutes
  // setTimeout(getTimeOfDay, 300000);
}

function convertUnixTime(unixTime) {
  const date = new Date(unixTime * 1000);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  let amPm = 'am';
  if (hours > 12) {
    hours = hours - 12;
    amPm = 'pm';
  };

  return `${hours}:${minutes}${amPm}`;
}

getWeather();


})();
