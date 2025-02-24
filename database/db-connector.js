// ./database/db-connector.js
const {user, password, database} = require('./passwords');

// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : user,
    password        : password,
    database        : database,
    dateStrings     : true
})

// Export it for use in our applicaiton
module.exports.pool = pool;