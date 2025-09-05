
// Code being used in index.html

const registerButton = document.getElementById("register");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

registerButton.addEventListener("click", () => 
{
    container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => 
{
    container.classList.remove("right-panel-active");
});


// Registration JSON
document.querySelector("#buttonRegister").addEventListener("click", () => 
{
    const firstName = document.getElementById("firstNameRegister").value;
    const lastName = document.getElementById("lastNameRegister").value;
    const login = document.getElementById("emailRegister").value;
    const password = document.getElementById("passwordRegister").value;

    fetch("/LAMPAPI/RegisterUser.php", 
    {
        method: "POST",
        headers: 
        {
            "Content-Type": "application/json",
        },
        body: JSON.stringify
        ({
            firstName: firstName,
            lastName: lastName,
            login: login,
            password: password,
        })
    })
    .then(response => response.json())
    .then(data => 
    {
        if (data.error === "") 
        {
            console.log("Registration Successful");
        } else
        {
            console.log("There was an error");
        }
    })
    .catch(error =>
    {
        alert("Failed to register. Please try again.");
        console.error("Error:", error);
    });
});

// Sign in JSON
document.querySelector("#buttonSignIn").addEventListener("click", () => 
{
    const login = document.getElementById("emailSignIn").value;
    const password = document.getElementById("passwordSignIn").value;

    fetch("/LAMPAPI/LoginUser.php",
    {
        method: "POST",
        headers:
        {
            "Content-Type": "application/json",
        },
        body: JSON.stringify
        ({
            login: email,
            password: password,
        })
    })
    .then(response => {
        console.log("Response status:", response.status); // adding debugging statements
        response.json()
    })
    .then(data =>
    {
        console.log("Response data:", data); // adding debugging statements
        if (data.error === "")
        {
            console.log("Login Successful");
        } else 
        {
            console.log("There was an error", data.error); // showing what the actual error is
        }
    })
    .catch(error => 
    {
        alert("Failed to Login. Please try again.");
        console.error("Error:", error);
    });
});


