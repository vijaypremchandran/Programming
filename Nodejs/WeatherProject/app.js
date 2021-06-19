//import necessary modules
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

// Second add get to the root folder.
app.get("/", function(req,res) {
    
    //Send the landing page.
    res.sendFile(__dirname + "/index.html")

    //post the form with the city name from the index page.
    app.post("/", function(req,res){

        const cityName = req.body.cityName
        // going to call a api to bring the local whether info.
        const query = cityName;
        const apiKey = '424bd5cc35b5f6769f2d9e6bee87b052';
        const unit = 'imperial';
        const url = "https://api.openweathermap.org/data/2.5/weather?q="+ query +"&appid="+ apiKey+"&units=" + unit

        https.get(url, function(response){
            // console.log(response.statusCode);

            //check the status code of the response if error give the the error message.
            if (response.statusCode === 200 ){
                response.on("data", function(data){
                    const weatherData = JSON.parse(data);  // covert the Hexa data to JSON.
                //   console.log(data); 
        
                //  const weatherDataStrng = JSON.stringify(weatherData); // convert the JSON to string
                //  console.log(weatherDataStrng);
        
                // traverse the JSON object and get the required information. 
                const temp          = weatherData.main.temp;
                const feelsLike     = weatherData.main.feels_like;
                const tempMin       = weatherData.main.temp_min;
                const tempMax       = weatherData.main.temp_max;
                const description   = weatherData.weather[0].description;
                const icon          = weatherData.weather[0].icon
                const imageURL      = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
        
                //format the output as list.
        
                const output = `<li>Temp       : ${temp}        </li>
                                <li>Feels Like : ${feelsLike}   </li>
                                <li>Min Temp   : ${tempMin}     </li>
                                <li>Max Temp   : ${tempMax}     </li>
                                <li>Description: ${description} </li>
                                <li>Condition  :                </li>
                                <img src = ${imageURL}>`
        
                res.send("Weather details for " + cityName + "\n" + output);
                })            
            }else{
                res.send("Bad response : " + response.statusCode);
            }
        })
    });
    

});

// First step is to Open a port and listen for any request.
app.listen(process.env.PORT || 3000, function(){
    console.log('server started and running on port 3000');
});