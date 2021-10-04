// Import AWS SDK.
const AWS = require('aws-sdk');

//set the access credentials.
const s3 = new AWS.S3({
    accessKeyId : process.env.ID,
    secretAccessKey : process.env.SECRET
});

//create a bucket.
const params = {
    Bucket: process.env.BUCKET_NAME,
    CreateBucketConfiguration: {
        LocationConstraint : "us-east-2"
    }
};

s3.createBucket(params, function(err, data) {
    if (err) console.log(err, err.stack);
    else console.log('Bucket Created Successfully', data.Location);
});