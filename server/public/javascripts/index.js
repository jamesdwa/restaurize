// Similar to the websharer code, the init() will load the loadRestaurants()
async function init() {
    loadRestaurants();
}

// This calls the post API for a resturant and sends the data to the server 
async function uploadResturant() {
    // get the values from the input elements
    let restaurantName = document.getElementById("restaurantName").value;
    let restaurantPhoneNum = document.getElementById("restaurantPhoneNum").value;
    let restaurantMenu = document.getElementById("restaurantMenu").value
    let location = document.getElementById("location").value;
    let operationHours = document.getElementById("operationHours").value;
    let restaurantCapacity = document.getElementById("restaurantCapacity").value;
    let restaurantRevenue = document.getElementById("restaurantRevenue").value;
    let employeeName = document.getElementById("employeeName").value;


    try {
        // calls the post API
        await fetchJSON(`api/v1/post`, {
            method: "POST",
            body: {
                restaurantName: restaurantName, restaurantPhoneNum: restaurantPhoneNum, restaurantMenu: restaurantMenu,
                location: location, operationHours: operationHours, restaurantCapacity: restaurantCapacity, restaurantRevenue:
                    restaurantRevenue, employeeName: employeeName
            }
        })
    } catch (error) {
        // TODO: if there is an error, display error, change elementID when html is updated
        // document.getElementById("postStatus").innerText = "Error"
        throw (error);

    }

    // clear the input elements
    document.getElementById("restaurantName").value = "";
    document.getElementById("restaurantPhoneNum").value = "";
    document.getElementById("restaurantMenu").value = "";
    document.getElementById("location").value = "";
    document.getElementById("operationHours").value = "";
    document.getElementById("restaurantCapacity").value = "";
    document.getElementById("restaurantRevenue").value = "";
    document.getElementById("employeeName").value = "";

    loadRestaurants();
}

// TODO: make a load resturant function and call it
// loadResturants();
// When the loadPosts is done, call it again on start, and after an upload...

async function loadRestaurants() {
    let postsJson = await fetchJSON(`api/${apiVersion}/post`);
    console.log(postsJson);

    let postHTML = postsJson.map(postInfo => {
        return (`
            <div class="restaurant-card">
                <div class="card-image-container">
                    <div class="card-image-placeholder"></div>
                </div>
                <div class="card-content">
                    <h3 class="restaurant-name">${postInfo.restaurantName}</h3>
                    <div class="restaurant-details">
                        <div class="detail-item">
                            <span class="detail-label">Phone:</span>
                            <span class="detail-value">${postInfo.restaurantPhoneNum}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Location:</span>
                            <span class="detail-value">${postInfo.location}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Hours:</span>
                            <span class="detail-value">${postInfo.operationHours}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Menu:</span>
                            <div class="restaurant-menu">
                                ${postInfo.restaurantMenu.map(item => `<span class="menu-item">${item}</span>`).join('')}
                            </div>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Revenue:</span>
                            <span class="detail-value">${postInfo.restaurantRevenue}</span>
                        </div>
                    </div>
                    <div class="restaurant-footer">
                        <span class="capacity-badge">Capacity: ${postInfo.restaurantCapacity}</span>
                        <span class="employee-badge">Added by: Marco</span>
                    </div>
                </div>
            </div>
        `);
    });

    document.getElementById("preview-cards-container").innerHTML = postHTML.join('');
}