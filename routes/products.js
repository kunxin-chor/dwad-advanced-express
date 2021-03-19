const express = require("express");
const router = express.Router();

// import in the Product model
const { Product, Category, Tag } = require('../models');

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

    const allTags = await Tag.fetchAll().map( tag => [tag.get('id'), tag.get('name')]);

    const productForm = createProductForm(allCategories, allTags);
   
    res.render('products/create', {
        'form': productForm.toHTML(bootstrapField)
    })
})

router.post('/create', async (req, res) => {
    const productForm = createProductForm();
    productForm.handle(req, {
        'success': async (form) => {
            // seperate out tags from the other product data
            // as not to casue an error when we create
            // the new product
            let {tags, ...productData} = form.data;
            const product = new Product(productData);
            await product.save();
            // save the many to many relationship
            if (tags) {
                await product.tags().attach(tags.split(","));
            }
            req.flash("success_messages", `New Product ${product.get('name')} has been created`)
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
        'id': parseInt(productId)
    }).fetch({
        required: true,
        withRelated:['tags', 'category']
    });
    
    const allTags = await Tag.fetchAll().map( tag => [tag.get('id'), tag.get('name')]);

    // fetch all the categories
    const allCategories = await Category.fetchAll().map((category)=>{
        return [category.get('id'), category.get('name')];
    })

    const productForm = createProductForm(allCategories, allTags);

    // fill in the existing values
    productForm.fields.name.value = product.get('name');
    productForm.fields.cost.value = product.get('cost');
    productForm.fields.description.value = product.get('description');
    productForm.fields.category_id.value = product.get('category_id');

    // fill in the multi-select for the tags
    let selectedTags = await product.related('tags').pluck('id');
    productForm.fields.tags.value= selectedTags;

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
        required: true,
        withRelated:['tags']
    });

    // process the form
    const productForm = createProductForm();
    productForm.handle(req, {
        'success': async (form) => {
            let { tags, ...productData} = form.data;
            product.set(productData);
            product.save();
            // update the tags
            
            let tagIds = tags.split(',');
            let existingTagIds = await product.related('tags').pluck('id');

            // remove all the tags that aren't selected anymore
            let toRemove = existingTagIds.filter( id => tagIds.includes(id) === false);
            await product.tags().detach(toRemove);

            // add in all the tags selected in the form
            await product.tags().attach(tagIds);

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