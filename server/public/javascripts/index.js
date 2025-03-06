let map;
let markers = [];
let bounds;

async function init() {
    loadRestaurants();
    initMap();
}

function initMap() {    
    map = new google.maps.Map(
        document.getElementById('map'), 
        {
            zoom: 2,
            center: {lat: 0, lng: 0}
        }
    );
    
    bounds = new google.maps.LatLngBounds();
    
    addRestaurantMarkers();
}

function clearMarkers() {
    markers.forEach(marker => {
        marker.setMap(null);
    });
    markers = [];
}

function addRestaurantMarkers() {
    clearMarkers();
    bounds = new google.maps.LatLngBounds();

    const restaurantCards = document.querySelectorAll('.restaurant-card');
    const geocodingPromises = [];

    restaurantCards.forEach(card => {
        const restaurantName = card.querySelector('.restaurant-name').textContent;
        const addressElement = card.querySelector('.detail-item:nth-child(2) .detail-value');
        if (!addressElement) return;

        const address = addressElement.textContent;

        geocodingPromises.push(geocodeAddressPromise(restaurantName, address));
    });

    Promise.all(geocodingPromises.filter(p => p !== null))
        .then(() => {
            if (markers.length > 0 && map) {
                map.fitBounds(bounds);

                google.maps.event.addListenerOnce(map, 'idle', function() {
                    if (map.getZoom() > 16) {
                        map.setZoom(16);
                    }
                });
            }
        })
        .catch(err => {
            console.error("Error processing geocoding requests:", err);
        });
}


function geocodeAddressPromise(restaurantName, address) {
    return new Promise((resolve, reject) => {
        const geocoder = new google.maps.Geocoder();
        
        const searchQuery = `${restaurantName}, ${address}`;
        
        geocoder.geocode({ address: searchQuery }, (results, status) => {
            if (status === 'OK' && results[0]) {
                const position = results[0].geometry.location;

                const marker = new google.maps.Marker({
                    map: map,
                    position: position,
                    title: restaurantName,
                    animation: google.maps.Animation.DROP
                });

                markers.push(marker);

                const infoWindow = new google.maps.InfoWindow({
                    content: `<strong>${restaurantName}</strong><br>${results[0].formatted_address}`
                });

                marker.addListener('click', () => {
                    infoWindow.open(map, marker);
                });

                bounds.extend(position);

                resolve();
            } else {
                console.error(`Geocode was not successful for ${restaurantName}: ${status}`);
                resolve();
            }
        });
    });
}

// This calls the post API for a restaurant and sends the data to the server 
async function uploadResturant() {
    let restaurantName = document.getElementById("restaurantName").value;
    let restaurantPhoneNum = document.getElementById("restaurantPhoneNum").value;
    let restaurantMenu = document.getElementById("restaurantMenu").value;
    let location = document.getElementById("location").value;
    let operationHours = document.getElementById("operationHours").value;
    let restaurantCapacity = document.getElementById("restaurantCapacity").value;
    let restaurantRevenue = document.getElementById("restaurantRevenue").value;
    let employeeName = document.getElementById("employeeName").value;
    let inputFile = document.getElementById("input-file").files[0];

    /* FormData is an interface where you can set key/value pairs... */
    const formData = new FormData();
    
    formData.append("restaurantName", restaurantName);
    formData.append("restaurantPhoneNum", restaurantPhoneNum);
    formData.append("restaurantMenu", restaurantMenu);
    formData.append("location", location);
    formData.append("operationHours", operationHours);
    formData.append("restaurantCapacity", restaurantCapacity);
    formData.append("restaurantRevenue", restaurantRevenue);
    formData.append("employeeName", employeeName);
    
    if (inputFile) {
        formData.append("file", inputFile);
    }

    try {
        const response = await fetch(`api/v1/post`, {
            method: "POST",
            body: formData,
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Clear form fields on success
        document.getElementById("restaurantName").value = "";
        document.getElementById("restaurantPhoneNum").value = "";
        document.getElementById("restaurantMenu").value = "";
        document.getElementById("location").value = "";
        document.getElementById("operationHours").value = "";
        document.getElementById("restaurantCapacity").value = "";
        document.getElementById("restaurantRevenue").value = "";
        document.getElementById("employeeName").value = "";
        document.getElementById("input-file").value = "";
        
        let restaurantImage = document.getElementById("restaurant-image");
        if (restaurantImage) {
            restaurantImage.src = "";
        }
        
        loadRestaurants();
        
    } catch (error) {
        console.error("Error uploading restaurant:", error);
        throw(error);
    }
}

async function loadRestaurants() {
    let postsJson = await fetchJSON(`api/${apiVersion}/post`);
    
    let postHTML = postsJson.map(postInfo => {
        let imageHtml = '';
        if (postInfo.restaurantImage && postInfo.restaurantImage.data) {
            const imageBase64 = postInfo.restaurantImage.data;
            const contentType = postInfo.restaurantImage.contentType || 'image/jpeg';
            imageHtml = `<img src="data:${contentType};base64,${imageBase64}" alt="${postInfo.restaurantName}"/>`;
        } else if (postInfo.restaurantImage) {
            imageHtml = `<img src="${postInfo.restaurantImage}" alt="${postInfo.restaurantName}"/>`;
        } else {
            imageHtml = `<div class="no-image-placeholder">No Image</div>`;
        }

        return (`
            <div class="restaurant-card">
                <div class="card-image-container">
                    <div class="card-image-placeholder">
                        ${imageHtml}
                    </div>
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
                            <span class="detail-label">Employees:</span>
                            <div class="restaurant-employees">
                                ${Array.isArray(postInfo.employeeName) ? postInfo.employeeName.map(item => `<span class="menu-item">${item}</span>`).join('') : `<span class="menu-item">${postInfo.employeeName}</span>`}
                            </div>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Revenue:</span>
                            <span class="detail-value">${postInfo.restaurantRevenue}</span>
                        </div>
                    </div>
                    <div class="restaurant-footer">
                        <span class="capacity-badge">Capacity: ${postInfo.restaurantCapacity}</span>
                        <span class="employee-badge">Added by: ${postInfo.restaurantOwner || 'Marco'}</span>
                    </div>
                </div>
            </div>
        `);
    });

    document.getElementById("preview-cards-container").innerHTML = postHTML.join('');
    
    if (map) {
        addRestaurantMarkers();
    }
}

function uploadRestaurantImage() {
    let restaurantImage = document.getElementById("restaurant-image");
    let inputFile = document.getElementById("input-file");
}

document.addEventListener("DOMContentLoaded", function() {
    let restaurantImage = document.getElementById("restaurant-image");
    let inputFile = document.getElementById("input-file");
    
    inputFile.onchange = function() {
        if (inputFile.files && inputFile.files[0]) {
            restaurantImage.src = URL.createObjectURL(inputFile.files[0]);
        }
    };
});