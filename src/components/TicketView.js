// src/components/TicketView.js

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TicketView.css'; // Import the CSS file

const TicketView = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate(); // Initialize navigate for navigation
    const [bookingDetails, setBookingDetails] = React.useState(null);
    
    React.useEffect(() => {
        // Fetch the booking details using the bookingId
        axios.get(`http://localhost:5000/api/bookings/${bookingId}`)
            .then(response => {
                setBookingDetails(response.data);
            })
            .catch(error => console.error('Error fetching booking details:', error));
    }, [bookingId]);

    if (!bookingDetails) {
        return <p>Loading...</p>;
    }

    const handlePrint = () => {
        window.print();
    };

    const handleBack = () => {
        navigate(-1); // Navigate to the previous page
    };

    return (
        <div className="ticket-view">
            <button onClick={handleBack} className="back-button">
                <i className="fa fa-arrow-left" aria-hidden="true"></i> Back
            </button>
            <h1 className="ticket-heading">Harshu's Journey</h1>
            <div className="ticket-details">
                <p><strong>Booking Name:</strong> {bookingDetails.trip_name}</p>
                <p><strong>Adults:</strong> {bookingDetails.adults}</p>
                <p><strong>Children:</strong> {bookingDetails.children}</p>
                <p><strong>Booking Date:</strong> {new Date(bookingDetails.booking_date).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                })}</p>
                <p><strong>Price:</strong> ₹{bookingDetails.price.toFixed(2)}</p>
            </div>
            <button onClick={handlePrint} className="print-button">
                Print Ticket
            </button>
        </div>
    );
};

export default TicketView;
