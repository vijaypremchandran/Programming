//example of Async/ non blocking file read. Javascripts commands need not wait on previous
// statement.

const fs = require('fs');

console.log('start');

fs.readFile('./file.txt', 'utf-8', (err, data) => {
    if (err) throw err;
    console.log('file.txt data: ', data.trim());
  });

console.log('end');

