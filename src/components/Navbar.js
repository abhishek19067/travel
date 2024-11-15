import React, { useState, useEffect } from "react";
import axios from "axios";
import "./NavbarStyles.css";
import { MenuItems } from '../routes/MenuItems';
import { Link, useNavigate } from 'react-router-dom';
import ConfirmationModal from './ConfirmationModal';

const Navbar = () => {
  const [clicked, setClicked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSignUp, setShowSignUp] = useState(true);
  const [showAdminLogin, setShowAdminLogin] = useState(false); // New state for admin modal
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState(""); // For toast notifications
  const [toastType, setToastType] = useState(""); // For toast type (success/error)

  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
      setLoggedIn(true);
    }
  }, []);

  const handleClick = () => {
    setClicked(!clicked);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") setUsername(value);
    else if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/register", { username, email, password });
      localStorage.setItem("username", username);
      setLoggedIn(true);
      setShowModal(false);
      showToast("Registration successful! You can now log in.", "success");
    } catch (error) {
      showToast("Error during sign up. Please try again.", "error");
      console.error("Error during sign up: ", error);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/login", { email, password })
      .then((response) => {
        localStorage.setItem("username", response.data.username);
        setUsername(response.data.username);
        setLoggedIn(true);
        setShowModal(false);
        showToast("Login successful! Welcome back.", "success");
      })
      .catch((error) => {
        showToast("Login failed. Please check your credentials.", "error");
        console.error("Error during login: ", error);
      });
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    console.log(email, password);
  
    axios
      .post("http://localhost:5000/admin/login", { email, password })
      .then((response) => {
        localStorage.setItem("adminToken", response.data.token);
        setUsername(response.data.username); // If this is returned by the backend
        setLoggedIn(true);
        setShowModal(false);
        setShowAdminLogin(false); // Close admin login modal
        showToast("Admin login successful! Welcome.", "success");
        navigate("/admin/dashboard"); // Navigate to the admin dashboard
      })
      .catch((error) => {
        showToast("Admin login failed. Please check your credentials.", "error");
        console.error("Error during admin login: ", error);
      });
  };
  
  

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setLoggedIn(false);
    setUsername("");
    localStorage.removeItem("username");
    setShowLogoutConfirm(false);
    showToast("You have been logged out.", "success");
    navigate('/');
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleMyTripsClick = () => {
    if (loggedIn) {
      navigate('/mytrips');
    } else {
      showToast("Please log in or register first to view your trips.", "error");
    }
  };

  const showToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(""); // Clear the message after 3 seconds
    }, 3000); // Set the duration of the toast
  };

  return (
    <nav className="NavbarItems">

      <h1 className="navbar-logo">Harshu's Journey</h1>
      <div className="menu-icons" onClick={handleClick}>
        <i className={clicked ? "fa fa-times" : "fa fa-bars"}></i>
      </div>
      <ul className={clicked ? "nav-menu active" : "nav-menu"}>
        {MenuItems.map((item, index) => (
          <li key={index}>
            <Link className={item.cName} to={item.url}>
              <i className={item.icon}></i>
              {item.title}
            </Link>
          </li>
        ))}
        <li>
          <button className="nav-links" onClick={handleMyTripsClick}>
            <i className="fas fa-plane"></i>
            My Trips
          </button>
        </li>
        {loggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <button onClick={() => { setShowModal(true); setShowSignUp(true); }}>Sign Up</button>
        )}
      </ul>

      {showModal && (
        <div className="signup-container show">
          <button
            className="close-modal"
            onClick={() => setShowModal(false)}  // Close the modal when clicked
          >
            <i className="fa fa-times"></i>
          </button>
          {showSignUp ? (
            <>
              <h2>Sign Up</h2>
              <form onSubmit={handleSignUp}>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  required
                  onChange={handleChange}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  onChange={handleChange}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  onChange={handleChange}
                />
                <button type="submit">Create Account</button>
              </form>
              <p>
                Already have an account?{" "}
                <button
                  className="switch-link"
                  onClick={() => setShowSignUp(false)}
                >
                  Login
                </button>
               
              </p>
            </>
          ) : showAdminLogin ? (
            <>
              <h2>Admin Login</h2>
              <form onSubmit={handleAdminLogin}>
                <input
                  type="email"
                  name="email"
                  placeholder="Admin Email"
                  required
                  onChange={handleChange}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Admin Password"
                  required
                  onChange={handleChange}
                />
                <button type="submit">Admin Login</button>
              </form>
              <p>
                Not an admin?{" "}
                <button
                  className="switch-link"
                  onClick={() => { setShowAdminLogin(false); setShowSignUp(true); }}
                >
                  User Sign Up
                </button>
              </p>
            </>
          ) : (
            <>
              <h2>Login</h2>
              <form onSubmit={handleLogin}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  onChange={handleChange}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  onChange={handleChange}
                />
                <button type="submit">Login</button>
              </form>
              <p>
                Don't have an account?{" "}
                <button
                  className="switch-link"
                  onClick={() => setShowSignUp(true)}
                >
                  Sign Up
                </button>
                
              </p>
            </>
          )}
        </div>
      )}

      <ConfirmationModal
        isVisible={showLogoutConfirm}
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
        message="Are you sure you want to log out?"
      />

      {toastMessage && (
        <div className={`toast ${toastType}`}>
          {toastMessage}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
