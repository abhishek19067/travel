// ConfirmationModal.js
import React from "react";
import './ConfirmationModal.css'; // Import your styles here

const ConfirmationModal = ({ isVisible, onConfirm, onCancel ,message}) => {
    if (!isVisible) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Confirm Logout</h2>
                <p>{message}</p>
                <div className="modal-actions">
                    <button className="confirm-button" onClick={onConfirm}>Yes</button>
                    <button className="cancel-button" onClick={onCancel}>No</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
