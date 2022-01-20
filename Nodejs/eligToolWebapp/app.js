// This app is used to get the information from a form and create a test accum layout
require('dotenv').config()
//Require all modules.
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const fs = require('fs');
const uuid = require('uuid').v1;
const multer  = require('multer');
const path = require('path');
const alert = require('alert');
var spawn = require('child_process').spawn;
const { exec } = require("child_process");
const readline = require('readline');


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const os = require('os');

// Define constants..
PORT = process.env.PORT || 3000;

const uploadPath = process.env.uploadPath
const server = process.env.Robin
const userName = process.env.userName
var memDetails = [];

//path of accum file
const localPath = __dirname + "\\uploads\\accum_test" + "_" + uuid() + ".txt"
//path of X12 file
const localx12Path = __dirname + "\\uploads\\X12_test" + "_" + uuid() + ".txt"
//path of cardh file
const localCa29Path = __dirname + "\\uploads\\CA29_test" + "_" + uuid() + ".txt"

const fileUpload = multer({ dest: __dirname + "\\uploads\\" })

//Run post variables 
const remoteDir = process.env.DIR;
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

//Variable to pass the message from the app to the alert messages.
var appMessage ={
  messageStatus : "N",
  message : " "
}

//get the root request and send the HTML form.
app.get('/', (req, res) => {
    //empty measage when posting to the root request
    // appMessage.messageStatus = "N";
    // appMessage.message = " ";
    // runLog = "Sysout will be written here ( information only)";
    // res.render("index.ejs", {altMessage : appMessage,logs : runLog});
    res.render("index.ejs");
  })
  
//get the create request to render the create.ejs
app.get('/create',(req,res) => {
    //empty measage when posting to the root request
    appMessage.messageStatus = "N";
    appMessage.message = " ";
    runLog = "Sysout will be written here ( information only)";
    res.render("create.ejs", {altMessage : appMessage,logs : runLog});
})

//get the load request to render the load.ejs
app.get('/load',(req,res) => {
  //empty measage when posting to the root request
  appMessage.messageStatus = "N";
  appMessage.message = " ";
  runLog = "Sysout will be written here ( information only)";
  res.render("load.ejs", {altMessage : appMessage,logs : runLog});
})

//get the home route and redirect to the root route.
app.get('/Home',(req,res) => {
  res.redirect('/');
})

//get the post request for sending X12/cardh route.
app.post('/sendFile', (req,res) => {
  console.log("cathching route for send any file based on option..")

  const fileType = req.body.runType
  console.log("file type :" + fileType);

  //set the name of the files based on the file type.
  var filePath = ' ';

  if (fileType == 'X12'){
    filePath = localx12Path;
  }else if(fileType == 'Cardh29'){ 
    filePath = localCa29Path;
  }else if(fileType == 'Accum'){
    filePath = localPath;
  }else{
    console.log("Wrong file type choosen.");
  }

  const destPath = userName + '@' + server + ':' + uploadPath;
  console.log(destPath);
   
  //send the file to the server.
  console.log("copy begins...");

  var executor = spawn("scp", [filePath, destPath]);
  
  executor.stderr.on('data', function(data) {
      console.log(data.toString());
  });
  
  executor.stdout.on('data', function(data) {
      console.log(data.toString());
  });
  
  executor.stdout.on('end', function(data) {
      console.log("copied");
  });
  
  executor.on('close', function(code) {
      if (code !== 0) {
          console.log('Failed: ' + code);
      }else{
        //Delete the file that was sent to the server.
        fs.unlink(filePath,function(err,data){
          if (err){
            return console.log(err);
          }
        })
      }
  });

  // res.redirect('/');
  const fileName = path.basename(filePath); 

  appMessage.messageStatus = "Y";
  appMessage.message = `File ${fileName} copied to server`;
  res.render("create.ejs", {altMessage : appMessage,logs : runLog});

})

//get the post request for //uploadFile
app.post('/uploadFile', fileUpload.single('uploaded_file'), (req,res) => {
  console.log('catching upload path');
  // console.log(req.file.filename);

  //rename file based on the file type.
  const fileType = req.body.runType

  if (fileType == 'X12'){
    filePath = localx12Path;
  }else if(fileType == 'Cardh29'){ 
    filePath = localCa29Path;
  }else if(fileType == 'Accum'){
    filePath = localPath;
  }else{
    console.log("Wrong file type choosen.");
  }

  //once uploaded rename the file so that send file can pick this file.
  fs.rename(__dirname + "\\uploads\\" + req.file.filename , filePath, (error) => {
    if (error) {
        
      // Show the error 
      console.log(error);
    }
    else {
    
      // List all the filenames after renaming
      console.log("\nFile Renamed Successfully\n");
    }
  });
  // res.redirect('/');
  //move the message to the screen

  const fileName = path.basename(filePath); 

  appMessage.messageStatus = "Y";
  appMessage.message = `Uploaded File is ${fileName}`;
  res.render("create.ejs", {altMessage : appMessage,logs : runLog});
})

//get the post request from the root route.
app.post('/accumFileGen', (req,res) => {

    //function to find the sign of a num.
    function getSign(num){
        var amtSign = '';
        if (Math.sign(num) >= 0){
           return amtSign = '+';
        } else {
           return amtSign = '-'; 
        }
    }
    
    // function to pad a number 
    function leftFillNum(num, targetLength) {
        return num.toString().padStart(targetLength, 0);
    }
    //get the form fields and save to const here.
    const tranType = req.body.tranType;
    const cardNum = req.body.cardNum;
    const memNum = req.body.memNum;
    const spoNum = req.body.spoNum.padStart(8,'0');
    const lastName = req.body.lastName.padEnd(20);
    const firstName = req.body.firstName.padEnd(15);
    const birthDate = req.body.birthDate;
    const copayAmt = req.body.copayAmt;    
    const copayAmtSign = getSign(copayAmt)
    const copayAmtAbs = leftFillNum(Math.abs(copayAmt),7);
    const totAmt = req.body.totAmt;
    const totAmtSign = getSign(totAmt);
    const totAmtAbs = leftFillNum(Math.abs(totAmt),7);
    const rollDate = req.body.rollDate;
    const altGrpId = req.body.altGrpId.padEnd(20);
    const medDed = req.body.medDed
    const medDedSign = getSign(medDed);
    const medDedAbs = leftFillNum(Math.abs(medDed),9);
    const medMax = req.body.medMax
    const medMaxSign = getSign(medMax);
    const medMaxAbs = leftFillNum(Math.abs(medMax),9);
    const medOop = req.body.medOop
    const medOopSign = getSign(medOop);
    const medOopAbs = leftFillNum(Math.abs(medOop),9);

    // construct the record layout
    const rec = tranType + cardNum + memNum + spoNum + lastName +
                firstName + birthDate + copayAmtSign + copayAmtAbs + 
                totAmtSign + totAmtAbs + rollDate + altGrpId + 
                medDedSign + medDedAbs + medMaxSign + medMaxAbs +
                medOopSign + medOopAbs + '\n' 

    fs.appendFile(localPath, rec, function (err,data) {
        if (err) {
          return console.log(err);
        }
      });
    
      const fileName = path.basename(localPath);  
          
      // alert(`filename :${fileName} `);

      //move message to show the file name on the screen.
      appMessage.messageStatus = "Y";
      appMessage.message = `Generated File is ${fileName}`;
  
    res.render("create.ejs", {altMessage : appMessage,logs : runLog});
})

// get the app route for X12 file gen
app.post('/x12FileGen',(req,res) => {    

    const formData = {
      subscriber        : req.body.x12Subscriber,
      cardHolderNum     : req.body.x12cardNum,
      memNum            : req.body.x12memNum,
      relCode           : req.body.x12relCode,
      altGrpId          : req.body.x12altGrpId,
      dxid              : req.body.x12dxId,
      zzid              : req.body.x12zzId,
      x1223id           : req.body.x1223Id,
      lastName          : req.body.x12lastName,
      firstName         : req.body.x12firstName,
      SSN               : req.body.x12ssnNum,
      dateOfBirth       : req.body.x12birthDate,
      genderCode        : req.body.x12genderCode,
      covlvlCode        : req.body.x12covlvlCode,
      begDate           : req.body.x12begDate,
      endData           : req.body.x12endDate,
      chgDate           : req.body.x12chgDate
    }

    console.log("formData items :" + Object.keys(formData).length);

    //get the format type.
    const fmtType = req.body.runType;

    console.log("Format Type :" + fmtType);

    // create either x12 form the template or build a cardh29 from the fields.
    if (fmtType == 'X12'){
        console.log("creating X12 format !!");
        const x12sourceFle = path.join(__dirname,'uploads','X12_Template.txt');

         //Read the file into data.
         try {
             var data = fs.readFileSync(x12sourceFle, 'utf8');

             var re = new RegExp(Object.keys(formData).join("|"),"gi");
  
             data = data.replace(re, function(matched){
              return formData[matched];
            });

            fs.appendFile(localx12Path, data, function (err) {
              if (err) {
                return console.log(err);
              }
            });

            const fileName = path.basename(localx12Path);  
          
            appMessage.messageStatus = "Y";
            appMessage.message = `Generated File is ${fileName}`;
            
          } catch (err) {
            console.error(err);
          };
    } else{
        console.log("creating cardh29 format !!");

        const cardNum   = formData.cardHolderNum;
        const memNum    = formData.memNum;
        const altGrpId  = formData.altGrpId.padEnd(20);
        const tranID    = '400';
        const effDate   = formData.begDate;
        const termDate  = formData.endData;
        const chgDate   = formData.chgDate;
        const covType   = req.body.x12covType; // this field should be passed manually. form has a seperate field for cov level and 3 alpha.
        const lastName  = formData.lastName.padEnd(20);
        const firstName = formData.firstName.padEnd(15);
        const midName   = ' ';
        const birthDate = formData.dateOfBirth;
        const Gender    = formData.genderCode; 
        const addrLn1   = req.body.x12addrLn1.padEnd(40);
        const addrLn2   = req.body.x12addrLn2.padEnd(40);
        const city      = req.body.x12city.padEnd(15);
        const state     = req.body.x12state;
        const Zip5      = req.body.x12zip5;
        const Zip4      = req.body.x12zip4.padEnd(26); //padding spaces for PCP number and Effective date that is not used in general.
        const numOnCard = formData.x1223id.padEnd(20);
        const altCard   = formData.zzid.padEnd(15); // padding for cobra flag and soj
        const relCode   = formData.relCode; // after this all are not critical.


        // construct the record layout
        const cardrec = cardNum + memNum + altGrpId + tranID +
                        effDate + termDate + chgDate + covType + 
                        lastName + firstName + midName + birthDate + 
                        Gender +  addrLn1 +  addrLn2 +  city + 
                        state + Zip5 + Zip4 + numOnCard + 
                        altCard + relCode + '\n'

        //write to the file. localCa29Path
        fs.appendFile(localCa29Path, cardrec, function (err) {
          if (err) {
            return console.log(err);
          }
        });

        const fileName = path.basename(localCa29Path);
        appMessage.messageStatus = "Y";
        appMessage.message = `Generated File is ${fileName}`; 
      }
    
    
    
    // This is to retain the value on the fileds to help us resubmit with the same values with minor alternations. We may need to have a clear button once all info is entered
    // res.render("index.ejs", {altMessage : appMessage,logs : runLog});

    // alert(`filename :${fileName} `);
    res.render("create.ejs", {altMessage : appMessage,logs : runLog});
});

//get the post for runElig.
app.post('/runElig', (req, res) => {
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
    var buildCommand = 'sh app_cardhX12.sh' + ' ' + '-c' + ' ' + parms.clientID + ' ' + '-d' + ' ' + parms.runDate + ' ' +
                         '-b' + ' ' + batchSeqNum + ' ' + '-f' + ' ' + parms.filename;
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

  var remoteCommand = `ssh ${userName}@${parms.runEnv} "cd ${remoteDir}; ${buildCommand}"`
  console.log(remoteCommand);

  // var tempTst ='ssh vchandran@Robin "cd /usr/devl/users/vchandran/tstshl/elig_cardh29; sh test.sh"'
  // ssh into robin and run the shell scripts using child process.
  exec(remoteCommand, (error, stdout, stderr) => {
    // console.log(`error : ${error}  stdout : ${stdout} stderr : ${stderr}`)
    //Have the default success message so that we know the process completed on the no log mode.
    runLog = " !! Process completed fine !! "    
    
    if (parms.logMode == "logs"){
      if(error){
        runLog = remoteCommand + '\n' + error;
      } else {
        runLog = remoteCommand + '\n' + stderr + '\n' + stdout; 
      };
    }

    appMessage.messageStatus = "Y";
    appMessage.message = `Process completed fine @${parms.runEnv}`;
    res.render("load.ejs", {altMessage : appMessage,logs : runLog});
  });  
});

// start the app and listen to port 3000;
app.listen(PORT, () => {
    console.log(`App started and listening at http://localhost:${PORT}`);
})