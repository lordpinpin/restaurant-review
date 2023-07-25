const passForm = document.querySelector("#password-form");
const wrongNew = document.querySelector('#wrongpast');
const wrongPast = document.querySelector('#wrongnew');
const wrongAgain = document.querySelector("#wrongreenter");
const passOld = document.querySelector('#pastpass')
const passNew = document.querySelector('#newpass');
const passVerify = document.querySelector('#passagain');

function isNotEmpty(str) {
  // Regular expression pattern to match non-empty and non-space strings
  const regexPattern = /\S/;
  return regexPattern.test(str);
}

passForm.addEventListener('submit', (event) => {
  wrongNew.classList.add('hide');
  wrongPast.classList.add('hide');
  wrongAgain.classList.add('hide');

  if(!isNotEmpty(passOld.value) || !isNotEmpty(passNew.value)  || passNew.value != passVerify.value){
    event.preventDefault();
    if(!isNotEmpty(passOld.value)) {
        wrongPast.classList.remove("hide");
    }
    if(!isNotEmpty(passNew.value)) {
        wrongNew.classList.remove("hide");
    }
    if(passNew.value != passVerify.value){
        wrongAgain.classList.remove('hide');
    }
  }
});
