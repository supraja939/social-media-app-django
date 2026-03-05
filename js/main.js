function goHome() {
    window.location.href = "home.html";
}

function goCreate() {
    window.location.href = "create.html";
}

function goPeople() {
    window.location.href = "people.html";
}

function goProfile() {
    window.location.href = "profile.html";
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

function goEditProfile() {
    window.location.href = "edit.html";
}

function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "login.html";
}