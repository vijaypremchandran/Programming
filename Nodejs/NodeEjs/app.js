var express = require('express');
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// define a json list that will be send to the screen.
var memDetails = [
    {
        name : "vijay",
        age  : 37,
        place : "Ohio"
    },
    {
        name : "Nandy",
        age  : 35,
        place : "Ohio"
    },
    {
        name : "Taylor",
        age  : 01,
        place : "Ohio"
    }
]

// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) {
  //test the js forEach command.
  memDetails.forEach(member => console.log(member));
  res.render('index.ejs',{memDetails : memDetails});
});

app.listen(3000);
console.log('Server is listening on port 3000');