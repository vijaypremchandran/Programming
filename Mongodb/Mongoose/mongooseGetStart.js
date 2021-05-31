//Bring in all the required Mongoose modules..
const mongoose = require('mongoose');

//Connect to the DB, if you give a new one that does not exists it will create the DB for us.
mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true, useUnifiedTopology: true});

//Test connection.. 
const db = mongoose.connection;
db.on('error', console.error.bind(console,'connection error'));
db.once('open', function(){
    console.log('We are connected');
    // create a new schema for the kitten..
    const kittySchema = new mongoose.Schema({
      name : String  
    });

    //create a model with the above schema .. 
    const kitten = mongoose.model('Kitten', kittySchema);

    // Add a new kitten to the db.. 
    const silence = new kitten({name : 'Silence'});
    // console.log(silence.name);

    //save the kitty to the DB.
    silence.save(function(err,silence){
        if(err){
            console.log(err);
        }else {
            console.log('info saved :' + silence);
            // db.close();
        }
    });

    //find the kitty that we saved, this is getting executed first ?? due to asynchronous 
    kitten.find(function(err,kittens){
        if (err) return console.error(err);
        console.log(kittens);
        db.close();
    });

})


// close the connection finally when we are done..


