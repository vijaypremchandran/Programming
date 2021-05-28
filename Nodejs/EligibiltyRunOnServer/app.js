// Require all the modules needed for this app.
const express = require('express');
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

const {NodeSSH} = require('node-ssh');
const os = require('os');
const ssh = new NodeSSH();

// Define constants..
const port = 3000;
const userName = os.userInfo().username;
const remoteDir = '/media/cobol/users/vchandran/workspace/ProductionCodeVersion1/Shellscripts/Eligibilty_Run';
var parms = {
    filename : " ",
    clientID : " ",
    runDate  : " ",
    runType  : " "
}

var runLog = 'Sysout will be written here ';

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
  console.log(parms); 

//check the run type to call the respective process.
if(parms.runType == "X12"){
  // Dynamically populate pgm form user input.
  var buildCommand = 'sh X12_run.sh' + ' ' + parms.filename + ' ' + parms.clientID + ' ' + parms.runDate;
}else if(parms.runType == "accum"){
  var buildCommand = 'sh accum_run.sh' + ' ' + parms.filename + ' ' + parms.clientID + ' ' + parms.runDate;
}else if(parms.runType == "Cardh29"){
  var buildCommand = 'sh Cardh29_app_run.sh' + ' ' + parms.filename + ' ' + parms.clientID + ' ' + parms.runDate;
}else{
    console.log("wrong choice");
}

console.log('build commmand : ' + buildCommand);

// Connect to the remote server and then run the shell to load eligibilty.
ssh.connect({
  host: '***.**.***.**', //Put your ssh IP address.
  username: userName,
  privateKey: `C:\\Users\\${userName}\\.ssh\\id_rsa`
})

.then(function() {       
  //  Command
   ssh.execCommand(buildCommand, { cwd:remoteDir }).then(function(result) {
  //   console.log('STDOUT: ' + result.stdout)
  //   console.log('STDERR: ' + result.stderr)
    runLog = result.stdout + '\n'  +result.stderr ;
    res.render("index.ejs", {logs : runLog});
    })
  }) 
});



// start the app and listen to port 3000;
app.listen(port, () => {
    console.log(`App started and listening at http://localhost:${port}`);
})
