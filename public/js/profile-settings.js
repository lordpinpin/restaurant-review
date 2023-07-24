if (typeof window !== 'undefined'){

const emailField = document.querySelector('.email-field');
const emailError = document.querySelector('.email-error');
const submitButton = document.querySelector('.btnSubmit confirm');

function validateEmail(){

  emailField.addEventListener('input', function() {
    if(!emailField.ariaValueMax.match(/^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/)){
      emailError.innerHTML = "Please enter a valid email";
      submitButton.disabled = true;
      return false;
    } else {
      emailError.innerHTML = "";
      submitButton.disabled = false;
      return true;
    }

  })
}
}