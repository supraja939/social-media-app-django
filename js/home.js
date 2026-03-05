const BASE_URL = "http://127.0.0.1:8000/api";

async function loadPosts() {

    const token = localStorage.getItem("access");

    const response = await fetch(`${BASE_URL}/posts/feed/`, {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    const posts = await response.json();

    const container = document.getElementById("postsContainer");
    container.innerHTML = "";

    posts.forEach(post => {

        container.innerHTML += `

        <div class="card mb-3">

       <img src="http://127.0.0.1:8000${post.image}" class="post-image">
        <div class="card-body">

        <b>${post.username}</b>

        <p>${post.caption}</p>

        <button onclick="likePost(${post.id})"
        class="btn btn-outline-danger btn-sm">
        ❤️ Like
        </button>

        <span class="ms-2">${post.likes} likes</span>

        </div>

        </div>

        `;

    });

}


async function likePost(postId){

    const token = localStorage.getItem("access");

    await fetch(`${BASE_URL}/posts/like/${postId}/`,{
        method:"POST",
        headers:{
            "Authorization":"Bearer "+token
        }
    });

    loadPosts();
}


document.addEventListener("DOMContentLoaded", loadPosts);