// import in the Product model
const { Product, Category, Tag } = require('../models');

const getAllProducts = async () => {
    return await Product.fetchAll();
}

const getAllCategories = async () => {
    return await Category.fetchAll().map((category) => {
        return [category.get('id'), category.get('name')];
    })
}

const getAllTags = async () => {
    return await Tag.fetchAll().map(tag => [tag.get('id'), tag.get('name')]);
}

const getProductByID = async (productId) => {
    return await Product.where({
        'id': parseInt(productId)
    }).fetch({
        require: false,
        withRelated: ['tags', 'category']
    });
}

module.exports = {
    getAllCategories, getAllTags, getProductByID, getAllProducts
}