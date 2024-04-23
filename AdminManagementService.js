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
  const adminSql = 'INSERT INTO `Admin` (`Fname`, `Lname`, `Proficiency`, `IG`, `PhotoPath`, `DOB`) VALUES (?, ?, ?, ?, ?, ?)';
  const loginSql = 'INSERT INTO `LoginInformation` (`Username`, `Password`) VALUES (?, ?)';
  
  connection.beginTransaction((err) => {
      if (err) {
          console.error('Error beginning transaction:', err);
          callback(err, null);
          return;
      }
      
      connection.query(adminSql, [adminData.Fname, adminData.Lname, adminData.Proficiency, adminData.IG, adminData.PhotoPath, adminData.DOB], (err, adminResult) => {
          if (err) {
              connection.rollback(() => {
                  console.error('Error inserting admin:', err);
                  callback(err, null);
              });
              return;
          }
          
          const adminId = adminResult.insertId;
          
          connection.query(loginSql, [adminData.Username, adminData.Password], (err, loginResult) => {
              if (err) {
                  connection.rollback(() => {
                      console.error('Error inserting login information:', err);
                      callback(err, null);
                  });
                  return;
              }
              
              connection.commit((err) => {
                  if (err) {
                      connection.rollback(() => {
                          console.error('Error committing transaction:', err);
                          callback(err, null);
                      });
                      return;
                  }
                  
                  console.log('Inserted admin with ID:', adminId);
                  callback(null, adminId);
              });
          });
      });
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
function editAdmin(AdminID, newData, callback) {
  let sql = 'UPDATE Admin SET ';
  const params = [];
  const updateFields = [];

  // Construct the SET clause dynamically based on newData
  if (newData.Fname !== undefined && newData.Fname !== null) {
      updateFields.push('Fname=?');
      params.push(newData.Fname);
  }
  if (newData.Lname !== undefined && newData.Lname !== null) {
      updateFields.push('Lname=?');
      params.push(newData.Lname);
  }
  if (newData.Proficiency !== undefined && newData.Proficiency !== null) {
      updateFields.push('Proficiency=?');
      params.push(newData.Proficiency);
  }
  if (newData.IG !== undefined && newData.IG !== null) {
      updateFields.push('IG=?');
      params.push(newData.IG);
  }
  if (newData.PhotoPath !== undefined && newData.PhotoPath !== null) {
      updateFields.push('PhotoPath=?');
      params.push(newData.PhotoPath);
  }
  if (newData.DOB !== undefined && newData.DOB !== null) {
      updateFields.push('DOB=?');
      params.push(newData.DOB);
  }

  // If there are no fields to update, return early
  if (updateFields.length === 0) {
      callback(null, -1); // No updates performed
      return;
  }

  // Append the SET clause to the SQL query
  sql += updateFields.join(', ');
  sql += ', UpdatedDate=NOW() WHERE AdminID=?';
  params.push(AdminID);

  connection.beginTransaction((err) => {
      if (err) {
          console.error('Error beginning transaction:', err);
          callback(err, null);
          return;
      }

      connection.query(sql, params, (err, result) => {
          if (err) {
              connection.rollback(() => {
                  console.error('Error updating admin:', err);
                  callback(err, null);
              });
              return;
          }
          
          // If newData includes Username and Password, update LoginInformation table
          if (newData.Username !== undefined && newData.Username !== null && newData.Password !== undefined && newData.Password !== null) {
              const loginSql = 'UPDATE LoginInformation SET Username=?, Password=? WHERE AdminID=?';
              const loginParams = [newData.Username, newData.Password, AdminID];
              
              connection.query(loginSql, loginParams, (err, loginResult) => {
                  if (err) {
                      connection.rollback(() => {
                          console.error('Error updating login information:', err);
                          callback(err, null);
                      });
                      return;
                  }
                  
                  connection.commit((err) => {
                      if (err) {
                          connection.rollback(() => {
                              console.error('Error committing transaction:', err);
                              callback(err, null);
                          });
                          return;
                      }
                      
                      console.log('Updated admin with ID:', AdminID);
                      console.log('Updated admin:', result);
                      console.log('Updated login information:', loginResult);
                      callback(null, result.affectedRows);
                  });
              });
          } else {
              connection.commit((err) => {
                  if (err) {
                      connection.rollback(() => {
                          console.error('Error committing transaction:', err);
                          callback(err, null);
                      });
                      return;
                  }
                  
                  console.log('Updated admin with ID:', AdminID);
                  console.log('Updated admin:', result);
                  callback(null, result.affectedRows);
              });
          }
      });
  });
}


// Admin Management: Remove Admin
function deleteAdmin(adminID, callback) {
  const sql = 'DELETE FROM Admin WHERE AdminID=?';
  connection.query(sql, [adminID], (err, result) => {
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
