import axios from "axios";
import { toast } from "react-toastify"; // Import toast 
import React, { useState } from "react";
import DatePicker from "react-datepicker"; // Import the DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Import CSS for the date picker

const Modal = ({ isOpen, onClose, trip, adults, setAdults, children, setChildren }) => {
    if (!isOpen) return null;

    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const [startDate, setStartDate] = useState(new Date()); // State for selected date

    const confirmBooking = async () => {
        console.log('User ID:', userId);
        console.log('Username:', username);

        if (!userId || !username) {
            console.error('User ID or Username is not available');
            alert('Please log in before making a booking.');
            return;
        }

        const bookingDate = startDate.toISOString().split('T')[0]; // Format: "YYYY-MM-DD"

        const bookingData = {
            userId,
            username,
            tripName: trip.heading,
            adults,
            children,
            bookingDate, // Only the date part
        };
        console.log(bookingData);

        try {
            const response = await axios.post('http://localhost:5000/bookings', bookingData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Booking confirmed:', response.data);
            toast.success(`${trip.heading} is now in Your Trip Section!`); // Toast notification
            onClose();
        } catch (error) {
            console.error('Error confirming booking:', error.response ? error.response.data : error.message);
            toast.error('Error confirming booking. Please try again.'); // Error toast notification
        }
    };

    // Function to check if the date is valid (not in the past and within one year from today)
    const isDateValid = (date) => {
        const today = new Date();
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(today.getFullYear() + 1);
        return date >= today && date <= oneYearFromNow; // Ensure the date is valid
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
                        filterDate={isDateValid} // Apply date validation
                        minDate={new Date()} // Prevent past dates
                        maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))} // Limit to one year in future
                        dateFormat="MMMM d, yyyy" // Date format
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
        </div>
    );
};

export default Modal;
