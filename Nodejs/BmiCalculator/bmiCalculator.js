// BMI Calculator app.

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req, res){

    var weight = Number(req.body.weight);
    var height = Number(req.body.height);

    var bmi = Number.parseFloat(703 * (weight/(height*height))).toPrecision(4);

    res.send(" Your bmi is " + bmi);
})

app.listen(3000, function(){
    console.log("server started and listening at port 3000");
})