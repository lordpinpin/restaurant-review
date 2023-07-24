
function searchdisplay (document, restaurants, reviews, users) {
    const container = document.querySelector(".restaurant-results");
    var count = 0;

    for(let restaurant of restaurants){
        const restaurantItem = document.createElement("div");
        restaurantItem.classList.add("restaurant-item");

        // Create the image element
        const img = document.createElement("img");
        img.classList.add("restaurant-result-image");
        img.src = `${restaurant.mini_pic_url}`;
        restaurantItem.appendChild(img);

        // Create the restaurant details container
        const detailsContainer = document.createElement("div");
        detailsContainer.classList.add("restaurant-result-details");
        restaurantItem.appendChild(detailsContainer);

        // Create the first line (name and rating)
        const firstLine = document.createElement("div");
        firstLine.classList.add("first-line");
        detailsContainer.appendChild(firstLine);

        const nameLink = document.createElement("a");
        nameLink.classList.add("link-effect");
        nameLink.href = `/restaurants/${restaurant.url}`;
        const restaurantName = document.createElement("h1");
        restaurantName.textContent = restaurant.name;
        nameLink.appendChild(restaurantName);
        firstLine.appendChild(nameLink);

        const resultRate = document.createElement("div");
        resultRate.classList.add("result-rate");
        firstLine.appendChild(resultRate);

        const rating = document.createElement("p");
        rating.textContent = restaurant.rating;
        resultRate.appendChild(rating);


        const fieldsetElement = document.createElement('fieldset');
        fieldsetElement.classList.add('rate', 'blocked');

        let ratings = [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5];

        const ranges = [0, 0.75, 1.25, 1.75, 2.25, 2.75, 3.25, 3.75, 4.25, 4.75, 5]; // Range values
        const roundedValues = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
        var restaurant_rating = 0;

        for(i = 1; i <= 10; i += 1){
            if(restaurant.rating < ranges[i]){
                restaurant_rating = roundedValues[i - 1];
                console.log(restaurant_rating);
                break;
            }
        };

        if (restaurant.rating === 5) {
            restaurant_rating = 5;
        }

        ratings.forEach((rating) => {
            let inputElement = document.createElement('input');
            inputElement.type = 'radio';
            inputElement.id = `${count}-rating${rating}`;
            inputElement.name = `rating${count}`;
            inputElement.value = rating;
            if(restaurant_rating === rating){
                inputElement.setAttribute('checked', 'checked');
            }

            let labelElement = document.createElement('label');
            labelElement.htmlFor = `${count}-rating${rating}`;
            labelElement.title = `${rating} stars`;

            if (rating === 4.5 || rating === 3.5 || rating === 2.5 || rating === 1.5 || rating === 0.5) {
                labelElement.classList.add('half');
            }


            fieldsetElement.appendChild(inputElement);
            fieldsetElement.appendChild(labelElement);
        });

        resultRate.appendChild(fieldsetElement);

        // Create the second line (tags and number of reviews)
        const secondLine = document.createElement("div");
        secondLine.classList.add("second-line");
        detailsContainer.appendChild(secondLine);

        const tagsContainer = document.createElement("div");
        tagsContainer.classList.add("tags");
        secondLine.appendChild(tagsContainer);

        const tagsList = document.createElement("ul");
        tagsContainer.appendChild(tagsList);

        for (const tag of restaurant.tags) {
            const li = document.createElement("li");
            li.textContent = tag;
            tagsList.appendChild(li);
        }

        const numberOfReviews = document.createElement("p");
        numberOfReviews.classList.add("numberofreviews");
        numberOfReviews.textContent = `${reviews[count].length} reviews`;
        secondLine.appendChild(numberOfReviews);

        // Create the description
        const description = document.createElement("div");
        description.classList.add("description");
        detailsContainer.appendChild(description);

        const descriptionText = document.createElement("p");
        descriptionText.classList.add("description-text");
        descriptionText.textContent = restaurant.description;
        description.appendChild(descriptionText);

        const dropdownIcon = document.createElement("span");
        dropdownIcon.classList.add("dropdown-icon");
        const ionIcon = document.createElement("ion-icon");
        ionIcon.setAttribute('name', "chevron-down");
        dropdownIcon.appendChild(ionIcon);
        description.appendChild(dropdownIcon);

        // Create the sample review
        const sampleReview = document.createElement("div");
        sampleReview.classList.add("sample-review");
        detailsContainer.appendChild(sampleReview);

        // Create the review top section (reviewer name, image, rating, and date)
        const reviewTop = document.createElement("div");
        reviewTop.classList.add("review-top");
        sampleReview.appendChild(reviewTop);

        const profileDetails = document.createElement("div");
        profileDetails.classList.add("profile-details");
        reviewTop.appendChild(profileDetails);

        const reviewerImage = document.createElement("img");
        reviewerImage.src = `${users[count][0].profile_picture}`;
        reviewerImage.alt = "";
        reviewerImage.classList.add("profile-pic");
        profileDetails.appendChild(reviewerImage);

        const reviewerNameLink = document.createElement("a");
        reviewerNameLink.classList.add("name");
        reviewerNameLink.href = `/user/${users[count][0].url}`;
        reviewerNameLink.textContent = `${users[count][0].first_name} ${users[count][0].last_name}`;
        profileDetails.appendChild(reviewerNameLink);

        const reviewRating = document.createElement("div");
        reviewRating.classList.add("review-rating");
        profileDetails.appendChild(reviewRating);

        const reviewRatingFieldset = document.createElement("fieldset");
        reviewRatingFieldset.classList.add("rate", "blocked");
        reviewRating.appendChild(reviewRatingFieldset);

        ratings.forEach((rating) => {
            let inputElement = document.createElement('input');
            inputElement.type = 'radio';
            inputElement.id = `${count}-review${rating}`;
            inputElement.name = `review${count}`;
            inputElement.value = rating;
            if(reviews[count][0].rating === rating){
                inputElement.setAttribute('checked', 'checked');
            }

            let labelElement = document.createElement('label');
            labelElement.htmlFor = `${count}-review${rating}`;
            labelElement.title = `${rating} stars`;

            if (rating === 4.5 || rating === 3.5 || rating === 2.5 || rating === 1.5 || rating === 0.5) {
                labelElement.classList.add('half');
            }

            reviewRatingFieldset.appendChild(inputElement);
            reviewRatingFieldset.appendChild(labelElement);
        });


        const reviewDate = document.createElement("h4");
        reviewDate.classList.add("date");
        var review_date = reviews[count][0].date;
        dateString = `${review_date.getFullYear()}-${review_date.getMonth() + 1}-${review_date.getDate()} ${review_date.getHours()}:${review_date.getMinutes()}:${review_date.getSeconds()}`;

        if(reviews[count][0].edited){
            reviewDate.textContent = `Edited ${dateString}`;
        } else {
            reviewDate.textContent = dateString;
        }
        reviewTop.appendChild(reviewDate);

        // Create the review details section
        const reviewDetails = document.createElement("div");
        reviewDetails.classList.add("review-details");
        sampleReview.appendChild(reviewDetails);

        const titleH1 = document.createElement('h1');
         titleH1.classList.add('description-title');
        titleH1.textContent = reviews[count][0].title;

        reviewDetails.appendChild(titleH1);

        const reviewText = document.createElement("p");
        reviewText.classList.add("description-text");
        reviewText.innerHTML = reviews[count][0].body;

        if(!(reviews[count][0].readmore === "")){
            const spanElement = document.createElement("span");
            spanElement.classList.add("readmore-text", "unrevealed");
            spanElement.innerHTML = reviews[count][0].readmore;

            const anchorElement = document.createElement("a");
            anchorElement.classList.add("read");
            anchorElement.setAttribute("onclick", "readMore(this)");
            anchorElement.textContent = " ...Read More.";

            reviewText.appendChild(spanElement);
            reviewText.appendChild(anchorElement);
        }

        reviewDetails.appendChild(reviewText);

        if(reviews[count][0].media != undefined && reviews[count][0].media.length != 0){

            const mediaDiv = document.createElement('div');
            mediaDiv.classList.add('media');

            for (const image of reviews[count][0].media) {
                const mediaSquareDiv = document.createElement('div');
                mediaSquareDiv.classList.add('media-square');

                const img = document.createElement('img');
                img.classList.add('media-item');
                img.setAttribute('src', `${image}`);
                img.setAttribute('onclick', 'imageModal(this)');

                mediaSquareDiv.appendChild(img);
                mediaDiv.appendChild(mediaSquareDiv);
            }
            reviewDetails.appendChild(mediaDiv);
        }

        container.appendChild(restaurantItem);
        count++;
    }
}

module.exports = {
searchdisplay
};

