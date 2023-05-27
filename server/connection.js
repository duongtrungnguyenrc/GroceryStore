const config = require('./config');
const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection(config);

module.exports = connection;
