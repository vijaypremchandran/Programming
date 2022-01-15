import React from 'react';
import Card from './Card';
import contacts from '../contacts';

//create a function to create card.

function createCard(contacts){
  return(
    <Card
      key={contacts.id} 
      name={contacts.name}
      imgURL={contacts.imgURL}
      phone={contacts.phone}
      email={contacts.email}
    />
  )
}

function App() {
  return (
    <div>
      <h1 className="heading">My Contacts</h1>
      {contacts.map(createCard)};
    </div>
  );
}

export default App;
