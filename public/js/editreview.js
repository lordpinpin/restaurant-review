
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


}

module.exports = {
editreview
};

