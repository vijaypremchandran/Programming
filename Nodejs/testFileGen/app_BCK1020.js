// This app is used to get the information from a form and create a test accum layout
require('dotenv').config()
//Require all modules.
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const fs = require('fs');
const SftpUpload = require('sftp-upload');
const uuid = require('uuid').v1;
const multer  = require('multer');
const path = require('path');
const alert = require('alert');
const clipboardy = require('clipboardy');


const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const os = require('os');

// Define constants..
PORT = process.env.PORT || 3000;

const uploadPath = process.env.uploadPath
const server = process.env.server
const serverPort = process.env.serverPort
const userName = process.env.userName

//path of accum file
const localPath = __dirname + "\\uploads\\accum_test" + "_" + uuid() + ".txt"
//path of X12 file
const localx12Path = __dirname + "\\uploads\\X12_test" + "_" + uuid() + ".txt"
//path of cardh file
const localCa29Path = __dirname + "\\uploads\\CA29_test" + "_" + uuid() + ".txt"

const fileUpload = multer({ dest: __dirname + "\\uploads\\" })

//get the root request and send the HTML form.
app.get('/', (req, res) => {
    res.render("index.ejs");
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
   
  //send the file to the server.
  var options = {
    host:server,
    port:serverPort,
    username:userName,
    path: filePath,
    remoteDir: uploadPath,
    privateKey: fs.readFileSync('C:\\Users\\vchandran\\.ssh\\id_rsa'),
    dryRun: false,
  }
  
  sftp = new SftpUpload(options);

  sftp.on('error', function(err) {
    throw err;
  })
  .on('uploading', function(progress) {
      console.log('Uploading', progress.file);
      console.log(progress.percent+'% completed');
  })
  .on('completed', function() {
      console.log('Upload Completed');
      // Delete the file so that new file will be sent everytime after generate.
      fs.unlinkSync(filePath, function (err,data) {
        if (err) {
          return console.log(err);
        }
      });
  })
  .upload();  
  res.redirect('/');

})

//get the post request for //uploadFile
app.post('/uploadFile', fileUpload.single('uploaded_file'), (req,res) => {
  console.log('catching upload path');
  console.log(req.file.filename);

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

  console.log()
  //once uploaded rename the file so that send file can pick this file.
  fs.rename(__dirname + "\\uploads\\" + req.file.filename , filePath, (error) => {
    if (error) {
        
      // Show the error 
      console.log(error);
    }
    else {
    
      // List all the filenames after renaming
      console.log("\nFile Renamed\n");
    }
  });
  res.redirect('/');
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
          
      alert(`filename :${fileName} `);

      clipboardy.writeSync(fileName);
  
    res.render("index.ejs");
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
          
            alert(`filename :${fileName} `);
            clipboardy.writeSync(fileName);

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
        const Gender    = formData.genderCode.padEnd(128); //padding spaces for addr fields that are not critical.
        const numOnCard = formData.x1223id.padEnd(20);
        const altCard   = formData.zzid.padEnd(16); // padding for cobra flag and soj
        const relCode   = formData.relCode.padEnd(2); // after this all are not critical.


        // construct the record layout
        const cardrec = cardNum + memNum + altGrpId + tranID +
                        effDate + termDate + chgDate + covType + 
                        lastName + firstName + midName + birthDate + 
                        Gender +  numOnCard + altCard + relCode + '\n'

        //write to the file. localCa29Path
        fs.appendFile(localCa29Path, cardrec, function (err) {
          if (err) {
            return console.log(err);
          }
        });
      }
    
    const fileName = path.basename(localCa29Path);  
      
    res.render("index.ejs");

    alert(`filename :${fileName} `);
    clipboardy.writeSync(fileName);
});

// start the app and listen to port 3000;
app.listen(PORT, () => {
    console.log(`App started and listening at http://localhost:${PORT}`);
})