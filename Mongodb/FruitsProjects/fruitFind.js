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

//Use connect method to connect to the server and insert records.
async function run() {
    try {
      await client.connect();
      const db = client.db(dbName);
      const fruits = db.collection("fruits")
      
      // To read the data inserted.
      const findFruits = await fruits.findOne(
          {
              "name" : "Apple"
          }
      )
      console.log(findFruits);
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);