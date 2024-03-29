const bookshelf = require('../bookshelf')

const Product = bookshelf.model('Product', {
    tableName:'products',
    category() {
        return this.belongsTo('Category')
    },
    tags() {
        return this.belongsToMany('Tag');
    }

});

const Category = bookshelf.model('Category',{
    tableName: 'categories',
    products() {
        return this.hasMany('Product');
    }
})

const Tag = bookshelf.model('Tag',{
    tableName: 'tags',
    products() {
        return this.belongsToMany('Product')
    }
})

const User = bookshelf.model('User',{
    tableName: 'users'
})

module.exports = {Product, Category, Tag, User};