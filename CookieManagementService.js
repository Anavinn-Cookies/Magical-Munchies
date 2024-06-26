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
  let sql = 'UPDATE Product SET ';
  const params = [];
  const updateFields = [];

  // Construct the SET clause dynamically based on newData
  if (newData.Name !== undefined && newData.Name !== null) {
      updateFields.push('Name=?');
      params.push(newData.Name);
  }
  if (newData.Flavor !== undefined && newData.Flavor !== null) {
      updateFields.push('Flavor=?');
      params.push(newData.Flavor);
  }
  if (newData.Detail !== undefined && newData.Detail !== null) {
      updateFields.push('Detail=?');
      params.push(newData.Detail);
  }
  if (newData.Price !== undefined && newData.Price !== null) {
      updateFields.push('Price=?');
      params.push(newData.Price);
  }
  if (newData.PhotoPath !== undefined && newData.PhotoPath !== null) {
      updateFields.push('PhotoPath=?');
      params.push(newData.PhotoPath);
  }

  // If there are no fields to update, return early
  if (updateFields.length === 0) {
      callback(null, -1); // No updates performed
      return;
  }

  // Append the SET clause to the SQL query
  sql += updateFields.join(', ');
  sql += ', UpdatedDate=NOW() WHERE ProductID=?';
  params.push(ProductID);

  connection.query(sql, params, (err, result) => {
      if (err) {
          console.error('Error updating cookie:', err);
          callback(err, null);
          return;
      }
      console.log('Updated cookie with ID:', ProductID);
      console.log('Updated cookie:', result);
      callback(null, result.affectedRows);
  });
}


// Cookie Management: Remove Cookie
function deleteCookie(productID, callback) {
  const sql = 'DELETE FROM Product WHERE ProductID=?';
  connection.query(sql, [productID], (err, result) => {
    if (err) {
      console.error('Error deleting cookie:', err);
      callback(err, null);
      return;
    }
    callback(null, -1);
  });
}  

// =======================================

module.exports = { addCookie, selectCookie, editCookie, deleteCookie };

// =======================================
