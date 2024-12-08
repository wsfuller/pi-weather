(function(){
const API_KEY = '00ffe67401ef889e85434ae98183c43e';
const DEFAULT_LAT = 47.6038321;
const DEFAULT_LON = -122.330062;
const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${DEFAULT_LAT}&lon=${DEFAULT_LON}&appid=${API_KEY}&units=imperial`;

const DEFAULT_CITY = 'Seattle';
const DEFAULT_STATE = 'WA';
const LOCATION_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${DEFAULT_CITY},${DEFAULT_STATE},1&appid=${API_KEY}`;

async function getWeather() {
  const url = WEATHER_API_URL;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log('json', json);

    const mainTemperature = Math.floor(json.main.temp);
    const minTemperature = Math.floor(json.main.temp_min);
    const maxTemperature = Math.floor(json.main.temp_max);
    const feelsLikeTemperature = Math.floor(json.main.feels_like);

    document.querySelector('#main-temperature').innerHTML = `${mainTemperature}&deg;F`;
    document.querySelector('#min-temperature').innerHTML = `${minTemperature}&deg;F`;
    document.querySelector('#feels-like-temperature').innerHTML = `${feelsLikeTemperature}&deg;F`;
    document.querySelector('#max-temperature').innerHTML = `${maxTemperature}&deg;F`;

    const convertedSunrise = convertUnixTime(json.sys.sunrise);
    const convertedSunset = convertUnixTime(json.sys.sunset);

    document.querySelector('#sunrise > .label').innerHTML = convertedSunrise;
    document.querySelector('#sunset > .label').innerHTML = convertedSunset;

    const sunriseUnixTime = json.sys.sunrise;
    const sunsetUnixTime = json.sys.sunset;

    getWeatherIcon(json.weather[0], sunriseUnixTime, sunsetUnixTime);
    setTimeOfDay(sunriseUnixTime, sunsetUnixTime);

  } catch (error) {
    console.error(error.message);
  }

  // Check every 30 minutes
  setTimeout(getWeather, 30 * 60 * 1000);
}

function getWeatherIcon(weather, sunriseUnixTime, sunsetUnixTime) {
  const iconPath = './assets/images/icons/';
  const iconElement = document.querySelector('#weather-icon');
  const timeNow = Date.now() / 1000;

  switch (weather.main){
    case 'Clear':
      if (timeNow > sunriseUnixTime  && timeNow < sunsetUnixTime) {
        iconElement.src = `${iconPath}clear-day.svg`;
      } else {
        iconElement.src = `${iconPath}clear-night.svg`;
      }
      iconElement.alt = weather.description;
      break;
    case 'Clouds':
      iconElement.src = `${iconPath}cloudy.svg`;
      iconElement.alt = weather.description;
      break;
    case 'Drizzle':
      iconElement.src = `${iconPath}drizzle.svg`;
      iconElement.alt = weather.description;
      break;
    case 'Fog':
      iconElement.src = `${iconPath}fog.svg`;
      iconElement.alt = weather.description;
      break;
    case 'Mist':
      iconElement.src = `${iconPath}mist.svg`;
      iconElement.alt = weather.description;
      break;
    case 'Rain':
      iconElement.src = `${iconPath}rain.svg`;
      iconElement.alt = weather.description;
      break;
    case 'Snow':
      iconElement.src = `${iconPath}snow.svg`;
      iconElement.alt = weather.description;
      break;
    case 'Thunderstorm':
      iconElement.src = `${iconPath}thunderstorms-rain.svg`;
      iconElement.alt = weather.description;
      break;
    default:
       iconElement.src = `${iconPath}not-available.svg`;
       iconElement.alt = 'not available';
  }
}

function setTimeOfDay(sunriseUnixTime, sunsetUnixTime) {
  const date = new Date();
  const now = Math.floor(Date.now() / 1000);
  const midnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const midnightUnixTime = Math.floor(midnight.getTime() / 1000);

  const oneHour = 3600;

  // If daytime
  if (now >= sunriseUnixTime - oneHour && now < sunsetUnixTime + oneHour) {
    console.log('daytime');
    console.log('now', now);
    // Sunrise +/- 1 hour
    if (now >= sunriseUnixTime - oneHour && now <= sunriseUnixTime + oneHour) {
      console.log('sunrise');
      console.log('now', now);

      document.body.className = "";
      document.body.classList.add('sunrise');
      return;
    } else if (now >= sunsetUnixTime - oneHour && now <= sunsetUnixTime + oneHour) {
      // Sunset +/- 1 hour
      console.log('sunset');
      console.log('now', now);
      document.body.className = "";
      document.body.classList.add('sunset');
      return;
    } else {
      console.log('noon');
      console.log('now', now);
      document.body.className = "";
      document.body.classList.add('noon');
      return;
    }
  }
  // If evening
  if (now >= sunsetUnixTime + oneHour) {
    if(now >= midnightUnixTime - oneHour && now <= midnightUnixTime + oneHour) {
      console.log('midnight');
      console.log('now', now);
      document.body.className = "";
      document.body.classList.add('midnight');
      return;
    } else {
      console.log('evening');
      console.log('now', now);
      document.body.className = "";
      document.body.classList.add('nighttime');
      return;
    }
  }
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
