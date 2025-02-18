(async function(){
const API_KEY = '00ffe67401ef889e85434ae98183c43e';
const DEFAULT_LAT = 47.6038321;
const DEFAULT_LON = -122.330062;

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
  const LAT = lat || DEFAULT_LAT;
  const LON = lon || DEFAULT_LON;
  const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=imperial`;
  try {
    const response = await fetch(WEATHER_API_URL);
    getForecast(LAT, LON);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();

    const mainTemperature = Math.floor(json.main.temp);
    const minTemperature = Math.floor(json.main.temp_min);
    const maxTemperature = Math.floor(json.main.temp_max);
    const feelsLikeTemperature = Math.floor(json.main.feels_like);

    const convertedSunrise = convertUnixTime(json.sys.sunrise);
    const convertedSunset = convertUnixTime(json.sys.sunset);
    const sunriseUnixTime = json.sys.sunrise;
    const sunsetUnixTime = json.sys.sunset;

    const iconElement = document.querySelector('#weather-icon');
    const weatherIcon = getWeatherIcon(json.weather[0], sunriseUnixTime, sunsetUnixTime);

    iconElement.src = weatherIcon.src;
    iconElement.alt = weatherIcon.alt;

    document.querySelector('#main-temperature').innerHTML = `${mainTemperature}&deg;F`;
    document.querySelector('#min-temperature').innerHTML = `${minTemperature}&deg;F`;
    document.querySelector('#feels-like-temperature').innerHTML = `${feelsLikeTemperature}&deg;F`;
    document.querySelector('#max-temperature').innerHTML = `${maxTemperature}&deg;F`;

    document.querySelector('#sunrise > .label').innerHTML = convertedSunrise;
    document.querySelector('#sunset > .label').innerHTML = convertedSunset;

    document.querySelector('#weather-description').innerHTML = json.weather[0].description;

    setTimeOfDay(sunriseUnixTime, sunsetUnixTime);

  } catch (error) {
    console.error(error.message);
  }

  // Check every 30 minutes
  setTimeout(getWeather, 30 * 60 * 1000);
}

// Update this to only return the icon path. Description should be handled out side of this
function getWeatherIcon(weather, sunriseUnixTime, sunsetUnixTime) {
  const iconPath = './assets/images/icons/';
  const timeNow = Date.now() / 1000;
  const sunrise = sunriseUnixTime;
  const sunset = sunsetUnixTime;
  const isDaytime = sunrise === null || sunset === null || timeNow > sunrise && timeNow < sunset;
  const imageObject = {
    alt: weather.description,
    src: ''
  }

  switch (weather.main){
    case 'Clear':
      if (isDaytime) {
        imageObject.src = `${iconPath}clear-day.svg`;
      } else {
        imageObject.src = `${iconPath}clear-night.svg`;
      }
      break;
    case 'Clouds':
      imageObject.src = `${iconPath}cloudy.svg`;
      break;
    case 'Drizzle':
      imageObject.src = `${iconPath}drizzle.svg`;
      break;
    case 'Fog':
      imageObject.src = `${iconPath}fog.svg`;
      break;
    case 'Haze':
      imageObject.src = `${iconPath}haze.svg`;
    case 'Mist':
      imageObject.src = `${iconPath}mist.svg`;
      break;
    case 'Rain':
      imageObject.src = `${iconPath}rain.svg`;
      break;
    case 'Snow':
      imageObject.src = `${iconPath}snow.svg`;
      break;
    case 'Thunderstorm':
      imageObject.src = `${iconPath}thunderstorms-rain.svg`;
      break;
    default:
      imageObject.src = `${iconPath}not-available.svg`;
      imageObject.alt = 'not available';
  }

  return imageObject;
}

async function getForecast(lat, lon) {
  const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`;
  const date = new Date();
  const forecastDatesToFind = Array.from({ length: 5 }, (_, i) => {
    const time = '12:00:00';
    const firstDay = date.toISOString().split('T')[0];
    const nextDay = new Date(new Date().setDate(new Date().getDate() + (i + 1))).toISOString().split('T')[0];

    if (i > 0) {
      return `${nextDay} ${time}`;
    } else {
      return [`${firstDay} ${time}`, `${nextDay} ${time}`];
    }
  }).flat();
  const forecastElement = document.querySelector('#forecast');

  forecastElement.innerHTML = '';

  /* Forecast data is every 3 hours for each array item. Find the index for the next 5 days at 12 noon.
  [0] day 0 (today)
  [1] ~ [8] day 1 (tomorrow)
  [9] ~ [13] day 2 (day after tomorrow)
  [14] ~ [21] day 3,
  [22] ~ [30] day 4
  [31] ~ [39] day 5 (last day)
  */

  try {
    const response = await fetch(WEATHER_API_URL);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    const forecast = json.list.filter((item) => forecastDatesToFind.includes(item.dt_txt));

    forecast.forEach((item) => {
      const weatherIcon = getWeatherIcon(item.weather[0], null, null);

      forecastElement.insertAdjacentHTML('beforeend',
        `<div class="icon-stack">
            <div class="icon">
              <img src="${weatherIcon.src}" alt="${weatherIcon.alt}" />
            </div>
            <div class="label">${Math.floor(item.main.temp)}&deg;F
            <span>
              ${item.dt_txt.split(' ')[0].split(`${date.getFullYear()}-`)[1]}
            </span>
            </div>
          </div>`
      )
    });
  } catch (error) {
    console.error(error.message);
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
    // Sunrise +/- 1 hour
    if (now >= sunriseUnixTime - oneHour && now <= sunriseUnixTime + oneHour) {
      document.body.className = "";
      document.body.classList.add('sunrise');
      return;
    } else if (now >= sunsetUnixTime - oneHour && now <= sunsetUnixTime + oneHour) {
      // Sunset +/- 1 hour
      document.body.className = "";
      document.body.classList.add('sunset');
      return;
    } else {
      document.body.className = "";
      document.body.classList.add('noon');
      return;
    }
  }

  // If evening
  if(now >= midnightUnixTime - oneHour && now <= midnightUnixTime + oneHour) {
    document.body.className = "";
    document.body.classList.add('midnight');
    return;
  } else if (now >= sunsetUnixTime + oneHour) {
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

