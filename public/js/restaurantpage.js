function restaurantpage(document, restaurant, reviews, users) {
    const pic = document.querySelector('.banner-container img');
    pic.src = restaurant.banner_url;
    const name = document.querySelector('.banner-first-line h1');
    console.log(name);
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
    console.log(reviews);
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
        console.log(occurences[`${num}`])
        if (occurences[`${num}`]) {
          occurences[`${num}`] += 1;
        } else {
          occurences[`${num}`] = 1;
        }

        if (occurences[`${num}`] > highestOccuring){
            highestOccuring = occurences[`${num}`];
        }
    }

    console.log(occurences);

    for (let rating of ratings) {
        var bar = "";
        console.log(`bar-${rating}`);
        if(rating == 5 || rating == 4 || rating == 3 || rating == 2 || rating == 1){
            bar = document.querySelector(`.bar-${rating}`);
        } else {
            bar = document.querySelector(`.bar-${rating - 0.5}5`);
        }
        console.log(highestOccuring);
        console.log(occurences[`${rating}`]);
        console.log((occurences[`${rating}`] / highestOccuring)*100);
        bar.style.width = `${(occurences[`${rating}`] / highestOccuring)*100}%`;
        bar.parentNode.parentNode.querySelector('.rating-total-numbers').textContent = occurences[`${rating}`];
    }





}

module.exports = {
    restaurantpage
}
