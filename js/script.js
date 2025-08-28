
// Code being used in register.html

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

// End of code being used in register.html