function editreply (document, review, user) {

    console.log(user);

    const title = document.querySelector('.choose-name');
    title.textContent = `Reply to ${user.first_name} ${user.last_name}`;

    let ratings = [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5];
    const previewImage = document.querySelector(".preview-image img");
    previewImage.src = user.profile_picture;

    const previewName = document.querySelector(".preview-name h3");
    previewName.textContent = `${user.first_name} ${user.last_name}`;

    let fieldsetElement = document.createElement('fieldset');
    fieldsetElement.classList.add('rate', 'blocked');

    ratings.forEach((rating) => {
        let inputElement = document.createElement('input');
        inputElement.type = 'radio';
        inputElement.id = `rating${rating}`;
        inputElement.name = `restrating`;
        inputElement.value = rating;
        if(review.rating == rating){
            inputElement.setAttribute('checked', 'checked');
        }

        let labelElement = document.createElement('label');
        labelElement.htmlFor = `rating${rating}`;
        labelElement.title = `${rating} stars`;

        if (rating === 4.5 || rating === 3.5 || rating === 2.5 || rating === 1.5 || rating === 0.5) {
            labelElement.classList.add('half');
        }

        fieldsetElement.appendChild(inputElement);
        fieldsetElement.appendChild(labelElement);
    });
    document.querySelector(".preview-rating").appendChild(fieldsetElement);

    document.querySelector('.reply').innerHTML = review.reply;

    const previewDescription = document.querySelector(".preview-description");
    previewDescription.innerHTML = review.body + review.readmore;
}


module.exports = {
editreply,
};


