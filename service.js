// ================= NAVIGATION =================

const home = document.getElementById("home");
const servicesNav = document.getElementById("services");
const contact = document.getElementById("contact-us");
const about = document.getElementById("about-us");

if (home) {
    home.onclick = () => window.location.href = "index.html";
}

if (servicesNav) {
    servicesNav.onclick = () => window.location.href = "service.html";
}

if (contact) {
    contact.onclick = () => window.location.href = "contactus.html";
}

if (about) {
    about.onclick = () => window.location.href = "aboutUs.html";
}


// ================= USERNAME =================

const popup = document.getElementById("popup");
const username = document.getElementById("username");
const userText = document.getElementById("userText");
const popupname = document.getElementById("popupname");
const enter = document.getElementById("enter");
const icon = document.getElementById("icon");

const saved = localStorage.getItem("userText");

if (saved) {
    userText.innerText = saved;
    icon.style.display = "block";
}

if (username) {
    username.onclick = () => {
        popup.style.display = "block";
    };
}

if (enter) {
    enter.onclick = () => {

        if (popupname.value.trim() === "") {
            alert("Enter Name");
            return;
        }

        userText.innerText = popupname.value;

        localStorage.setItem(
            "userText",
            popupname.value
        );

        icon.style.display = "block";

        popup.style.display = "none";

    };
}

if (icon) {
    icon.onclick = (e) => {

        e.stopPropagation();

        userText.innerText = "Username";

        icon.style.display = "none";

        localStorage.removeItem("userText");
        localStorage.removeItem("orderData");
localStorage.removeItem("messageData");
    };
}


// ================= BOOKING =================

const itemsList = document.getElementById("itemsList");
const amount = document.getElementById("amount");
const book = document.getElementById("Book");
const name = document.getElementById("name");
const mail = document.getElementById("Email");
const phNo = document.getElementById("phNo");
const popupbook = document.getElementById("popup-book");

let totalAmount = 0;

const savedName =
    localStorage.getItem("userText");

if (savedName && name) {
    name.value = savedName;
}


// ================= SERVICES =================

const serviceData = [

    {
        name: "Dry Cleaning",
        price: 500,
        added: false
    },

    {
        name: "Wash & Fold",
        price: 200,
        added: false
    },

    {
        name: "Ironing",
        price: 150,
        added: false
    },

    {
        name: "Stain Removal",
        price: 500,
        added: false
    },

    {
        name: "Leather & Suede Cleaning",
        price: 800,
        added: false
    },

    {
        name: "Wedding Dress Cleaning",
        price: 1000,
        added: false
    }

];


// ================= CART =================

const buttons =
    document.querySelectorAll(".add");

buttons.forEach((button, index) => {

    button.addEventListener("click", () => {

        serviceData[index].added =
            !serviceData[index].added;

        if (serviceData[index].added) {

            button.textContent =
                "(-) Remove Item";

            button.classList.remove("add");

            button.classList.add("remove");

        } else {

            button.textContent =
                "(+) Add Item";

            button.classList.remove("remove");

            button.classList.add("add");

        }

        renderCart();

    });

});

function renderCart() {

    if (!itemsList) return;

    itemsList.innerHTML = "";

    let total = 0;

    let serial = 1;

    serviceData.forEach(service => {

        if (service.added) {

            total += service.price;

            itemsList.innerHTML += `

<div class="cartItem">

<span>${serial}</span>

<span>${service.name}</span>

<span>₹${service.price}</span>

</div>

`;

            serial++;

        }

    });

    totalAmount = total;

    if (amount) {
        amount.textContent = total;
    }

}


// ================= BOOK =================

if (book) {

    book.addEventListener("click", () => {

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const phonePattern =
            /^[0-9]{10}$/;

        if (totalAmount === 0) {

            alert("Please add items");

            return;

        }

        if (
            name.value.trim() === "" ||
            mail.value.trim() === "" ||
            phNo.value.trim() === ""
        ) {

            alert("Fill all details");

            return;

        }

        if (!emailPattern.test(mail.value)) {

            alert("Invalid Email");

            return;

        }

        if (!phonePattern.test(phNo.value)) {

            alert("Invalid Phone");

            return;

        }

        localStorage.setItem(
            "orderData",

            JSON.stringify({

                name: name.value,

                email: mail.value,

                phone: phNo.value,

                services:
                    serviceData.filter(
                        s => s.added
                    ),

                total: totalAmount

            })

        );

        popupbook.style.display =
            "block";

        popupbook.innerHTML = `

<p id="close">X</p>

<h2>Order Placed Successfully</h2>

<hr>

<p>Name:
${name.value}</p>

<p>Email:
${mail.value}</p>

<p>Phone:
${phNo.value}</p>

<p>Total:
₹${totalAmount}</p>

`;

        document
            .getElementById("close")
            .onclick = () => {

                popupbook.style.display =
                    "none";

            };

    });

}