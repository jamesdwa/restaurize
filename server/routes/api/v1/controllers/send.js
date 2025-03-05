import express from 'express';
var router = express.Router();

router.get('/', async function (req, res, next) {
    console.log("Hello");
})

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

export default router;