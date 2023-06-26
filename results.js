const dropdown = document.querySelectorAll('.dropdown-icon');
const dropdownReviews = document.querySelectorAll('.sample-review');

for (let i = 0; i < dropdown.length; i++) {
    dropdown[i].addEventListener("click", function() {
        dropdownReviews[i].classList.toggle('active');
        dropdown[i].classList.toggle('active');
    });
}

