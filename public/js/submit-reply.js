const emptyDesc = document.querySelector('#emptydesc');
const createReplyForm = document.querySelector('#create-reply');

function isNotEmpty(value) {
    // Use regex to test if the value contains at least one non-whitespace character
    return /\S/.test(value);
}

createReplyForm.addEventListener('submit', async (event) => {
    console.log("check");

    emptyDesc.classList.add("hide");

    if (!isNotEmpty(createReplyForm.elements.reply.value)) {
        event.preventDefault();
        emptyDesc.classList.remove("hide");
    } else {
        createReplyForm.action = window.location.href;
        createReplyForm.submit();
    }
});
