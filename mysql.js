require('dotenv/config');
console.log(process.env.APP_NAME)
const mysql = require('mysql');
require('dotenv/config');

let pool = mysql.createPool({
    "connectionLimit": 1000,
    "user": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT

});


exports.execute = (query, params = []) => {
    return new Promise((resolve, reject) => {
        pool.query(query, params, (error, result, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(result)
            }
        });
    })
}

exports.pool = pool;