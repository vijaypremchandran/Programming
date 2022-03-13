//Add a event listener for the button1 click.
document.getElementById('button1').addEventListener('click', getText);

//Add a event listener for the button2 click.
document.getElementById('button2').addEventListener('click', getJson);

//Add a event listener for the button3 click.
document.getElementById('button3').addEventListener('click', getExternal);

//Fetch returns the promise.
function getText(){
    // console.log('Button 1 is pressed')
    fetch('test.txt')
    .then(function(res){
       return(res.text()); 
    })
    .then(function(data){
        console.log(data);
        document.getElementById('output').innerHTML = data;
    })
    .catch(function(err){
        console.log(err);
    })
}

function getJson(){
    // console.log('Button 2 is pressed')
    fetch('post.json')
    .then(function(res){
       return(res.json()); 
    })
    .then(function(data){
        let output = '';
        data.forEach(function(post) {
            output += `<li>${post.title}</li>`;
        });
        document.getElementById('output').innerHTML = output;
    })
    .catch(function(err){
        console.log(err);
    })
}

function getExternal(){
    // console.log('Button 3 is pressed')
    fetch('https://api.github.com/users')
    .then(function(res){
       return(res.json()); 
    })
    .then(function(data){
        let output = '';
        data.forEach(function(user) {
            output += `<li>${user.login}</li>`;
        });
        document.getElementById('output').innerHTML = output;
    })
    .catch(function(err){
        console.log(err);
    })    
}