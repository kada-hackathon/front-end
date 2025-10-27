import React, { useState } from 'react';
import './FloatingButton.css';

const FloatingButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOptions = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fab-container">
      {isOpen && (
        <div className="fab-options">
          <button className="fab-option-item" aria-label="Add Text">
            <span className="icon">T</span>
            <span className="label">Text</span>
          </button>
          <button className="fab-option-item" aria-label="Upload Video">
            <svg viewBox="0 0 24 24" className="icon">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 12.5l4 2.5v-5l-4 2.5z"/>
            </svg>
            <span className="label">Video</span>
          </button>
          <button className="fab-option-item" aria-label="Upload Photo">
            <svg viewBox="0 0 24 24" className="icon">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
            <span className="label">Photo</span>
          </button>
          <button className="fab-option-item" aria-label="Upload Document">
            <svg viewBox="0 0 24 24" className="icon">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z"/>
            </svg>
            <span className="label">Document</span>
          </button>
          <button className="fab-option-item" aria-label="Add Link">
            <svg viewBox="0 0 24 24" className="icon">
              <path d="M3.9 12c0-1.63 1.05-3.03 2.5-3.5v-2C4.31 7.37 3 9.53 3 12s1.31 4.63 3.4 5.5v-2c-1.45-.47-2.5-1.87-2.5-3.5zm8.1 0c0-1.63 1.05-3.03 2.5-3.5v-2C12.31 7.37 11 9.53 11 12s1.31 4.63 3.4 5.5v-2c-1.45-.47-2.5-1.87-2.5-3.5zm-5-3h4v2H7v-2zm-2 5h10v-2H5v2z"/>
            </svg>
            <span className="label">Link</span>
          </button>
        </div>
      )}

      <button
        className={`fab-main-button ${isOpen ? 'open' : ''}`}
        onClick={toggleOptions}
        aria-label={isOpen ? 'Close options' : 'Open options'}
      >
        <span className="plus-icon"></span>
      </button>
    </div>
  );
};

export default FloatingButton;