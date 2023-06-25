
const choose = document.querySelector('.choose');
const chooseTitle = document.querySelector('.choose-title');
const chooseSearch = document.querySelector('.searchbar');
const chooseNav = document.querySelector('.choose-nav');
const chooseIcon = document.querySelector('.choose-icon');
const chooseItem = document.querySelectorAll('.choose-item');
const chooseName = document.querySelector('.choose-name');


chooseTitle.addEventListener('click', ()=> {
    choose.classList.toggle('revealed');
    chooseNav.classList.toggle('revealed');
    chooseIcon.classList.toggle('active');
    chooseSearch.classList.toggle('active');
});

for (let i = 0; i < chooseItem.length; i++) {
    chooseItem[i].addEventListener("click", function() {
        chooseName.innerText = (chooseItem[i].innerText);
        choose.classList.remove('revealed');
        chooseNav.classList.remove('revealed');
        chooseIcon.classList.remove('active');
        chooseSearch.classList.remove('active');
    });
}


function filterFunction() {
    var filter, a, i;
    filter = document.querySelector('.searchbar-text').value.toUpperCase();
    a = document.querySelectorAll(".choose-item");
    for (i = 0; i < a.length; i++) {
      txtValue = a[i].textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = "";
      } else {
        a[i].style.display = "none";
      }
    }
  }
