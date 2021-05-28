// Require all the modules needed for this app.
const express = require('express');
const path = require('path');
const formidable = require('formidable');
const fs = require('fs-extra');
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

const localFolder = `C:\\Users\\${userName}\\Documents\\Programming\\CompilePGM\\FilesToMove`;
const remoteDir = `/home/${userName}/NodejsCompile`;

var copyBookLines = [];

var compileLog = ' ';

// get the root request and send the index.html.
app.get('/', (req, res) => {
    // res.sendFile(path.join(__dirname, '/index.html'))
    res.render("index.ejs", {logs : compileLog});
  })

app.post('/', (req, res) => {
  console.log("got the post!!");  
  //console.log(req.body.filetoupload);
  // parse the form data using the formidable express..
  var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) throw err;
      var oldpath = files.filetoupload.path;
      var newpath = 'C:/Users/vchandran/Documents/Programming/CompilePGM/FilesToMove/CBL/' + files.filetoupload.name;
      //console.log(files.filetoupload.path)
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        // Read the file after the copy is good..
        fs.readFile(newpath, 'utf8', (err, data) => {
          if (err) throw err;
          // move the data into lines..
          var lines = data.split('\n');
          for(var line = 0; line < lines.length; line++){

            // checks for the lines that has COPY keywords within Area A and B of CBL Pgm. we will pick commented copybook as well. Need to fix that.
            if (lines[line].search('COPY ') > 0 && lines[line].indexOf('COPY') < 16 ){
              // console.log(lines[line]);

              // get the line after removing the contents till "COPY "
              const copyBookLine = lines[line].substring(lines[line].indexOf('COPY') + 5);
              // console.log(copyBookLine);
              // for the copy books enclosed within the '"'.
              if(copyBookLine.search('"') >= 0 ){ 
                // console.log(copyBookLine.substring(copyBookLine.indexOf('"') + 1,copyBookLine.lastIndexOf('"')))
                // extract the sring inside the quotes.
                copyBookLines.push(copyBookLine.substring(copyBookLine.indexOf('"') + 1,copyBookLine.lastIndexOf('"')));
              }else if (copyBookLine.charAt(copyBookLine.length - 2 ) == '.'){
                copyBookLines.push(copyBookLine.substring(0,copyBookLine.length - 2));
                // console.log(copyBookLine.charAt(copyBookLine.length - 2 ));
                // console.log(copyBookLine.substring(0,copyBookLine.length - 2))
              }else{
                copyBookLines.push(copyBookLine.replace(/[\r]+/g, ''));
              }  
            }
          }

          // Log.FD is not used?? they dont have a standard namming convention for RECORDSIZES.CPY.
          // so this copybook is not copied. lets push this copybook but this cannot be a practice.

          copyBookLines.push('RECORDSIZES.CPY');

          // get the variables from screen and build the compile statement..
          //const pgmName = fields.Pname;
          const pgmName = files.filetoupload.name;
          //const compType = fields.Ctype;
          let compType = 'c';

          copyBookLines.forEach(function(item){
            fs.copyFile('C:/COBOL_GIT/NEWCPY/' + item ,'C:/Users/vchandran/Documents/Programming/CompilePGM/FilesToMove/NEWCPY/' + item ,function(err){
              if(err) console.log(err);
            })
            //when we have FD move the corresponding CPY layout as well.
            if(item.search('.FD') >= 0){
                item1 = item.split('.',1);
                fdCopy = item1 + '.CPY';
                fs.copyFile('C:/COBOL_GIT/NEWCPY/' + fdCopy ,'C:/Users/vchandran/Documents/Programming/CompilePGM/FilesToMove/NEWCPY/' + fdCopy ,function(err){
                  if(err) console.log(err);
                })
            }
            //check for the newcpy standard..
            if(item.search('STATUS-CODES.WS') >= 0 ){
              //console.log('Newcpy standard')
              compType = 'n'
            } 
          })
          console.log('Compiling ..' + pgmName + ' ' + 'with compile type..' + compType);
          console.log('Number of copybooks in the pgm : ' + copyBookLines.length);
          
          //send all the files to the remote server..
          ssh.connect({
            host: '***.**.***.**', // put your own ssh ip adress
            username: userName,
            privateKey: `C:\\Users\\${userName}\\.ssh\\id_rsa`
          })
          
          .then(function() {
              
              //Putting entire directories
              const failed = []
              const successful = []
              ssh.putDirectory(localFolder, remoteDir, {
                recursive: true,
                concurrency: 10,
                //^ WARNING: Not all servers support high concurrency
                //try a bunch of values and see what works on your server
                validate: function(itemPath) {
                  const baseName = path.basename(itemPath)
                  return baseName.substr(0, 1) !== '.' && // do not allow dot files
                         baseName !== 'node_modules' // do not allow node_modules
                },
                tick: function(localPath, remotePath, error) {
                  if (error) {
                    failed.push(localPath)
                  } else {
                    successful.push(localPath)
                  }
                }
              }).then(function(status) {
                console.log('the directory transfer was', status ? 'successful' : 'unsuccessful')
              //  console.log('failed transfers', failed.join(', '))
              //  console.log('successful transfers', successful.join(', '))
              
              // Dynamically populate pgm form user input.
              const buildCommand = 'sh compilepgm.sh' + ' -' + compType + ' ' + pgmName
              console.log('build commmand : ' + buildCommand);
               
            //  Command
             ssh.execCommand(buildCommand, { cwd:remoteDir }).then(function(result) {
            //   console.log('STDOUT: ' + result.stdout)
            //   console.log('STDERR: ' + result.stderr)
              compileLog = result.stdout + '\n'  +result.stderr ;
              res.render("index.ejs", {logs : compileLog});
            //  res.write(`${result.stdout}`)
            //  res.write(`${result.stderr}`) 
            //  res.write('\nFile moved and compiled on Robin');
            //  res.end();
              })
            // Remove local DIR contents.  
            // fs.emptyDir(localFolder + '/CBL', err => {
            //   if (err) return console.error(err)
            //   console.log('clearing CBL success!')
            // })
            // fs.emptyDir(localFolder + '/NEWCPY', err => {
            //   if (err) return console.error(err)
            //   console.log('clearing NEWCPY success!')
            // })
            // Remove folder ends.
            })
          })

          //Send to the remote server ends...
        });  
      });
  });
});

// start the app and listen to port 3000;
app.listen(port, () => {
    console.log(`App started and listening at http://localhost:${port}`);
})
