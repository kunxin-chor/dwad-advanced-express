const express = require("express");
const router = express.Router();

// import in the Product model
const { Product } = require('../models');

// import in the Forms
const { bootstrapField, createProductForm } = require('../forms');

router.get('/', async (req, res) => {
    let products = await Product.collection().fetch();
    res.render('products/index', {
        'products': products.toJSON()
    })
})

router.get('/create', async (req, res) => {
    const productForm = createProductForm();
    res.render('products/create',{
        'form': productForm.toHTML(bootstrapField)
    })
})

router.post('/create', async(req,res)=>{
    const productForm = createProductForm();
    productForm.handle(req, {
        'success': async (form) => {
            const product = new Product(form.data);
            await product.save();
            res.redirect('/products');

        }
    })
})


module.exports = router;