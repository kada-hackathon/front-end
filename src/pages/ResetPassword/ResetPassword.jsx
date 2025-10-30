import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Login/login.css";
import "./ResetPassword.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      alert("Please enter your email address");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call - replace with actual backend call later
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1000);
  };

  const handleBackToLogin = () => {
    navigate("/login");
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
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                  <div className="underline"></div>
                </div>

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
              >
                Back to Login
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
