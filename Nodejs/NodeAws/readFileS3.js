// Import AWS SDK.
const AWS = require('aws-sdk');
require('dotenv').config();

//set the access credentials.
const s3 = new AWS.S3({
    accessKeyId : process.env.ID,
    secretAccessKey : process.env.SECRET
});

//construct getParam
var getParams = {
    Bucket: process.env.BUCKET_NAME,
    Key: process.env.FILE_NAME
}

//Fetch or read data from aws s3
s3.getObject(getParams, function (err, data) {

    if (err) {
        console.log(err);
    } else {
        console.log(data.Body.toString()); //this will log data to console
    }

});