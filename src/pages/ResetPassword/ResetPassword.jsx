import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Login/login.css";
import "./ResetPassword.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email})
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setIsSubmitted(true);
      } else {
        setError(data.message || 'Failed to send reset email');
      }
    } catch (err) {
      console.error('Error during password reset request:', err);
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  const handleResendEmail = async () => {
    if (!email) {
      setError("Email address is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email})
      });
      
      const data = await res.json();
      
      if (res.ok) {
        alert("Email reset link sent successfully!");
      } else {
        setError(data.message || 'Failed to resend email');
      }
    } catch (err) {
      console.error('Error during password reset request:', err);
      setError('Failed to resend email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="login-container reset-password-container">
        <div className="login-content reset-password-content">
          {!isSubmitted ? (
            <>
              <div className="welcome-section">
                <h1>Reset Your Password</h1>
                <p className="reset-subtitle">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form className="login-form" onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className="input-field"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                  />
                  <div className="underline"></div>
                </div>

                {error && <p className="error-message" style={{color: 'red', marginTop: '10px'}}>{error}</p>}

                <button 
                  type="submit" 
                  className="login-button"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Reset Password"}
                </button>

                <div className="forgot-password">
                  Remember your password?{" "}
                  <span className="forgot-link" onClick={handleBackToLogin}>
                    Back to Login
                  </span>
                </div>
              </form>
            </>
          ) : (
            <div className="success-message-container">
              <div className="success-icon">✓</div>
              <h2 className="success-title">Check Your Email</h2>
              <p className="success-message">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="success-subtitle">
                Please check your inbox and click the link to reset your password.
                If you don't see the email, check your spam folder.
              </p>
              
              <button 
                className="login-button back-to-login-button"
                onClick={handleBackToLogin}
                style={{marginBottom: '10px'}}
              >
                Back to Login
              </button>

              <button 
                className="login-button"
                onClick={handleResendEmail}
                disabled={isLoading}
                style={{backgroundColor: '#6b7280'}}
              >
                {isLoading ? "Resending..." : "Resend Email"}
              </button>
            </div>
          )}
        </div>

        {/* Decorative Icons - matching login page */}
        <img 
          src="/docs-icon.png" 
          alt="Docs" 
          className="docs-icon"
          onError={(e) => e.target.style.display = 'none'}
        />
        <img 
          src="/pencil-icon.png" 
          alt="Pencil" 
          className="pencil-icon"
          onError={(e) => e.target.style.display = 'none'}
        />
        <img 
          src="/people-icon.png" 
          alt="People" 
          className="people-icon"
          onError={(e) => e.target.style.display = 'none'}
        />
        <img 
          src="/folder-icon.png" 
          alt="Folder" 
          className="folder-icon"
          onError={(e) => e.target.style.display = 'none'}
        />
        <img 
          src="/magnifier-icon.png" 
          alt="Search" 
          className="magnifier-icon"
          onError={(e) => e.target.style.display = 'none'}
        />
      </div>
    </div>
  );
};

export default ResetPassword;
