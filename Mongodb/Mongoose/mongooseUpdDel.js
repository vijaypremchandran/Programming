// This script will connect to a local mongo db. Validate the variables that are passed
// and loads to personDB.

//Require modules 
const mongoose = require('mongoose');

//make a connection to a new db, when making a connection if the DB is not present, will create one.
mongoose.connect("mongodb://localhost:27017/personDB",{ useNewUrlParser: true, useUnifiedTopology: true  })

//create a Schema.. add the validation on the fields that are inserted.
const personShema = new mongoose.Schema({

    name    : {type : String, required : true},
    age     : {type : Number, min :1 , max : 70 },
    type    : String
});

//Create a Collection.
const Person = mongoose.model("Person", personShema );

//Construct the record with the above collection.
const person = new Person({
    name : "Nandhinie",
    age : 33,
    type : "Good mom"
});

// person.save();

// find everything that is on the person schema 
Person.find(function(err,persons){
    if(err){
        console.log(err);
    }else {
        persons.forEach(function(person){
            console.log(person);
        })
        //mongoose.connection.close();
    }
})

Person.updateOne({_id: "60b506e26a273a1ed1e27bf9"}, {name: "Nandy"}, function(err){
    if(err){
        console.log(err);
    }else{
        console.log("Update Sucessful..");
    }
} );

Person.deleteOne({_id: "60b5076557b7d21f0898d56e"}, function(err){
    if(err){
        console.log(err);
    }else{
        console.log("Delete Sucessful..");
    }
});

Person.deleteOne({_id: "60b5077a00c4071f11ee1c19"}, function(err){
    if(err){
        console.log(err);
    }else{
        console.log("Delete Sucessful..");
        mongoose.connection.close();
    }
});