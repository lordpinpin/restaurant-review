
function profilepage (document, cur_user_id, user, num, reviews, restaurants) {

    const avatarImage = document.querySelector(".avatar img");
    avatarImage.src = `${user.profile_picture}`;

    const profileName = document.querySelector(".profile-name");
    profileName.textContent = `${user.first_name} ${user.last_name.charAt(0).toUpperCase()}.`;



    const profileSubtext = document.querySelector(".profile-subtext");
    profileSubtext.textContent = `${user.nickname}, ${user.gender}, ${user.pronouns}`;

    // Create p element for the number of reviews
    const reviewsCount = document.querySelector(".total-reviews p");
    reviewsCount.textContent = `${num} review/s`;

    // Create p element for profile description
    const profileDescription = document.querySelector(".profile-description");
    profileDescription.textContent = user.description;

    var count = 0;
    const container = document.querySelector(".review-container");

    for(let review of reviews){
        const reviewDiv = document.createElement("div");
        reviewDiv.classList.add("review");

        // Create profile-review-details div
        const profileReviewDetailsDiv = document.createElement("div");
        profileReviewDetailsDiv.classList.add("profile-review-details");

        // Create profile-review-top div
        const profileReviewTopDiv = document.createElement("div");
        profileReviewTopDiv.classList.add("profile-review-top");

        // Create img element with class "review-img"
        const reviewImg = document.createElement("img");
        reviewImg.classList.add("review-img");
        reviewImg.src = `${restaurants[count][0].mini_pic_url}`;

        // Create review-restaurant-details div
        const reviewRestaurantDetailsDiv = document.createElement("div");
        reviewRestaurantDetailsDiv.classList.add("review-restaurant-details");

        // Create review-restaurant div
        const reviewRestaurantDiv = document.createElement("div");
        reviewRestaurantDiv.classList.add("review-restaurant");

        // Create anchor element with class "review-restaurant-name" and href attribute
        const restaurantNameLink = document.createElement("a");
        restaurantNameLink.classList.add("review-restaurant-name", "link-effect");
        restaurantNameLink.href = `/restaurants/${restaurants[count][0].url}`;

        // Create h1 element with restaurant name
        const restaurantNameH1 = document.createElement("h1");
        restaurantNameH1.textContent = restaurants[count][0].name;

        // Append h1 element to the anchor element
        restaurantNameLink.appendChild(restaurantNameH1);

        // Create tags div
        const tagsDiv = document.createElement("div");
        tagsDiv.classList.add("tags");
        reviewRestaurantDetailsDiv.appendChild(tagsDiv);

        const tagsList = document.createElement("ul");
        tagsDiv.appendChild(tagsList);

        for (const tag of restaurants[count][0].tags) {
            const li = document.createElement("li");
            li.textContent = tag;
            tagsList.appendChild(li);
        }

        // Append anchor and tags elements to review-restaurant div
        reviewRestaurantDiv.appendChild(restaurantNameLink);
        reviewRestaurantDiv.appendChild(tagsDiv);

        // Append review-restaurant div to review-restaurant-details div
        reviewRestaurantDetailsDiv.appendChild(reviewRestaurantDiv);

        // Append img element and review-restaurant-details div to profile-review-top div
        profileReviewTopDiv.appendChild(reviewImg);
        profileReviewTopDiv.appendChild(reviewRestaurantDetailsDiv);

        // Create review-rating div
        const reviewRatingDiv = document.createElement("div");
        reviewRatingDiv.classList.add("review-rating");

        // Create profile-review-rate div
        const profileReviewRateDiv = document.createElement("div");
        profileReviewRateDiv.classList.add("profile-review-rate");

        // Create fieldset element with class "rate blocked"
        const ratingFieldset = document.createElement("fieldset");
        ratingFieldset.classList.add("rate", "blocked");

        // Create 10 input elements with different ratings and labels for stars
        let ratings = [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5];

        ratings.forEach((rating) => {
            let inputElement = document.createElement('input');
            inputElement.type = 'radio';
            inputElement.id = `${count}-review${rating}`;
            inputElement.name = `review${count}`;
            inputElement.value = rating;
            if(review.rating === rating){
                inputElement.setAttribute('checked', 'checked');
            }

            let labelElement = document.createElement('label');
            labelElement.htmlFor = `${count}-review${rating}`;
            labelElement.title = `${rating} stars`;

            if (rating === 4.5 || rating === 3.5 || rating === 2.5 || rating === 1.5 || rating === 0.5) {
                labelElement.classList.add('half');
            }

            ratingFieldset.appendChild(inputElement);
            ratingFieldset.appendChild(labelElement);
        });

        // Append fieldset to profile-review-rate div
        profileReviewRateDiv.appendChild(ratingFieldset);

        var modifyReview = []


        console.log(`${cur_user_id === user._id.toString()}`);

        if(cur_user_id != undefined && cur_user_id === user._id.toString()){
            console.log("adding modify");
            const modifyReviewDiv = document.createElement("div");
            modifyReviewDiv.classList.add('modify-review');

            // Create the edit link
            const editLink = document.createElement('a');
            editLink.classList.add('edit');
            editLink.textContent = 'Edit';
            editLink.href = `/edit-review?review=${review._id}`;

            // Create the "|" paragraph element
            const separator = document.createElement('p');
            separator.textContent = '|';

            // Create the delete link
            const deleteLink = document.createElement('p');
            deleteLink.classList.add('delete');
            deleteLink.textContent = 'Delete';

            // Append the elements to the modify-review div
            modifyReviewDiv.appendChild(editLink);
            modifyReviewDiv.appendChild(separator);
            modifyReviewDiv.appendChild(deleteLink);

            modifyReview.push(modifyReviewDiv);
        }

        console.log(modifyReview);

        // Create h4 element with class "date" for the date
        const dateH4 = document.createElement("h4");
        dateH4.classList.add("date");
        var review_date = review.date;
        dateString = `${review_date.getFullYear()}-${review_date.getMonth() + 1}-${review_date.getDate()} ${review_date.getHours()}:${review_date.getMinutes()}:${review_date.getSeconds()}`;

        if(review.edited){
            dateH4.textContent = `Edited ${dateString}`;
        } else {
            dateH4.textContent = dateString;
        }

        // Append profile-review-rate div and date h4 element to review-rating div
        reviewRatingDiv.appendChild(profileReviewRateDiv);
        if(modifyReview.length > 0){
            reviewRatingDiv.appendChild(modifyReview[0]);
        }
        reviewRatingDiv.appendChild(dateH4);

        // Create own-review div
        const ownReviewDiv = document.createElement("div");
        ownReviewDiv.classList.add("own-review");

        const titleH1 = document.createElement('h1');
        titleH1.classList.add('description-title');
        titleH1.textContent = review.title;


        // Create p element with class "rev" for the review text
        const reviewTextP = document.createElement("p");
        reviewTextP.classList.add("rev");
        reviewTextP.innerHTML = review.body;
        ownReviewDiv.appendChild(reviewTextP);

        if((!(review.readmore === ""))){
            const spanElement = document.createElement("span");
            spanElement.classList.add("readmore-text", "unrevealed");
            spanElement.innerHTML = review.readmore;

            const anchorElement = document.createElement("a");
            anchorElement.classList.add("read");
            anchorElement.setAttribute("onclick", "readMore(this)");
            anchorElement.textContent = " ...Read More.";

            reviewTextP.appendChild(spanElement);
            reviewTextP.appendChild(anchorElement);
        }

        mediaDivs = [];

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

                mediaSquareDiv.appendChild(img);
                mediaDiv.appendChild(mediaSquareDiv);
            }
            mediaDivs.push(mediaDiv);

        }

        // Append profile-review-top div, review-rating div, and own-review div to profile-review-details div
        profileReviewDetailsDiv.appendChild(profileReviewTopDiv);
        profileReviewDetailsDiv.appendChild(reviewRatingDiv);
        profileReviewDetailsDiv.appendChild(titleH1);
        profileReviewDetailsDiv.appendChild(ownReviewDiv);
        for(let mediaDiv of mediaDivs){
            profileReviewDetailsDiv.appendChild(mediaDiv);
        }

        // Append profile-review-details div to the review div
        reviewDiv.appendChild(profileReviewDetailsDiv);

        // Add the review div to the document's body or any desired parent element
        container.appendChild(reviewDiv)
        count++;
    }
}



module.exports = {
    profilepage
}

