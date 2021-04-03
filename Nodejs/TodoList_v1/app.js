// get the required modules using the require.

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

//get the default root / and send some response.

app.get("/", function(req,res){
    res.send("Hi there ");
});

//start the server and listen at port 3000.
app.listen(3000, function(){
    console.log("server started and listening at local port 3000");
});