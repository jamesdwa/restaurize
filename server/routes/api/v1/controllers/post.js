import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

var router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('file'), async function (req, res, next) {
    console.log("Hello")
    console.log(req.file);
    if (req.session.isAuthenticated) {
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

            // Create a data object first
            const restaurantData = {
                restaurantName: req.body.restaurantName,
                restaurantPhoneNum: req.body.restaurantPhoneNum,
                restaurantMenu: processedRestaurantMenu,
                location: req.body.location,
                operationHours: req.body.operationHours,
                restaurantCapacity: req.body.restaurantCapacity,
                restaurantRevenue: req.body.restaurantRevenue,
                employeeName: processedEmployeeName,
                restaurantOwner: req.session.account.username,
            };

            // Add image data if a file was uploaded
            if (req.file) {
                restaurantData.restaurantImage = {
                    data: fs.readFileSync(path.join('uploads/' + req.file.filename)),
                    contentType: req.file.mimetype,
                    filename: req.file.filename
                };
            }

            // Create a new model instance with the data
            const newResturant = new req.models.RestaurantModel(restaurantData);
            console.log("New restaurant is " + newResturant);

            // save the post
            await newResturant.save()
            console.log("restaurant saved");

            // Clean up the uploaded file after saving to database (optional)
            if (req.file) {
                fs.unlinkSync(path.join('uploads/' + req.file.filename));
            }

            res.json({ "status": "success" })

        } catch (error) {
            console.log("Error in restaurant post is " + error);
            res.status(500).json({ "status": "error", "error": error.toString() })
        }
    } else {
        res.status(401).json({ status: "error", error: "not logged in" })
    }
})

router.get('/', async function(req, res, next) {
    try {
        console.log("Breakpoint Check...");
        const username = req.session.isAuthenticated ? req.session.account.username : null;
        const query = username ? { restaurantOwner: username } : {};
        const allPosts = await req.models.RestaurantModel.find(query);
        
        let postData = await Promise.all(
            allPosts.map(async post => {
                let restaurantData = {
                    restaurantName: post.restaurantName, 
                    restaurantPhoneNum: post.restaurantPhoneNum, 
                    restaurantMenu: post.restaurantMenu, 
                    location: post.location, 
                    operationHours: post.operationHours, 
                    restaurantCapacity: post.restaurantCapacity, 
                    restaurantRevenue: post.restaurantRevenue, 
                    employeeName: post.employeeName, 
                    restaurantOwner: post.restaurantOwner
                };
                
                if (post.restaurantImage && post.restaurantImage.data) {
                    restaurantData.restaurantImage = {
                        data: post.restaurantImage.data.toString('base64'),
                        contentType: post.restaurantImage.contentType,
                        filename: post.restaurantImage.filename
                    };
                }
                
                return restaurantData;
            })
        );

        res.type("json");
        res.json(postData);
    } catch (err) {
        console.log("Error getting the posts...", err);
        res.status(500).json({"status": "error", "error": err.toString()});
    }
});

export default router;