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
const clipboardy = require('clipboardy');
var spawn = require('child_process').spawn;
const readline = require('readline');


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
var memDetails = [];

//path of accum file
const localPath = __dirname + "\\uploads\\accum_test" + "_" + uuid() + ".txt"
//path of X12 file
const localx12Path = __dirname + "\\uploads\\X12_test" + "_" + uuid() + ".txt"
//path of cardh file
const localCa29Path = __dirname + "\\uploads\\CA29_test" + "_" + uuid() + ".txt"

const fileUpload = multer({ dest: __dirname + "\\uploads\\" })

//get the root request and send the HTML form.
app.get('/', (req, res) => {
    res.render("index.ejs", {x12tojsonDet : memDetails});
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
  
    res.render("index.ejs", {x12tojsonDet : memDetails});;
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
      }
    
    const fileName = path.basename(localCa29Path);  
      
    res.render("index.ejs", {x12tojsonDet : memDetails});

    alert(`filename :${fileName} `);
    clipboardy.writeSync(fileName);
});

// Get the post request for x12tojson
app.post('/x12tojson', (req,res) => {
    console.log("getting the post request for edi to json conversion");
    //X12 file the was created, converted to JSON for browsing purpose.
    var insCount = 0 ;

    //json object for key information from the file.
    
    var insData = {
        insIdentifier_00    : " ",
        insSubsID_01        : " ",
        insRelcode_02       : " ",
        insMainTypeCde_03   : " ",
        insMainRsnCde_04    : " ",
        insBenStatusCde_05  : " ",
        insMedStatusCde_06  : " ",
        insCobFlg_07        : " ",
        insEmpStatusCde_08  : " "
    }
    
    var ref0FData = {
        ref0F_00    : " ",
        ref0F_01    : " ",
        ref0F_02    : " "
    }
    
    var ref1LData = {
        ref1L_00    : " ",
        ref1L_01    : " ",
        ref1L_02    : " "
    }
    
    var dtpData = {
        dtpIndentifier_00       : " ",
        dtpDateTimeQualifier_01 : " ",
        dtpDateFormat_02        : " ",
        dtpDate_03              : " "
    }
    
    var nm1Data = {
        nm1Identifier_00            : " ",
        nm1EntityIdentifierCode_01  : " ", // insured or subscriber
        nm1EntityTpeQualifier_02    : " ",
        nm1LastName_03              : " ",
        nm1FirstName_04             : " ",
        nm1MiddleName_05            : " ",
        nm1NamePrefix_06            : " ",
        nm1NameSuffix_07            : " ",
        nm1IdentityCdeQual_08       : " ", // 34 = social security, ZZ = others
        nm1IdentityCode_09          : " ", // Social security number or others.
    
    }
    
    var n3Data = {
        n3Identifier_00     : " ",
        n3AdressLine1       : " ",
        n3AdressLine2       : " ",
    }
    
    var n4Data = {
        n4Identifier_00     : " ",
        n4CityName_01       : " ",
        n4State_02          : " ",
        n4Zip5_03           : " ",
    }
    
    var dmgData = {
        dmgIdentifier_00    : " ",
        dmgDateFmt_01       : " ",
        dmgDob_02           : " ",
        dmgGender_03        : " "
    }
    
    var outFile = {
        cardHolder  : " ",
        memNum      : " ",
        altGrp      : " ",
        tranCode    : "400",
        effData     : " ",
        termDate    : " ",
        chgData     : new Date().toISOString().slice(0, 10), // Change date is current date for now, change this if need to be used from the DTP segment later.
        covType     : " ",
        firstName   : " ",
        lastName    : " ",
        dateOfBirth : " ",
        genderCode  : " ",
        addressLin1 : " ",
        addressLin2 : " ",
        cityName    : " ",
        stateID     : " ",
        zipCde5     : " ",
        zipCde4     : "0000", // Keep it like const now and we can decide this later..
        relCode     : " "
    }
    
    // var memDetails = [];
    
    //Program mainline.
    const file = readline.createInterface({
        // input: fs.createReadStream(localx12Path),
        input: fs.createReadStream("X12_test_0bd5f790-42f7-11ec-80a7-13cadeef2fd0.txt"),
        output: process.stdout,
        terminal: false
    });
      
    //Read the file line by line.
    file.on('line', (line) => {
        // check the line and map it to the correspoding item on the ediDate.
        if(line.startsWith("INS")){
            //Remove "~" at the end of the line and split the string delimited by *
            const insDetails = line.substring(0,line.length -1 ).split("*");
    
            //move the fileds to the json obj
            insData.insIdentifier_00    = insDetails[0];
            insData.insSubsID_01        = insDetails[1];
            insData.insRelcode_02       = insDetails[2];
            insData.insMainTypeCde_03   = insDetails[3];
            insData.insMainRsnCde_04    = insDetails[4];
            insData.insBenStatusCde_05  = insDetails[5];
            insData.insMedStatusCde_06  = insDetails[6];
            insData.insCobFlg_07        = insDetails[7];
            insData.insEmpStatusCde_08  = insDetails[8];
    
            // validate the insRelcode and populate the relcode and coverageType, mem num and relcode of out file.
            if(insData.insRelcode_02 == '18'){
                outFile.memNum = '01';
            }else if(insData.insRelcode_02 == '01'){
                outFile.memNum = '02';
            }else{
                outFile.memNum = '19';
            }
        
            insCount+= 1;
    
        }else if(line.startsWith("REF")){
            const refDetails = line.substring(0,line.length -1 ).split("*");
    
            //move the fileds to json obj
            ref0FData.ref0F_00 = refDetails[0];
            ref1LData.ref1L_00 = refDetails[0];
            
            if (refDetails[01] == '0F'){
                ref0FData.ref0F_01 = refDetails[1];
                ref0FData.ref0F_02 = refDetails[2];
                outFile.cardHolder = ref0FData.ref0F_02;
            }else{
                ref1LData.ref1L_01 = refDetails[1];
                ref1LData.ref1L_02 = refDetails[2];
                outFile.altGrp = ref1LData.ref1L_02;
            }
        }else if (line.startsWith("DTP")){
            const dtpDetails = line.substring(0,line.length -1 ).split("*");
            dtpData.dtpIndentifier_00   = dtpDetails[0];
            dtpData.dtpDateTimeQualifier_01 = dtpDetails[1];
            dtpData.dtpDateFormat_02    = dtpDetails[2];
            dtpData.dtpDate_03          = dtpDetails[3];
    
            //check the Date and move to the appropritate out file fieldsl.
            if(dtpData.dtpDateTimeQualifier_01 == '348'){
                outFile.effData = dtpData.dtpDate_03;
            }else if (dtpData.dtpDateTimeQualifier_01 == '349'){
                outFile.termDate = dtpData.dtpDate_03;
            }else{
                outFile.chgData = dtpData.dtpDate_03;
            }
        }else if (line.startsWith("NM1")){
            const nm1Details = line.substring(0,line.length -1 ).split("*");
            nm1Data.nm1Identifier_00 = nm1Details[0];
            nm1Data.nm1EntityIdentifierCode_01 = nm1Details[1];
            nm1Data.nm1EntityTpeQualifier_02 = nm1Details[2];
            nm1Data.nm1LastName_03 = outFile.lastName = nm1Details[3];
            nm1Data.nm1FirstName_04 = outFile.firstName = nm1Details[4];
            nm1Data.nm1MiddleName_05 = nm1Details[5];
            nm1Data.nm1NamePrefix_06 = nm1Details[6];
            nm1Data.nm1NameSuffix_07 = nm1Details[7];
            nm1Data.nm1IdentityCdeQual_08 = nm1Details[8];
            nm1Data.nm1IdentityCode_09 = nm1Details[9];
        }else if (line.startsWith("N3")){
            const n3Details = line.substring(0,line.length -1 ).split("*");
            n3Data.n3Identifier_00 = n3Details[0];
            n3Data.n3AdressLine1 = outFile.addressLin1 = n3Details[1];
            n3Data.n3AdressLine2 = outFile.addressLin2 = n3Details[2];
        }else if (line.startsWith("N4")){
            const n4Details = line.substring(0,line.length -1 ).split("*");
            n4Data.n4Identifier_00 = n4Details[0];
            n4Data.n4CityName_01 = outFile.cityName = n4Details[1];
            n4Data.n4State_02 = outFile.stateID = n4Details[2];
            n4Data.n4Zip5_03 = outFile.zipCde5 = n4Details[3];
        }else if (line.startsWith("DMG")){
            const dmgDetails = line.substring(0,line.length -1 ).split("*");
            dmgData.dmgIdentifier_00 = dmgDetails[0];
            dmgData.dmgDateFmt_01 = dmgDetails[1];
            dmgData.dmgDob_02 = outFile.dateOfBirth = dmgDetails[2];
            dmgData.dmgGender_03 = outFile.genderCode =  dmgDetails[3];
            
        }else if (line.startsWith("IEA")){
            //This is the end of the member info. We should have a member set so push that to the array.
            memDetails.push(outFile);
            // console.log("No of Members" + " : " + insCount);
            // console.log(memDetails);
        }
        //render the details to the screen.
        // res.render("index.ejs", {x12tojson : memDetails});
    });
    //X12toJSON ends
    console.log("outside :" + memDetails);
    res.render("index.ejs", {x12tojsonDet : memDetails});
});

// start the app and listen to port 3000;
app.listen(PORT, () => {
    console.log(`App started and listening at http://localhost:${PORT}`);
})