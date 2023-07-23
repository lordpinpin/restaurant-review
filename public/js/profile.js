const latestReviewOption = document.querySelector('.latest-review-option');
const allReviewOption = document.querySelector('.all-review-option');
const latestReviews = document.querySelector('.latest-reviews');
const allReviews = document.querySelector('.all-reviews');

function latestReview() {
    if(allReviewOption.classList.contains('current')){
        allReviewOption.classList.remove('current');
        latestReviewOption.classList.add('current');
        allReviews.classList.remove('show');
        allReviews.classList.add('hide');
        latestReviews.classList.remove('hide');
        latestReviews.classList.add('show')

    }
}

function allReview() {
    if(latestReviewOption.classList.contains('current')){
        latestReviewOption.classList.remove('current');
        allReviewOption.classList.add('current');
        latestReviews.classList.remove('show');
        latestReviews.classList.add('hide');
        allReviews.classList.remove('hide');
        allReviews.classList.add('show')
    }
}

module.exports = {
    createProfile
};

