// let map;

// function initMap( lat= -34.397, lng= 150.644) {
//   map = new google.maps.Map(document.getElementById("map"), {
//     center: { lat: -34.397, lng: 150.644 },
//     zoom: 8,
//   });
// }

// window.initMap = initMap;


//weather api 
fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=40.74&lon=-73.99&appid=be2354ee5a7e54a4a66d585d0b51ea8c`)
    .then(response => response.json())
    .then(data => console.log(data))