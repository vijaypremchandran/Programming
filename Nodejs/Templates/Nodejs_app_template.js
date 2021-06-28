// This is standard Nodejs app template.

// Get all the required modules for running this app.
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// Make the app use ejs and body parser and other resources in the public folder.
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


// start the server at port 3000.
app.listen(3000, function(){
    console.log("Server started at port 3000");
});