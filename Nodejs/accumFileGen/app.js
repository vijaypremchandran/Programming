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

const localPath = __dirname + "\\uploads\\accum_test" + "_" + uuid() + ".txt"

const fileUpload = multer({ dest: __dirname + "\\uploads\\" })

//get the root request and send the HTML form.
app.get('/', (req, res) => {
    res.render("index.ejs");
  })

// catch the send route..
app.post('/sendFile', (req,res) => {
    console.log('catching send file route')
    //connect to the server and put the file in the dir
    var options = {
      host:server,
      port:serverPort,
      username:userName,
      path: localPath,
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
        fs.unlinkSync(localPath, function (err,data) {
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
  //once uploaded rename the file so that send file can pick this file.
  
  fs.rename(__dirname + "\\uploads\\" + req.file.filename , localPath, (error) => {
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
app.post('/', (req,res) => {

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
    res.render("index.ejs");
})
// start the app and listen to port 3000;
app.listen(PORT, () => {
    console.log(`App started and listening at http://localhost:${PORT}`);
})