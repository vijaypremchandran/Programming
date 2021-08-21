//example of a blocking/Synch file read. One instruction has to complete before the other.
const fs = require('fs');

console.log('start');

const data = fs.readFileSync('./file.txt', 'utf-8'); // blocks here until file is read
console.log('data: ', data.trim());

console.log('end');

