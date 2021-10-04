// This app get the user info frm a form. connects to the respective server and runs the batch
// job for eligibility process.
require('dotenv').config()
// Require all the modules needed for this app.
const express = require('express');
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
const path = require('path');
const AWS = require('aws-sdk');

const {NodeSSH} = require('node-ssh');
const os = require('os');
const ssh = new NodeSSH();

// Define constants..
PORT = process.env.PORT || 3000;
// const userName = os.userInfo().username;
const userName = process.env.userName;
const remoteDir = process.env.DIR;
// const rsaKey = path.join(__dirname,'id_rsa');


var parms = {
    filename : " ",
    clientID : " ",
    runDate  : " ",
    runType  : " ",
    runEnv   : " ",
    logMode  : " "
}

var connectIP = " ";

var runLog = 'Sysout will be written here ( information only) ';

// Read Private key from AWS and save it on a variable.!!!!

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

// Read aws s3 file ends !!!!!

// get the root request and send the index.html.
app.get('/', (req, res) => {
    res.render("index.ejs", {logs : runLog});
  })

app.post('/', (req, res) => {
  // get the fields from the form and use it in the pgm. 
  // console.log(req.body);
  parms.filename = req.body.flname;
  parms.clientID = req.body.clientId;
  parms.runDate = req.body.date; 
  parms.runType = req.body.runType;
  parms.runEnv = req.body.runEnv;
  parms.logMode = req.body.logMode;

  console.log(parms);
  
  //generate a random 8 digit number.
  function getRandom(length) {

    return Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1));
    
    }
  
  const batchSeqNum = getRandom(8);
  

  //check the run type to call the respective process.
  if(parms.runType == "X12"){
    // Dynamically populate pgm form user input.
    var buildCommand = 'sh hello.sh' ;
  }else if(parms.runType == "accum"){
    var buildCommand = 'sh accum_run.sh' + ' ' + parms.filename + ' ' + parms.clientID + ' ' + parms.runDate;
  }else if(parms.runType == "Cardh29"){
    var buildCommand = 'sh app_cardh29.sh' + ' ' + '-c' + ' ' + parms.clientID + ' ' + '-d' + ' ' + parms.runDate + ' ' +
                         '-b' + ' ' + batchSeqNum + ' ' + '-f' + ' ' + parms.filename;
  }else{
      console.log("wrong choice");
  }

  //sh app_cardh29.sh -c xu -d 0916 -b 36354134 -f TEST_VIJAY_TRMDTE.txt
  
  console.log('build commmand : ' + buildCommand);
  
  // populate the Ip address based on the users choice.
  if (parms.runEnv == 'Robin'){
    connectIP = process.env.Robin;
  }else if(parms.runEnv == 'Prodtest10'){
    connectIP = process.env.prodTest;
  }else if(parms.runEnv == 'Prod'){
    connectIP = process.env.prod;
  }else{
    console.log(' wrong server selected');
  }

  console.log ('connecting to ' + parms.runEnv + ' ' + 'on ip ..' + connectIP);

  //Fetch or read data from aws s3
  s3.getObject(getParams, function (err, data) {
  
    if (err) {
        console.log(err);
    } else {
        const rsaKey = data.Body.toString();
        // add the connect and run code here..
        ssh.connect({
          host: connectIP,
          username: userName,
          privateKey: rsaKey
        })
      
        .then(function() {       
          //  Command
           ssh.execCommand(buildCommand, { cwd:remoteDir }).then(function(result) {
          //   console.log('STDOUT: ' + result.stdout)
          //   console.log('STDERR: ' + result.stderr)
            if (parms.logMode == "logs"){
              runLog = result.stdout + '\n'  +result.stderr ;
            }else {
              runLog = 'Sysout will be written here ( information only) ';
            }
            res.render("index.ejs", {logs : runLog});
            })
          }) 
        // add ends!!
    }  
  });
 
});


// start the app and listen to port 3000;
app.listen(PORT, () => {
    console.log(`App started and listening at http://localhost:${PORT}`);
})