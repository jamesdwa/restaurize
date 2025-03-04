import mongoose from "mongoose";

main().catch(err => console.log(err));

let models = {};

async function main() {
    console.log("Connecting to the restaurant database...");
    await mongoose.connect('mongodb+srv://cainglet:restaurant-cluster@restaurantcluster.lsviq.mongodb.net/restaurizeDB?retryWrites=true&w=majority&appName=RestaurantCluster');
    console.log("Connected...");
}

const testSchema = new mongoose.Schema({
    value: String
})

models.Test = mongoose.model("Test", testSchema);

export default models;