
function editreview (document, review, restaurant) {

    const title = document.querySelector('.choose-name');
    title.textContent = `Review to ${restaurant.name}`;

    let ratings = [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5];
    const ranges = [0, 0.75, 1.25, 1.75, 2.25, 2.75, 3.25, 3.75, 4.25, 4.75, 5]; // Range values
    const roundedValues = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];


    let reviewsetElement = document.createElement('fieldset');
    reviewsetElement.classList.add('rate');
    ratings.forEach((rating) => {
        let inputElement = document.createElement('input');
        inputElement.type = 'radio';
        inputElement.id = `1-rating${rating}`;
        inputElement.name = `reviewrating`;
        inputElement.value = rating;
        if(review.rating == rating){
            inputElement.setAttribute('checked', 'checked');
        }

        let labelElement = document.createElement('label');
        labelElement.htmlFor = `1-rating${rating}`;
        labelElement.title = `${rating} stars`;

        if (rating === 4.5 || rating === 3.5 || rating === 2.5 || rating === 1.5 || rating === 0.5) {
            labelElement.classList.add('half');
        }

        reviewsetElement.appendChild(inputElement);
        reviewsetElement.appendChild(labelElement);
    });

    document.querySelector('.review-rate').appendChild(reviewsetElement);


    const reviewTitle = document.querySelector('.titlebar');
    console.log(review.title)
    reviewTitle.setAttribute('value', review.title);

    var reviewText = `${review.body}${review.readmore}`;
    const plainText = reviewText.replace(/<br\s*[\/]?>/gi, "\n").replace(/<[^>]+>/g, '');

    const textArea = document.querySelector('.review-description');
    textArea.innerHTML = plainText;

    const media = document.querySelector('.media');

    if(review.media != undefined && review.media.length != 0){
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
            spanElement.setAttribute('onclick', 'deleteDiv(this)');
            spanElement.appendChild(iconElement);

            mediaSquareDiv.appendChild(img);
            mediaSquareDiv.appendChild(spanElement);
            media.appendChild(mediaSquareDiv);
        }
    }

    const previewImage = document.querySelector(".preview-image img");
    previewImage.src = restaurant.mini_pic_url;

    const previewName = document.querySelector(".preview-name h3");
    previewName.textContent = restaurant.name;

    var tagRest = restaurant.tags;
    const tagsList = document.createElement("ul");

    for(let tag of tagRest){
        let liElement = document.createElement('li');
        liElement.textContent = tag;
        tagsList.appendChild(liElement);
    }

    document.querySelector('.tags').appendChild(tagsList);

    const previewRating = document.querySelector(".preview-rating p");
    previewRating.textContent = restaurant.rating;


    let fieldsetElement = document.createElement('fieldset');
    fieldsetElement.classList.add('rate', 'blocked');

    // Define an array of rating values

    var restaurant_rating = 0;
    for(i = 1; i <= 10; i += 1){
        if(restaurant.rating < ranges[i]){
            restaurant_rating = roundedValues[i - 1];
            break;
        }
    };
    if (restaurant.rating == 5) {
        restaurant_rating = 5;
    }


    ratings.forEach((rating) => {
        let inputElement = document.createElement('input');
        inputElement.type = 'radio';
        inputElement.id = `0-rating${rating}`;
        inputElement.name = `restrating`;
        inputElement.value = rating;
        if(restaurant_rating == rating){
            inputElement.setAttribute('checked', 'checked');
        }

        let labelElement = document.createElement('label');
        labelElement.htmlFor = `0-rating${rating}`;
        labelElement.title = `${rating} stars`;

        if (rating === 4.5 || rating === 3.5 || rating === 2.5 || rating === 1.5 || rating === 0.5) {
            labelElement.classList.add('half');
        }

        fieldsetElement.appendChild(inputElement);
        fieldsetElement.appendChild(labelElement);
    });

    document.querySelector(".preview-rating").appendChild(fieldsetElement);

    const previewDescription = document.querySelector(".preview-description");
    previewDescription.textContent = restaurant.description;
}

module.exports = {
editreview
};

