//practice with objects...

const person = {
    name : ['vijay', 'chandran'], 
    age : 37,
    bio (){
        console.log(`${this.name[0]} ${this.name[1]} is ${this.age} years old.`);
    },
    introduceSelf (){
        console.log(`Hi! I'm ${this.name[0]}`)
    }
}; // Object has variables(properties) and functiions(methods).
// console.log(person);

console.log(person.name);
console.log(person.age);
person.bio();
person.introduceSelf();

// lets set the object now to change the age.
person.age = 40;
console.log(`Modified age : ${person.age}`);

// Let's add some more properties to the person.
person.address = "3635, Indian run drive";
console.log(`New property : ${person.address}`)

// console.log(person);

/*
person is a object and if we have to add another person we may have to 
re-create the object again and again. The solution to this issue is to 
create a constructor. This is like a function.
 */

//Creating function to acheive this makes to create a person passing name each time. this could be improved
function createPerson(name){
    const Person = {} ; //empty object
    Person.name = name ; // name is passed as argument.
    Person.introduce = function (){
        console.log(`Greetings from ${this.name}`);
    }
    return Person;
}

const vijay = createPerson('Vijay' );
console.log(vijay.name);
console.log(vijay.introduce());

const Eshaan = createPerson('Eshaan');
console.log(Eshaan.name);
console.log(Eshaan.introduce());

/* *********************************** */
//using constructor as a better alternative.
// Constructor starts with the capital case as standard..
function Person(name){
    this.name = name;
    this.introduceSelf = function (){
        console.log(`Hi from ${this.name}`);
    }
}

//to call this contructor,

const athul = new Person('athul');
console.log(athul.introduceSelf());

const indrani = new Person('Indrani');
console.log(indrani.introduceSelf());

// prototyope chaining.. 
//define a object with few properties and method..

const object1 = {
    name    : 'vijay',
    age     : 37,
    intro   : function(){
        console.log(`this is ${this.name} and I am ${this.age} years old`);
    }
}

console.log(object1);