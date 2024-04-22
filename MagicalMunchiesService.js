// Import and use Environmental Variable
const dotenv = require("dotenv");
dotenv.config();

// Connection to MySQL
const mysql = require('mysql2');

// Connect to DB
var connection = mysql.createConnection({
    host : process.env.MYSQL_HOST,
    user : process.env.MYSQL_USERNAME,
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DATABASE
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Select operation for admin authentication
function selectAdmin(admin_data, callback) {
    const sql = 'SELECT * FROM LoginInformation WHERE Username = ? AND Password = ?';
    connection.query(sql, [admin_data.username, admin_data.password], (err, results) => {
        if (err) {
            console.error('Error selecting admin:', err);
            callback(err, null);
            return;
        }
        console.log('Selected admin:', results);
        callback(null, results.length > 0); // Return true if admin exists, false otherwise
    });
}

// Select operation for all LoginInformation
function selectAllLoginInformation(callback) {
    const sql = 'SELECT * FROM LoginInformation';
    connection.query(sql, (err, result) => {
      if (err) {
        console.error('Error selecting all LoginInformation:', err);
        callback(err, null);
        return;
      }
      console.log('Selected all LoginInformation:', result);
      callback(null, result);
    });
  }


module.exports = { selectAdmin, selectAllLoginInformation };