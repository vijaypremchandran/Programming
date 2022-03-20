// A function called inside another function. 

function sum(a,b){
    let sum = a + b;
    console.log(sum);
}

//Running print function to perform sum.
//print(sum(2,3));

/*
 * Javascript runs lines top to bottom. if the task one calls some process and it 
 * takes a little bit of time, Due to asynch feature of the JS, the second task 
 * will run and so on. This might me giving an unexpected result if the task 2 has 
 * to wait for task one. Call back would fix this issue.
 */

//Define the functions..
function taskOne(){
    console.log("task 1")
}

function taskTwo(){
    console.log("task 2")
}

function taskThree(){
    console.log("task 3")
}
/*
* calling task one inside task two makes task one as callback. 
*/
taskTwo(taskOne());

taskThree();