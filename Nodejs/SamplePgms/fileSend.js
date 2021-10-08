const fs = require('fs')
const path = require('path')
const {NodeSSH} = require('node-ssh')

const ssh = new NodeSSH()

ssh.connect({
    host: '192.168.40.229',
    username: 'vijaypremchandran',
    privateKey: '/Users/vijaypremchandran/.ssh/id_rsa'
  })
  .then(function() {
    // Local, Remote
    ssh.putFile('/Users/vijaypremchandran/localFiles/firstFile.txt', '/home/vijaypremchandran/files/firstFile.txt').then(function() {
      console.log("The File thing is done")
    }, function(error) {
      console.log("Something's wrong")
      console.log(error)
    })
});