
// Window Interaction: Wipe the Window

// Get the HTML elements
const haze = document.getElementById("haze");
const wipeButton = document.getElementById("wipe-button");
const wipeMessage = document.getElementById("wipe-message");

// Keep track of the wipe timer
let wipeTimeout;

// Remove any previous wipe effect
function resetWipe() {
    clearTimeout(wipeTimeout);

    haze.classList.remove("wiped");

    wipeButton.disabled = false;

    wipeMessage.textContent = "Try cleaning the window.";
}

// Wipe the window when the button is clicked
wipeButton.addEventListener("click", function () {

    // Prevent another click while the window is being wiped
    if (wipeButton.disabled) {
        return;
    }

    // Clear any previous timer
    clearTimeout(wipeTimeout);

    // Temporarily remove the haze
    haze.classList.add("wiped");

    // Disable the button during the animation
    wipeButton.disabled = true;

    // Update the message
    wipeMessage.textContent =
        "The glass is clear for a moment, but the air outside has not changed.";

    // Bring the haze back after 2.5 seconds
    wipeTimeout = setTimeout(function () {

        haze.classList.remove("wiped");

        wipeButton.disabled = false;

        wipeMessage.textContent =
            "The pollution is still outside. You cannot wipe it away.";

    }, 2500);

});

// Make the reset function available to other scripts
window.resetWipe = resetWipe;
