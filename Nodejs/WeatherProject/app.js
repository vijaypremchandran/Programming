//import necessary modules
const express = require("express");
const https = require("https");

const app = express();

// Second add get to the root folder.
app.get("/", function(req,res) {
    res.send("server is up and running ");
    
    // going to call a api to bring the local whether info.
    const url = "https://api.openweathermap.org/data/2.5/weather?q=ohio&appid=424bd5cc35b5f6769f2d9e6bee87b052&units=imperial"

    https.get(url, function(response){
        console.log(response.statusCode);

        response.on("data", function(data){
         const weatherData = JSON.parse(data);  // covert the Hexa data to JSON.
        //   console.log(data); 

         const weatherDataStrng = JSON.stringify(weatherData); // convert the JSON to string
        //  console.log(weatherDataStrng);

        // traverse the JSON object and get the required information. 
        const temp = weatherData.main.temp;
        const feelsLike = weatherData.main.feels_like;
        const tempMin = weatherData.main.temp_min;
        const tempMax = weatherData.main.temp_max;
        const description = weatherData.weather[0].description;

        console.log("Temp       : " + temp);
        console.log("Feels Like : " + feelsLike);
        console.log("Min Temp   : " + tempMin);
        console.log("Max Temp   : " + tempMax);
        console.log("Description: " + description);
        })
    })

});

// First step is to Open a port and listen for any request.
app.listen(3000, function(){
    console.log('server started and running on port 3000');
});