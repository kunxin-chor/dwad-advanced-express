const express = require("express");
const router = express.Router();

// import in the Product model
const { Product, Category } = require('../models');

// import in the Forms
const { bootstrapField, createProductForm } = require('../forms');

router.get('/', async (req, res) => {
    let products = await Product.collection().fetch({
        withRelated:['category']
    });
    res.render('products/index', {
        'products': products.toJSON()
    })
})

router.get('/create', async (req, res) => {

     const allCategories = await Category.fetchAll().map((category)=>{
        return [category.get('id'), category.get('name')];
    })

    const productForm = createProductForm(allCategories);
   
    res.render('products/create', {
        'form': productForm.toHTML(bootstrapField)
    })
})

router.post('/create', async (req, res) => {
    const productForm = createProductForm();
    productForm.handle(req, {
        'success': async (form) => {
            const product = new Product(form.data);
            await product.save();
            res.redirect('/products');
        },
        'error': async (form) => {
            res.render('products/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/:product_id/update', async (req, res) => {
    // retrieve the product
    const productId = req.params.product_id
    const product = await Product.where({
        'id': productId
    }).fetch({
        required: true
    });

    // fetch all the categories
    const allCategories = await Category.fetchAll().map((category)=>{
        return [category.get('id'), category.get('name')];
    })

    const productForm = createProductForm(allCategories);

    // fill in the existing values
    productForm.fields.name.value = product.get('name');
    productForm.fields.cost.value = product.get('cost');
    productForm.fields.description.value = product.get('description');
    productForm.fields.category_id.value = product.get('category_id');

    res.render('products/update', {
        'form': productForm.toHTML(bootstrapField),
        'product': product
    })

})

router.post('/:product_id/update', async (req, res) => {

   // fetch the product that we want to update
    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        required: true
    });

    // process the form
    const productForm = createProductForm();
    productForm.handle(req, {
        'success': async (form) => {
            product.set(form.data);
            product.save();
            res.redirect('/products');
        },
        'error': async (form) => {
            res.render('products/update', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/:product_id/delete', async(req,res)=>{
    // fetch the product that we want to delete
    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        required: true
    });

    res.render('products/delete', {
        'product': product
    })

});

router.post('/:product_id/delete', async(req,res)=>{
    // fetch the product that we want to delete
    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        required: true
    });
    await product.destroy();
    res.redirect('/products')
})

module.exports = router;