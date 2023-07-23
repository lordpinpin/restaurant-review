
const loginForm = document.querySelector("#login-form");

const emailInput = document.querySelector("#email-login");
const passInput = document.querySelector("#pass-login");
const wrongEmail = document.querySelector("#errorEmail");
const wrongPass = document.querySelector("#errorPass");

function isValidEmail(email) {
    // Regular expression pattern for email validation
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return emailRegex.test(email) && email.length <= 253;
}

function isValidPass(pass) {
    // Regular expression pattern for password validation
    const passRegex = /(?!^$)([^\s])/;

    return passRegex.test(pass);
}


loginForm.addEventListener('submit', (event) => {
    wrongEmail.classList.remove("visible");
    wrongPass.classList.remove("visible");

    if (!isValidEmail(emailInput.value) || !isValidPass(passInput.value)) {
        event.preventDefault();
        if(!isValidEmail(emailInput.value)) {
            wrongEmail.textContent = "Invalid email";
            wrongEmail.classList.add("visible");
        }
        if(!isValidPass(passInput.value)) {
            wrongPass.textContent = "Invalid password";
            wrongPass.classList.add("visible");
        }
        console.log('Invalid email input');
    } else {
        console.log('Valid email input');
    }
});





