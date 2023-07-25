const logged = document.querySelector("#email-form");
const wrongNew = document.querySelector('#wrongpast');
const wrongPast = document.querySelector('#wrongnew');
const noAgain = document.querySelector("#noreenter");
const wrongAgain = document.querySelector("#wrongreenter");
const emailOld = document.querySelector('#pastemail')
const emailNew = document.querySelector('#newemail');
const emailVerify = document.querySelector('#email-again');

function isValidEmail(email) {
  // Regular expression pattern for validating an email address
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

logged.addEventListener('submit', (event) => {
  wrongNew.classList.add('hide');
  wrongPast.classList.add('hide');
  noAgain.classList.add('hide');
  wrongAgain.classList.add('hide');
  console.log("check");

  if(!isValidEmail(emailOld.value) || !isValidEmail(emailNew.value) || !isValidEmail(emailVerify.value) || emailNew.value != emailVerify.value){
    event.preventDefault();
    if(!isValidEmail(emailOld.value)) {
        wrongPast.classList.remove("hide");
    }
    if(!isValidEmail(emailNew.value)) {
        wrongNew.classList.remove("hide");
    }
    if(!isValidEmail(emailVerify.value)) {
        noAgain.classList.remove("hide");
    }
    if(emailNew.value != emailVerify.value){
        wrongAgain.classList.remove('hide');
    }
  }
});
