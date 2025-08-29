


// need to create a form for this information
document.querySelector('.add-contact-button').addEventListener('click', function() {
    const dialog = document.getElementById("add-contact-dialog");
    dialog.showModal()

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