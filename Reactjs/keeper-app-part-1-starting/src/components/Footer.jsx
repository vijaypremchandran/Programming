import React from "react";

//Create a function for Footer.
function Footer(){
    var currentYear = new Date().getFullYear();
    return(
        <footer>
            <p>
                copyright {currentYear}
            </p>
        </footer>
    )
}

export default Footer;