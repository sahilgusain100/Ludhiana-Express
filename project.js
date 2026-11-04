const username=document.getElementById("username");
const popup=document.getElementById("popup");
const enter=document.getElementById("enter");
const itemsList=document.getElementById("itemsList");
const amount=document.getElementById("amount");
const book=document.getElementById("Book");
const name=document.getElementById("name");
const mail=document.getElementById("Email");
const phNo=document.getElementById("phNo");
let totalAmount=0;
const home=document.getElementById("home");
const options=document.getElementById("services");
options.addEventListener("click",()=>{
  window.location.href="service.html";
})

home.addEventListener("click",()=>{
  window.location.href="home.html";
})

const secondpage=document.getElementById("secondPage");
const bookServiceBtn=document.getElementById("btn");

bookServiceBtn.addEventListener("click",()=>{
  window.location.href="service.html";
})
username.addEventListener("click",()=>{
    popup.style.display="block";
})

const buttons = document.querySelectorAll(".add");

buttons.forEach((button,index) => {
    button.addEventListener("click", () => {
        console.log("index");
        if(button.classList.contains("add")){
            services[index].added=true;
            button.textContent="(-) Remove Item";
            button.classList.remove("add");
            button.classList.add("remove");
        }
        else{
            services[index].added=false;
            button.textContent="(+) Add Item";
             button.classList.remove("remove");
            button.classList.add("add");
        }
        rendercart();
    });
});
enter.addEventListener("click",()=>{
    username.innerText=popupname.value;
    popup.style.display="none";
})

const services=[
    {name:"Dry Cleaning",price:100,added:false},
    {name:"Wash & Fold",price:100,added:false},
    {name:"Ironing",price:100,added:false},
    {name:"Stain Removal",price:100,added:false},
    {name:"Leather and Sued Cleaning",price:100,added:false},
    {name:"Wedding Dress Cleaning",price:100,added:false}
]
function rendercart() {
    itemsList.innerHTML = "";

    let total = 0;
    let serial = 1;

    services.forEach(service => {

        if (service.added) {

            total += service.price;

            itemsList.innerHTML += `
            <div class="cartItem">
                <span >${serial}</span>
                <span  >${service.name}</span>
                <span >₹${service.price}</span>
            </div>
            `;

            serial++;
        }
    });
totalAmount=total;
    amount.textContent = total;
}

book.addEventListener("click",()=>{
    if(totalAmount===0){
        alert("Please add some items");
    }else if(mail.value.trim() === "" ||
    phNo.value.trim() === "" ||
    name.value.trim() === ""){
        alert("Fill all the details");
    }else{
            popup.style.display="block";
            popup.innerHTML=`
            <h2>Y0ur order is successfully placed</h2>

            <p><b>Name:</b> ${name.value}</p>

            <p><b>Email:</b> ${mail.value}</p>

            <p><b>Phone:</b> ${phNo.value}</p>

            <p><b>Total Amount:</b> ₹${totalAmount}</p>
            `
    }
})