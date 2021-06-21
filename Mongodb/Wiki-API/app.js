// This app uses mongoDB to store the wiki of learning concept and this
// demos the client server api concepts.

// Get all the required modules for running this app.
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// Make the app use ejs and body parser and other resources in the public folder.
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Set up mongodb 
const mongoose = require('mongoose');

// Make a connection to the Wiki db.. 
mongoose.connect("mongodb://localhost:27017/wikiDB",{ useNewUrlParser: true, useUnifiedTopology: true  });

//Create a Schema .. 
const articleSchema = new mongoose.Schema({
    title   : String,
    content : String 
});

//Create a Collection..
const Article = mongoose.model("Article", articleSchema);

// chaining routes handlers for the whole articles.. 
app.route('/articles')
    .get(function(req,res){
        Article.find(function(err,foundArticles){
            // console.log(foundArticles);
            if(!err){
                res.send(foundArticles);
            }else{
                res.send(foundArticles);
            }        
        });
    })
    .post(function(req,res){

        const newArticle = new Article({
            title   : req.body.title ,
            content : req.body.content
        }); 
    
        newArticle.save(function(err){
            if(!err){
                res.send(" Data saved to the DB ");
            }else{
                res.send(err);
            }
        });
    })
    .delete(function(req,res){
        Article.deleteMany(function(err){
            if(!err){
                res.send(" documents deleted successfully ");
            }else{
                res.send(err);
            }
        });
    });

// Chaining route handlers for specific documents.. 
app.route('/articles/:articleTitle')
    .get(function(req,res){
        Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
           if(foundArticle){
                res.send(foundArticle);
           }else {
                res.send("No articles matching that title was found");
           }   
        });
    })
    .put(function(req,res){
        Article.updateOne(
            {title: req.params.articleTitle},
            {title: req.body.title, content:req.body.content},
            function(err){
                if(!err){
                    res.send("sucessfully updated the document");
                } else {
                    res.send(err);
                }
            }

        );
    })
    .patch(function(req,res){
        Article.updateOne(
            {title : req.params.articleTitle},
            {$set: req.body},
            function(err){
                if(!err){
                    res.send(" successfully updated a field in the document");
                } else {
                    res.send(err);
                }
            }
        );
    })
    .delete(function(req,res){
        Article.deleteOne(
            {title : req.params.articleTitle},
            function(err){
                if(!err){
                    res.send(" Document deleted successfully ");
                } else {
                    res.send(err);
                }
            }
        );
    });

// start the server at port 3000.
app.listen(3000, function(){
    console.log("Server started at port 3000");
});