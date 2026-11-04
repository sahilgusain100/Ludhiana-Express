const username=document.getElementById("username");
const popup=document.getElementById("popup");
const enter=document.getElementById("enter");
const icon=document.getElementById("icon");
const bookServiceBtn=document.getElementById("btn");
const popupname=document.getElementById("popupname");
const userText=document.getElementById("userText");
const you=document.getElementById("you");
const youPopup=document.getElementById("youPopup");
const youclose=document.getElementById("youClose");

const options=document.getElementById("services");
options.addEventListener("click",()=>{
  window.location.href="service.html";
})
const contactUs=document.getElementById("contact-us");
contactUs.addEventListener("click",()=>{
  window.location.href="contactus.html";
})

const aboutUs=document.getElementById("about-us");
aboutUs.addEventListener("click",()=>{
  window.location.href="aboutUs.html";
})
enter.addEventListener("click",()=>{
    userText.innerText=popupname.value;
     localStorage.setItem("userText",popupname.value);
    popup.style.display="none";
     icon.style.display="block";

    
})
bookServiceBtn.addEventListener("click",()=>{
  window.location.href="service.html";
})
username.addEventListener("click",()=>{
    popup.style.display="block";
   
})
icon.addEventListener("click",(event)=>{
    if(popupname.value.trim()===""){
        alert("Please enter a name");
        return;
    }

   event.stopPropagation();
    icon.style.display="none";
    userText.innerText="Username";
    localStorage.removeItem("userText");
})



you.addEventListener("click", () => {

    const order = JSON.parse(localStorage.getItem("orderData"));
    const message = JSON.parse(localStorage.getItem("messageData"));
    const username = localStorage.getItem("userText");

    let output = `
        <h2>Hi, ${username ? username : "User"} 👋</h2>
        <hr>
    `;
    if(order){
        output += `
        <h3>📦 Your Order</h3>
        <p><b>Name:</b> ${order.name}</p>
        <p><b>Email:</b> ${order.email}</p>
        <p><b>Phone:</b> ${order.phone}</p>
        <p><b>Total:</b> ₹${order.total}</p>
        <hr>
        <p><b>Services:</b></p>
        `;

        order.services.forEach(s => {
            output += `<p>✔ ${s.name} - ₹${s.price}</p>`;
        });
    }
    else{
        output += `<h3>❌ No order is placed</h3>`;
    }

    output += `<hr>`;

    if(message){
        output += `
        <h3>💬 Your Message</h3>
        <p><b>Name:</b> ${message.name}</p>
        <p><b>Email:</b> ${message.email}</p>
        <p><b>Phone:</b> ${message.phone}</p>
        <p><b>Message:</b> ${message.message}</p>
        `;
    }
    else{
        output += `<h3>❌ No message is sent</h3>`;
    }

    // FIXED HERE
    const youPopup = document.getElementById("youPopup");

    youPopup.style.display = "block";
    youPopup.innerHTML = `
        <p id="youClose">X</p>
        ${output}
    `;

    document.getElementById("youClose").onclick = () => {
        youPopup.style.display = "none";
    };
});