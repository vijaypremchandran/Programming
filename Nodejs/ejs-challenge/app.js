//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
// require lodash to convert the resource parameters to lower case before finding a match.
const ldsh = require('lodash');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Add a global variables to capture all your posts from the compose page and save it an an array.

const Posts = [];

// Get the route request and render the home page from ejs.
// move the home page content to the home.ejs.

//from the root, render the landing page.
app.get("/", function(req,res){
  res.render("home.ejs", {homeText : homeStartingContent, blogPost : Posts});
});

// when home is clicked, href on this link does this post.
app.get("/home", function(req,res){
  res.render("home.ejs", {homeText : homeStartingContent, blogPost : Posts});
});

// when about is clicked, href on this link does this post.
app.get("/about", function(req,res){
  res.render("about.ejs", {aboutText : aboutContent});
});

// when contact is clicked, href on this link does this post.
app.get("/contact", function(req,res){
  res.render("contact.ejs", {contactText : contactContent});
});

//creating a get for compose page.
app.get("/compose", function(req,res){
  res.render("compose.ejs");
});

//catch the post from the form in compose page..
app.post("/compose", function(req,res){

  var blog = {Title : req.body.blogTitle,
              Post  : req.body.blogPost} 
  
  //  save the posts inside global variables.
  Posts.push(blog);

  // redirect the page back to the home page
  // res.render("home.ejs", {homeText : homeStartingContent});
  res.redirect("/");  


});

// add a get example for the resource parameter. This can be removed later ..
// The posts are in title case and each time it is not possible to pass the same case so using lodash to convert to lower case..

app.get("/posts/:blogName", function(req,res){
    const requestedTitle = ldsh.lowerCase(req.params.blogName);
    
    Posts.forEach(function(post){
      const storedTitle = ldsh.lowerCase(post.Title);

      if(requestedTitle === storedTitle){
        // render the post pages with the requested posts.. 
        res.render("post.ejs",{postBlog : post});
      }else{
        console.log("Not a match")
      }
    });
});







app.listen(3000, function() {
  console.log("Server started on port 3000");
});
