var AWS = require('aws-sdk');

// var myCredentials = new AWS.CognitoIdentityCredentials({IdentityPoolId:'AKIA543BN7XVSITP5FHC'});
// var myConfig = new AWS.Config({
//   credentials: myCredentials, region: 'us-west-2'
// });

AWS.config.getCredentials(function(err) {
    if (err) console.log(err.stack);
    // credentials not loaded
    else {
      console.log("Access key:", AWS.config.credentials.accessKeyId);
    }
  });