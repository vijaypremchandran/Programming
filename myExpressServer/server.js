const express = require("express");

const app = express();

app.get("/", function(req, res){
    res.send("index.html");
})

app.get("/contact", function(req, res){
    res.send("contact me @");
})

app.get("/about", function(req, res){
    res.send("I am a man.");
})

app.get("/blog", function(req, res){
    res.send("I write a blog here.");
})

app.listen(3000, function(){
    console.log("server started at port 3000");
});