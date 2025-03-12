// Fetch Restaurant Data
async function fetchRestaurantData() {
    try {
        let response = await fetch(`api/${apiVersion}/post`);
        if (!response.ok) {
            throw new Error(`status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching restaurant data:", error);
    }
}

// Helper function
function removeSymbols(revenue) {
    // RegEx for removing symbols (dollar sign and comma)
    return revenue.replace(/[$,]/g, '');
}

// Creates bar charts for the restaurants' revenue
async function createRevenueChart() {
    const restaurantData = await fetchRestaurantData();
    // Maps the restaurant names and puts them in an array
    const restaurantNames = restaurantData.map(restaurant => restaurant.restaurantName);
    // Maps the restaurant revenues and puts them in an array
    // parseFloat returns floating point number parsed from the given string
    // or NaN when the first non-whitespace character cannot be converted to a number
    const restaurantRevenues = restaurantData.map(restaurant => parseFloat(removeSymbols(restaurant.restaurantRevenue)));

    const ctx = document.getElementById('myChart');
        new Chart(ctx, {
            type: 'bar',
            // X-axis
            data: {
                labels: restaurantNames,
                // Y-axis
                datasets: [{
                    label: 'Restaurant Revenue',
                    data: restaurantRevenues,
                    backgroundColor: 'rgba(255,76,96)',
                    borderColor: 'rgba(255,76,96)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
}

document.addEventListener("DOMContentLoaded", function () {
    createRevenueChart();
});
