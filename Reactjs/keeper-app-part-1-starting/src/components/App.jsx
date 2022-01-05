//import react components.
import React from "react";
import Footer from "./Footer";
import Header from './Header';
import Note from "./Note";

//create a function for app to return all the HTML components.
function App(){
    return(
        <div>
            <Header />
            <Note />
            <Footer />
        </div>     
    )
}


export default App;