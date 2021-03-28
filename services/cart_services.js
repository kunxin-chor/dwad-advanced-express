
const { CartItem } = require('../models');
const cartDataLayer = require('../dal/cart_items')

class CartServices {
    constructor(user_id) {
        this.user_id = user_id;
    }

    async getCart() {
        let allCartItems = await cartDataLayer.getCartItems(this.user_id);
        return allCartItems;
    }

    async addToCart(productId, quantity) {

        // check if the item already exist
        let cartItem = await cartDataLayer.getCartItemByUserAndProduct(this.user_id, productId)

        // the cart item does not exist
        if (!cartItem) {
            cartItem = new CartItem({
                'user_id': this.user_id,
                'product_id': productId,
                'quantity': quantity
            })
        } else {
            cartItem.set('quantity', cartItem.get('quantity') + quantity);
        }
        await cartItem.save();
        return cartItem;
    }

    async setQuantity(productId, newQuantity) {
        console.log(productId, newQuantity);
        // check if the item already exist
        let cartItem = await cartDataLayer
            .getCartItemByUserAndProduct(this.user_id, productId); 
        if (cartItem) {
              cartItem.set('quantity', newQuantity);
            await cartItem.save();
            return cartItem;
        }
        return null;
    }

    async remove(productId) {
        let cartItem = await cartDataLayer
            .getCartItemByUserAndProduct(this.user_id, productId);
        if (cartItem) {
            await cartItem.destroy();
            return true;
        }
        return false;
    }
}

module.exports = CartServices;