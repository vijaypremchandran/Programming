//jshint esversion:6

// use this to configure env variables as early as possible
require('dotenv').config();

// Get all the required modules for running this app.
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
//const encrypt = require ("mongoose-encryption");
//const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;


const app = express();

// Make the app use ejs and body parser and other resources in the public folder.
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//make the connection to Mongoose to the userDB.
mongoose.connect("mongodb://localhost:27017/userDB",{ useNewUrlParser: true, useUnifiedTopology: true  });

// create a user schema for mongoose encryption.
// const userSchema = new mongoose.Schema({
    // email : String,
    // password : String
// });

// create a user schema.
const userSchema = {
    email : String,
    password : String
};

// Using mongoose encrypt ( this is moved to the env file for security )
// const secret = "Thisisourlittlesecret";
// const secret = process.env.SECRET
// 
// userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

// Create a model for the document.
const User = new mongoose.model("User",userSchema);

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

// catch the post request from the register route.. 
app.post("/register", function(req,res){

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email   : req.body.username,
            password: hash
        });
    
        newUser.save(function(err){
            if (err) {
                console.log(err);
            } else {
                res.render("secrets");
            }
        });
    });    
});

// catch the login route ..
app.post("/login", function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email : username}, function(err,foundUser){
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {                
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    if (result === true){
                        res.render("secrets");
                    }
                });
            }
        }
    });
});

// start the server at port 3000.
app.listen(3000, function(){
    console.log("Server started at port 3000");
});
