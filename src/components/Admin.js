import React, { useState, useEffect } from "react";
import axios from "axios";
// import "./AdminPage.css";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
    const [userTrips, setUserTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch user trips when component mounts
    useEffect(() => {
        const fetchUserTrips = async () => {
            try {
                const token = localStorage.getItem("adminToken");
                if (!token) {
                    throw new Error("Admin token not found");
                }

                const response = await axios.get("http://localhost:5000/api/admin/dashboard", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const formattedTrips = response.data.map((trip) => {
                    const dateObj = new Date(trip.booking_date);
                    trip.booking_date = new Intl.DateTimeFormat("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                    }).format(dateObj);
                    return trip;
                });

                setUserTrips(formattedTrips);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching user trips:", err);
                setError("Error fetching user trips.");
                setLoading(false);
            }
        };

        fetchUserTrips();
    }, []);

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        navigate("/");
    };

    return (
        <div className="admin-dashboard">
            <nav className="admin-sidebar">
                <ul className="sidebar-list">
                    <li className="sidebar-item">
                        <a href="/admin/dashboard" className="sidebar-link">Dashboard</a>
                    </li>
                    <li className="sidebar-item">
                        <a href="/admin/manage-users" className="sidebar-link">Manage Users</a>
                    </li>

                    <li className="sidebar-item">
                        <button className="sidebar-links logout-button" onClick={handleLogout}>
                            Logout
                        </button>
                    </li>
                </ul>
            </nav>

            <div className="admin-content">
                <h1 className="admin-heading">Admin Dashboard - User Trips</h1>

                {loading ? (
                    <div className="loading">Loading...</div>
                ) : error ? (
                    <div className="error">{error}</div>
                ) : (
                    <div className="user-trips">
                        <h2>User Trip Information</h2>
                        <table className="trips-table">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Trip Name</th>
                                    <th>Booking Date</th>
                                    <th>Price</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {userTrips.map((trip) => (
                                    <tr key={trip.id}>
                                        <td>{trip.username}</td>
                                        <td>{trip.email}</td>
                                        <td>{trip.trip_name}</td>
                                        <td>{trip.booking_date}</td>
                                        <td>${trip.price}</td>
                                        
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPage;
