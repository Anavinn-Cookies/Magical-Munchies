const mysql = require('mysql2');
const dotenv = require("dotenv");
dotenv.config();

// Create MySQL connection pool
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Connect to the database
pool.getConnection(function(err, connection) {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database:', process.env.MYSQL_DATABASE);
    // Release the connection
    connection.release();
});

// Function to query the database
function queryDB(query, values) {
    return new Promise((resolve, reject) => {
        pool.query(query, values, function (err, result) {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        });
    });
}

module.exports = {
    pool, // Export the connection pool for use in other modules
    queryDB // Export the queryDB function for use in other modules
};


