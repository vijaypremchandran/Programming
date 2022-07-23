const app = Vue.createApp({
    //data is a function that returns a object
    data(){
        return{
            RESULT : 0
        }
    },
    //method is the object that has lots of functions.
    methods : {
        addFiveToResult(){
            this.RESULT = this.RESULT + 5;
        },
        addOneToResult(){
            this.RESULT = this.RESULT + 1;
        },
        addToResult(num){
            this.RESULT = this.RESULT + num
        }

    },
    //Computed is used for values that need not get refreshed all the time.
    computed : {
        showResult(){
            if (this.RESULT < 37 ){
                return 'Not there yet'
            } else if (this.RESULT === 37){
                return this.RESULT 
            } else {
                return 'Too much'
            }
        }
    },
    //watch is used to monitor a vairables.
    watch : {
        showResult() {
            const that = this; 
            setTimeout(function(){
                that.RESULT = 0;
            },5000);
        }
    }
})

// use this to control the part of the screen by Vuejs
app.mount('#assignment');