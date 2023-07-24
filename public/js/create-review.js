
const choose = document.querySelector('.choose');
const chooseTitle = document.querySelector('.choose-title');
const chooseNav = document.querySelector('.choose-nav');
const chooseIcon = document.querySelector('.choose-icon');

chooseTitle.addEventListener('click', ()=> {
    choose.classList.toggle('revealed');
    chooseNav.classList.toggle('revealed');
    chooseIcon.classList.toggle('active');
});


