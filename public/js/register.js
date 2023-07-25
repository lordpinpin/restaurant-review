const registerForm = document.querySelector('#registerform')

const emailInput = document.querySelector("#email-input");
const passInput = document.querySelector("#password-input");
const firstInput = document.querySelector("#first-name-input");
const lastInput = document.querySelector("#last-name-input");
const wrongEmail = document.querySelector("#wrongemail");
const wrongPass = document.querySelector("#wrongpass");
const wrongFirst = document.querySelector("#wrongfirst");
const wrongLast = document.querySelector("#wronglast");


function isValidEmail(email) {
    // Regular expression pattern for email validation
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return emailRegex.test(email) && email.length <= 253;
}

function isValid(pass) {
    // Regular expression pattern for password validation
    const passRegex = /(?!^$)([^\s])/;

    return passRegex.test(pass);
}

registerForm.addEventListener('submit', (event) => {
    wrongEmail.classList.remove("visible");
    wrongPass.classList.remove("visible");
    wrongFirst.classList.remove("visible");
    wrongLast.classList.remove("visible");

    if (!isValidEmail(emailInput.value) || !isValid(passInput.value) || !isValid(firstInput.value) || !isValid(lastInput.value)) {
        event.preventDefault();
        if(!isValidEmail(emailInput.value)) {
            wrongEmail.classList.add("visible");
        }
        if(!isValid(passInput.value)) {
            wrongPass.classList.add("visible");
        }
        if(!isValid(firstInput.value)) {
            wrongFirst.classList.add("visible");
        }
        if(!isValid(lastInput.value)) {
            wrongLast.classList.add("visible");
        }
        console.log('Invalid input');
    } else {
        console.log('Valid email input');
    }
});


