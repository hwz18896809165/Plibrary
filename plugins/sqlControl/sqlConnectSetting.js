var mysql = require("mysql");

var connection = mysql.createConnection({
    host : '101.132.171.42',
    //host:'localhost',
    port : 3306,
    user : 'root',
    password : '123456',
    database : "nprojects"
});


connection.connect();

module.exports = connection;