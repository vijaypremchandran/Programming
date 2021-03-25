// listen for a submit 
document.getElementById('loan-form').addEventListener('submit',function(e){
    // hide results.
    document.getElementById('results').style.display = 'none';

    // show loader 
    document.getElementById('loading').style.display = 'block';

    setTimeout(calculateResults, 2000);
    e.preventDefault();    
});

// create that function 
function calculateResults(){
    console.log('Calculating..');
    // get UI variables.
    const amount = document.getElementById('amount');
    const interest = document.getElementById('interest');
    const years = document.getElementById('years');
    const monthlyPayment = document.getElementById('monthly-payment');
    const totalPayment = document.getElementById('total-payment');
    const totalInterest = document.getElementById('total-interest');

    const principal = parseFloat(amount.value);
    const calculatedInterest = parseFloat(interest.value) / 100 / 12;
    const calculatedPayments = parseFloat(years.value) * 12;

    // compute monthly payments.. 
    const x = Math.pow(1 + calculatedInterest,calculatedPayments);
    const monthly = (principal*x*calculatedInterest)/(x-1);

    if(isFinite(monthly)){
        monthlyPayment.value = monthly.toFixed(2);
        totalPayment.value = (monthly * calculatedPayments).toFixed(2);
        totalInterest.value = ((monthly * calculatedPayments) - principal).toFixed(2);
        // show results.
        document.getElementById('results').style.display = 'block';

        // hide loader 
        document.getElementById('loading').style.display = 'none';
    }else{
        showError('please check your numbers..');
    }
    
}

// create a functions for custom error. 

function showError(error){
    // create an element 
    const errorDiv = document.createElement('div');
    
    // get elements to display a banner after the header.
    const card = document.querySelector('.card');
    const heading = document.querySelector('.heading');

    // add a class 
    errorDiv.className = 'alert alert-danger';

    // create a text node and append to the child.
    errorDiv.appendChild(document.createTextNode(error));

    //insert error above.. 
    card.insertBefore(errorDiv, heading);

    // clear error after 30 sec. 
    setTimeout(clearError, 3000);

    // hide results.
    document.getElementById('results').style.display = 'none';

    // show loader 
    document.getElementById('loading').style.display = 'none';
}

function clearError(){
    document.querySelector('.alert').remove();
}
