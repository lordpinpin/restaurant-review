function readMore(readmore) {
    var moreText = readmore.previousElementSibling;

    if (moreText.classList.contains('unrevealed')) {
        moreText.classList.remove('unrevealed');
        moreText.classList.add('revealed')
        readmore.innerHTML = "Read Less";
    } else {
        moreText.classList.remove('revealed');
        moreText.classList.add('unrevealed')
        readmore.innerHTML = "Read More.";
    }
  }
