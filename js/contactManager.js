
/* Global Variables: 
    ContactsData stores all contact objects
    currentEditIndex tracks the contact that's being edited.
*/

    let contactsData = []; // an empty array of contact objects (initialized)
    let currentEditIndex = 0;

/*
    When page loads, checking if a user is logged in by looking for id in local storage.
    If a user isn't found, they should redirect back to the login screen.
*/
document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('userId');
    console.log("Stored userId:", userId, "Type:", typeof userId);

    if(!userId){
        window.location.href = 'index.html';
        return;
    }

    // When user is logged in and redirected, load their contacts
    loadContacts(userId, '');

    /* 
    every time the user types in search input, calling SearchContacts.php with input value
    */
    const searchInput = document.getElementById('search');
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchValue = e.target.value.trim();
            console.log(searchValue)

            loadContacts(userId, searchValue);    
        });
    }

    /*
    User input form to create a new contact
    */
    document.querySelector('.add-contact-button').addEventListener('click', function() {
        const dialog = document.getElementById('add-contact-dialog');
        dialog.showModal();
    });  

    /* 
    After the create new contact form is submitted, calling api
    First get the form input fields
    Then making the api call to PHP
    then handling the response
    */
    document.querySelector('#add-contact-dialog form').addEventListener('submit', function(e) {
        e.preventDefault();

        const firstName = document.getElementById('inputFirstName').value;
        const lastName = document.getElementById('inputLastName').value;
        const email = document.getElementById('inputEmail').value;
        const phoneNumber = document.getElementById('inputPhoneNumber').value;
        
        console.log("Stored userId:", userId, "Type:", typeof userId);
        
        fetch('/LAMPAPI/CreateContact.php', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: parseInt(userId),       
                firstName: firstName,
                lastName: lastName,
                email: email,
                phoneNumber: phoneNumber
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error === "") {  
                console.log("Contact added successfully");
                document.getElementById('add-contact-dialog').close();
                document.querySelector('#add-contact-dialog form').reset(); // Clear form
                console.log("Sending userId to API:", parseInt(userId));
                loadContacts(userId);
            } else {
                console.log("Error adding contact:", data.error);
            }
        })
        .catch(error => {
            alert('Failed to add contact. Please try again.');
            console.error('Error:', error);
        });
    });

    /* 
    After the edit contact form is submitted, calling api
    This form uses currentEditIndex to know which form is being edited
    First get the form input fields
    Then making the api call to PHP
    then handling the response

    */

    document.querySelector('#edit-contact-dialog form').addEventListener('submit', (e) => {
        e.preventDefault();

        const contact = contactsData[currentEditIndex];
        const firstName = document.getElementById('editFirstName').value;
        const lastName = document.getElementById('editLastName').value;
        const email = document.getElementById('editEmail').value;
        const phoneNumber = document.getElementById('editPhoneNumber').value;
                
        fetch('/LAMPAPI/UpdateContact.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            
            body: JSON.stringify({
                userId: parseInt(userId),
                firstName: firstName,
                lastName: lastName,
                email: email,
                phoneNumber: phoneNumber,
                contactID: contact.contactId
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data.error === ''){
                console.log("Successfully updated contact");
                document.getElementById('edit-contact-dialog').close();
                loadContacts(userId, '');
            } else {
                console.log("There was an error with updating this contact", data.error);
            }
        })
        .catch(error => {
               console.log('Error:', error);
        }); 
    });

    /* logout button functionality, returning user to the login/register page */
    document.getElementById('logout-button').addEventListener('click', () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
        window.location.href = 'index.html';
    });
});


/* 
Implemented Search Fetch request
    fetches contacts from the server
    gets called when page loads, when contacts are added, edited, searched, updated, and deleted
    searchValue = '' means show all contacts, which takes place when page loads, and after add, edit, and delete contact
*/
function loadContacts(userId, searchValue = '') {
    fetch('/LAMPAPI/SearchContacts.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: parseInt(userId),
            search: searchValue
        })
    })
    .then(response => response.json())
    .then(data => {

        if (data.results) {
            displayContacts(data.results);

        } else if (data.error === 'No Records Found'){
            console.log("There were no contacts found for this search value:", searchValue);
            displayContacts([]);
        } else if (data.error){
            console.log("Error loading contacts", data.error);
            displayContacts([]);
        }   

    })
    .catch(error => {
        console.log("Error loading contacts:", error);
        displayContacts([]);
    });
}

/*
This creates the table of contacts
table is rebuilt every time a contact is added, edited, deleted, and searched
*/
function displayContacts(contacts) {
    contactsData = contacts;
    const contactTableBody = document.getElementById('contactTableBody');
    contactTableBody.innerHTML = '';

    contacts.forEach((contact, index) => {
        const row = document.createElement('tr');
        row.id = 'row-cells';
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${contact.firstName}</td>
            <td>${contact.lastName}</td>
            <td>${contact.email}</td>
            <td>${contact.phoneNumber}</td>
            <td>
                <button class="edit-btn" data-id="${index}">
                    <i class="fa-solid fa-pen-to-square"></i></button>
                <button class="delete-btn" data-id="${contact.contactId}">
                    <i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        contactTableBody.appendChild(row);
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const contactId = this.getAttribute('data-id');
            deleteContact(contactId);
        });
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.getAttribute('data-id');
            currentEditIndex = index;
            editContact(index);
        });
    });
}

// adding the selected contacts current information to the edit form
function editContact(index){
    const contact = contactsData[index];

    document.getElementById('editFirstName').value = contact.firstName;
    document.getElementById('editLastName').value = contact.lastName;
    document.getElementById('editEmail').value = contact.email;
    document.getElementById('editPhoneNumber').value = contact.phoneNumber;

    document.getElementById('edit-contact-dialog').showModal();
}

// delete fetch request implemented
// still need to add delete alert
function deleteContact(contactId) {
    // Confirmation Alert
    const confirmDelete = confirm("Press OK to confirm deletion");
    if (confirmDelete){

        const userId = localStorage.getItem('userId');

        fetch('/LAMPAPI/DeleteContact.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: parseInt(userId),
                contactId: parseInt(contactId)
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error === "") {
                console.log("Deleted contact:", contactId);
                loadContacts(userId, ''); // refresh list
            } else {
                console.log("Error deleting:", data.error);
            }
        })
        .catch(error => console.error("Delete error:", error));

    }
}



