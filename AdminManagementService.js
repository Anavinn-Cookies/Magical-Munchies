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

// ========== Admin Management ==========

// Admin Management: Add Admin
function addAdmin(adminData, callback) {
    const sql = 'INSERT INTO `Product` (`Name`, `Flavor`, `Detail`, `Price`, `PhotoPath`) VALUES (?, ?, ?, ?, ?)';
    connection.query(sql, [adminData.Name, adminData.Flavor, adminData.Detail, adminData.Price, adminData.PhotoPath], (err, result) => {
      if (err) {
        console.error('Error inserting admin:', err);
        callback(err, null);
        return;
      }
      console.log('Inserted admin with ID:', result.insertId);
      callback(null, result.insertId);
    });
}

// Admin Management: Select Admin
function selectAdmin(productID, callback) {
  const sql = 'SELECT * FROM Product WHERE ProductID=?';
  connection.query(sql, [productID], (err, result) => {
    if (err) {
      console.error('Error selecting admin:', err);
      callback(err, null);
      return;
    }
    console.log('Selected admin:', result);
    callback(null, result);
  });
}

// Admin Management: Edit Admin
function editAdmin(ProductID, newData, callback) {
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
          console.error('Error updating admin:', err);
          callback(err, null);
          return;
      }
      console.log('Updated admin with ID:', ProductID);
      console.log('Updated admin:', result);
      callback(null, result.affectedRows);
  });
}


// Admin Management: Remove Admin
function deleteAdmin(productID, callback) {
  const sql = 'DELETE FROM Product WHERE ProductID=?';
  connection.query(sql, [productID], (err, result) => {
    if (err) {
      console.error('Error deleting admin:', err);
      callback(err, null);
      return;
    }
    callback(null, -1);
  });
}  

// =======================================

module.exports = { addAdmin, selectAdmin, editAdmin, deleteAdmin };

// =======================================
