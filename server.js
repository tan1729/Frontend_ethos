const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Load student data from JSON file
let students;
try {
    students = JSON.parse(fs.readFileSync('csvjson.json'));
} catch (error) {
    console.error('Error reading or parsing csvjson.json:', error);
    process.exit(1); // Exit if there’s an error reading the file
}

// In-memory storage for login attempts
const loginAttempts = {};
const adminCredentials = { username: 'admin', password: 'admin123' };

// Function to check login attempts
function checkLoginAttempts(user) {
    if (loginAttempts[user] && loginAttempts[user].timeout > Date.now()) {
        return false;
    }
    return true;
}

// Function to increment login attempts
function incrementLoginAttempts(user) {
    if (!loginAttempts[user]) {
        loginAttempts[user] = { count: 1 };
    } else {
        loginAttempts[user].count++;
    }

    if (loginAttempts[user].count >= 3) {
        loginAttempts[user].timeout = Date.now() + 3600000; // 1 hour timeout
        return false;
    }
    return true;
}

// Student login route
app.post('/login/student', (req, res) => {
    const { webmail, password } = req.body;

    if (!checkLoginAttempts(webmail)) {
        return res.status(403).json({ message: 'Account locked. Try again later.' });
    }

    const student = students.find(s => s.WEBMAIL === webmail);
    if (!student || student.PASSWORD !== password) {
        if (!incrementLoginAttempts(webmail)) {
            return res.status(403).json({ message: 'Too many failed attempts. Try again in 1 hour.' });
        }
        return res.status(401).json({ message: 'Invalid webmail or password' });
    }

    delete loginAttempts[webmail];
    res.json({ message: 'Login successful', user: { name: student.NAME, rollNo: student['ROLL NO'] } });
});

// Professor login route
app.post('/login/professor', (req, res) => {
    const { webmail, password } = req.body;

    if (!checkLoginAttempts(webmail)) {
        return res.status(403).json({ message: 'Account locked. Try again later.' });
    }

    const professor = students.find(s => s.WEBMAIL === webmail); // Assuming the same JSON for professors
    if (!professor || professor.PASSWORD !== password) {
        if (!incrementLoginAttempts(webmail)) {
            return res.status(403).json({ message: 'Too many failed attempts. Try again in 1 hour.' });
        }
        return res.status(401).json({ message: 'Invalid webmail or password' });
    }

    delete loginAttempts[webmail];
    res.json({ message: 'Login successful', user: { name: professor.NAME, rollNo: professor['ROLL NO'] } });
});

// Admin login route
app.post('/login/admin', (req, res) => {
    const { username, password } = req.body;
    if (username === adminCredentials.username && password === adminCredentials.password) {
        return res.json({ message: 'Admin login successful' });
    }
    return res.status(401).json({ message: 'Invalid admin credentials' });
});

// Serve the login HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

