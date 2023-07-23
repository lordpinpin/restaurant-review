

const editReviewForm = document.querySelector('.create-review');
const emptyTitle = document.querySelector('#emptytitle');
const emptyDesc = document.querySelector('#emptydesc');

function isNotEmpty(value) {
    // Use regex to test if the value contains at least one non-whitespace character
    return /\S/.test(value);
}

editReviewForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    emptyTitle.classList.add("hide");
    emptyDesc.classList.add("hide");

    if (!isNotEmpty(editReviewForm.elements.title.value) || !isNotEmpty(editReviewForm.elements.description.value)) {
        event.preventDefault();
        if(!isNotEmpty(editReviewForm.elements.title.value)) {
            emptyTitle.classList.remove("hide");
        }
        if(!isNotEmpty(editReviewForm.elements.description.value)) {
            emptyDesc.classList.remove("hide");
        }
    } else {
        const imageSources = [];
        const mediaContainer = document.querySelector('.media');
        const mediaItems = mediaContainer.querySelectorAll('.media-item');

        // Loop through the media items to get their src values
        mediaItems.forEach(async (item) => {
          const src = item.getAttribute('src');
          imageSources.push(src);
        });
        const imageSourcesInput = document.querySelector('#imageSourcesInput')
        imageSourcesInput.value = JSON.stringify(imageSources);
        editReviewForm.submit();
    }
});

function waitOneSecond() {
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  }

const inputFile = document.querySelector('#getFile');

inputFile.addEventListener("change", async function(event) {
    console.log("START");
    const media = document.querySelector('.media');

    if(media.children.length >= 5){
        document.querySelector('.attach-media-square').classList.add('hide');
    }
    const mediaSquareDiv = document.createElement('div');
    mediaSquareDiv.classList.add('media-square');

    const img = document.createElement('img');
    img.classList.add('media-item');

    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", 'media');
    formData.append("upload_preset", 'fs5jhgac');

    fetch(`https://api.cloudinary.com/v1_1/dg28enybo/image/upload`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Image uploaded to Cloudinary:", data);
        img.setAttribute('src', data.secure_url);
        img.setAttribute('onclick', 'imageModal(this)');
        // Use 'data.secure_url' to access the uploaded image URL
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });

    const spanElement = document.createElement('span');
    const iconElement = document.createElement('ion-icon');
    spanElement.classList.add('icon-close');
    spanElement.setAttribute('onclick', 'deleteDiv(this)');
    iconElement.setAttribute('name', 'close');
    spanElement.appendChild(iconElement);

    mediaSquareDiv.appendChild(img);
    mediaSquareDiv.appendChild(spanElement);
    media.appendChild(mediaSquareDiv);
    console.log("appending");

    inputFile.value = "";
});

const attachMedia = document.querySelector('.attach-media-square')

function deleteDiv(div){
    const parentDiv = div.parentElement;
    parentDiv.remove();
    attachMedia.classList.remove('hide');
}
