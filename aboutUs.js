// =====================
// NAVIGATION
// =====================

const options = document.getElementById("services");
const home = document.getElementById("home");
const contactUs = document.getElementById("contact-us");
const username = document.getElementById("username");
const popup = document.getElementById("popup");
const enter = document.getElementById("enter");
const icon = document.getElementById("icon");
const userText = document.getElementById("userText");
const popupname = document.getElementById("popupname");
const you = document.getElementById("you");
const youPopup = document.getElementById("youPopup");


// =====================
// PAGE NAVIGATION
// =====================

options.addEventListener("click", () => {
    window.location.href = "service.html";
});

home.addEventListener("click", () => {
    window.location.href = "index.html";
});

contactUs.addEventListener("click", () => {
    window.location.href = "contactus.html";
});


// =====================
// USERNAME POPUP
// =====================

username.addEventListener("click", () => {
    popup.style.display = "block";
});


// =====================
// ENTER NAME
// =====================

enter.addEventListener("click", () => {

    const name = popupname.value.trim();

    if (name === "") {
        alert("Please enter a name");
        return;
    }

    userText.innerText = name;

    localStorage.setItem("userText", name);

    popup.style.display = "none";

    icon.style.display = "block";
});


// =====================
// LOAD SAVED USER
// =====================

const savedUser = localStorage.getItem("userText");

if (savedUser) {
    userText.innerText = savedUser;
    icon.style.display = "block";
}


// =====================
// LOGOUT
// =====================

icon.addEventListener("click", (event) => {

    event.stopPropagation();

    icon.style.display = "none";

    userText.innerText = "Username";

    popupname.value = "";

    localStorage.removeItem("userText");
    localStorage.removeItem("orderData");
localStorage.removeItem("messageData");
});


// =====================
// YOU POPUP
// =====================

you.addEventListener("click", () => {

    const order = JSON.parse(localStorage.getItem("orderData"));

    const message =
        JSON.parse(localStorage.getItem("messageData"));

    const currentUser =
        localStorage.getItem("userText");

    let output = `
        <h2>Hi, ${currentUser || "User"} 👋</h2>
        <hr>
    `;


    // ORDER

    if (order) {

        output += `
            <h3>📦 Your Order</h3>

            <p><b>Name:</b> ${order.name}</p>

            <p><b>Email:</b> ${order.email}</p>

            <p><b>Phone:</b> ${order.phone}</p>

            <p><b>Total:</b> ₹${order.total}</p>

            <hr>

            <p><b>Services:</b></p>
        `;

        if (order.services) {

            order.services.forEach(service => {

                output += `
                <p>
                ✔ ${service.name}
                - ₹${service.price}
                </p>
                `;

            });

        }

    }

    else {

        output += `
        <h3>❌ No order is placed</h3>
        `;

    }


    output += `<hr>`;


    // MESSAGE

    if (message) {

        output += `
            <h3>💬 Your Message</h3>

            <p><b>Name:</b> ${message.name}</p>

            <p><b>Email:</b> ${message.email}</p>

            <p><b>Phone:</b> ${message.phone}</p>

            <p><b>Message:</b> ${message.message}</p>
        `;

    }

    else {

        output += `
        <h3>❌ No message is sent</h3>
        `;

    }


    // SHOW POPUP

    youPopup.style.display = "block";

    youPopup.innerHTML = `
        <p id="youClose">✖</p>
        ${output}
    `;


    // CLOSE BUTTON

    document
        .getElementById("youClose")
        .addEventListener("click", () => {

            youPopup.style.display = "none";

        });

});


// =====================
// CLOSE POPUP ON OUTSIDE CLICK
// =====================

window.addEventListener("click", (event) => {

    if (event.target === popup) {

        popup.style.display = "none";

    }

});