const BASE_URL = "http://127.0.0.1:8000/api";

async function loadPeople() {

    const token = localStorage.getItem("access");

    const response = await fetch(`${BASE_URL}/people/`, {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    const users = await response.json();

    const container = document.getElementById("peopleList");
    container.innerHTML = "";

    users.forEach(user => {

        container.innerHTML += `
            <div class="d-flex justify-content-between align-items-center border p-2 mb-2 bg-white">
                <span>${user.username}</span>
                <button class="btn btn-primary btn-sm"
                        onclick="toggleFollow(${user.id})">
                    Follow
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

    loadPeople(); // Refresh list
}

document.addEventListener("DOMContentLoaded", loadPeople);


