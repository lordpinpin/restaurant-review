
/*
function validateEmail(){

  const emailField = document.getElementById('.email-field');
  const emailError = document.getElementById('.email-error');
  const submitButton = document.getElementsByClassName('#btnSubmit confirm');

  emailField.addEventListener('input', function() {
    if(!emailField.value.match(/^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/)){
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
*/

function validateEmail(email) {

  const emailField = document.getElementById('.email-field');
  const emailError = document.getElementById('.email-error');
  const emailNew = document.querySelector(".new-email-details input[type=email]");
  const emailVerify = document.querySelector(".verify-email-details input[type=email]");
  const submitButton = document.getElementsByClassName('#btnSubmit confirm');

  loginForm.addEventListener('submit', (event) => {
    wrongEmail.classList.remove("visible");
    submitButton.disabled = false;
    
      if(!emailField.value.match(/^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/)){
        emailError.textContent = "Please enter a valid email";
        emailError.classList.add("visible");
        submitButton.disabled = true;
        return false;
      }

      if(emailNew !== emailVerify){
        emailError.textContent = "Email does not match with the New Email."
        emailError.classList.add("visible");
        submitButton.disabled = true;
        return false;
      }
  })
}