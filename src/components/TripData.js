import React, { useState } from "react";
import { FaShoppingCart } from 'react-icons/fa';
import Modal from './Model'; // Import the Modal component

const TripData = ({ image, heading, text, price, days }) => { // Add days to props
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [adults, setAdults] = useState(0);
    const [children, setChildren] = useState(0);

    const addToCart = () => {
        setIsModalOpen(true); // Open the modal when Add to Cart is clicked
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
            <p><strong>Duration:</strong> {days} days</p> {/* Display days */}
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
        </div>
    );
};

export default TripData;
