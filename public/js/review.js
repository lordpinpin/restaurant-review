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


const container = document.querySelector('.review-container')

container.addEventListener('click', async (event) => {
      if(event.target.classList.contains('delete')){
      // Show a pop-up warning using confirm()
      const shouldDelete = window.confirm('Are you sure you want to delete this review?');

      // Check if the user clicked "OK"
        if (shouldDelete) {
          try {
            // Send an HTTP request to the server (Express) using fetch
            const response = await fetch("/delete", {
              method: "POST", // or "GET", "PUT", "DELETE", etc., depending on your needs
              removal: event.target.href
            });

            // Check the server's response and handle accordingly
            if (response.ok) {
              // If the request was successful, redirect the user to a new page
              window.location.reload();
            } else {

              console.error("Something went wrong with the request.");
            }
          } catch (error) {
            console.error("Error occurred:", error);
          }
        } else {
          console.log('Review deletion cancelled.');
        }
      }
  });
