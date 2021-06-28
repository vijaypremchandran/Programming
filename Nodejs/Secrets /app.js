//jshint esversion:6
// Get all the required modules for running this app.
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// Make the app use ejs and body parser and other resources in the public folder.
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//render the pages thru GET 

app.get("/",function(req, res){
    res.render("home");
})

app.get("/login",function(req, res){
    res.render("login");
})

app.get("/register",function(req, res){
    res.render("register");
})
// start the server at port 3000.
app.listen(3000, function(){
    console.log("Server started at port 3000");
});
