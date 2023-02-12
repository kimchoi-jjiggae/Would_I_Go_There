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

// google maps rendering code
let inputAddress;
let lat;
let long;


    document.getElementsByTagName("form")[0].addEventListener("submit", e =>
    {

        e.preventDefault()
        inputAddress = document.getElementById("address").value

        document.getElementById("showAddress").append(inputAddress)

        let formattedAddress = inputAddress.replaceAll(" ", "%")

        let query = `https://api.geoapify.com/v1/geocode/search?text=${formattedAddress}&apiKey=ef5a7756a5d946bdae460c509c190f54`
        console.log(query)
        fetch(query)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            lat = data.features[0].properties.lat
            long = data.features[0].properties.lon
            console.log(lat, long)
            document.getElementById("newLat").append(lat)
            document.getElementById("newLong").append(long)
            codeAddress()
            codeLatLng(lat, long)

        })

    })

let geocoder;
let map;
let marker;

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

    let latlng = new google.maps.LatLng(-latitude, longitude-180);
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
  geocoder.geocode( { 'address': address}, function(results, status) {
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