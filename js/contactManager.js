

// need to create a form for this information
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.add-contact-button').addEventListener('click', function() {
        const firstName = document.getElementById('inputFirstName').value;
        const lastName = document.getElementById('inputLastName').value;
        const email = document.getElementById('inputEmail').value;
        const phoneNumber = document.getElementById('inputPhoneNumber').value;
        
        // this should be stored from login session 
        // const userId = localStorage.getItem('userId');
        
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
            console.log("response was successful");
            } else {
                // Show error message
                console.log("there was an error")
            }
        })
        .catch(error => {
            alert('Failed to add contact. Please try again.');
            console.error('Error:', error);
        });
    });
});

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

document.addEventListener('DOMContentLoaded', function() {
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
        displayContacts(data.results);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});