(async function(){
const API_KEY = '00ffe67401ef889e85434ae98183c43e';

const editLocationButton = document.querySelector('#edit-location-button');
const editLocationIcon = document.querySelector('#edit-location-icon');
const updateLocationButton = document.querySelector('#update-location-button');
const cityInput = document.querySelector('#city-name');
const stateSelect = document.querySelector('#state-select');
const editIconPath = './assets/images/icons/edit.svg';
const closeIconPath = './assets/images/icons/close.svg';

editLocationButton.addEventListener('click', function() {
  const locationInput = document.querySelector('.location-input');
  if (locationInput.classList.contains('hidden')) {
    locationInput.classList.remove('hidden');
    editLocationIcon.src = closeIconPath;
  } else {
    locationInput.classList.add('hidden');
    editLocationIcon.src = editIconPath;
  }
});

updateLocationButton.addEventListener('click', function() {
  const cityValue = cityInput.value;
  const stateValue = stateSelect.value;

  if (cityValue !== '' && stateValue !== '') {
    getLocation(cityValue, stateValue)
  } else {
    alert('Please enter a city and select a state')
  }
});

async function getLocation(city, state) {
  const LOCATION_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${city},${state},1&appid=${API_KEY}`;

  try {
    const response = await fetch(LOCATION_API_URL);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    if (json.length === 0) {
      throw new Error('No location found');
    }

    const { lat, lon } = json[0];

    if (lat && lon) {
      cityInput.value = '';
      stateSelect.value = '';
      document.querySelector('#location .city').innerHTML = `${city},`;
      document.querySelector('#location .state').innerHTML = state;
      getWeather(lat, lon);
    } else {
      throw new Error('No latitude and longitude found');
    }
  } catch (error) {
    alert(error);
    console.error(error)
  }
}

async function getWeather(lat, lon) {
  const DEFAULT_LAT = 47.6038321;
  const DEFAULT_LON = -122.330062;
  const LAT = lat || DEFAULT_LAT;
  const LON = lon || DEFAULT_LON;
  const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=imperial`;

  try {
    const response = await fetch(WEATHER_API_URL);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();

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
  const nextDay = new Date(date);
  nextDay.setDate(date.getDate() + 1);
  nextDay.setHours(0, 0, 0, 0);
  const midnightUnixTime = Math.floor(nextDay.getTime() / 1000);

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
  if(now >= midnightUnixTime - oneHour && now <= midnightUnixTime + oneHour) {
    console.log('midnight');
    console.log('now', now);
    document.body.className = "";
    document.body.classList.add('midnight');
    return;
  } else if (now >= sunsetUnixTime + oneHour) {
    console.log('evening');
    console.log('now', now);
    document.body.className = "";
    document.body.classList.add('nighttime');
    return;
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

async function loadStateData() {
  try {
    const response = await fetch('./assets/data/states.json');

    if (!response.ok) {
      throw new Error(`HTTP error! ${response.status}`)
    }

    states = await response.json();

    setStateSelect(states);
  } catch (error) {
    console.error(`Error loading state data: ${error}`)
  }
};

function setStateSelect(states) {
  const selectElement = document.querySelector('#state-select');

  states.forEach((state) => {
    const newOption = document.createElement('option');
    newOption.value = state.value;
    newOption.text = state.name;

    selectElement.appendChild(newOption);
  });
}

getWeather();
await loadStateData()
})();

