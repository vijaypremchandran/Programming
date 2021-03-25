// script for reading the file content thru xmlHttp

// Add a event listerner for the button.
document.getElementById('button').addEventListener('click', loadData);

//funtion loadData - what happens when the button is pressed.
function loadData(){
    // create on xhr object.
    const xhr = new XMLHttpRequest();

    //open
    xhr.open('GET','data.txt',true);

    //onhold is like reading the file.
    xhr.onload = function(){
        if(this.status === 200){
            // console.log(this.responseText);
            document.getElementById('output').innerHTML=`<h1> ${this.responseText} </h1>`
        }
    }

    //send.
    xhr.send();
}
