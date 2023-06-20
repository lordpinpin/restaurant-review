const dropDown = document.querySelector('.dropdown');
const dropDownNav = document.querySelector('.dropdown-nav');

dropDown.addEventListener('click', ()=> {
    dropDown.classList.toggle('revealed');
    dropDownNav.classList.toggle('revealed');
});
