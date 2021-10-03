// This program is to try some child process commands..
const { spawn } = require('child_process');
// const ls = spawn('ls', ['-lh', '/Users/vijaypremchandran']);

const ls = spawn("scp", ["/Users/vijaypremchandran/localFiles/secondFile.txt", "vijaypremchandran@192.168.40.229:/home/vijaypremchandran/files"]);



ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});