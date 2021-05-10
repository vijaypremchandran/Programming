// This script will connect to a local mongo db.

//Require modules 
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert'); // all error handling.

//Constant URL.
const url = 'mongodb://localhost:27017';

//Database Name, Creates one of it does not exists.
const dbName = 'fruitDB';

//Create a new Mongo client.
const client = new MongoClient(url,{useUnifiedTopology: true});

//Use connect method to connect to the server.
client.connect(function(err){
    assert.equal(null,err);
    console.log("connected successfully to the server");

    const db = client.db(dbName);

    client.close();
})