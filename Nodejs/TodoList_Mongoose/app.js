// get the required modules using the require.

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
// make our app use the ejs
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
// To use the css or images to serve to this website.
app.use(express.static("public"));

//create new database 
mongoose.connect("mongodb://localhost:27017/todoListDB",{ useNewUrlParser: true, useUnifiedTopology: true  });

//Create a new schema 
const itemSchema = new mongoose.Schema({
    name: String
});

//Create a model for the above schema ..
const Item = mongoose.model("Item",itemSchema);

//get the default root / and send some response.
app.get("/", function(req,res){
    
    let today = new Date();
    let currentDay = today.getDay();
    let day = "";
    let dayName = "";

    //check the day to find it is a weekday or weekend?
    if(currentDay === 6 || currentDay === 0){ 
        day = "Weekend";
    }else{      
        day = "Weekday";
    };
    
    // use the switch validation to print the the day of the week.
    switch(currentDay){
        case 0:
            dayName = "Sunday";
            break;
        case 1:
            dayName = "Monday";
            break;
        case 2:
            dayName = "Tuesday";
            break;
        case 3:
            dayName = "Wednesday";
            break;
        case 4:
            dayName = "Thursday";
            break;
        case 5:
            dayName = "Friday";
            break;
        case 6:
            dayName = "Saturday";
            break;
        default:
            console.log("Wrong day. check this.. " + currentDay)
    };
    Item.find({},function(err,docs){
        if(err){
            console.log(err);
        }
        res.render("list", {kindOfDay   : day, 
            kindDayName : dayName,
            newListItems : docs});
    }) 
    
});

app.post("/", function(req, res){
    let item = req.body.newItem;
    // save the document to the model.
    const item1 = new Item({name : item});
    item1.save(function(err){
        if(err){
            console.log("Save error on the new item");
        }
    })
    res.redirect("/");
});

//handle another post request from the form /delete.
app.post("/delete", function(req,res){
    checkedItem = req.body.checkbox
    Item.findByIdAndRemove(checkedItem, function(err){
        if(err){
            console.log("error on delete item ");
        }
    });
    res.redirect("/");
});

//start the server and listen at port 3000.
app.listen(3000, function(){
    console.log("server started and listening at local port 3000");
});