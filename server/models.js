import mongoose from "mongoose";

main().catch(err => console.log(err));

let models = {};

async function main() {
    console.log("Database Connection Attempt");
    await mongoose.connect('mongodb+srv://cainglet:restaurant-cluster@restaurantcluster.lsviq.mongodb.net/restaurizeDB?retryWrites=true&w=majority&appName=RestaurantCluster');
    console.log("Connected Successfully!");

    const restaurantModel = new mongoose.Schema({
        restaurantName: String,
        restaurantPhoneNum: Number,
        restaurantMenu: [String],
        location: String,
        operationHours: String,
        restaurantCapacity: Number,
        restaurantRevenue: Number,
        employeeName: [String],
        restaurantOwner: String,
    })
    models.RestaurantModel = mongoose.model("RestaurantModel", restaurantModel);
}

export default models;