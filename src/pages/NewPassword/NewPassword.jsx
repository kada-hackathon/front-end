import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../Login/login.css';
import './NewPassword.css';

const NewPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Get token from URL query params

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [submitError, setSubmitError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear submit error when user starts typing
    if (submitError) {
      setSubmitError('');
    }
  };

  // Check if passwords match in real-time
  const passwordsMatch = formData.newPassword && formData.confirmPassword && 
                         formData.newPassword === formData.confirmPassword;
  const showRedLine = formData.confirmPassword && 
                      formData.newPassword !== formData.confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation: check if passwords match
    if (!formData.newPassword || !formData.confirmPassword) {
      setSubmitError('Please fill in all fields');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setSubmitError('Passwords do not match!');
      return;
    }

    // Submit the form
    setIsLoading(true);
    setSubmitError('');

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }, 1000);

    // TODO: Replace with actual API call
    // Example:
    // fetch('/api/reset-password', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ 
    //     token: token,
    //     newPassword: formData.newPassword 
    //   })
    // })
    // .then(response => response.json())
    // .then(data => {
    //   setIsLoading(false);
    //   setIsSubmitted(true);
    //   setTimeout(() => navigate('/login'), 3000);
    // })
    // .catch(error => {
    //   setIsLoading(false);
    //   setError('Failed to reset password. Please try again.');
    // });
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  if (isSubmitted) {
    return (
      <div className="app">
        <div className="login-container new-password-container">
          <div className="login-content new-password-content">
            <div className="success-message-container">
              <div className="success-icon">✓</div>
              <h1 className="success-title">Password Reset Successful!</h1>
              <p className="success-message">
                Your password has been successfully reset.
              </p>
              <p className="success-subtitle">
                You will be redirected to the login page in a few seconds...
              </p>
              <button 
                className="login-button back-to-login-button"
                onClick={handleBackToLogin}
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="login-container new-password-container">
        <div className="login-content new-password-content">
          <div className="welcome-section">
            <h1>Reset Your Password</h1>
            <p className="reset-subtitle">
              Please enter your new password below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                className="input-field"
                placeholder="Enter your new password"
                value={formData.newPassword}
                onChange={handleChange}
                disabled={isLoading}
              />
              <div className="underline"></div>
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="input-field"
                placeholder="Confirm your new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
              />
              <div className={`underline ${showRedLine ? 'error' : ''}`}></div>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </button>
            
            <p className={`submit-error ${submitError ? 'visible' : ''}`}>
              {submitError || 'Passwords do not match!'}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;
