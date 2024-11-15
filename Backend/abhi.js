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
  host: "localhost",
  user: "root",
  password: "",
  database: "harshu"
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
    return;
  }
  console.log("Connected to MySQL database");
});



const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]; // Extract Authorization header
  if (!authHeader) {
    console.log("Authorization header is missing"); // Debugging log
    return res.status(403).json({ message: "No token provided." });
  }

  const token = authHeader.split(" ")[1]; // Extract token from header
  if (!token) {
    console.log("Token is missing from Authorization header"); // Debugging log
    return res.status(403).json({ message: "No token provided." });
  }

  console.log("Extracted token:", token); // Log token for debugging

  // Verify the token
  jwt.verify(token, "secretKey", (err, decoded) => {
    if (err) {
      console.error("Token verification failed:", err.message); // Detailed error log
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token has expired." });
      }
      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token." });
      }
      return res.status(401).json({ message: "Failed to authenticate token." });
    }

    console.log("Decoded token:", decoded); // Log decoded token data
    req.userId = decoded.id; // Attach user ID to request object
    req.isAdmin = decoded.isAdmin; // Attach admin flag to request object
    next(); // Proceed to the next middleware or route
  });
};

// Admin Verification Middleware
// const verifyAdmin = (req, res, next) => {
//   if (!req.isAdmin) {
//     console.log("Access denied: not an admin");
//     return res.status(403).json({ message: "Access denied." });
//   }

//   console.log("Admin access granted");
//   next();
// };


// Register Route
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body; // Removed isAdmin from destructuring if not used

  try {
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length > 0) return res.status(400).json({ error: "User already exists." });

      const hashedPassword = await bcrypt.hash(password, 10); // Correct hashing

      db.query(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)", // Removed extra comma
        [username, email, hashedPassword],
        (err, result) => {
          if (err) return res.status(500).json({ error: err });
          return res.status(201).json({ message: "User registered successfully!" });
        }
      );
    });
  } catch (err) {
    return res.status(500).json({ error: "Registration failed." });
  }
});


// User Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0) return res.status(400).json({ error: "User not found." });

      const user = results[0];
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return res.status(400).json({ error: "Invalid password." });

      const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, "secretKey", { expiresIn: "1h" });
      return res.status(200).json({ message: "Logged in successfully!", username: user.username, token });
    });
  } catch (err) {
    return res.status(500).json({ error: "Login failed." });
  }
});

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

// // Admin Login Route
// app.post("/admin/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     db.query(
//       "SELECT * FROM admin WHERE email = ? AND password = ?",
//       [email, password],
//       (err, results) => {
//         if (err) return res.status(500).json({ error: err });
//         if (results.length === 0) return res.status(400).json({ error: "Admin not found." });

//         const admin = results[0];

//         // Generate a JWT for the admin
//         const token = jwt.sign({ id: admin.id, isAdmin: true }, "secretKey", { expiresIn: "1h" });

//         return res.status(200).json({ message: "Admin logged in successfully!", token });
//       }
//     );
//   } catch (err) {
//     return res.status(500).json({ error: "Login failed." });
//   }
// });


// Bookings Route (for all users)
// app.post("/bookings", (req, res) => {
//   const { username, tripName, adults, children, bookingDate, price } = req.body;

//   const insertQuery = `
//     INSERT INTO bookings (username, trip_name, adults, children, booking_date, price)
//     VALUES (?, ?, ?, ?, ?, ?);
//   `;

//   db.query(insertQuery, [username, tripName, adults, children, bookingDate, price], (err, results) => {
//     if (err) {
//       console.error("Error inserting data:", err);
//       res.status(500).send({ message: "Error confirming booking. Please try again." });
//       return;
//     }
//     res.send({ message: "Booking confirmed successfully" });
//   });
// });

// Admin-only: View all bookings
// app.get("/admin/bookings", verifyToken, verifyAdmin, (req, res) => {
//   const query = "SELECT * FROM bookings";
//   db.query(query, (err, results) => {
//     if (err) {
//       console.error("Error fetching bookings:", err);
//       res.status(500).send({ message: "Error fetching bookings" });
//       return;
//     }
//     res.send(results);
//   });
// });

// Admin-only: Delete booking by ID
// app.delete("/admin/bookings/:id", verifyToken, verifyAdmin, (req, res) => {
//   const id = req.params.id;
//   if (!id) {
//     res.status(400).send({ message: "Booking ID is required" });
//     return;
//   }

//   const query = "DELETE FROM bookings WHERE id = ?";
//   db.query(query, [id], (err, results) => {
//     if (err) {
//       console.error("Error deleting booking:", err);
//       res.status(500).send({ message: "Error deleting booking" });
//       return;
//     }
//     res.send({ message: "Booking deleted successfully" });
//   });
// });

// Example of Protected Route
// app.get("/mytrips", verifyToken, (req, res) => {
//   res.json({ message: "Your trips" });
// });

// // Start the Server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

// app.get("/admin/dashboard", verifyToken, verifyAdmin, (req, res) => {
//   const query = `
//     SELECT users.username, users.email, bookings.trip_name, bookings.booking_date, bookings.price
//     FROM users
//     JOIN bookings ON users.username = bookings.username
//     ORDER BY bookings.booking_date DESC;
//   `;
  
//   db.query(query, (err, results) => {
//     if (err) {
//       console.error("Error fetching user trips:", err);
//       res.status(500).send({ message: "Error fetching user trips" });
//       return;
//     }
    
//     if (results.length === 0) {
//       return res.status(404).send({ message: "No trips found for users." });
//     }

//     res.send(results); // Send the user trips data as a response
//   });
// });

// app.get("/api/admin/dashboard", verifyToken, verifyAdmin, (req, res) => {
//   const query = `
//     SELECT users.username, users.email, bookings.trip_name, bookings.booking_date, bookings.price
//     FROM users
//     JOIN bookings ON users.username = bookings.username
//     ORDER BY bookings.booking_date DESC;
//   `;

//   db.query(query, (err, results) => {
//     if (err) {
//       console.error("Error fetching user trips:", err);
//       return res.status(500).send({ message: "Error fetching user trips" });
//     }

//     if (results.length === 0) {
//       return res.status(404).send({ message: "No trips found for users." });
//     }

//     res.status(200).send(results); // Ensure proper status code and response
//   });
// });

// app.delete("/api/admin/trips/:id", verifyToken, verifyAdmin, (req, res) => {
//   const tripId = req.params.id;

//   const query = "DELETE FROM bookings WHERE id = ?"; // Update 'id' if necessary
//   db.query(query, [tripId], (err, result) => {
//     if (err) {
//       console.error("Error deleting trip:", err);
//       return res.status(500).send({ message: "Error deleting trip" });
//     }

//     if (result.affectedRows === 0) {
//       return res.status(404).send({ message: "Trip not found" });
//     }

//     res.send({ message: "Trip deleted successfully" });
//   });
// });
// app.get("/api/admin/users", verifyToken, verifyAdmin, (req, res) => {
//   const query = `
//     SELECT 
//       users.id AS user_id, 
//       users.username, 
//       users.email, 
//       COUNT(bookings.id) AS trip_count
//     FROM users
//     LEFT JOIN bookings ON users.username = bookings.username
//     GROUP BY users.id, users.username, users.email
//     ORDER BY trip_count DESC;
//   `;

//   db.query(query, (err, results) => {
//     if (err) {
//       console.error("Error fetching users and trip counts:", err);
//       return res.status(500).send({ message: "Error fetching data" });
//     }

//     if (results.length === 0) {
//       return res.status(404).send({ message: "No users found." });
//     }

//     res.send(results); // Send user data with trip counts
//   });
// });

// const blacklistedTokens = new Set();

// app.post("/api/admin/logout", (req, res) => {
//   const token = req.body.token;

//   if (!token) {
//     return res.status(400).send({ message: "Token is required" });
//   }

//   blacklistedTokens.add(token); // Add the token to the blacklist
//   res.send({ message: "Admin logged out successfully" });
// });
