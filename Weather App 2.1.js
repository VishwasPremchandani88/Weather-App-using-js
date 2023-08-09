window.addEventListener('load', function()
{
    var img=['stunningnaturea.jpg','stunningnaturec.jpg','stunningnatured.webp','stunningnaturee.jpg','stunningnaturef.jpg'];
    var randindex=Math.floor(Math.random()*img.length);
    var randimg =img[randindex];
    var body= document.querySelector('body');
    body.style.backgroundImage='url('+randimg+')';
}
);
const cityinput = document.querySelector(".city");
const searchcity = document.querySelector(".search-btn");
const locationbutton = document.querySelector(".location");
const currentweatherdisplay = document.querySelector(".current-weather");
const weathercarddisplay = document.querySelector(".weather-cards");
const API_key ="";
const createweathercard = (cityname,weatherItem,index) =>
{
  if(index ===0)
  {
    //HTML for forecast
    return `<div class="info">
            <h2>${cityname} (${weatherItem.dt_txt.split(" ")[0]})</h2>
            <!-- <img src="rainy-day.png" alt="rainy"> -->
            <h4>Temperature : ${(weatherItem.main.temp -273.15).toFixed(2)}°C</h4>
            <h4>wind : ${(weatherItem.wind.speed)}</h4>
            <h4>Humidity : ${(weatherItem.wind.speed)}% </h4>
            <div class="icon">
                <img src="http://openweathermap.org/img//wn/${weatherItem.weather[0].icon}@4x.png" alt="rainy">
                <h4>${weatherItem.weather[0].description}</h4>
            </div>`

  }
  else
  { //HTML for 5 days forecast
    return `<li class="card">
            <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
            <h4>Temperature : ${(weatherItem.main.temp -273.15).toFixed(2)}°C</h4>
            <h4>wind : ${(weatherItem.wind.speed)}</h4>
            <h4>Humidity : ${(weatherItem.wind.speed)}% </h4>
            <img src="http://openweathermap.org/img//wn/${weatherItem.weather[0].icon}@2x.png" alt="icon">
            <h4>${weatherItem.weather[0].description}</h4>
            </li>`;
    
  }
}
const getWeatherDetails = (cityname, lat, lon) => { // Fix the function definition here
    const Weather_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`;
  
    fetch(Weather_API_URL)
      .then(res => res.json())
      .then(data => {
        const uniqueforecastdays =[];
        const fivedaysforecast = data.list.filter( forecast => {
          const forecastdate = new Date(forecast.dt_txt).getDate();
          if(!uniqueforecastdays.includes(forecastdate))
          {
            return uniqueforecastdays.push(forecastdate);
          }
        })
        // clear the previous data
        cityinput.value="";
        weathercarddisplay.innerHTML="";
        currentweatherdisplay.innerHTML=""; 
        // console.log(fivedaysforecast);
        fivedaysforecast.forEach((weatherItem, index) =>
        {
          if(index ===0)
          {
            currentweatherdisplay.insertAdjacentHTML("beforeend",createweathercard(cityname,weatherItem,index));
          }
          else
          {
            weathercarddisplay.insertAdjacentHTML("beforeend",createweathercard(cityname,weatherItem,index));
          }
          // createweathercard(weatherItem)
          

        })

      })
      .catch(() => {
        alert("An error occurred while fetching the weather forecast!");
      });
  };
const getcitycoordinates = () =>
{
    const cityname = cityinput.value.trim();
    if(!cityname) return;
    const geocoding_API_url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityname}&limit=1&appid=${API_key}`;
    fetch(geocoding_API_url).then(res => res.json()).then(data =>{
        if(!data.length) return alert(`No coordinates found for ${cityname}`);
        const {name , lat, lon} = data[0];
        getWeatherDetails(name,lat,lon);
    }).catch(()=>{
        alert("An error  occured while fetching  the coordinates!");
    }
    )
    console.log(cityname);

}
// city name using reverse geolocation API
const getusercoordinates = () =>
{
  navigator.geolocation.getCurrentPosition(
    position =>
    {
      const {latitude, longitude} = position.coords;
      const REVERSE_GEOCODING_URL =`http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_key}`;
      fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data =>{
        const {name} = data[0];
        getWeatherDetails(name,latitude,longitude);
    }).catch(()=>{
        alert("An error  occured while fetching  the city!");
    }
    )
    },
    error =>
    {
      if(error.code === error.PERMISSION_DENIED)
      {
        alert("Geolocation request denied. Please reset the permissions.")
      }
    }


  )


}


locationbutton.addEventListener("click", getusercoordinates);
searchcity.addEventListener("click", getcitycoordinates);