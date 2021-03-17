const bookshelf = require('../bookshelf')

const Product = bookshelf.model('Product', {
    tableName:'products',
    category() {
        return this.belongsTo('Category')
    }
});

const Category = bookshelf.model('Category',{
    tableName: 'categories',
    products() {
        return this.hasMany('Product');
    }
})

module.exports = {Product, Category};