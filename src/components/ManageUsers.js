import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManageUsers.css";
import { useNavigate } from "react-router-dom";

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch users and trip counts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          throw new Error("Admin token not found");
        }

        const response = await axios.get("http://localhost:5000/api/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Error fetching users.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        navigate("/");
    };

  return (
    <div>
 
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
            <div className="manage-users-page">
      <h1 className="page-heading">Manage Users</h1>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Trips Booked</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.user_id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.trip_count}</td>
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

export default ManageUsersPage;
