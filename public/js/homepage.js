
function homepage (document, restaurants) {

    const container = document.querySelector(".dashrestaurant-boxes");

    let count = 0;
    for(let restaurant of restaurants){
        let dashRestaurantDiv = document.createElement('div');
        dashRestaurantDiv.classList.add('dashrestaurant');

        let dashTopDiv = document.createElement('div');
        dashTopDiv.classList.add('dashtop');

        let imageElement = document.createElement('img');
        imageElement.classList.add('dashrestaurant-image');
        imageElement.src = `${restaurant.mini_pic_url}`;

        let listDiv = document.createElement('div');
        listDiv.classList.add('list');

        let tagsHeader = document.createElement('h3');
        tagsHeader.textContent = 'Tags';

        let ulElement = document.createElement('ul');

        let tags = restaurant.tags;
        tags.forEach((tag) => {
        let liElement = document.createElement('li');
        liElement.textContent = tag;
        ulElement.appendChild(liElement);
        });

        listDiv.appendChild(tagsHeader);
        listDiv.appendChild(ulElement);

        let dashRateDiv = document.createElement('div');
        dashRateDiv.classList.add('dash-rate');

        let fieldsetElement = document.createElement('fieldset');
        fieldsetElement.classList.add('rate', 'blocked');

        // Define an array of rating values
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

        dashRateDiv.appendChild(fieldsetElement);
        dashTopDiv.appendChild(imageElement);
        dashTopDiv.appendChild(listDiv);
        dashTopDiv.appendChild(dashRateDiv);

        let anchorElement = document.createElement('a');
        anchorElement.classList.add('dashrestaurant-name');
        anchorElement.href = `/restaurants/${restaurant.url}`;
        anchorElement.textContent = restaurant.name;

        dashRestaurantDiv.appendChild(dashTopDiv);
        dashRestaurantDiv.appendChild(anchorElement);

        container.appendChild(dashRestaurantDiv);
        count++;
    }
}

module.exports = {
homepage
};

