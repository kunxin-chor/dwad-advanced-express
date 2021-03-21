
const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary")

router.get('/sign', (req,res)=>{
    const params_to_sign = req.query.params_to_sign;
    const api_secret = process.env.CLOUDINARY_API_SECRET;
    console.log(params_to_sign);
    const signature = cloudinary.utils.api_sign_request(params_to_sign, api_secret);
    res.send(signature);
})

module.exports = router;