async function updateProfile() {

    const token = localStorage.getItem("access");

    const formData = new FormData();

    formData.append("username", document.getElementById("username").value);
    formData.append("bio", document.getElementById("bio").value);

    const image = document.getElementById("profilePicture").files[0];

    if (image) {
        formData.append("profile_picture", image);
    }

    await fetch("http://127.0.0.1:8000/api/edit-profile/", {
        method: "PUT",
        headers: {
            "Authorization": "Bearer " + token
        },
        body: formData
    });

    window.location.href = "profile.html";
}