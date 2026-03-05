const BASE_URL = "http://127.0.0.1:8000/api";

async function loadFollowing() {

    const token = localStorage.getItem("access");

    const response = await fetch(`${BASE_URL}/following/`, {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    const users = await response.json();

    const container = document.getElementById("followingList");
    container.innerHTML = "";

    users.forEach(user => {

        container.innerHTML += `
            <div class="d-flex justify-content-between align-items-center border p-2 mb-2 bg-white">
                <span>${user.username}</span>
                <button class="btn btn-danger btn-sm"
                        onclick="toggleFollow(${user.id})">
                    Unfollow
                </button>
            </div>
        `;
    });
}

async function toggleFollow(userId) {

    const token = localStorage.getItem("access");

    await fetch(`${BASE_URL}/follow/${userId}/`, {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    loadFollowing();
}

document.addEventListener("DOMContentLoaded", loadFollowing);