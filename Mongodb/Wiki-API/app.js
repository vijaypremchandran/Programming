// This app uses mongoDB to store the wiki of learning concept and this
// demos the client server api concepts.

// Get all the required modules for running this app.
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// Make the app use ejs and body parser and other resources in the public folder.
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Set up mongodb 
const mongoose = require('mongoose');

// Make a connection to the Wiki db.. 
mongoose.connect("mongodb://localhost:27017/wikiDB",{ useNewUrlParser: true, useUnifiedTopology: true  });

//Create a Schema .. 
const articleSchema = new mongoose.Schema({
    title   : String,
    content : String 
});

//Create a Collection..
const Article = mongoose.model("Article", articleSchema);

// get route for the articles( GET)
app.get('/articles', function(req,res){
    Article.find(function(err,foundArticles){
        // console.log(foundArticles);
        if(!err){
            res.send(foundArticles);
        }else{
            res.send(foundArticles);
        }        
    });
});


// start the server at port 3000.
app.listen(3000, function(){
    console.log("Server started at port 3000");
});