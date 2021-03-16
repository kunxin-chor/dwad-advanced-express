// Setting up the database connection
const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: 'dev.db'
  }
})
const bookshelf = require('bookshelf')(knex)

module.exports = bookshelf;