

// need to create a form for this information
document.addEventListener('DOMContentLoaded', function() {

    // first making sure that a user is logged in, this information was sent from the local storage in script.js after a user is done logging in / registering

    const userId = localStorage.getItem('userId');
    console.log("Stored userId:", userId, "Type:", typeof userId);

    if(!userId){
        window.location.href = 'index.html';
        return;
    }

    loadContacts(userId);

    document.querySelector('.add-contact-button').addEventListener('click', function() {
        const dialog = document.getElementById('add-contact-dialog');
        dialog.showModal();
    });  

    document.querySelector('#add-contact-dialog form').addEventListener('submit', function(e) {
        e.preventDefault();

        const firstName = document.getElementById('inputFirstName').value;
        const lastName = document.getElementById('inputLastName').value;
        const email = document.getElementById('inputEmail').value;
        const phoneNumber = document.getElementById('inputPhoneNumber').value;
        
        // this should be stored from login session 
        //const userId = localStorage.getItem('userId');
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
                <button><i class="fa-solid fa-pen-to-square"></i></button>
                <button><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        contactTableBody.appendChild(row);
    });
}

