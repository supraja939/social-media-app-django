const BASE_URL = "http://127.0.0.1:8000/api";

async function createPost() {

    const token = localStorage.getItem("access");

    const caption = document.getElementById("captionInput").value;
    const image = document.getElementById("imageInput").files[0];

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", image);

    const response = await fetch(`${BASE_URL}/posts/create/`, {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token
        },
        body: formData
    });

    const data = await response.json();

    console.log(data);

    alert("Post created!");

    window.location.href = "home.html";
}