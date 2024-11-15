import axios from "axios";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Model.css";

const Modal = ({ isOpen, onClose, trip, adults, setAdults, children, setChildren }) => {
    if (!isOpen) return null;

    const username = localStorage.getItem('username') || 'Guest';
    const [startDate, setStartDate] = useState(new Date());
    const [toastMessage, setToastMessage] = useState(null);

    const confirmBooking = async () => {
        const bookingDate = startDate.toISOString().split('T')[0];

        // Format the price by removing any non-numeric characters
        const price = parseFloat(trip.price.replace(/[^\d.-]/g, ''));

        const bookingData = {
            username,
            tripName: trip.heading,
            adults,
            children,
            bookingDate,
            price, // Now this is a number
        };

        try {
            const response = await axios.post('http://localhost:5000/bookings', bookingData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Booking confirmed:', response.data);
            showToast(`${trip.heading} is now in Your Trip Section!`);
            onClose();
        } catch (error) {
            console.error('Error confirming booking:', error.response ? error.response.data : error.message);
            showToast('Error confirming booking. Please try again.');
        }
    };

    // Function to check if the date is valid (not in the past and within one year from today)
    const isDateValid = (date) => {
        const today = new Date();
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(today.getFullYear() + 1);
        return date >= today && date <= oneYearFromNow; // Ensure the date is valid
    };

    // Function to show toast message
    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000); // Hide the toast after 3 seconds
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>{trip.heading}</h2>
                <img src={trip.image} alt={trip.heading} />
                <p>{trip.text}</p>
                <p className="price">{trip.price}</p>

                <div className="date-picker-container">
                    <label>Select Booking Date:</label>
                    <DatePicker
                        selected={startDate}
                        onChange={date => setStartDate(date)}
                        filterDate={isDateValid}
                        minDate={new Date()}
                        maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
                        dateFormat="MMMM d, yyyy"
                    />
                </div>

                <div className="quantity-controls">
                    <div>
                        <label>Adults:</label>
                        <button onClick={() => setAdults(adults > 0 ? adults - 1 : 0)}>–</button>
                        <span>{adults}</span>
                        <button onClick={() => setAdults(adults + 1)}>+</button>
                    </div>
                    <div>
                        <label>Children:</label>
                        <button onClick={() => setChildren(children > 0 ? children - 1 : 0)}>–</button>
                        <span>{children}</span>
                        <button onClick={() => setChildren(children + 1)}>+</button>
                    </div>
                </div>

                <button className="add-to-cart" onClick={confirmBooking}>Confirm Booking</button>
            </div>

            {/* Toast message container */}
            {toastMessage && (
                <div className="toast-container">
                    <div className="toast-message">{toastMessage}</div>
                </div>
            )}
        </div>
    );
};

export default Modal;
