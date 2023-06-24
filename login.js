const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const createReview = document.querySelector('.create-review');
const iconClose = document.querySelector('.icon-close');
const section = document.querySelector('.section');

const btn = document.querySelectorAll(".btn");


 for (let i = 0; i < btn.length; i++) {
     btn[i].addEventListener("click", function() {
       location.href = './index-logged.html';
     });
 }

registerLink.addEventListener('click', ()=> {
    wrapper.classList.add('active');
});

loginLink.addEventListener('click', ()=> {
    wrapper.classList.remove('active');
});

btnPopup.addEventListener('click', ()=> {
    section.classList.add('blocked');
    wrapper.classList.add('active-popup');

});

createReview.addEventListener('click', ()=>{
    section.classList.add('blocked');
    wrapper.classList.add('active-popup');
});

iconClose.addEventListener('click', ()=> {
    wrapper.classList.remove('active-popup');
    section.classList.remove('blocked');
});






