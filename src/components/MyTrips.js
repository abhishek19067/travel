import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import axios from 'axios';

import ConfirmationModal from '../components/ConfirmationModal'; // Import your ConfirmationModal
import './BookingsTable.css'; 
import { useNavigate } from 'react-router-dom'; 
import 'font-awesome/css/font-awesome.min.css';

const BookingsTable = () => {
    const [bookings, setBookings] = useState([]);
    const [displayedBookings, setDisplayedBookings] = useState([]); // State for displayed bookings
    const [loggedInUsername, setLoggedInUsername] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmationVisible, setIsConfirmationVisible] = useState(false); // State for confirmation modal
    const [currentBooking, setCurrentBooking] = useState(null);
    const [bookingToDelete, setBookingToDelete] = useState(null); // Track the booking to delete
    const navigate = useNavigate(); 

    useEffect(() => {
        const username = localStorage.getItem('username');
        if (username) {
            setLoggedInUsername(username);
            axios.get('http://localhost:5000/api/bookings')
                .then(response => {
                    setBookings(response.data);
                    setDisplayedBookings(response.data); // Initialize displayed bookings
                })
                .catch(error => console.error('Error fetching data:', error));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const userBookings = displayedBookings.filter(booking => booking.username === loggedInUsername);

    const handleModalClose = () => {
        setIsModalOpen(false);
        setCurrentBooking(null); 
    };

    const handleUpdate = (updatedBooking) => {
        setDisplayedBookings(prevBookings =>
            prevBookings.map(booking => (booking.id === updatedBooking.id ? updatedBooking : booking))
        );
    };

    const handleDelete = (id) => {
        setBookingToDelete(id); // Set the booking ID to delete
        setIsConfirmationVisible(true); // Show confirmation modal
    };

    const confirmDelete = () => {
        setDisplayedBookings(prev => prev.filter(booking => booking.id !== bookingToDelete));
        setIsConfirmationVisible(false); // Hide confirmation modal
    };

    const cancelDelete = () => {
        setIsConfirmationVisible(false); // Hide confirmation modal without deleting
    };

    return (
        <div>
            <Navbar />
            {loggedInUsername ? (
                <div className="bookings-container">
                    <h1 className="bookings-title">Your Bookings</h1>
                    <div className="card bookings-card">
                        <table className="bookings-table">
                            <thead>
                                <tr>
                                    <th>St No</th>
                                    <th>Booking Name</th>
                                    <th>Adults</th>
                                    <th>Children</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userBookings.length > 0 ? (
                                    userBookings.map((booking, index) => (
                                        <tr key={booking.id}>
                                            <td>{index + 1}</td>
                                            <td>{booking.trip_name}</td>
                                            <td>{booking.adults}</td>
                                            <td>{booking.children}</td>
                                            <td>
                                                
                                            <button 
    onClick={() => handleDelete(booking.id)} 
    className="bg-dark" 
    title="Delete"
>
    <i className="fa fa-trash" aria-hidden="true"></i> Trash
</button>

                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5">No bookings found for your account.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    <ConfirmationModal 
    isVisible={isConfirmationVisible}
    onConfirm={confirmDelete}
    onCancel={cancelDelete}
    message="Are you sure you want to delete this booking?" // Custom message
/>

                </div>
            ) : (
                <p>You must be logged in to view your bookings.</p>
            )}
        </div>
    );
};

export default BookingsTable;
