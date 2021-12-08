// This program is a fizz buzz game.
var output = [];
var num = 0;

//define a function to push an item to the array.
function fizzBuzz(){
    // define a num that will be incremented everytime and pushed inside the array.
    num+= 1;
    if (num %  3 == 0 && num % 5 == 0){
        output.push("fizzBuzz");
    } else if (num %  3 == 0 ){
        output.push("fizz");
    } else {
        output.push(num);
    }
    // output.push(num);
    // console.log(output);
}


// Call the function for 100 times.
for (let i = 0; i < 100 ; i++){
    fizzBuzz();
}

console.log(output);