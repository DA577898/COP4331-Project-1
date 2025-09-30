
// Code being used in index.html

const registerButton = document.getElementById("register");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");
const registerError = document.getElementById("registerError");
const loginError = document.getElementById("loginError");

registerButton.addEventListener("click", () => 
{
    container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => 
{
    container.classList.remove("right-panel-active");
});


// Registration JSON
document.querySelector("#buttonRegister").addEventListener("click", (e) => 
{
    e.preventDefault();
    const firstName = document.getElementById("firstNameRegister").value;
    const lastName = document.getElementById("lastNameRegister").value;
    const login = document.getElementById("emailRegister").value;
    const password = document.getElementById("passwordRegister").value;

    console.log("Sending data:", {firstName, lastName, login, password}); // adding additional checks to see which variables are being sent to form the json body

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
    .then(response => {
        console.log("Response status:", response.status); // adding debugging statements
        return response.json()
    })
    .then(data => 
    {
        console.log("Response status:", data); // adding debugging statements
        if (data.error === "") 
        {
            console.log("Registration Successful");
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('firstName', data.FirstName);
            localStorage.setItem('lastName', data.Lastname);
            window.location.href = "contactManager.html"
        } else
        {
            registerError.textContent = `*${data.error}`;
            console.log("There was an error", data.error); // showing what the actual error is
        }
    })
    .catch(error =>
    {
        registerError.textContent = `*${error.message}`;
    });
});

// Sign in JSON
document.querySelector("#buttonSignIn").addEventListener("click", (e) => 
{
    e.preventDefault();
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
            login: login,
            password: password,
        })
    })
    .then(response => {
        console.log("Response status:", response.status); // adding debugging statements
        return response.json()
    })
    .then(data =>
    {
        console.log("Response data:", data); // adding debugging statements
        if (data.error === "")
        {
            console.log("Login Successful");
            // storing the logged in user's credentials into the local storage and setting page to redirect to contact manager
            localStorage.setItem('userId', data.id);
            localStorage.setItem('firstName', data.firstName);
            localStorage.setItem('lastName', data.lastName);
            window.location.href = "contactManager.html"
        } else 
        {
            loginError.textContent = "*Username or password was not valid. Please try again";
            console.log("There was an error", data.error); // showing what the actual error is
        }
    })
    .catch(error => 
    {
        loginError.textContent = `*${error.message}`;
        console.error("Error:", error);
    });
});


