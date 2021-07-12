//jshint esversion:6

// use this to configure env variables as early as possible
require('dotenv').config();

// Get all the required modules for running this app.
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();

// Make the app use ejs and body parser and other resources in the public folder.
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//make the connection to Mongoose to the userDB.
mongoose.connect("mongodb://localhost:27017/userDB",{ useNewUrlParser: true, useUnifiedTopology: true  });
mongoose.set("useCreateIndex", true);

// create a user schema.
const userSchema = new mongoose.Schema  ({
    email : String,
    password : String
});

userSchema.plugin(passportLocalMongoose);

// Create a model for the document.
const User = new mongoose.model("User",userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

app.get("/secrets", function(req, res){
    if (req.isAuthenticated()){
        res.render("secrets");
    }  else {
        res.redirect("/login");
    }
});

app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/");
});

// catch the post request from the register route.. 
app.post("/register", function(req,res){
    User.register({username: req.body.username}, req.body.password, function(err,user){
        if(err){
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secrets");
            })
        }
    })
});

// catch the login route ..
app.post("/login", function(req,res){
    const user = new User({
        username : req.body.username,
        password : req.body.password
    });

    req.login(user, function(err){
        if (err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secrets");
            })
        }
    })
});

// start the server at port 3000.
app.listen(3000, function(){
    console.log("Server started at port 3000");
});
