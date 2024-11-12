import React, { useState } from "react";
import { FaShoppingCart } from 'react-icons/fa';
import Modal from './Model'; // Import the Modal component
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer for notifications
import 'react-toastify/dist/ReactToastify.css'; // Import the toast styles


const TripData = ({ image, heading, text, price, days }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [adults, setAdults] = useState(0);
    const [children, setChildren] = useState(0);

    const addToCart = () => {
        const isLoggedIn = localStorage.getItem("username"); // Check if user is logged in

        if (isLoggedIn) {
            setIsModalOpen(true); // Open the modal if logged in
        } else {
            toast.error("Please log in to add items to the cart."); // Show login prompt
        }
    };

    const closeModal = () => {
        setIsModalOpen(false); // Close the modal
    };

    return (
        <div className="t-card">
            <div className="t-image">
                <img src={image} alt={heading} />
            </div>
            <h4>{heading}</h4>
            <p>{text}</p>
            <p className="price">{price}</p>
            <p><strong>Duration:</strong> {days} days</p>
            <button className="add-to-cart" onClick={addToCart}>
                <FaShoppingCart /> Add to Cart
            </button>

            {/* Modal component */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                trip={{ image, heading, text, price, days }} // Pass days to the modal
                adults={adults}
                setAdults={setAdults}
                children={children}
                setChildren={setChildren}
            />

            {/* Toast Container for showing error messages */}
            <ToastContainer />
        </div>
    );
};

export default TripData;
