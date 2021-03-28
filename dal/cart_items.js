const {CartItem} = require('../models');

const getCartItems = async (userId) => {
    return await CartItem.collection()
        .where({
            'user_id' : userId
        }).fetch({
            require:false,
            withRelated:['product', 'product.category']
        });
}

const getCartItemByUserAndProduct = async (userId, productId) => {
    return await CartItem.where({
            'user_id' : userId,
            'product_id' : productId
        }).fetch({
            require:false
        });
}

module.exports = {
    getCartItems, getCartItemByUserAndProduct
}