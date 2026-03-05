const BASE_URL = "http://127.0.0.1:8000/api";

async function loadProfile() {

    const token = localStorage.getItem("access");

    const response = await fetch("http://127.0.0.1:8000/api/profile/", {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    const data = await response.json();

    document.getElementById("username").innerText = data.username;
    document.getElementById("bio").innerText = data.bio;
    document.getElementById("followersCount").innerText = data.followers;
    document.getElementById("followingCount").innerText = data.following;

    if (data.profile_picture) {
        document.getElementById("profileImage").src = data.profile_picture;
    }
}
document.addEventListener("DOMContentLoaded", loadProfile);

async function loadMyPosts(){

    const token = localStorage.getItem("access");

    const response = await fetch("http://127.0.0.1:8000/api/posts/my/",{
        headers:{
            "Authorization":"Bearer "+token
        }
    });

    const posts = await response.json();

    const container = document.getElementById("myPosts");
    container.innerHTML = "";

    posts.forEach(post => {

    container.innerHTML += `
<div class="post-box">

    <img src="http://127.0.0.1:8000${post.image}" alt="post">

    <p class="mt-2">${post.caption || ""}</p>

    <div class="text-center">

        <button onclick="likePost(${post.id})"
        class="btn btn-outline-danger btn-sm">
        ❤️ Like
        </button>

        <span>${post.likes} likes</span>

    </div>

    <div class="mt-2 text-center">

        <button onclick="editPost(${post.id}, '${post.caption}')"
        class="btn btn-warning btn-sm">
        Edit
        </button>

        <button onclick="deletePost(${post.id})"
        class="btn btn-danger btn-sm">
        Delete
        </button>

    </div>

</div>
`;
    });

}

async function deletePost(postId){

    const token = localStorage.getItem("access");

    await fetch(`http://127.0.0.1:8000/api/posts/delete/${postId}/`,{
        method:"DELETE",
        headers:{
            "Authorization":"Bearer "+token
        }
    });

    loadMyPosts();
}
async function editPost(postId, oldCaption){

    const newCaption = prompt("Edit caption:", oldCaption);

    if(!newCaption) return;

    const token = localStorage.getItem("access");

    await fetch(`http://127.0.0.1:8000/api/posts/update/${postId}/`,{
        method:"PUT",
        headers:{
            "Authorization":"Bearer "+token,
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            caption:newCaption
        })
    });

    loadMyPosts();
}


async function likePost(postId){

const token = localStorage.getItem("access");

await fetch(`http://127.0.0.1:8000/api/posts/like/${postId}/`,{
method:"POST",
headers:{
"Authorization":"Bearer "+token
}
});

loadMyPosts();
}


document.addEventListener("DOMContentLoaded",loadMyPosts);