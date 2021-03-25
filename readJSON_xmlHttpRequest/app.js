// script for reading the JSON content thru xmlHttp

// Add a event listerner for button1 - Customer.
document.getElementById('button1').addEventListener('click', loadCustomer);

// Add a event listerner for button2 - Customers.
document.getElementById('button2').addEventListener('click', loadCustomers);

//funtion loadCustomer - what happens when the button1 is pressed.
function loadCustomer(e){
    // create on xhr object.
    const xhr = new XMLHttpRequest();

    //open
    xhr.open('GET','customer.json',true);

    //onhold is like reading the file.
    xhr.onload = function(){
        if(this.status === 200){
            // console.log(this.responseText);
            // document.getElementById('customer').innerHTML=`<h1> ${this.responseText} </h1>`
            // Since this is a js object. Parse this with the jason parser method and save it to a Const.
            customer = JSON.parse(this.responseText);
            
            // move the value from the customer to the output variable. This will be used to populate the screen.
            output = `
                <ul>
                    <li> ID         :   ${customer.id}      </li>
                    <li> Name       :   ${customer.name}    </li>
                    <li> Company    :   ${customer.company} </li>
                    <li> Phone      :   ${customer.phone}   </li>
                </ul>
            `;

            // console.log(output); 
            //move this to the screen.
            document.getElementById('Customer').innerHTML = output;
        }
    }
    //send.
    xhr.send();
}

//funtion loadCustomers - what happens when the button2 is pressed.
function loadCustomers(e){
    // create on xhr object.
    const xhr = new XMLHttpRequest();

    //open
    xhr.open('GET','customers.json',true);

    //onhold is like reading the file.
    xhr.onload = function(){
        if(this.status === 200){
            // console.log(this.responseText);
            // document.getElementById('customer').innerHTML=`<h1> ${this.responseText} </h1>`
            // Since this is a js object. Parse this with the jason parser method and save it to a Const.
            customers = JSON.parse(this.responseText);
            
            // Define a variable output and populated the value by looping..
            let output = '';

            customers.forEach(function(customer){
                // move the value from the customer to the output variable. This will be used to populate the screen.
                output+= `
                <ul>
                    <li> ID         :   ${customer.id}      </li>
                    <li> Name       :   ${customer.name}    </li>
                    <li> Company    :   ${customer.company} </li>
                    <li> Phone      :   ${customer.phone}   </li>
                </ul>
                `;
            })
            
            // console.log(output); 
            //move this to the screen.
            document.getElementById('Customers').innerHTML = output;
        }
    }
    //send.
    xhr.send();
}