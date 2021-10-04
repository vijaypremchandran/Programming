// Import AWS SDK.
const AWS = require('aws-sdk');
const fs = require('fs');

//set the access credentials.
const s3 = new AWS.S3({
    accessKeyId : process.env.ID,
    secretAccessKey : process.env.SECRET
});

// upload a file id_rsa to the aws bucket.

const uploadFile = (fileName) => {
    // Read content from the file
    const fileContent = fs.readFileSync(fileName);

    // Setting up S3 upload parameters
    const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: process.env.FILE_NAME,
        Body: fileContent
    };

    // Uploading files to the bucket
    s3.upload(params, function(err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};

uploadFile('id_rsa');