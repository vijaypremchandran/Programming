// get the required modules using the require.

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
// make our app use the ejs
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

let items = ["Buy food",
            "Cook food",
            "Eat food"];

//get the default root / and send some response.
app.get("/", function(req,res){
    // res.send("Hi there ");
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
    // send the page using the ejs..KindofDay is the let in the list.ejs file inside the View fldr. 
    res.render("list", {kindOfDay   : day, 
                        kindDayName : dayName,
                        newListItems : items});
});

app.post("/", function(req, res){
    let item = req.body.newItem;
    items.push(item);
    res.redirect("/");
});

//start the server and listen at port 3000.
app.listen(3000, function(){
    console.log("server started and listening at local port 3000");
});