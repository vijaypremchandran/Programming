/*Use Math.random() method to explore random num generator */

var n = Math.random();
// console.log(n); // random number is between 0 and 1

//To upsale to any numbers let say 6, Multiple by 6 to get any numbers till 6 

n = n * 6;

// get the base number alone using the math.floor function

n = Math.floor(n) + 1 ;

console.log(n);

if (n === 6){
    console.log("Lucky");
} else {
    console.log("try again");
}
