import mongoose from "mongoose";

main().catch(err => console.log(err));

let models = {};

async function main() {
    console.log("Database Connection Attempt");
    await mongoose.connect('mongodb+srv://cainglet:restaurant-cluster@restaurantcluster.lsviq.mongodb.net/restaurizeDB?retryWrites=true&w=majority&appName=RestaurantCluster');
    console.log("Connected Successfully!");
}

const testSchema = new mongoose.Schema({
    value: String
})

models.Test = mongoose.model("Test", testSchema);

export default models;