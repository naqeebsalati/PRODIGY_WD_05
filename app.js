// app.js
const apiKey = '044b2b07fcf2c3a130e691fb64e84c47' // Replace with your OpenWeatherMap API key
const weatherInfo = document.getElementById("weather-info");
const errorMessage = document.getElementById("error-message");

// Function to fetch weather by user's location
function fetchWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      fetchWeatherData(lat, lon);
    }, showError);
  } else {
    errorMessage.textContent = "Geolocation is not supported by this browser.";
  }
}

// Function to fetch weather by city name
function fetchWeatherByCity() {
  const city = document.getElementById("city-input").value;
  if (city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
      .then(response => response.json())
      .then(data => displayWeatherData(data))
      .catch(error => handleError(error));
  } else {
    errorMessage.textContent = "Please enter a city name.";
  }
}

// Helper function to fetch weather data based on coordinates
function fetchWeatherData(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => displayWeatherData(data))
    .catch(error => handleError(error));
}

// Function to display weather data
function displayWeatherData(data) {
  if (data.cod === 200) {
    errorMessage.textContent = '';
    weatherInfo.innerHTML = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <p>Temperature: ${data.main.temp} °C</p>
      <p>Weather: ${data.weather[0].description}</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
  } else {
    errorMessage.textContent = data.message;
  }
}

// Function to handle errors
function handleError(error) {
  errorMessage.textContent = "Unable to fetch weather data. Please try again.";
}

// Error callback for geolocation
function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      errorMessage.textContent = "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      errorMessage.textContent = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      errorMessage.textContent = "The request to get user location timed out.";
      break;
    default:
      errorMessage.textContent = "An unknown error occurred.";
      break;
  }
}
