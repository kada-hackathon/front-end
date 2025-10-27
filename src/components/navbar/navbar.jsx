import React, { useState } from 'react';
import './Navbar.css';

const Navbar = ({ onToggleFriendsList }) => {
  const [showSearchInput, setShowSearchInput] = useState(false);

  const toggleSearchInput = () => {
    setShowSearchInput(!showSearchInput);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="navbar-logo">
          <svg className="logo-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
          <span className="logo-text">NebWork</span>
        </div>

        {/* Search Bar - Desktop Only */}
        <div className="navbar-search">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search"
            className="search-input"
          />
        </div>

        {/* Settings Icon */}
        <button className="icon-button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="4" y1="21" x2="4" y2="14" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="4" y1="10" x2="4" y2="3" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="12" y1="21" x2="12" y2="12" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="12" y1="8" x2="12" y2="3" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="20" y1="21" x2="20" y2="16" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="20" y1="12" x2="20" y2="3" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="4" cy="14" r="2" fill="currentColor"/>
            <circle cx="12" cy="8" r="2" fill="currentColor"/>
            <circle cx="20" cy="16" r="2" fill="currentColor"/>
          </svg>
        </button>

        {/* Toggle Buttons for Mobile */}
        <div className="navbar-toggles">
          <button className="icon-button toggle-button" onClick={onToggleFriendsList}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 2l-4 4"/>
              <path d="M18 2l4 4"/>
            </svg>
          </button>
          <button className="icon-button toggle-button" onClick={toggleSearchInput}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Search Input - Mobile Only */}
        {showSearchInput && (
          <div className="navbar-search-input">
            <input
              type="text"
              placeholder="Search"
              className="search-input"
              autoFocus
            />
          </div>
        )}

        {/* Profile Avatar - Mobile */}
        <div className="navbar-profile">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
            alt="Profile"
            className="profile-avatar"
          />
        </div>

        {/* Right Section - Desktop */}
        <div className="navbar-right">
          {/* User Profile */}
          <div className="user-profile">
            <div className="profile-avatar">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                alt="Profile"
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            </div>
            <div className="user-info">
              <div className="user-name">Gideon A siagian</div>
              <div className="user-division">Nama_Divisi</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
