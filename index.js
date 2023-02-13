let inputAddress;
let lat;
let long;
let antiLat;
let antiLong;
let geocoder;
let map;
let marker;


document.getElementsByTagName("form")[0].addEventListener("submit", e => {

    e.preventDefault()
    inputAddress = document.getElementById("address").value

    document.getElementById("showAddress").append(inputAddress)

    let formattedAddress = inputAddress.replaceAll(" ", "%")

    let query = `https://api.geoapify.com/v1/geocode/search?text=${formattedAddress}&apiKey=ef5a7756a5d946bdae460c509c190f54`
    console.log(query)
    fetch(query)
        .then(res => res.json())
        .then(data => {
            // console.log(data)
            lat = data.features[0].properties.lat
            long = data.features[0].properties.lon

            document.getElementById("newLat").innerHTML = lat
            document.getElementById("newLong").innerHTML=long
            codeAddress()
            antiCoordinates = antipodal(lat,long)
            codeLatLng(antiCoordinates[0], antiCoordinates[1])
            renderHomeElevation(lat,long)
            getWeatherData(antiCoordinates[0], antiCoordinates[1])
        })

})

function antipodal(lat, long){
    antiLat = -lat;
    antiLong;
    if (long>0){
        antiLong = long-180;
    } else antiLong = long+180
    return [antiLat, antiLong];
}

// google maps rendering code
function initialize() {
    geocoder = new google.maps.Geocoder();
    let latlng = new google.maps.LatLng(-34.397, 150.644);
    let mapOptions = {
        zoom: 8,
        center: latlng
    }
    map = new google.maps.Map(document.getElementById("map_canvas1"), mapOptions);
    map2 = new google.maps.Map(document.getElementById("map_canvas2"), mapOptions);

}

function codeLatLng(latitude, longitude) {

    let latlng = new google.maps.LatLng(latitude, longitude);
    map2.setCenter(latlng);
    // map.setCenter(results[0].geometry.location);
    // if (marker2) {
    //   marker.setMap(null);
    // }
    marker2 = new google.maps.Marker({
        map: map2,
        position: latlng
    });
};


function codeAddress() {
    let address = inputAddress;
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == 'OK') {
            map.setCenter(results[0].geometry.location);
            if (marker) {
                marker.setMap(null);
            }
            marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}


function renderHomeElevation(lat,long){
    fetch(`https://api.gpxz.io/v1/elevation/point?lat=${lat}&lon=${long}&api-key=ak_4rLt9ykj_GbgzR3XS651qJnwc`)
        .then(res=>res.json())
        .then(data=> document.getElementById("homeElevation").innerText = `Elevation is: ~${data.result.elevation}m`)

}
// function renderOtherSideElevation(lat,long){
//     otherElevation = getElevation(-lat, 180-long, "ak_4rLt9ykj_XenmA90l0QP8tXdM")
//     document.getElementById("otherSideElevation").innerText = `Elevation is: ${otherElevation}m`

// }

// render time at home location
function renderHomeTime(dateObj){
    document.getElementById("homeTime").innerText = `Time is: ${dateObj}`
}

//fetch weather data for other side of the world
let timezone_offset;
function getWeatherData(lat, long){
    fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${long}&units=metric&appid=be2354ee5a7e54a4a66d585d0b51ea8c`)
        .then(response => response.json())
        .then(data => {

            let dt;
            dt = data.current.dt
            timezone_offset = data.timezone_offset
            dateObj = formatDT(dt, timezone_offset)

            data.hourly.forEach(hour => renderHourlyWeather(hour))
            renderHomeTime(dateObj)

        })
    }

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
    // console.log(data)
}

function determineIcon(icon) {
    return `https://openweathermap.org/img/wn/${icon}.png`
}

function formatDT(dt, timezone_offset) {
    let dateObj = new Date(((dt + timezone_offset) * 1000));
    utcString = dateObj.toUTCString();
    return time = utcString.slice(-12, -7);
}
