import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateTicket = () => {
  const [formData, setFormData] = useState({
    bookingId: '',
    issueDescription: '',
    priority: 'low'
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Assuming your backend API is set up to handle this POST request
    axios.post('http://localhost:5000/api/tickets', formData)
      .then(response => {
        setSuccess(true);
        setError(null);
        setTimeout(() => {
          navigate('/bookings');
        }, 2000); // Redirect to bookings page after 2 seconds
      })
      .catch(err => {
        setError('Failed to create ticket');
        console.error('Error creating ticket:', err);
      });
  };

  return (
    <div className="create-ticket-container">
      <h1>Create a Support Ticket</h1>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">Ticket created successfully! Redirecting...</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="bookingId">Booking ID</label>
          <input
            type="text"
            id="bookingId"
            name="bookingId"
            value={formData.bookingId}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="issueDescription">Issue Description</label>
          <textarea
            id="issueDescription"
            name="issueDescription"
            value={formData.issueDescription}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <button type="submit" className="submit-button">Create Ticket</button>
      </form>
    </div>
  );
};

export default CreateTicket;
