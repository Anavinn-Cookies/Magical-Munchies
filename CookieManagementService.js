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

// ========== Cookie Management ==========

// Cookie Management: Add Cookie
function addCookie(cookieData, callback) {
    const sql = 'INSERT INTO `Product` (`Name`, `Flavor`, `Detail`, `Price`, `PhotoPath`) VALUES (?, ?, ?, ?, ?)';
    connection.query(sql, [cookieData.Name, cookieData.Flavor, cookieData.Detail, cookieData.Price, cookieData.PhotoPath], (err, result) => {
      if (err) {
        console.error('Error inserting cookie:', err);
        callback(err, null);
        return;
      }
      console.log('Inserted cookie with ID:', result.insertId);
      callback(null, result.insertId);
    });
}

// Cookie Management: Select Cookie
function selectCookie(productID, callback) {
  const sql = 'SELECT * FROM Product WHERE ProductID=?';
  connection.query(sql, [productID], (err, result) => {
    if (err) {
      console.error('Error selecting cookie:', err);
      callback(err, null);
      return;
    }
    console.log('Selected cookie:', result);
    callback(null, result);
  });
}

// Cookie Management: Edit Cookie
function editCookie(ProductID, newData, callback) {
  const sql = 'UPDATE Product SET Name=?, Flavor=?, Detail=?, Price=?, PhotoPath=?, UpdatedDate=?, WHERE ProductID=?';
  connection.query(sql, [newData.Name, newData.Flavor, newData.Detail, newData.Price, newData.PhotoPath, NOW()], (err, result) => {
    if (err) {
      console.error('Error updating student:', err);
      callback(err, null);
      return;
    }
    console.log('Updated student with ID:', ProductID);
    callback(null, result.affectedRows);
  });
}

// Cookie Management: Remove Cookie
function deleteCookie(ProductID, callback) {
  const sql = 'DELETE FROM Product WHERE ProductID=?';
  connection.query(sql, [ProductID], (err, result) => {
    if (err) {
      console.error('Error deleting cookie:', err);
      callback(err, null);
      return;
    }
    console.log('Deleted cookie with ID:', ProductID);
    callback(null, result.affectedRows);
  });
}  

// =======================================

module.exports = { addCookie, selectCookie, editCookie, deleteCookie };

// =======================================
