

// need to create a form for this information
document.addEventListener('DOMContentLoaded', function() {

    // first making sure that a user is logged in, this information was sent from the local storage in script.js after a user is done logging in / registering

    const userId = localStorage.getItem('userId');
    console.log("Stored userId:", userId, "Type:", typeof userId);

    // if the user id doesn't exist, going back to the login screen.
    if(!userId){
        window.location.href = 'index.html';
        return;
    }

    loadContacts(userId);

    document.querySelector('.add-contact-button').addEventListener('click', function() {
        const dialog = document.getElementById('add-contact-dialog');
        dialog.showModal();
    });  

    // ADD Contact Fetch Request - POST
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
            // adding to contact here if response was successful
            // clearing the form
                console.log("Contact added successfully");
                document.getElementById('add-contact-dialog').close();
                document.querySelector('#add-contact-dialog form').reset(); // Clear form
                console.log("Sending userId to API:", parseInt(userId));
                loadContacts(userId);
            } else {
                // Show error message
                console.log("Error adding contact:", data.error);
            }
        })
        .catch(error => {
            alert('Failed to add contact. Please try again.');
            console.error('Error:', error);
        });
    });

    document.getElementById('logout-button').addEventListener('click', () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
        window.location.href = 'index.html';
    });
});


// Search contact fetch REQUEST - POST
const searchInput = document.getElementById('search');

// this will run anytime we add anything inside input from
searchInput.addEventListener('input', (e) => {
    const value = e.target.value;
    console.log(value)
})


function loadContacts(userId) {
    fetch('/LAMPAPI/SearchContacts.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: parseInt(userId),
            search: ''
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.results) {
            displayContacts(data.results);
        } else if (data.error){
            console.log("Error loading contacts:", data.error);
            displayContacts([]);
        }    
    })
    .catch(error => {
        console.log("Error loading contacts:", error);
    });
}

function displayContacts(contacts) {
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
                <button class="edit-btn" data-id="${contact.ID}">
                    <i class="fa-solid fa-pen-to-square"></i></button>
                <button class="delete-btn" data-id="${contact.ID}">
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
            const contactId = this.getAttribute('data-id');
            editContact(contactId);
        });
    });
}

function deleteContact(contactId) {
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
            loadContacts(userId); // refresh list
        } else {
            console.log("Error deleting:", data.error);
        }
    })
    .catch(error => console.error("Delete error:", error));
}


