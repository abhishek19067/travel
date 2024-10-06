const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Change to your React app's URL if different
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
}));
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'harshu' // Ensure this matches your database name
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

// User signup route
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [username, email, password], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error saving user.' });
        }
        res.status(201).json({ message: 'User created successfully!' });
    });
});

// User login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT id, username FROM users WHERE email = ? AND password = ?';
    db.query(query, [email, password], (err, results) => {
        if (err) {
            console.error('Error logging in:', err);
            return res.status(500).json({ error: 'Error logging in.' });
        }
        if (results.length > 0) {
            const { id, username } = results[0];
            return res.json({ message: 'Login successful!', user_id: id, username });
        } else {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }
    });
});

app.post('/bookings', (req, res) => {
    const { userId, username, tripName, adults, children, bookingDate } = req.body;

    const bookingQuery = `
        INSERT INTO bookings (userId, username, tripName, adults, children, bookingDate) 
        VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(bookingQuery, [userId, username, tripName, adults, children, bookingDate], (err, result) => {
        if (err) {
            console.error('Error creating booking:', err);
            return res.status(500).json({ message: 'Error creating booking' });
        }
        res.status(201).json({ message: 'Booking created successfully', bookingId: result.insertId });
    });
});


// Get bookings by username
app.get('/api/bookings', (req, res) => {
    const { username } = req.query; // Get username from query parameters
    
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    const query = 'SELECT * FROM bookings WHERE username = ? AND isDeleted = 0'; // Filter by isDeleted
    
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// Get all bookings (for admin or overview purposes)
app.get('/api/bookings/all', (req, res) => {  // Changed the endpoint to avoid conflict
    db.query('SELECT * FROM bookings WHERE isDeleted = 0', (err, results) => {
        if (err) {
            console.error('Error fetching bookings:', err);
            return res.status(500).json({ error: 'Failed to fetch bookings' });
        }
        res.json(results);
    });
});

// 404 Middleware
app.use((req, res) => {
    res.status(404).json({ message: 'Resource not found' });
});

app.get('/', (req, res) => {
    res.send('Welcome to the API!'); // A simple response for the root
});

// Soft delete booking
app.delete('/api/bookings/:id', (req, res) => {
    const bookingId = req.params.id;
    const query = 'UPDATE bookings SET isDeleted = 1 WHERE id = ?';

    db.query(query, [bookingId], (err, results) => {
        if (err) {
            console.error('Error marking booking as deleted:', err);
            return res.status(500).json({ error: 'Failed to delete booking' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        res.status(204).send(); // No content
    });
});

// Update booking
app.put('/api/bookings/:id', (req, res) => {
    const { id } = req.params;
    const { trip_name, adults, children } = req.body;

    db.query('UPDATE bookings SET trip_name = ?, adults = ?, children = ? WHERE id = ?', 
        [trip_name, adults, children, id], 
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Booking not found' });
            }
            res.json({ message: 'Booking updated successfully' });
        }
    );
});


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
