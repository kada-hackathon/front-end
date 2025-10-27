import React, { useState } from 'react';
import './UserProfile.css';

const UserProfile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState('');
  const [division, setDivision] = useState('Engineering');
  const [email, setEmail] = useState('user@company.com');
  const [dateOfJoin, setDateOfJoin] = useState('2023-01-01');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleImageDelete = () => {
    setProfileImage(null);
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Simulate API call
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="profile-container">
      <form onSubmit={handleSave} className="profile-form">
        {/* Profile Photo Section */}
        <div className="photo-section">
        <label className="photo-label">Photo:</label>
        <div className="photo-content">
            <div className="photo-container">
            <img src="https://via.placeholder.com/100" alt="Profile" className="profile-photo" />
            </div>
            <div className="photo-buttons">
            <button type="button" className="upload-btn">Upload Photo</button>
            <button type="button" className="delete-btn">Delete Photo</button>
            </div>
        </div>
        </div>

        {/* Profile Fields */}
        <div className="profile-fields">
          <div className="field-group">
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="name-input"
            />
          </div>

          <div className="field-group">
            <label>Division:</label>
            <div className="readonly-field">
              <input type="text" value={division} readOnly />
              <span className="field-note">Cannot be changed</span>
            </div>
          </div>

          <div className="field-group">
            <label>Email:</label>
            <div className="readonly-field">
              <input type="email" value={email} readOnly />
              <span className="field-note">Cannot be changed</span>
            </div>
          </div>

          <div className="field-group">
            <label>Date of Join:</label>
            <div className="readonly-field">
              <input type="text" value={dateOfJoin} readOnly />
              <span className="field-note">Cannot be changed</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button type="submit" className="save-btn">
          SAVE
        </button>

        {/* Success Message */}
        {showSuccess && (
          <div className="success-message">
            Your profile has successfully updated!
          </div>
        )}
      </form>
    </div>
  );
};

export default UserProfile;