const express = require("express");
const router = express.Router();

router.get('/', (req,res)=>{
    res.render('landing/index')
})

router.get('/about-us', (req,res)=>{
    res.render('landing/about-us')
})

router.get('/contact-us', (req,res)=>{
    res.render('landing/contact-us')
})


module.exports = router;