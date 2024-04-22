// Import and use Environmental Variable
const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const app = express();
const port = process.env.PORT;
const MagicalMunchiesService = require('./MagicalMunchiesService');
const path = require('path');

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'html' directory
app.use(express.static(path.join(__dirname, 'html')));

// Serve static files from the root directory (for CSS file)
app.use(express.static(__dirname));

// Define routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/html/mainPage.html'));
});

app.get('/admin', (req, res) => {
    console.log('Admin');
    res.sendFile(path.join(__dirname, '/html/admin.html'));
});
  
app.post('/admin-main', express.urlencoded({ extended: true }), (req, res) => {
    console.log(req.body);
    const admin_data = req.body;
    MagicalMunchiesService.selectAdmin(admin_data, (error, loggedInUser) => {
        if (error) {
            console.error('Error checking login:', error);
            res.status(500).send('Internal Server Error');
        } else {
            if (loggedInUser) {
                res.sendFile(path.join(__dirname, '/html/admin_main_page.html'));
            } else {
                res.status(401).send('Unauthorized'); // Unauthorized if login fails
            }
        }
    });
});

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});
