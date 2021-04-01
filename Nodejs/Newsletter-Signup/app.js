//get the necessary package instiated.

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();
const mailchimp = require("@mailchimp/mailchimp_marketing")

//use the static files like images and style sheets.
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

//use the mailchimp credentials 
mailchimp.setConfig({ 
    apiKey: "0bec30a1902d50532081aa2fe41ac587-us1",
    server: "us1"
});

const listId = "1adc9e2656";


// get the initial page and respond
app.get("/", function(req,res){
    res.sendFile(__dirname + "/signup.html")
})

//get the post from the page ..

app.post("/", function(req,res){
    
    // get the data from the forms.
    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email;

    const subscribingUser = {
        firstName: req.body.fName,
        lastName: req.body.lName,
        email: req.body.email
      };

      async function run() {
          try {
            await mailchimp.lists.addListMember(listId, {
                email_address: subscribingUser.email,
                status: "subscribed",
                merge_fields: {
                  FNAME: subscribingUser.firstName,
                  LNAME: subscribingUser.lastName
                }
              });
            res.sendFile(__dirname + "/sucess.html");
          }
          catch (e) {
              console.log(`error ${e.message}`)
              res.sendFile(__dirname + "/failure.html");
          }
        
      }
      
      run();
});

//post from the failure page route.
app.post("/failure", function(req,res){
    res.redirect("/");
})

// start the server and make it listen on Port 3000 
app.listen(3000, function(){
    console.log("server started and listenning on port 3000");
})
