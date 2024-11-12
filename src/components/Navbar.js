import React, { useState, useEffect } from "react";
import axios from "axios";
import "./NavbarStyles.css";
import { MenuItems } from '../routes/MenuItems';
import { Link, useNavigate } from 'react-router-dom'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmationModal from './ConfirmationModal';

const Navbar = () => {
  const [clicked, setClicked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSignUp, setShowSignUp] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
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

  const toggleModal = (showSignUp = true) => {
    setShowModal(!showModal);
    setShowSignUp(showSignUp);
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
      await axios.post("http://localhost:5000/register", {
        username,
        email,
        password,
      });
    
      toast.success("Account created successfully!");
      localStorage.setItem("username", username);
      setLoggedIn(true);
      setShowModal(false);
    } catch (error) {
      toast.error("Error during sign up: " + (error.response ? error.response.data.error : error.message));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", { email, password });
      toast.success("Logged in successfully!");
      localStorage.setItem("username", response.data.username);
      setUsername(response.data.username);
      setLoggedIn(true);
      setShowModal(false);
    } catch (error) {
      toast.error("Error during login: " + (error.response ? error.response.data.error : error.message));
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setLoggedIn(false);
    setUsername("");
    localStorage.removeItem("username");
    toast.success("Logged out successfully!");
    setShowLogoutConfirm(false);
    navigate('/');
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleMyTripsClick = () => {
    if (loggedIn) {
      navigate('/mytrips'); // Adjust the path according to your routes
    } else {
      toast.error("Please log in or register first to view your trips.");
    }
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
          <button onClick={() => toggleModal(true)}>Sign Up</button>
        )}
      </ul>

      {showModal && (
        <div className="signup-container show">
          <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
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

      <ToastContainer />
    </nav>
  );
};

export default Navbar;
