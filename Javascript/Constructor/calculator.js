//constructor example using a calculator app.

class Calculator {
    constructor (num1,num2){
        this.num1 = num1;
        this.num2 = num2;
    }

    Add(){
        return this.num1 + this.num2;
    }

    Subtract(){
        return this.num1 - this.num2;
    }

    Multiply(){
        return this.num1 * this.num2;
    }

    Divide(){
        return this.num1 / this.num2;
    }
}