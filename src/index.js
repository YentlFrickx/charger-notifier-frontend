import './style.css';
import './plugtracker.png';
import "./index.html";

// Get the cookie preference value
let cookiePreference = getCookie('cookie_preference');

// If the cookie preference is not set, show the cookie policy
if (!cookiePreference) {
    const cookieModal = document.getElementById('cookie-modal');
    // cookieModal.classList.remove('hidden');
    cookieModal.hidden = false
}

// Function to set cookie
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

// Function to get cookie
function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
        let c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

// Get the cookie policy accept button and set the cookie on click
const cookieAcceptBtn = document.getElementById('cookie-accept-btn');
cookieAcceptBtn.addEventListener('click', function() {
    setCookie('cookie_preference', 'accepted', 365);
    const cookieModal = document.getElementById('cookie-modal');
    cookieModal.hidden = true;
});
