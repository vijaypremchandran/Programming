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
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

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
    password : String,
    googleId : String,
    secret : String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

// Create a model for the document.
const User = new mongoose.model("User",userSchema);

passport.use(User.createStrategy());

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
    //console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

//render the pages thru GET 

app.get("/",function(req, res){
    res.render("home");
})

app.get("/auth/google",
  passport.authenticate('google', { scope: ["profile"] }));
// passport.authenticate('google', {scope: 'https://www.googleapis.com/auth/plus.login'}));

app.get("/auth/google/secrets", 
passport.authenticate('google', { failureRedirect: "/login"}),
function(req, res) {
    User.find({"secret": {$ne: null}}, function(err, foundUsers){
        if (err){
            console.log(err);
        } else {
            if(foundUsers) {
                res.render("secrets", {usersWithSecrets: foundUsers});
            }
        }
    });
  //res.render("secrets");
});

app.get("/login",function(req, res){
    res.render("login");
})

app.get("/register",function(req, res){
    res.render("register");
})

app.get("/secrets", function(req, res){
    User.find({"secret": {$ne: null}}, function(err, foundUsers){
        if (err){
            console.log(err);
        } else {
            if(foundUsers) {
                res.render("secrets", {usersWithSecrets: foundUsers});
            }
        }
    });
});

app.get("/submit", function(req,res){
    if (req.isAuthenticated()){
        res.render("submit");
    }  else {
        res.redirect("/login");
    } 
});

app.post("/submit", function(req,res){
    
    const submittedSecret = req.body.secret;

    User.findById(req.user.id, function(err, foundUser){
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                foundUser.secret = submittedSecret;
                foundUser.save(function(){
                    res.redirect("/secrets");
                });
            }
        }
    });
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
