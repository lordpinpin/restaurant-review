const wrapper = document.querySelector('.wrapper');
const backtologinLink = document.querySelector('.backtologin-link');
const loginRestLink = document.querySelector('.login-restaurant-link');
const btnPopup = document.querySelector('.btnLogin-popup');
const iconClose = document.querySelector('.icon-close');
const section = document.querySelector('.section');

const loginBtn = document.querySelector("#login");
const restBtn = document.querySelector("#login-restaurant");


loginBtn.addEventListener("click", function() {
    location.href = "/index-logged.html"
});

restBtn.addEventListener("click", function() {
    location.href = "/index-restlogged.html"
});

loginRestLink.addEventListener('click', ()=> {
    wrapper.classList.add('active-login-restaurant');
});

backtologinLink.addEventListener('click', ()=> {
    wrapper.classList.remove('active-login-restaurant');
});


btnPopup.addEventListener('click', ()=> {
    section.classList.add('blocked');
    wrapper.classList.add('active-popup');
});

iconClose.addEventListener('click', ()=> {
    wrapper.classList.remove('active-popup');
    section.classList.remove('blocked');
});






