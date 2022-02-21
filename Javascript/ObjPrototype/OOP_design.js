//Object oriented programming concepts..
/*
    1) CLASS : Java script object representing a set of properties and actions/method. We can inherete a class for different objects. This is a template.
    2) PROPERTIES : Describes the object, this is like noun example a person may name, age, address, what he teaches. This defines the object.
    3) METHODS : Functions, What can this object do, these are actions that object can perform. Like a person can teach or learn based on whether he is a student or a teacher.
    4) INSTANCE :  Each professor that we create is an instance of this class. we create an instance using the constructor.

    example: A class has data, functions and contructor to make instance of the class.
    class Professor
        properties
            name 
            teaches
        constructor 
            Professor(name,teaches)
        methods
            grades (paper)
            introduceSelf()
*/

//Defining a class for person.
class Person {
    constructor(name){
        this.name = name;
    }
    introduceSelf() {
        console.log(`hi my name is ${this.name}`)
    }
}

const vijay = new Person('Vijay Chandran');

console.log(vijay.introduceSelf());