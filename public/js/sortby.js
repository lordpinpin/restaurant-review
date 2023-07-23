const sortby = document.querySelector('.sortby');
const sortbyTitle = document.querySelector('.sortby-title');
const sortbyNav = document.querySelector('.sortby-nav');
const sortbyIcon = document.querySelector('.sortby-icon');
const sortbyItem = document.querySelectorAll('.sortby-item');
const sortbyName = document.querySelector('.sortby-name');



sortbyTitle.addEventListener('click', ()=> {
    sortby.classList.toggle('revealed');
    sortbyNav.classList.toggle('revealed');
    sortbyIcon.classList.toggle('active');
});


