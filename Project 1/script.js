const  API_URL =
"https://jsonplaceholder.typicode.com/users";

const usercards =
document.getElementById("usercards");
const searchInput =
document.getElementById("searchInput");
const cityFilter =
document.getElementById("cityFilter");
const companyFilter = 
document.getElementById("companyFilter");
const resetBtn = 
document.getElementById("resetBtn");
const reloadBtn = 
document.getElementById("reloadBtn");
const errorDiv = 
document.getElementById("error")

let users = [];
let filteredUsers = [];


    // Fetch users
async function fetchUsers() {
    showskeletons();
    errorDiv.classList.add("hidden");

    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error ("Network response failed");
        users = await res.json();
        filteredUsers = [...users];
        populateFilters(users);
        rendercards(filteredUsers);
    }
        catch(err) {
            errorDiv.textcontent = "Failed to load users. Please try again";
            errorDiv.classList.remove("hidden");
            usercards.innerHtml = "";
        }
} 

//populate city and comany filters
function populateFilters(data) {
    const cities = [...new setInterval(data.map(u=>u.company.name))];

    cityFilter.innerHtml = `<option value="">Filter by company</option>`;

    cities.forEach(city => {
        const opt =
        document.createElement("option");
        opt.value = companyFilter;
        companyFilter.appendChild(opt);
    });
}

//render cards
function rendercards(data) {
    usercards.innerHTML = "";

    if (data.length === 0) {
        usercards.innerHTML = `<p class="col-span-full text-center text-gray-500">No users found. </p>`;
        return;
    }

    data.forEach(user => {
        const card =document.createElement("div");
        card.className = "card bg-white p-4 rounded-xl shadow";

        card.innerHTML = `
        <h2 class ="text-lg font-semibold">$ {user.name}</h2>
        <p class="text-gray-600">${user.email}</P>
        <p class="text-sm text-gray-500">Company:${user.company.name}</p>
        <button class="mt-3 text-indigo-600 underline detailsBtn" aria-expanded="false">Details</button>
        <div class="details hidden mt-2 text-sm text-gray-700">
        <p><strong>phone:</strong> ${user.phone}</p>
        <p><strong>Website:</strong> ${user.website}</p>
        <p><strong>City:</strong> ${user.address.city}</p>
        </div>
        `;

        usercards.appendChild(card);
    });

    attachToggleEvents();
}

//show skeleton loaders
function showSkeletons() {
    usercards.innerHTML ="";
    for (let i = 0; i < 6; i++) {
        const skel = document.createElement("div");
        skel.className = "card bg-white p-4 rounded-xl shadow";
        skel.innerHTML = `
       <div class="h-6 w-2/3 mb-2 skeleton rounded"></div> 
       <div class="h-4 w-1/2 mb-2 skeleton rounded"></div>
       <div class="h-4 w-1/3 skeleton rounded></div>
       `;
       usercards.appendChild(skel);
    }
}

//attach toggle events for details
function attachToggleEvents() {

    document.querySelectorAll(".detailsBtn"). forEach (btn => {
        btn.addEventListener("click", () =>  {
            const details = btn.nextElementSibling;
            const expanded =
            btn.getAttribute("aria-expanded") === "true";
            btn.setAttribute("aria-expanded", !expanded);
            details.classList.toggle("hidden");
            btn.textcontent = expanded ? "Details":"Hide";
            });
        });
    }

    //Apply filters and search
    function applyFilters() {
        const searchTerm =searchInput.value.tolowerCase();
        const city = cityFilter.value;
        const company = companyFilter.value;

        filterdUsers = users.filter(u => {
            const matchesSearch =
            u.name.tolowerCase().includes(searchTerm)||
            
        u.username.tolowerCase().includes(searchTerm);

            const matchesCity = city ? u.company.name === company : true;
            const matchesCompany = company ? u.comp.name === company : true;

            return matchesSearch && matchesCity && matchesCompany;
        });

        rendercards(filteredUsers);
    }

    //event listerners
    searchInput.addEventListener("input", applyFilters);
    cityFilter.addEventListener("change",applyFilters);
    companyFilter.addEventListener("change",applyFilters);
    resetBtn.addEventListener("click", () => {
        searchInput.value = "";
        cityFilter.value = "";
        companyFilter.value = "";
        filteredUsers = [...users];
        rendercards(filteredUsers);
    });
    reloadBtn.addEventListener("click", fetchUsers);

    //initial load
    fetchUsers();