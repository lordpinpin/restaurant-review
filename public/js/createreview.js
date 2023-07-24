
function createreview (document, restaurants) {

    const title = document.querySelector('.choose-name');
    title.textContent = `Review`;

    const restaurantList = document.querySelector('.choose-group');

    restaurants.forEach((restaurant) => {
        const li = document.createElement('li');
        li.classList.add('choose-item');

        const a = document.createElement('a');
        a.textContent = restaurant.name;
        a.href = `/create-review/${restaurant.url}`;

        li.appendChild(a);
        restaurantList.appendChild(li);
    });

    const searchbar = document.querySelector(".choose .searchbar-text");
    searchbar.addListener('onkeyup', filterFunction());

    const previewImage = document.querySelector(".preview-image img");
    previewImage.src = "https://res.cloudinary.com/dg28enybo/image/upload/v1690166382/background/1200px-HD_transparent_picture_q7zqkf.png";



}

function createreviewRest (document, restaurants, rest) {

    const title = document.querySelector('.choose-name');
    title.textContent = `Review for ${rest.name}`;

    let ratings = [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5];
    const ranges = [0, 0.75, 1.25, 1.75, 2.25, 2.75, 3.25, 3.75, 4.25, 4.75, 5]; // Range values
    const roundedValues = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];


    let reviewsetElement = document.createElement('fieldset');
    reviewsetElement.setAttribute('name', 'ratingfieldset')
    reviewsetElement.classList.add('rate');
    ratings.forEach((rating) => {
        let inputElement = document.createElement('input');
        inputElement.type = 'radio';
        inputElement.id = `1-rating${rating}`;
        inputElement.name = `reviewrating`;
        inputElement.value = rating;

        let labelElement = document.createElement('label');
        labelElement.htmlFor = `1-rating${rating}`;
        labelElement.title = `${rating} stars`;

        if (rating === 4.5 || rating === 3.5 || rating === 2.5 || rating === 1.5 || rating === 0.5) {
            labelElement.classList.add('half');
        }

        reviewsetElement.appendChild(inputElement);
        reviewsetElement.appendChild(labelElement);
    });

    const restaurantList = document.querySelector('.choose-group');

    restaurants.forEach((restaurant) => {
        const li = document.createElement('li');
        li.classList.add('choose-item');

        const a = document.createElement('a');
        a.textContent = restaurant.name;
        a.href = `/create-review/${restaurant.url}`;

        li.appendChild(a);
        restaurantList.appendChild(li);
    });
    document.querySelector('.review-rate').appendChild(reviewsetElement);

    const previewImage = document.querySelector(".preview-image img");
    previewImage.src = rest.mini_pic_url;

    const previewName = document.querySelector(".preview-name h3");
    previewName.textContent = rest.name;

    var tagRest = rest.tags;
    const tagsList = document.createElement("ul");

    for(let tag of tagRest){
        let liElement = document.createElement('li');
        liElement.textContent = tag;
        tagsList.appendChild(liElement);
    }

    document.querySelector('.tags').appendChild(tagsList);

    const previewRating = document.querySelector(".preview-rating p");
    previewRating.textContent = rest.rating;


    let fieldsetElement = document.createElement('fieldset');
    fieldsetElement.classList.add('rate', 'blocked');

    // Define an array of rating values

    var restaurant_rating = 0;
    for(i = 1; i <= 10; i += 1){
        if(rest.rating < ranges[i]){
            restaurant_rating = roundedValues[i - 1];
            break;
        }
    };
    if (rest.rating == 5) {
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
    previewDescription.textContent = rest.description;

}


module.exports = {
createreview,
createreviewRest
};


