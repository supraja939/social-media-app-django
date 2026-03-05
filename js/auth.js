const API_URL = "http://127.0.0.1:8000/api/";
// 🔹 Register
function register() {
    fetch(API_URL + "register/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: document.getElementById("username").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message || data.error);
        window.location.href = "login.html";
    });
}
// 🔹 Login    
function login() {
    fetch(API_URL + "login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
        })
    })
    .then(res => res.json())
    .then(data => {
        if(data.access){
            localStorage.setItem("access", data.access);
             localStorage.setItem("refresh", data.refresh);
            window.location.href = "home.html";
        } else {
            alert(data.error);
        }
    });
}