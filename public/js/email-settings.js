const logged = document.querySelector("#index-logged");
const emailField = document.getElementById('.email-field');
const emailError = document.getElementsByClassName('#error');
const emailOld = document.querySelector('.old-email-details input[type=email]')
const emailNew = document.querySelector(".new-email-details input[type=email]");
const emailVerify = document.querySelector(".verify-email-details input[type=email]");
const submitButton = document.querySelector('.confirm');


logged.addEventListener('submit', (event) => {
  wrongEmail.classList.style.visibility = "visible";
  submitButton.disabled = false;

    if(!emailField.value.match(/^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/)){
      event.preventDefault();
      emailError.textContent = "Please enter a valid email";
      emailError.classList.style.visibility = "hidden";
      submitButton.disabled = true;
      return false;
    }

    if(emailNew !== emailVerify){
      event.preventDefault();
      emailError.textContent = "Email does not match with the New Email."
      emailError.classList.style.visibility = "hidden";
      submitButton.disabled = true;
      return false;
    }

    if(emailNew === emailOld || emailVerify === emailOld){
      event.preventDefault();
      emailError.textContent = "New Email should be different from the Old Email."
      emailError.classList.add("visible");
      submitButton.disabled = true;
      return false;
    }
})
