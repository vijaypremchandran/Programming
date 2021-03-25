// add a even handler for the button.
document.querySelector('.get-Jokes').addEventListener('click', getjokes);

// create the function when the button is pressed.
function getjokes(e){
    const number = document.getElementById('number').value;

    // create a xhr instantiation.
    const xhr = new XMLHttpRequest();

    //Open using url
    xhr.open('GET', `http://api.icndb.com/jokes/random/${number}`, true);

    xhr.onload = function(){
        if(this.status === 200){
            const response = JSON.parse(this.responseText);
            
            let output = '';

            if(response.type === 'success'){
                response.value.forEach(function(joke){
                    output += `<li>${joke.joke}</li>`
                })
            }else{
                output += `<li> something went wrong - status code - ${response.type} </li>`;
            }

            document.querySelector('.jokes').innerHTML = output;
        }
    }

    //send
    xhr.send();


    e.preventDefault();
}