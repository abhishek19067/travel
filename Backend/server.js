const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Database Connection
const db = mysql.createConnection({
  host: "localhost",  // Database host
  user: "root",       // Your MySQL username
  password: "",       // Your MySQL password
  database: "harshu"  // Your MySQL database name
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// JWT Authentication Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) return res.status(403).json({ message: "No token provided." });

  jwt.verify(token, "secretKey", (err, decoded) => {
    if (err) return res.status(500).json({ message: "Failed to authenticate token." });

    req.userId = decoded.id;
    next();
  });
};

// Register Route
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length > 0) return res.status(400).json({ error: "User already exists." });

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      db.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        return res.status(201).json({ message: "User registered successfully!" });
      });
    });
  } catch (err) {
    return res.status(500).json({ error: "Registration failed." });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0) return res.status(400).json({ error: "User not found." });

      const user = results[0];

      // Compare password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return res.status(400).json({ error: "Invalid password." });

      // Create and return JWT
      const token = jwt.sign({ id: user.id }, "secretKey", { expiresIn: "1h" });
      return res.status(200).json({ message: "Logged in successfully!", username: user.username, token });
    });
  } catch (err) {
    return res.status(500).json({ error: "Login failed." });
  }
});

// Bookings Route
app.post('/bookings', (req, res) => {
    const { username, tripName, adults, children, bookingDate, price } = req.body; // Extract price from request body

    const insertQuery = `
      INSERT INTO bookings (username, trip_name, adults, children, booking_date, price)
      VALUES (?, ?, ?, ?, ?, ?);
    `;
    
    // Use 'db' instead of 'connection'
    db.query(insertQuery, [username, tripName, adults, children, bookingDate, price], (err, results) => {
      if (err) {
        console.error('Error inserting data:', err);
        res.status(500).send({ message: 'Error confirming booking. Please try again.' });
        return;
      }
      res.send({ message: 'Booking confirmed successfully' });
    });
});



app.get('/api/bookings', (req, res) => {
    const username = req.query.username;
    if (!username) {
        res.status(400).send({ message: 'Username is required' });
        return;
    }

    const query = `
        SELECT id, username, trip_name, adults, children, booking_date, price
        FROM bookings
        WHERE username = ?
    `;
    
    db.query(query, [username], (err, results) => { // Change `connection` to `db`
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send({ message: 'Error fetching bookings' });
            return;
        }
        res.send(results);
    });
});

  // API endpoint to delete a booking by ID
  app.delete('/api/bookings/:id', (req, res) => {
    const id = req.params.id;
    if (!id) {
      res.status(400).send({ message: 'Booking ID is required' });
      return;
    }
  
    const query = `
      DELETE FROM bookings
      WHERE id = ?
    `;
    connection.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error deleting booking:', err);
        res.status(500).send({ message: 'Error deleting booking' });
        return;
      }
      res.send({ message: 'Booking deleted successfully' });
    });
  });

  app.get('/api/bookings/:bookingId', (req, res) => {
    const bookingId = req.params.bookingId;

    // SQL query to fetch booking details
    const query = 'SELECT * FROM bookings WHERE id = ?'; // Adjust this query according to your table structure

    db.query(query, [bookingId], (err, results) => {
        if (err) {
            console.error('Error fetching booking details:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json(results[0]); // Return the first result
    });
});

// Example of Protected Route
app.get("/mytrips", verifyToken, (req, res) => {
  // Logic to fetch user's trips
  res.json({ message: "Your trips" });
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});