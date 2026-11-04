// ================= CONTACT FORM =================

const nameInput = document.getElementById("name");
const mail = document.getElementById("Email");
const phone = document.getElementById("phNo");
const msg = document.getElementById("msg");
const sendBtn = document.getElementById("sendBtn");

window.onload = function () {

    const data = JSON.parse(
        localStorage.getItem("orderData")
    );

    if (data) {
        nameInput.value = data.name || "";
        mail.value = data.email || "";
        phone.value = data.phone || "";
    }

};


// ================= NAVIGATION =================

const home =
    document.getElementById("home");

const services =
    document.getElementById("services");

const contact =
    document.getElementById("contact-us");

const about =
    document.getElementById("about-us");


if (home) {

    home.onclick = () => {

        window.location.href =
            "index.html";

    };

}

if (services) {

    services.onclick = () => {

        window.location.href =
            "service.html";

    };

}

if (contact) {

    contact.onclick = () => {

        window.location.href =
            "contactus.html";

    };

}

if (about) {

    about.onclick = () => {

        window.location.href =
            "aboutUs.html";

    };

}


// ================= USERNAME =================

const popup =
    document.getElementById("popup");

const username =
    document.getElementById("username");

const userText =
    document.getElementById("userText");

const popupname =
    document.getElementById("popupname");

const saveUser =
    document.getElementById("enter");

const icon =
    document.getElementById("icon");


const saved =
    localStorage.getItem("userText");


if (saved) {

    userText.innerText =
        saved;

    icon.style.display =
        "block";

}


if (username) {

    username.onclick = () => {

        popup.style.display =
            "block";

    };

}


if (saveUser) {

    saveUser.onclick = () => {

        if (
            popupname.value.trim()
            === ""
        ) {

            alert(
                "Enter Name"
            );

            return;

        }

        userText.innerText =
            popupname.value;

        localStorage.setItem(
            "userText",
            popupname.value
        );

        icon.style.display =
            "block";

        popup.style.display =
            "none";

    };

}


if (icon) {

    icon.onclick = (e) => {

        e.stopPropagation();

        userText.innerText =
            "Username";

        icon.style.display =
            "none";

        localStorage.removeItem(
            "userText"
        );
        localStorage.removeItem("orderData");
localStorage.removeItem("messageData");

    };

}


// ================= YOU POPUP =================

// ================= YOU POPUP =================

const you = document.getElementById("you");
const youPopup = document.getElementById("youPopup");


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



// ================= CONTACT SUBMIT =================

const messagePopup =
    document.getElementById("msgPopup");

if (sendBtn) {

    sendBtn.onclick = () => {

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const phonePattern =
            /^[0-9]{10}$/;


        if (
            nameInput.value.trim() === "" ||
            mail.value.trim() === "" ||
            phone.value.trim() === "" ||
            msg.value.trim() === ""
        ) {

            alert("Fill all details");

            return;

        }


        if (
            !emailPattern.test(mail.value)
        ) {

            alert("Invalid Email");

            return;

        }


        if (
            !phonePattern.test(phone.value)
        ) {

            alert("Invalid Phone");

            return;

        }


        localStorage.setItem(

            "messageData",

            JSON.stringify({

                name: nameInput.value,

                email: mail.value,

                phone: phone.value,

                message: msg.value

            })

        );


        messagePopup.innerHTML = `

<p id="close">×</p>

<h2>Message Sent Successfully</h2>

<hr>

<p><b>Name:</b> ${nameInput.value}</p>

<p><b>Email:</b> ${mail.value}</p>

<p><b>Phone:</b> ${phone.value}</p>

<p><b>Message:</b> ${msg.value}</p>

`;

        messagePopup.style.display =
            "block";


        document
            .getElementById("close")
            .onclick = () => {

                messagePopup.style.display =
                    "none";

            };

    };

}