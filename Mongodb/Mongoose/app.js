// This script will connect to a local mongo db.

//Require modules 
const mongoose = require('mongoose');

//make a connection.
// mongoose.connect("mongodb://localhost:27017/fruitDB",{ useNewUrlParser: true, useUnifiedTopology: true  })

//create a schema.. 
// const fruitSchema = new mongoose.Schema({
    // name : String,
    // rating : Number,
    // review : String
// });

//Create a collection.
// const Fruit = mongoose.model("Fruit", fruitSchema);

//Construct the record with 
// const fruit = new Fruit({
    // name : "Apple",
    // rating : 7,
    // review :"pretty solid as fruit."
// });

//fruit.save();

//make a connection to a new db, when making a connection if the DB is not present, will create one.
mongoose.connect("mongodb://localhost:27017/personDB",{ useNewUrlParser: true, useUnifiedTopology: true  })

//create a Schema..
const personShema = new mongoose.Schema({
    name : String,
    age  : Number,
    type : String
});

//Create a Collection.
const Person = mongoose.model("Person", personShema );

//Construct the record with the above collection.
// const person = new Person({
    // name : "Vijay",
    // age : 37,
    // type : "Good man"
// });

//person.save();

// find everything that is on the person schema 
Person.find(function(err,persons){
    if(err){
        console.log(err);
    }else {
        persons.forEach(function(person){
            console.log(person.name);
        })
        mongoose.connection.close();
    }
})