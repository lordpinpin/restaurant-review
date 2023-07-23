const editReviewForm = document.querySelector('')

function editreview (document, review, restaurant) {

    const title = document.querySelector('.choose-name');
    title.textContent = `Review to ${restaurant.name}`;

    const ratingFieldset = document.getElementById('review');
    const ratingInputs = ratingFieldset.querySelectorAll('input[type="radio"]');
    const desiredValue = review.rating;
    ratingInputs.forEach((input) => {
        if (input.value === desiredValue) {
            input.checked = true;
        }
    });

    const reviewTitle = document.querySelector('.titlebar');
    reviewTitle.value = review.title;

    var reviewText = `${review.body}${readmore}`;
    const plainText = reviewText.replace(/<br\s*[\/]?>/gi, "\n").replace(/<[^>]+>/g, '');

    const textArea = document.querySelector('.review-description');
    textArea.value =  plainText;

    const media = document.querySelector('.media');

    if(review.media != undefined && review.media.length != 0){
        const mediaDiv = document.createElement('div');
        mediaDiv.classList.add('media');

        for (const image of review.media) {
            const mediaSquareDiv = document.createElement('div');
            mediaSquareDiv.classList.add('media-square');

            const img = document.createElement('img');
            img.classList.add('media-item');
            img.setAttribute('src', `${image}`);
            img.setAttribute('onclick', 'imageModal(this)');

            const spanElement = document.createElement('span');
            const iconElement = document.createElement('ion-icon');
            spanElement.classList.add('icon-close');
            iconElement.setAttribute('name', 'close');
            spanElement.appendChild(iconElement);

            mediaSquareDiv.appendChild(img);
            mediaSquareDiv.appendChild(spanElement);
            mediaDiv.appendChild(mediaSquareDiv);
        }
        media.push(mediaDiv);
    }


}


editReviewForm.addEventListener('submit', (event) => {
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


module.exports = {
editreview
};

