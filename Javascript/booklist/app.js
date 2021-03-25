// Book constructor

function Book(title,author,isbn){
    this.title = title;
    this.author = author;
    this.isbn = isbn;
}

// This is the empty constructor and we can add the procedures as proto types.. 
function UI(){};

// Add a prototype to the UI constuctor to add the book to the list.
UI.prototype.addBookToList = function(Book1){
    const list = document.getElementById('book-list');
    // create a tr element. 
    const row = document.createElement('tr');

    //Append cols to the row.
    row.innerHTML = `
        <td>${Book1.title}</td>
        <td>${Book1.author}</td>
        <td>${Book1.isbn}</td>
        <td><a href="#" class="delete">Remove</a></td>
    `;

    // Add the row item to tr.
    list.appendChild(row);

}

// Add a prototype to clear fields.
UI.prototype.clearFields = function(){
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
};

// Add show alert prototype to the UI constructor.
UI.prototype.showAlert = function(message, className){
    // create a div element.
    const div = document.createElement('div');
    
    // Add a class to the div.
    div.className = `alert ${className}`;

    // Add the error message text to the div element.
    div.appendChild(document.createTextNode(message));

    //Get parent.
    const container = document.querySelector('.container');

    //Get form. 
    const form = document.querySelector('#book-form');

    //insert Alert between container and form.
    container.insertBefore(div, form);
    
    // clear the alert message after 3 sec.
    setTimeout(function(){
        document.querySelector('.alert').remove();
    }, 3000);
};

// Add a prototype to delete the book from the list.
UI.prototype.deleteBookFromList = function(target){
    if(target.className === 'delete' ){
        target.parentElement.parentElement.remove();
    };

};

//Add event listerner for the submit 

document.getElementById('book-form').addEventListener('submit',function(e){

    const title = document.getElementById('title').value,
          author = document.getElementById('author').value,
          isbn = document.getElementById('isbn').value

    // instantiate a Book const

    const Book1 = new Book(title, author, isbn);

    // instantiate a UI const

    const ui = new UI();

    // Validate the fields .. 

    if(title === '' || author === '' || isbn === ''){
        // Error alert
        ui.showAlert('please enter values in fields', 'error');
    } else{
        // add a book to the list thru proto type.. 

        ui.addBookToList(Book1);

        // Show success message after the book is added.

        ui.showAlert('Book Added!', 'success');

        // after adding book clear fields. 

        ui.clearFields();
    }

    e.preventDefault();    
});

// Add a even listener for the delete button. 
// Note, since this is not a default HTML Button we need to add the listener to the entire 
// row and then check if the correct target is clicked.

document.getElementById('book-list').addEventListener('click',function(e){
    console.log('clicked..')
    // intantiate the UI object for this click event. 
    ui = new UI();    

    // Delete the row.
    ui.deleteBookFromList(e.target)

    // Show sucess message for delete..
    ui.showAlert('Row removed', 'success');
    
    e.preventDefault();


})
