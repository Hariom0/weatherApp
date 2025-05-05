document.addEventListener("DOMContentLoaded", () => {
    const getWeatherBtn = document.getElementById("get-weather-btn");
    const locationInput = document.getElementById("location-input");
    const cityName = document.getElementById("city-name");
    const weatherReport = document.getElementById("weather-report");
    const temperature = document.getElementById("temperature");
    const condition = document.getElementById("condition");
    const humidity = document.getElementById("humidity");
    const windSpeed = document.getElementById("wind-speed");
    const errorMessage = document.getElementById("error-message");
  
    const API_key = `c69815e2b6c38272c54c66570058d116`;
  
    getWeatherBtn.addEventListener("click", async () => {
      let city = locationInput.value.trim();
      if (!city) return;
  
      try {
        const data = await fetchData(city);
        if (data) {
          displayData(data);
        }
      } catch (error) {
        counterError();
      }
    });
  
    async function fetchData(city) {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_key}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("City not found");
      }
      return await response.json();
    }
  
    function displayData(data) {
      weatherReport.classList.remove("hidden");
      errorMessage.classList.add("hidden");
  
      const { weather, main, wind, name } = data;
      cityName.textContent = `${name} Weather`;
      temperature.textContent = `${main.temp} °C`;
      condition.textContent = `${weather[0].main}`;
      humidity.textContent = `${main.humidity} %`;
      windSpeed.textContent = `${wind.speed} km/h`;
    }
  
    function counterError() {
      weatherReport.classList.add("hidden");
      errorMessage.classList.remove("hidden");
    }
  
    locationInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        getWeatherBtn.click();
      }
    });

    VANTA.BIRDS({
        el: "#vanta-bg",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        backgroundColor: 0xeefff5,
        colorMode: "",
        cohesion: 28.00,
        quantity: 2.00
      });
  });
  