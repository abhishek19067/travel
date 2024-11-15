import React from "react";
import PropTypes from "prop-types";
import "./ConfirmationModal.css";

const ConfirmationModal = ({ isVisible, onConfirm, onCancel, message }) => {
  if (!isVisible) return null;

  return (
    <div className="confirmation-modal-overlay">
      <div className="confirmation-modal-content">
        <p>{message}</p>
        <button onClick={onConfirm}>Yes</button>
        <button onClick={onCancel}>No</button>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
};

export default ConfirmationModal;
