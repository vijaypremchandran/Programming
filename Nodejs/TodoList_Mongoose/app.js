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

// create default items list for the item model.
const item1 = new Item({
    name : "How"
});

const item2 = new Item({
    name : "are"
});

const item3 = new Item({
    name : "U"
});

const defaultItems = [item1,item2,item3];
// create default items ends.. 

//Create a new schema that would tie back to itemSchema.
const listSchema = {
    name : String,
    items:[itemSchema]
};

//Create a model for the listSchema.. 
const List = mongoose.model("list",listSchema);

//get the default root / and send some response.
app.get("/", function(req,res){
    
    Item.find({},function(err,docs){
        if(err){
            console.log(err);
        }
        res.render("list", {listName   : "Today",
            newListItems : docs});
    }) 
    
});

app.post("/", function(req, res){
    const item = req.body.newItem;
    const listName = req.body.list;
    console.log(listName);
    // save the document to the model.
    const item1 = new Item({name : item});

    if(listName === "Today"){
        item1.save(function(err){
            if(err){
                console.log("Save error on the new item - default list");
            }
            res.redirect("/");
        }); 
    } else {
        List.findOne({name : listName}, function(err, foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }
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

//handle dyanamic route with the route parameters.. 
app.get("/:listType", function(req,res){
    
    const listType = req.params.listType;

    //find the model if the same list type exists.. 
    List.findOne({name:listType},function(err,docs){
        if (err){
            console.log(err);
        }
        // check if we found a document in the ID, passed as parameter..
        if(docs){
            // console.log("Lists exists..");
            //show the list..
            res.render("list", {listName   : docs.name,
            newListItems : docs.items});
        }else{
            // console.log("Lists does not exists");
            // Create a new default list..
            // build a document 
            const list = new List({
                name : listType,
                items: defaultItems
            })
        
            //save the items to the list
            list.save(function(err){
                if(err){
                    console.log("error in saving the List model");
                }
            });
            res.redirect("/" + listType )
        }
    })
})

//start the server and listen at port 3000.
app.listen(3000, function(){
    console.log("server started and listening at local port 3000");
});