// The program will read a X12 file, Parse the records and gets the key information only.

//Require necessary module 
const fs = require('fs');
const readline = require('readline');

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

var memDetails = [];

//Program mainline.
const file = readline.createInterface({
    input: fs.createReadStream('sample_834.txt'),
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
        console.log("No of Members" + " : " + insCount);
        console.log(memDetails);
    }
});


