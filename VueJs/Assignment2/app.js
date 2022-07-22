const app = Vue.createApp ({
// add Data
data(){
    return {
        greetings : "Hello World",
        textTyped : ' ',
        textEntered : ' '
    }
}, 
// add Methods
methods : {
    //Define a function for the button pressed
    showalert(){
        alert("button is pressed");
    },
    copyText(){
        this.textTyped = event.target.value
    },
    enterText(){
        this.textEntered = event.target.value
    }
}
});

app.mount('#assignment');