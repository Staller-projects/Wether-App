



const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const REQUIRED_KEY = "Enter";
const tempElement = document.getElementById("tempElement");
const currentCity = document.getElementById("currentCity");
const d1Temp = document.querySelector("#d1Temp");
const windSpeed = document.getElementById("windSpeed");
const uvindex = document.getElementById("uvindex");
const humidity = document.getElementById("humidity");
const getCustomCityElement = document.getElementById(`getCustomCity`)

const realtimeWetherHeaderOptions = {
    method: 'GET',
    headers: {
      accept: 'application/json'
    }
  };

const forecastWetherHeaderOptions = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': 'c84469d420msh50238d438a75e68p162ea5jsne870ca641843',
    'X-RapidAPI-Host': 'tomorrow-io1.p.rapidapi.com'
  }
};



//** This function calls two APIs (1. realtime wether 2. forecast wether) **//
const fetchWetherData = async (cityName = "pune") => {

  const REALTIME_WETHER_API = `https://api.tomorrow.io/v4/weather/realtime?location=${cityName}&apikey=sT2OpsOrUwa99cJlsDsEojlNnPxqK5Z9`;
  // const REALTIME_WETHER_API = `https://tomorrow-io1.p.rapidapi.com/v4/weather/realtime?location=${cityName}`;
  const FORECAST_WETHER_API = `https://tomorrow-io1.p.rapidapi.com/v4/weather/forecast?timesteps=1d&location=${cityName}`;

  let wetherData = {realtime: null, forecast: null} 

  try {

    // realtime wether api call
    wetherData.realtime = await fetch(REALTIME_WETHER_API, realtimeWetherHeaderOptions)
    .then(response => response.json())
    .catch(error => alert(error))
    
    // forecast wether api call
    wetherData.forecast = await fetch(FORECAST_WETHER_API, forecastWetherHeaderOptions)
    .then(response => response.json())
    .catch(error => alert(error))

    console.log(wetherData);  

    return wetherData;

  } catch(error) {
    alert(`Error :- `, error);
  }

}


//** Following function displays the wether data onto the HTML DOM **/
const displayWetherData = async ({realtime, forecast}) => {

    // today's temperature displaying
    tempElement.innerHTML = `${Math.round(realtime.data.values.temperature)}&degC`;
    currentCity.innerText = realtime.location.name;
    windSpeed.innerText = `${realtime.data.values.windSpeed} m/s`;
    humidity.innerText = realtime.data.values.humidity;
    uvindex.innerText = realtime.data.values.uvIndex;
    
    
    forecast.timelines.daily.forEach((item, index) => {

        // formatting 'datetime' item to readable format
        let timeString = item.time;
        let date = new Date(timeString); 
    
        // temperature
        document.querySelector(`#d${index+1}Temp`)
        .querySelector(`h1`).innerHTML = `${Math.round(item.values.temperatureAvg)}&degC`;

        // date
        document.querySelector(`#d${index+1}Temp`)
        .querySelector(`h2`).innerText = `${weekdays[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
    })

}


const getCustomCityWether = (e) => {

  if(e.key == REQUIRED_KEY) { 

    document.getElementById("loading").classList.toggle("hidden");
    
    let cityName = String(getCustomCityElement.value);

    fetchWetherData(cityName)
    .then(response => displayWetherData(response))
    .then(() => document.getElementById("loading").classList.toggle("hidden"))
    .catch(error => console.log(error))
    
    // setTimeout(() => {
    // }, )



    // document.getElementById("loading").classList.toggle("hidden")
  }
  
} 


getCustomCityElement.addEventListener("keydown", getCustomCityWether);




(function() {
  document.getElementById("loading").classList.toggle("hidden")
  fetchWetherData()
  .then(response => displayWetherData(response))
  .then(() => document.getElementById("loading").classList.toggle("hidden"))
  .catch(error => console.log(error))

 
})()







