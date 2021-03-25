/* game fuction
- player must choose a num between min and max
- player gets certain amount of guess
- notify player of guess remainig
- notify player of correct answer if wrong.
- Let player choose to play again. 
*/

// Game value.
let min = 1,
    max = 10,
    // winningNum = 2,
    winningNum = getRandomNum(min, max),
    guessesleft = 3;

// UI elements.
const game = document.querySelector(".game"),
      minNum = document.querySelector(".min-num"),
      maxNum = document.querySelector(".max-num"),
      guessBtn = document.querySelector("#guess-btn"),
      guessInput = document.querySelector(".guess-input"),
      message = document.querySelector(".message");
// Assign UI elements.
minNum.textContent = min;
maxNum.textContent = max;

// Play again event listener. 
game.addEventListener('mousedown', function(e){
    if(e.target.className === 'play-again'){
        window.location.reload();
    }
})

// Listen for guessbtn.
 guessBtn.addEventListener('click', function(){
    let guess = parseInt(guessInput.value);
    
    // validate 
    if(isNaN(guess) || guess < min || guess > max){
        setMessage(`please enter a number between ${min} and ${max}`, 'red');
        // Clear input
        guessInput.value = '';
    } else {
        //check if won??
        if(guess === winningNum){
            // Game won ..
            gameOver(true, `${winningNum} is correct, YOU WIN!`);
        }else{
            //
            // reduce the number of guess by one each time.
            guessesleft -= 1;
    
            // check if there is no guess left to declare a lost message.
            if(guessesleft === 0){
                // You lost.. 
                gameOver(false, `Game Over, you lost. The correct number was ${winningNum}`);
                
            } else {
                // Show the remaining attempts left ..
                setMessage(`Keep Guessing, YOU have ${guessesleft} more attempts`, 'orange')
    
                // Make the border orange.
                guessInput.style.borderColor = 'orange';
    
                // Clear input
                guessInput.value = '';        
            } 
        }

    }
});

// Game over !!
function gameOver(won, msg){
    let color; 
    won === true ? color = 'green' : color = 'red';
    // Disable the input 
    guessInput.disabled = true;

    // Make the border color.
    guessInput.style.borderColor = color;

    // Set the text color.. 
    message.style.color = color;

    //set message 
    setMessage(msg);

    // Play again 
    guessBtn.value = 'play again'
    guessBtn.className += 'play-again'
}

//get winning num 
function getRandomNum(min, max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

//set msg
function setMessage(msg,color){
    message.style.color = color;
    message.textContent = msg;
}