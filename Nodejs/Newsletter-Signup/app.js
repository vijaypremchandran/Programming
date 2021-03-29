//get the necessary package instiated.

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();

//use the static files like images and style sheets.
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));


// get the initial page and respond
app.get("/", function(req,res){
    res.sendFile(__dirname + "/signup.html")
})

//get the post from the page ..

app.post("/", function(req,res){
    console.log("Posted to the server");
    // get the data from the forms.
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email;

    console.log(firstName +' '+ lastName +' '+ email)
});

// start the server and make it listen on Port 3000 
app.listen(3000, function(){
    console.log("server started and listenning on port 3000");
})