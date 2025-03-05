import express from 'express';
var router = express.Router();

router.post('/', async function(req, res, next) {
    // if(req.session.isAuthenticated){
        try {
            console.log("Request restaurantName is " + req.body.restaurantName + 
                "\n restaurantPhoneNum " + req.body.restaurantPhoneNum +
                "\n location " + req.body.location +
                "\n operationHours " + req.body.operationHours +
                "\n restaurantCapacity " + req.body.restaurantCapacity +
                "\n restaurantRevenue " + req.body.restaurantRevenue +
                "\n employeeName " + req.body.employeeName +
                "\n restaurantOwner " + req.body.restaurantOwner +
                "\n restaurantMenu " + req.body.restaurantMenu);
            // process the menu and employees 
            const processedRestaurantMenu = req.body.restaurantMenu.split(",");
            const processedEmployeeName = req.body.employeeName.split(",");

            const newResturant = req.models.RestaurantModel({
                restaurantName: req.body.restaurantName,
                restaurantPhoneNum: req.body.restaurantPhoneNum,
                restaurantMenu: processedRestaurantMenu,
                location: req.body.location,
                operationHours: req.body.operationHours ,
                restaurantCapacity: req.body.restaurantCapacity,
                restaurantRevenue: req.body.restaurantRevenue,
                employeeName: processedEmployeeName,
                restaurantOwner: "KyleDuTest", 
                // restaurantOwner: req.session.account.username, 
            });

            console.log("New resturant is " + newResturant);

            // save the post
            await newResturant.save()
            console.log("resturant saved");
            res.json({"status": "success"})

        } catch (error) {
            console.log("Error in resturant post is " + error);
            res.status(500).json({"status": "error", "error": error})
        }
    // } else {
    //     res.status(401).json({status: "error", error: "not logged in"})
    // }
})

router.get('/', async function(req, res, next) {
    try {
        const allPosts = await req.models.RestaurantModel.find();
        let postData = await Promise.all(
            allPosts.map(async post => {
                return {restaurantName: post.restaurantName, restaurantPhoneNum: post.restaurantPhoneNum, restaurantMenu: post.restaurantMenu, location: post.location, operationHours: post.operationHours, restaurantCapacity: post.restaurantCapacity, restaurantRevenue: post.restaurantRevenue, employeeName: post.employeeName, restaurantOwner: post.restaurantOwner}
            })
        )

        res.type("json");
        res.json(postData);
    } catch (err) {
        console.log("Error getting the posts...");
        res.status(500).json({"status": "error", "error": err});
    }
})

export default router;