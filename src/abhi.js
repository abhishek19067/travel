// src/Bookings.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/bookings');
                setBookings(response.data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchBookings();
    }, []);

    return (
        <div>
            <h1>Bookings</h1>
            {error && <p>Error: {error}</p>}
            {bookings.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User ID</th>
                            <th>Username</th>
                            <th>Trip Name</th>
                            <th>Adults</th>
                            <th>Children</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map(booking => (
                            <tr key={booking.id}>
                                <td>{booking.id}</td>
                                <td>{booking.user_id}</td>
                                <td>{booking.username}</td>
                                <td>{booking.trip_name}</td>
                                <td>{booking.adults}</td>
                                <td>{booking.children}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No bookings found.</p>
            )}
        </div>
    );
};

export default Bookings;
