function dashboard(document, restaurant, reviews, users) {
    const pic = document.querySelector('.banner-container img');
    pic.src = restaurant.banner_url;
    const name = document.querySelector('.banner-first-line h1');
    name.textContent = restaurant.name;
    const location = document.querySelector('.location');
    location.textContent = restaurant.location;
    const restaurantRatingDiv = document.querySelector('.restaurant-rate')
    restaurantRatingDiv.querySelector('p').textContent = restaurant.rating;

    // Dynamically create and add tags to the tag list

    const tagsList = document.createElement("ul");
    for (const tag of restaurant.tags) {
        const li = document.createElement("li");
        li.textContent = tag;
        tagsList.appendChild(li);
    }
    document.querySelector('.tags').appendChild(tagsList);

    const ratingFieldset = document.createElement("fieldset");
    ratingFieldset.classList.add("rate", "blocked");

    // Create 10 input elements with different ratings and labels for stars

    let ratings = [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5];

    const ranges = [0, 0.75, 1.25, 1.75, 2.25, 2.75, 3.25, 3.75, 4.25, 4.75, 5]; // Range values
    const roundedValues = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
    var restaurant_rating = 0;

    for(i = 1; i <= 10; i += 1){
        if(restaurant.rating < ranges[i]){
            restaurant_rating = roundedValues[i - 1];
            break;
        }
    };

    if (restaurant.rating === 5) {
        restaurant_rating = 5;
    }

    ratings.forEach((rating) => {
        let inputElement = document.createElement('input');
        inputElement.type = 'radio';
        inputElement.id = `rest${rating}`;
        inputElement.name = `rest`;
        inputElement.value = rating;
        if(restaurant_rating === rating){
            inputElement.setAttribute('checked', 'checked');
        }

        let labelElement = document.createElement('label');
        labelElement.htmlFor = `rest${rating}`;
        labelElement.title = `${rating} stars`;

        if (rating === 4.5 || rating === 3.5 || rating === 2.5 || rating === 1.5 || rating === 0.5) {
            labelElement.classList.add('half');
        }

        ratingFieldset.appendChild(inputElement);
        ratingFieldset.appendChild(labelElement);
    });
    restaurantRatingDiv.appendChild(ratingFieldset);

    document.querySelector('.restaurant-description p').textContent = restaurant.description;

    var allratings = [];
    for(let review of reviews){
        allratings.push(review.rating);
    }
    var occurences = {
        '0.5': 0,
        '1': 0,
        '1.5': 0,
        '2': 0,
        '2.5': 0,
        '3': 0,
        '3.5': 0,
        '4': 0,
        '4.5': 0,
        '5': 0
    }

    var highestOccuring = 0;

    for (var num of allratings) {
        if (occurences[`${num}`]) {
          occurences[`${num}`] += 1;
        } else {
          occurences[`${num}`] = 1;
        }

        if (occurences[`${num}`] > highestOccuring){
            highestOccuring = occurences[`${num}`];
        }
    }

    for (let rating of ratings) {
        var bar = "";
        if(rating == 5 || rating == 4 || rating == 3 || rating == 2 || rating == 1){
            bar = document.querySelector(`.bar-${rating}`);
        } else {
            bar = document.querySelector(`.bar-${rating - 0.5}5`);
        }
        bar.style.width = `${(occurences[`${rating}`] / highestOccuring)*100}%`;
        bar.parentNode.parentNode.querySelector('.rating-total-numbers').textContent = occurences[`${rating}`];
    }

    const restaurantPage = document.querySelector('.restaurant-page');

    // REVIEWS
    for(let i = 0; i < reviews.length; i++){

        const reviewElement = document.createElement('div');
        reviewElement.classList.add('restaurant-review');

        // Create review-top element
            const reviewTopElement = document.createElement('div');
            reviewTopElement.classList.add('review-top');

        // Create profile-details element
        const profileDetailsElement = document.createElement('div');
        profileDetailsElement.classList.add('profile-details');

        // Add profile pic and name
        const profilePicElement = document.createElement('img');
        profilePicElement.src = users[i][0].profile_picture;
        profilePicElement.alt = '';
        profilePicElement.classList.add('profile-pic');

        const nameLinkElement = document.createElement('a');
        nameLinkElement.classList.add('name');
        nameLinkElement.textContent = `${users[i][0].first_name} ${users[i][0].last_name}`;

        profileDetailsElement.appendChild(profilePicElement);
        profileDetailsElement.appendChild(nameLinkElement);

        // Create review-rating element
        const reviewRatingElement = document.createElement('div');
        reviewRatingElement.classList.add('review-rating');

        const ratingFieldset = document.createElement('fieldset');
        ratingFieldset.classList.add("rate", "blocked");

        let ratings = [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5];

        ratings.forEach((rating) => {
            let inputElement = document.createElement('input');
            inputElement.type = 'radio';
            inputElement.id = `${i}-review${rating}`;
            inputElement.name = `review${i}`;
            inputElement.value = rating;
            if(reviews[i].rating === rating){
                inputElement.setAttribute('checked', 'checked');
            }

            let labelElement = document.createElement('label');
            labelElement.htmlFor = `${i}-review${rating}`;
            labelElement.title = `${rating} stars`;

            if (rating === 4.5 || rating === 3.5 || rating === 2.5 || rating === 1.5 || rating === 0.5) {
                labelElement.classList.add('half');
            }

            ratingFieldset.appendChild(inputElement);
            ratingFieldset.appendChild(labelElement);
        });
        reviewRatingElement.appendChild(ratingFieldset);

        // Add profile-details and review-rating to review-top
        reviewTopElement.appendChild(profileDetailsElement);
        profileDetailsElement.appendChild(reviewRatingElement);

        // Add date
        const dateElement = document.createElement('h4');
        dateElement.classList.add('date');
        var review_date = reviews[i].date;
        dateString = `${review_date.getFullYear()}-${review_date.getMonth() + 1}-${review_date.getDate()} ${review_date.getHours()}:${review_date.getMinutes()}:${review_date.getSeconds()}`;

        if(reviews[i].edited){
            dateElement.textContent = `Edited ${dateString}`;
        } else {
            dateElement.textContent = dateString;
        }
        reviewTopElement.appendChild(dateElement);

        // Create review-details element
        const reviewDetailsElement = document.createElement('div');
        reviewDetailsElement.classList.add('review-details');

        // Add review description and readmore section
        const descriptionTitleElement = document.createElement('h1');
        descriptionTitleElement.classList.add('description-title');
        descriptionTitleElement.textContent = reviews[i].title;

        const descriptionTextElement = document.createElement('p');
        descriptionTextElement.classList.add('description-text');
        descriptionTextElement.innerHTML = reviews[i].body;

        if((!(reviews[i].readmore === ""))){
            const readmoreTextElement = document.createElement('span');
            readmoreTextElement.classList.add('readmore-text', 'unrevealed');
            readmoreTextElement.innerHTML = reviews[i].readmore;

            const readMoreLinkElement = document.createElement('a');
            readMoreLinkElement.classList.add('read');
            readMoreLinkElement.textContent = ' ...Read More.';
            readMoreLinkElement.setAttribute("onclick", "readMore(this)");

            descriptionTextElement.appendChild(readmoreTextElement);
            descriptionTextElement.appendChild(readMoreLinkElement);
        }
        // Add media section
        const mediaElement = document.createElement('div');
        mediaElement.classList.add('media');

        var mediaDivs = [];

        if(reviews[i].media != undefined && reviews[i].media.length != 0){

            const mediaDiv = document.createElement('div');
            mediaDiv.classList.add('media');

            for (const image of reviews[i].media) {
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
        } else {
            mediaElement.classList.add('hide');
        }

        for(let images of mediaDivs){
            mediaElement.appendChild(images);
        }
        console.log("media checked");

        const usefulCountElement = document.createElement('div');
        usefulCountElement.classList.add('useful-count');
        usefulCountElement.textContent = `${reviews[i].helpful.length} of ${reviews[i].helpful.length + reviews[i].non_helpful.length} people found this review helpful.`;

        const helpfulElement = document.createElement('div');
        helpfulElement.classList.add('helpful');


        helpfulElement.appendChild(usefulCountElement);
        if(reviews[i].reply == undefined || reviews[i].reply.length == 0){
            const yesButtonElement = document.createElement('a');
            yesButtonElement.classList.add('btnSubmit', 'reply');
            yesButtonElement.textContent = 'Reply';
            yesButtonElement.href = `/create-reply?review=${reviews[i]._id.toString()}`;
            helpfulElement.appendChild(yesButtonElement)
        }


        // Add elements to review-details
        reviewDetailsElement.appendChild(descriptionTitleElement);
        reviewDetailsElement.appendChild(descriptionTextElement);
        reviewDetailsElement.appendChild(mediaElement);

        // Add review-top and review-details to restaurant-review
        reviewElement.appendChild(reviewTopElement);
        reviewElement.appendChild(reviewDetailsElement);
        reviewElement.appendChild(helpfulElement);

        if(reviews[i].reply != undefined && reviews[i].reply.length > 0){
            const restaurantReply = document.createElement('div');
            restaurantReply.classList.add('restaurant-reply');
            const replyOwner = document.createElement('h3');
            replyOwner.textContent = `Reply from ${restaurant.name}`;
            const replyContent = document.createElement('p');
            replyContent.textContent = reviews[i].reply;
            restaurantReply.appendChild(replyOwner);
            restaurantReply.appendChild(replyContent);
            reviewElement.appendChild(restaurantReply);
        }


        restaurantPage.appendChild(reviewElement);
  }






}

module.exports = {
    dashboard
}
