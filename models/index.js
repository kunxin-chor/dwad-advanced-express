const bookshelf = require('../bookshelf')

const Product = bookshelf.model('Product', {
    tableName:'products'
});

const Category = bookshelf.model('Category',{
    tableName: 'categories'
})

module.exports = {Product, Category};