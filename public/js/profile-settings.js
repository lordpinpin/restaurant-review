const profile = document.querySelector('#profile-settings')

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


function isValid(pass) {
    // Regular expression pattern for password validation
    const passRegex = /(?!^$)([^\s])/;

    return passRegex.test(pass);
}


profile.addEventListener('submit', (event) => {
    wrongFirst.classList.add("hide");
    wrongLast.classList.add("hide");

    console.log(firstInput.value);
    console.log(lastInput.value);

    if (!isValid(firstInput.value) || !isValid(lastInput.value)) {
        event.preventDefault();
        if(!isValid(firstInput.value)) {
            wrongFirst.classList.remove("hide");
        }
        if(!isValid(lastInput.value)) {
            wrongLast.classList.remove("hide");
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
