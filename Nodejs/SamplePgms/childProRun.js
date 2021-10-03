var cproc = require('child_process');
var exec = cproc.exec;
var spawn = cproc.spawn;

var command = "ssh";
var args = ["vijaypremchandran@192.168.40.229", "cd ~/shell && sh hello.sh "];

var child = spawn(command, args);

child.stdout.on('data', function(data) {
  console.log('stdout: ' + data);
});

child.stderr.on('data', function(data) {
  console.log('stderr: ' + data);
});

child.on('close', function(code) {
  console.log('exit code: ' + code);
  process.exit();
});