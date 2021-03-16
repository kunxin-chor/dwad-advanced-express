const express = require("express");
const router = express.Router();

// import in the Product model
const {Product} = require('../models')

router.get('/', async (req,res)=>{
    let products = await Product.collection().fetch();
    console.log(products);
    res.render('products/index', {
        'products': products.toJSON()
    })
})

module.exports = router;