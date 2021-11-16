// This is a create function example.

// Simple function example. Does not take any input.
function displayName (){
    console.log("My name is Vijay");
}

//Call the function.
displayName();

//Function that takes in input as parameter example.
function displayUserName(name,age){
    console.log("Hello " + name + "!");
    console.log("Your age after 10 years is " + Number(age + 10));
}

//calling the function with the input parameter.
displayUserName("vijay",37);

/*Function that takes input and returns a value.
The value should be saved to the variables else the returened 
Value is not saved and it just executes the function only*/

function addNum(num1,num2){
    return Number(num1 + num2);
}

// Calling the funcion and saving the return value to the variable.
var sum = addNum(2,3); // Can also save the return value and use them.
console.log("The sum of 2 numbers = " + addNum(5,3));