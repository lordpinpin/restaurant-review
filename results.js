const dropdown = document.querySelectorAll('.dropdown-icon');
const dropdownReviews = document.querySelectorAll('.sample-review');

const sortby = document.querySelector('.sortby');
const sortbyNav = document.querySelector('.sortby-nav');
const sortbyIcon = document.querySelector('.sortby-icon');

sortby.addEventListener('click', ()=> {
    sortby.classList.toggle('revealed');
    sortbyNav.classList.toggle('revealed');
    sortbyIcon.classList.toggle('active');
});



for (let i = 0; i < dropdown.length; i++) {
    dropdown[i].addEventListener("click", function() {
        dropdownReviews[i].classList.toggle('active');
        dropdown[i].classList.toggle('active');
    });
}
