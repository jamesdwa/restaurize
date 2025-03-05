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
        await fetchJSON(`api/v1/send`, {
            method: "POST",
            body: {restaurantName: restaurantName, restaurantPhoneNum: restaurantPhoneNum, restaurantMenu: restaurantMenu, 
                location: location, operationHours: operationHours, restaurantCapacity: restaurantCapacity, restaurantRevenue: 
                restaurantRevenue, employeeName: employeeName}
        })
    } catch(error) {
        // TODO: if there is an error, display error, change elementID when html is updated
        // document.getElementById("postStatus").innerText = "Error"
        throw(error);
    
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

    // TODO: make a load resturant function and call it
    // loadResturants();
}

    