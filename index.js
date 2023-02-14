let inputAddress;
let lat;
let long;
let antiLat;
let antiLong;
let geocoder;
let map;
let marker;
let otherCountry;
let otherCity;



document.getElementsByTagName("form")[0].addEventListener("submit", e => {

    e.preventDefault()
    

    // Gets address inputed by user
    inputAddress = document.getElementById("address").value
    document.getElementById("showAddress").append(inputAddress)

    // formats address so that it can be put into the API to receive Lat/long
    let formattedAddress = inputAddress.replaceAll(" ", "%")
    let query = `https://api.geoapify.com/v1/geocode/search?text=${formattedAddress}&apiKey=ef5a7756a5d946bdae460c509c190f54`
    // fetches Lat/Long of input address
    fetch(query)
        .then(res => res.json())
        .then(data => {
            // gets Lat/Long from API
            

            lat = data.features[0].properties.lat
            long = data.features[0].properties.lon
    
            // document.getElementById("newLat").innerHTML = lat
            // document.getElementById("newLong").innerHTML=long

            // Creates map of home address
            codeAddress()
            scrollDown("currentLocation")
            // setInterval(scrollDown("diggingPanel"), 20000)
            // setInterval(scrollDown("result"), 400000)

            // Creates antipodal location ased on lat and long
            antiCoordinates = antipodal(lat,long)
            otherCountry = getOtherCountry(antiCoordinates)
            // Creates map of antipodal location
            
            codeLatLng(antiCoordinates[0], antiCoordinates[1])

            // Relaces placeholder elevation with antipodal location
            getLocalTime(lat, long)

            // Gets weather of antipodal location and renders it (rendering function is nested within the fetch function)
            getWeatherData(antiCoordinates[0], antiCoordinates[1])
            setTimeout(()=> scrollDown("diggingPanel"), 2000)

            setTimeout(() => scrollDown('result'), 4000)
            // scrollDown("result")
            

        })

})

function scrollDown(panelClass){
    let target = document.querySelector(`.${panelClass}`);
  
    // Calculate the target position
    let targetPosition = target.offsetTop;
    console.log("hi")
  
    // Scroll to the target position over a duration of 1000ms (1s)
    window.scroll({
      top: targetPosition,
      behavior: "smooth"
    });

    // scrolldelay = setTimeout(scrollDown,10)

      
}
// gets antipodal country and render it in placeholder div
function getOtherCountry(antiCoordinates){
    fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${antiCoordinates[0]}&lon=${antiCoordinates[1]}&format=json&apiKey=ef5a7756a5d946bdae460c509c190f54`)
        .then(res=> res.json())
        .then(data => {

            if (data.results[0].ocean){
                otherOcean = data.results[0].ocean
                document.getElementById("otherCountry").innerText = `Welcome to the ${otherOcean}!`
                getOceanData(otherOcean)

            } else {
                otherCountry = data.results[0].country
                otherCity = data.results[0].city
                // append data for country on other side of world
                getOtherData(otherCountry)
                document.getElementById("otherCountry").innerText = `Welcome to ${otherCountry}!`
            }
           

        })
    return otherCountry;
}

function getOceanData(otherOcean){
    locationInformation = document.getElementById("locationInformation")
    let fishFact = document.createElement("p")
    fishFact.innerText = `Did you know the ${otherOcean} has a gajillion fish and a tiny turtle that looks like this? Plz save it!`
    let fishPic = document.createElement("img")
    fishPic.src = `./images/turtle.png`
    fishPic.className = "turtlePic"
    locationInformation.append(fishFact, fishPic)

}
function getOtherData(country){
    // fetch(`https://api.api-ninjas.com/v1/country?name=${country}`, {headers: {
    //     'X-Api-Key': 'F4oBJay/tpdTNseprIXS6w==jeUoJ74InQ3ksOZw'
    //   }})
    //     .then(res=>res.json)
    //     .then(data=> {
    //         console.log(data)
    //     })
    let otherData;
    $.ajax({
        method: 'GET',
        url: `https://api.api-ninjas.com/v1/country?name=${country}`,
        headers: { 'X-Api-Key': 'F4oBJay/tpdTNseprIXS6w==jeUoJ74InQ3ksOZw'},
        contentType: 'application/json',
        success: function(result) {
            // console.log(result);
            otherData = result[0]
            console.log(otherData)
            locationInformation = document.getElementById("locationInformation")
            let GDP = document.createElement("p")
            GDP.innerText = `GDP: ${otherData.gdp}`
            let population = document.createElement("p")
            population.innerText = `Population: ${otherData.population}`
            locationInformation.append(GDP, population)
        },
        error: function ajaxError(jqXHR) {
            console.error('Error: ', jqXHR.responseText);
        }
    });
}

// Gets antipodal lat/long from any input lat/long
function antipodal(lat, long){
    antiLat = -lat;
    antiLong;
    if (long>0){
        antiLong = long-180;
    } else antiLong = long+180
    return [antiLat, antiLong];
}

// Does the INITIAL render of both the home map and the otherSide map based on a placeholder Lat/Long- needs to be put as a script into a div/body tag
function initialize() {
    geocoder = new google.maps.Geocoder();
    let latlng = new google.maps.LatLng(1.290270, 103.851959);
    let mapOptions = {
        zoom: 8,
        center: latlng
    }
    map = new google.maps.Map(document.getElementById("map_canvas1"), mapOptions);
    map2 = new google.maps.Map(document.getElementById("map_canvas2"), mapOptions);

}

// Renders map based on lat/long (used to render other side of the world map)
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

// Renders map based on address (used to render home location)
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


function renderOtherTime(dateObj){
    document.getElementById("otherSideTime").innerText = `Time at your new location: ${dateObj}`

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
            // If any weather is already displayed, delete all of those elements and replace with weather of new location
            if (document.getElementsByClassName("weatherCard").length > 0){
                Array.from(document.getElementsByClassName("weatherCard")).forEach(e => e.remove())
                weatherBar = document.createElement("div")
                weatherBar.className = "weatherBar"
            }
            data.hourly.forEach(hour => renderHourlyWeather(hour))
            renderOtherTime(dateObj)
            // renderHomeTime(homeDateObj)
        })
    }

    function getLocalTime(lat, long){
        fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${long}&units=metric&appid=be2354ee5a7e54a4a66d585d0b51ea8c`)
            .then(response => response.json())
            .then(data => {
    
                let dt;
                dt = data.current.dt
                timezone_offset = data.timezone_offset
                dateObj = formatDT(dt, timezone_offset)
                document.getElementById("homeTime").innerText = `Time at your current location:: ${dateObj}`            
            })
        }

// takes data of hourly weather and places it into the Weather Card in the OtherSide Display
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

// Gets icon for a given weather pattern
function determineIcon(icon) {
    return `https://openweathermap.org/img/wn/${icon}.png`
}

// Formats date/time based on input from weather API
function formatDT(dt, timezone_offset) {
    let dateObj = new Date(((dt + timezone_offset) * 1000));
    utcString = dateObj.toUTCString();
    return time = utcString.slice(-12, -7);
}

codeLatLng(-1.29027, -76.148041)