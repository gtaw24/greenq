// Tab functionality
function openTab(evt, tabName) {
    const tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    
    const tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
    
    // Load content when tab is opened
    if (tabName === 'restaurants') loadRestaurants();
    if (tabName === 'menu') loadMenuRestaurants();
}

// Logout function
function logout() {
    localStorage.removeItem('user');
    window.location.href = "index.html";
}

// Load restaurants
async function loadRestaurants() {
    const { data, error } = await supabase
        .from('restaurants')
        .select('*');
        
    const list = document.getElementById("restaurantsList");
    list.innerHTML = "";
    data.forEach(restaurant => {
        list.innerHTML += `<div>${restaurant.name}</div>`;
    });
}

// Add restaurant
async function addRestaurant() {
    const name = document.getElementById("restaurantName").value;
    if (name) {
        const { data, error } = await supabase
            .from('restaurants')
            .insert([{ name: name }]);
            
        if (!error) {
            document.getElementById("restaurantName").value = "";
            loadRestaurants();
        }
    }
}

// Load restaurants for menu tab
async function loadMenuRestaurants() {
    const { data, error } = await supabase
        .from('restaurants')
        .select('*');
        
    const select = document.getElementById("menuRestaurantSelect");
    select.innerHTML = '<option value="">Select Restaurant</option>';
    data.forEach(restaurant => {
        select.innerHTML += `<option value="${restaurant.id}">${restaurant.name}</option>`;
    });
}

// Add category
async function addCategory() {
    const restaurantId = document.getElementById("menuRestaurantSelect").value;
    const name = document.getElementById("categoryName").value;
    
    if (restaurantId && name) {
        const { data, error } = await supabase
            .from('menu_categories')
            .insert([{ 
                restaurant_id: restaurantId, 
                name: name 
            }]);
            
        if (!error) {
            document.getElementById("categoryName").value = "";
            loadCategories(restaurantId);
        }
    }
}

// Load categories
async function loadCategories(restaurantId) {
    const { data, error } = await supabase
        .from('menu_categories')
        .select('*')
        .eq('restaurant_id', restaurantId);
        
    const list = document.getElementById("categoriesList");
    list.innerHTML = "";
    data.forEach(category => {
        list.innerHTML += `<div>${category.name}</div>`;
    });
}

// Check user permission and adjust UI
window.onload = function() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    
    // Hide settings tab if not admin
    if (user.permission !== 'admin') {
        document.querySelector('button[onclick="openTab(event, \'settings\')"]').style.display = "none";
    }
    
    // Hide menu tab if employee
    if (user.permission === 'employee') {
        document.querySelector('button[onclick="openTab(event, \'menu\')"]').style.display = "none";
    }
    
    // Load initial tab
    document.getElementById("restaurants").style.display = "block";
    document.querySelector('.tab button').classList.add("active");
    loadRestaurants();
    
    // Set up restaurant select change event
    document.getElementById("menuRestaurantSelect").addEventListener('change', function() {
        if (this.value) {
            loadCategories(this.value);
        }
    });
};
