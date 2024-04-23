const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Default port is 3000 if PORT environment variable is not set
const MagicalMunchiesService = require('./MagicalMunchiesService');
const CookieManagementService = require('./CookieManagementService');
const path = require('path');
const dotenv = require("dotenv");
dotenv.config();

const appRouter = require('./Backend/app');
const cors = require('cors');
app.use(cors());

app.use('/', appRouter);

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

// Admin Login
app.post('/admin-main', express.urlencoded({ extended: true }), (req, res) => {
    // Request body is parsed using express.urlencoded middleware
    const admin_data = req.body; // Extracting data from the request body
    
    // Call to MagicalMunchiesService.selectAdmin to check admin login
    MagicalMunchiesService.selectAdmin(admin_data, (error, loggedInUser) => {
        if (error) {
            // If an error occurs during login check, send 500 Internal Server Error
            console.error('Error checking login:', error);
            res.status(500).send('Internal Server Error');
        } else {
            console.log(loggedInUser);
            if (loggedInUser) {
                // If loggedInUser exists, send the admin_main_page.html file
                res.sendFile(path.join(__dirname, '/html/admin_main_page.html'));
            } else {
                // If login fails (no loggedInUser), send 401 Unauthorized
                res.status(401).send('Unauthorized');
            }
        }
    });
});


// ========== Cookie Management ==========

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './Image/ProductImage');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

const upload = multer({ storage });

// Cookie Management: Add Cookie
app.post('/cookie-add', upload.single('Photo'), express.urlencoded({ extended: true }), (req, res) => {
    if (!req.file) {
        console.error('No file uploaded');
        res.status(400).send('Bad Request: No file uploaded');
        return;
    }

    const cookieData = req.body;
    cookieData.PhotoPath = '/Image/ProductImage/' + req.file.originalname;
    CookieManagementService.addCookie(cookieData, (err, result) => {
        if (err) {
            console.error('Error adding cookie:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.status(200).send('Cookie added successfully');
    });
});

// Cookie Management: Select Cookie
app.get('/cookie/:ProductID', (req, res) => {
    const productID = req.query.ProductID;
    CookieManagementService.selectCookie(productID, (err, result) => {
        if (err) {
            console.error('Error selecting cookie:', err);
            res.status(500).json({ error: 'Error selecting cookie' });
        } else if (!result) {
            res.status(404).json({ error: 'Cookie not found' });
        } else {
            res.sendFile(path.join(__dirname, '/html/CookieManagement/cookie_edit.html'));
        }
    });
});

// Cookie Management: Edit Cookie
app.put('/cookie/:ProductID', (req, res) => {
    const productID = req.query.ProductID;
    const newData = req.body;
    CookieManagementService.editCookie(ProductId, newData, (err, result) => {
        if (err) {
            console.error('Error updating cookie:', err);
            res.status(500).json({ error: 'Error updating cookie' });
        } else if (result === 0) {
            res.status(404).json({ error: 'Cookie not found' });
        } else {
            res.status(200).json({ message: 'Cookie updated successfully' });
        }
    });
});

// Cookie Management: Remove Cookie
app.delete('/cookie/:id', (req, res) => {
    const studentId = req.params.id;
    CookieManagementService.deleteCookie(studentId, (err, result) => {
        if (err) {
            console.error('Error deleting cookie:', err);
            res.status(500).json({ error: 'Error deleting cookie' });
        } else if (result === 0) {
            res.status(404).json({ error: 'Cookie not found' });
        } else {
            res.status(200).json({ message: 'Cookie deleted successfully' });
        }
    });
});




// =======================================

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});
