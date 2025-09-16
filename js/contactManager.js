
/* Global Variables: 
    ContactsData stores all contact objects
    currentEditIndex tracks the contact that's being edited.
*/

    let contactsData = []; // an empty array of contact objects (initialized)
    let currentEditIndex = 0;
    let currentPage = 1;
    let totalPages = 1;
    let contactsPerPage = 10;
    let searchValue = '';

/*
    When page loads, checking if a user is logged in by looking for id in local storage.
    If a user isn't found, they should redirect back to the login screen.
*/
document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('userId');
    console.log("Stored userId:", userId, "Type:", typeof userId);

    if(!userId){
        window.location.href = '/';
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
            searchValue = e.target.value.trim();
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
        window.location.href = '/';
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
            search: searchValue,
            num_contacts: contactsPerPage,
            num_page: currentPage
        })
    })
    .then(response => response.json())
    .then(data => {

        if (data.results) {
            totalPages = data.pagination.totalPages;
            displayContacts(data.results);
            displayPagination(data.pagination);
        } else if (data.error === 'No Records Found'){
            console.log("There were no contacts found for this search value:", searchValue);
            totalPages = 1;
            displayContacts([]);
            displayPagination([]);
        } else if (data.error){
            console.log("Error loading contacts", data.error);
            totalPages = 1;
            displayContacts([]);
            displayPagination([]);
        }   

    })
    .catch(error => {
        console.log("Error loading contacts:", error);
        displayContacts([]);
        displayPagination([]);
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
function deleteContact(contactId) {
    // Confirmation Alert
    const confirmDelete = confirm("Are you sure you want to delete this contact?");
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
                displayPagination([]);
            } else {
                console.log("Error deleting:", data.error);
            }
        })
        .catch(error => console.error("Delete error:", error));

    }
}

function displayPagination(pagination) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';
    userId = localStorage.getItem('userId');

    // First page button
    const firstPageDiv = document.createElement('div');
    firstPageDiv.innerHTML = '<i class="fa-solid fa-angles-left"></i>';
    paginationContainer.appendChild(firstPageDiv);
    firstPageDiv.addEventListener('click', () => {
        currentPage = 1;
        displayPagination(pagination);
        loadContacts(userId, searchValue);
    });

    // Previous page button
    const prevPageDiv = document.createElement('div');
    prevPageDiv.innerHTML = '<i class="fa-solid fa-angle-left"></i>';
    paginationContainer.appendChild(prevPageDiv);
    prevPageDiv.addEventListener('click', () => {
        if(currentPage > 1) {
            currentPage--;
        }
        displayPagination(pagination);
        loadContacts(userId, searchValue);
    });
    // Page numbers
    for(let i = 1; i <= totalPages; i++) {
        const pageDiv = document.createElement('div');
        pageDiv.textContent = i;
        if(i === currentPage) {
            pageDiv.classList.add('active-page');
        }
        paginationContainer.appendChild(pageDiv);
        pageDiv.addEventListener('click', () => {
            currentPage = i;
            displayPagination(pagination);
            loadContacts(userId, searchValue);
        });
    }

    // Next page button
    const nextPageDiv = document.createElement('div');
    nextPageDiv.innerHTML = '<i class="fa-solid fa-angle-right"></i>';
    paginationContainer.appendChild(nextPageDiv);
    nextPageDiv.addEventListener('click', () => {
        if(currentPage < totalPages) {
            currentPage++;
        }
        displayPagination(pagination);
        loadContacts(userId, searchValue);
    });

    // Last page button
    const lastPageDiv = document.createElement('div');
    lastPageDiv.innerHTML = '<i class="fa-solid fa-angles-right"></i>';
    paginationContainer.appendChild(lastPageDiv);
    lastPageDiv.addEventListener('click', () => {
        currentPage = totalPages;
        displayPagination(pagination);
        loadContacts(userId, searchValue);
    });
}