const express = require('express');
const path = require('path');
const port = 3030;
const app = express();

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
  
app.post('/admin-main', function(req, res) {
    console.log("admin main here");
    res.sendFile(path.join(__dirname, '/html/Admin - Main Page.html'));
});

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});
