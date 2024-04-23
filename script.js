const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Default port is 3000 if PORT environment variable is not set
const MagicalMunchiesService = require('./MagicalMunchiesService');
const CookieManagementService = require('./CookieManagementService');
const AdminManagementService = require('./AdminManagementService');
const path = require('path');
const dotenv = require("dotenv");
dotenv.config();

const appRouter = require('./Backend/app');
const cors = require('cors');
app.use(cors());

app.use('/', appRouter);

app.set('view engine', 'ejs');

app.use(cors({
    origin: 'http://127.0.0.1:5501', // Update this with your frontend URL
    credentials: true // If your frontend sends credentials (e.g., cookies)
}));


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

// Cookie Management: Select Cookie Edit
app.get('/cookie/:ProductID', (req, res) => {
    const productID = req.query.ProductID;
    CookieManagementService.selectCookie(productID, (err, result) => {
        if (err) {
            console.error('Error selecting cookie:', err);
            res.status(500).json({ error: 'Error selecting cookie' });
        } else if (!result || Array.isArray(result) && result.length === 0) {
            res.status(404).json({ error: 'Cookie not found' });
        } else {
            res.sendFile(path.join(__dirname, '/html/CookieManagement/cookie_edit.html'), { cookieData : result });
        }
    });
});

// Cookie Management: Edit Cookie
app.post('/cookie-edit/:ProductID', (req, res) => {
    const productID = req.body.ProductID;
    const newData = req.body;
    CookieManagementService.editCookie(productID, newData, (err, result) => {
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
app.post('/cookie-remove/:ProductID', (req, res) => {
    const productID = req.body.ProductID;
    CookieManagementService.deleteCookie(productID, (err, result) => {
        if (err) {
            console.error('Error updating cookie:', err);
            res.status(500).json({ error: 'Error deleting cookie' });
        } else if (result === 0) {
            res.status(404).json({ error: 'Cookie not found' });
        } else {
            res.status(200).json({ message: 'Cookie deleted successfully' });
        }
    });
});

// =======================================

// ========== Admin Management ==========

// Admin Management: Add Admin
app.post('/admin-add', upload.single('Photo'), express.urlencoded({ extended: true }), (req, res) => {
    if (!req.file) {
        console.error('No file uploaded');
        res.status(400).send('Bad Request: No file uploaded');
        return;
    }

    const adminData = req.body;
    adminData.PhotoPath = '/Image/AdminImage/' + req.file.originalname;
    AdminManagementService.addAdmin(adminData, (err, result) => {
        if (err) {
            console.error('Error adding admin:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.status(200).send('Admin added successfully');
    });
});

// Admin Management: Select Admin Edit
app.get('/admin/:ProductID', (req, res) => {
    const productID = req.query.ProductID;
    AdminManagementService.selectAdmin(productID, (err, result) => {
        if (err) {
            console.error('Error selecting admin:', err);
            res.status(500).json({ error: 'Error selecting admin' });
        } else if (!result || Array.isArray(result) && result.length === 0) {
            res.status(404).json({ error: 'Admin not found' });
        } else {
            res.sendFile(path.join(__dirname, '/html/AdminManagement/admin_edit.html'), { adminData : result });
        }
    });
});

// Admin Management: Edit Admin
app.post('/admin-edit/:AdminID', (req, res) => {
    const productID = req.body.ProductID;
    const newData = req.body;
    AdminManagementService.editAdmin(productID, newData, (err, result) => {
        if (err) {
            console.error('Error updating admin:', err);
            res.status(500).json({ error: 'Error updating admin' });
        } else if (result === 0) {
            res.status(404).json({ error: 'Admin not found' });
        } else {
            res.status(200).json({ message: 'Admin updated successfully' });
        }
    });
});

// Admin Management: Remove Admin
app.post('/admin-remove/:AdminID', (req, res) => {
    const productID = req.body.ProductID;
    AdminManagementService.deleteAdmin(productID, (err, result) => {
        if (err) {
            console.error('Error updating admin:', err);
            res.status(500).json({ error: 'Error deleting admin' });
        } else if (result === 0) {
            res.status(404).json({ error: 'Admin not found' });
        } else {
            res.status(200).json({ message: 'Admin deleted successfully' });
        }
    });
});

// =======================================

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});
