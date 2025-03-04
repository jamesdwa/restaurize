import express from 'express';
var router = express.Router();

router.get('/', async function (req, res, next) {
    console.log("Hello");
})

router.post('/', async function(req, res, next){
    try {
        const newPost = new req.models.Test({
            value: req.body.value
        });
        await newPost.save();
        res.json({"status": "success"});
    } catch(err) {
        console.log(err);
        res.status(500).json({"status": "error", "error": err});
    }
})

export default router;