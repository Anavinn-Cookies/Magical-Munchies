const express = require('express');
const cors = require('cors');
const { pool } = require('./db'); // Import the database connection pool
const app = express();
const PORT = process.env.PORT || 3000;

const router = express.Router();

// Allow all origins to access the API (for development purposes)
app.use(cors());

// app.use(express.static('public'));

// Route to get all products
app.get('/api/products', (req, res) => {
    pool.query('SELECT * FROM Product', (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Error executing query' });
        }
        res.json(results);
    });
});

// Route to search for products
app.get('/api/search', (req, res) => {
    const productName = req.query.name;
    const productFlavor = req.query.flavor;
    const productStart = req.query.start;
    const productEnd = req.query.end;

    let sqlQuery = 'SELECT * FROM Product WHERE 1=1';
    let queryParams = [];

    if (productName) {
        sqlQuery += ' AND Name LIKE ?';
        queryParams.push(`%${productName}%`);
    }
    if (productFlavor) {
        sqlQuery += ' AND Flavor LIKE ?';
        queryParams.push(`%${productFlavor}%`);
    }
    if (productStart && productEnd) {
        sqlQuery += ' AND Price BETWEEN ? AND ?';
        queryParams.push(productStart, productEnd);
    } else if (productStart) {
        sqlQuery += ' AND Price >= ?';
        queryParams.push(productStart);
    } else if (productEnd) {
        sqlQuery += ' AND Price <= ?';
        queryParams.push(productEnd);
    }

    pool.query(sqlQuery, queryParams, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Error executing query' });
        }
        res.json(results);
    });
});



app.get('/product-details.html', (req, res) => {
    const productId = req.query.id;

    console.log("Product ID:", productId);
    res.sendFile(path.join(__dirname, 'Frontend', 'html', 'product-details.html'));
  });


app.get('/api/product-details', (req, res) => {
    // Extract the product ID from the query parameters
    const productId = req.query.id;
    console.log(productId +" from app.js");
    // SQL query to retrieve product details based on productId
    const sqlQuery = 'SELECT * FROM Product WHERE ProductID = ?';

    const queryParams = [productId];

    // Execute the SQL query
    pool.query(sqlQuery, queryParams, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'Error executing query' });
        }
        console.log(results);
        res.json(results);
    });
    
});


module.exports = app;
