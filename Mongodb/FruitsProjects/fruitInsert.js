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
      const fruits = db.collection("fruits");
      // create an array of documents to insert
      const docs = [
        { name: "Apple", score: 1 },
        { name: "orange", score: 2 },
        { name: "grapes", score: 3 }
      ];
      // this option prevents additional documents from being inserted if one fails
      const options = { ordered: true };
      const result = await fruits.insertMany(docs, options);
      console.log(`${result.insertedCount} documents were inserted`);
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);