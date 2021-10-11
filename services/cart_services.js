

const cartDataLayer = require('../dal/cart_items')

class CartServices {
    constructor(user_id) {
        this.user_id = user_id;
    }

    async addToCart(productId, quantity) {
        // check if uuser has added the product to the shopping cart before
        let cartItem = await cartDataLayer.getCartItemByUserAndProduct(this.user_id, productId);

        if (cartItem) {
            return await cartDataLayer.updateQuantity(this.user_id, productId, cartItem.get('quantity') + 1);
        } else {
            let newCartItem = cartDataLayer.createCartItem(this.user_id, productId, quantity);
            return newCartItem;
        }
    }

    async remove(productId) {
        return await cartDataLayer.removeFromCart(this.user_id, productId);
    }

    async setQuantity(productId, quantity) {
        return await cartDataLayer.updateQuantity(this.user_id, productId, quantity);
    }

    async getCart() {
        return await cartDataLayer.getCart(this.user_id);
    }
}

module.exports = CartServices;