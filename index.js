// let map;

// function initMap( lat= -34.397, lng= 150.644) {
//   map = new google.maps.Map(document.getElementById("map"), {
//     center: { lat: -34.397, lng: 150.644 },
//     zoom: 8,
//   });
// }

// window.initMap = initMap;


//weather api 

//global variables

let timezone_offset;
fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=0&lon=0&units=metric&appid=be2354ee5a7e54a4a66d585d0b51ea8c`)
    .then(response => response.json())
    .then(data => {

        let dt;
        dt = data.current.dt
        timezone_offset = data.timezone_offset
        dateObj = formatDT(dt, timezone_offset)


        data.hourly.forEach(hour => renderHourlyWeather(hour))

    })

function renderHourlyWeather(weatherDetails) {
    let weatherBar = document.getElementById("weatherBar")
    let weatherCard = document.createElement("div")
    weatherCard.className = "weatherCard"
    let time = document.createElement("p")
    let icon = document.createElement("img")
    let temp = document.createElement("p")
    let imageIconURL = determineIcon(weatherDetails.weather[0].icon)

    let hourlyTimeDT = weatherDetails.dt
    let hourlyTime = formatDT(hourlyTimeDT, timezone_offset)

    time.textContent = hourlyTime

    icon.src = imageIconURL

    temp.textContent = weatherDetails.temp
    weatherCard.appendChild(time)
    weatherCard.appendChild(icon)
    weatherCard.appendChild(temp)
    weatherBar.appendChild(weatherCard)
}

function determineIcon(icon) {
    return `https://openweathermap.org/img/wn/${icon}.png`
}

function formatDT(dt, timezone_offset) {
    let dateObj = new Date(((dt + timezone_offset) * 1000));
    utcString = dateObj.toUTCString();
    return time = utcString.slice(-12, -7);
}

