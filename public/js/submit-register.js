const registerForm = document.querySelector('#registerform')

const emailInput = document.querySelector("#email-input");
const passInput = document.querySelector("#password-input");
const firstInput = document.querySelector("#first-name-input");
const lastInput = document.querySelector("#last-name-input");
const wrongPic = document.querySelector("#wrongpic");
const wrongEmail = document.querySelector("#wrongemail");
const wrongPass = document.querySelector("#wrongpass");
const wrongFirst = document.querySelector("#wrongfirst");
const wrongLast = document.querySelector("#wronglast");

const pic = document.querySelector(".media-circle img");
const empty = "https://res.cloudinary.com/dg28enybo/image/upload/v1690166382/background/1200px-HD_transparent_picture_q7zqkf.png"


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
    wrongPic.classList.add("hide");
    wrongEmail.classList.add("hide");
    wrongPass.classList.add("hide");
    wrongFirst.classList.add("hide");
    wrongLast.classList.add("hide");

    if (!isValidEmail(emailInput.value) || !isValid(passInput.value) || !isValid(firstInput.value) || !isValid(lastInput.value) || pic.src == empty) {
        event.preventDefault();
        if(!isValidEmail(emailInput.value)) {
            wrongEmail.classList.remove("hide");
        }
        if(!isValid(passInput.value)) {
            wrongPass.classList.remove("hide");
        }
        if(!isValid(firstInput.value)) {
            wrongFirst.classList.remove("hide");
        }
        if(!isValid(lastInput.value)) {
            wrongLast.classList.remove("hide");
        }
        if(pic.src == empty){
            wrongPic.classList.remove("hide");
        }
        console.log('Invalid input');
        window.scrollTo(0, 0);
    } else {
        const imageSourcesInput = document.querySelector('#imagesrc')
        imageSourcesInput.value = pic.src

        editReviewForm.action = window.location.href
        editReviewForm.submit();
    }
});

const inputFile = document.querySelector('#getFile');


inputFile.addEventListener("change", async function(event) {
    console.log("START");

    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", 'profile pictures');
    formData.append("upload_preset", 'fs5jhgac');

    fetch(`https://api.cloudinary.com/v1_1/dg28enybo/image/upload`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Image uploaded to Cloudinary:", data);
        pic.setAttribute('src', data.secure_url);
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });

    inputFile.value = "";
});
