import './login.css'
import docsIcon from '../../assets/icons/icon-docs.svg'
import pencilIcon from '../../assets/icons/icon-pencil.svg'
import peopleIcon from '../../assets/icons/icon-people.svg'
import folderIcon from '../../assets/icons/icon-folder.svg'
import magnifierIcon from '../../assets/icons/icon-magnifier.svg'
import { useNavigate } from 'react-router-dom';
import {useState} from 'react';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Clear localStorage for testing
  const clearStorage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('Storage cleared');
    alert('Storage cleared - try accessing protected routes now');
  };


  // Handle login form submit
  const handleLogin = async (e) =>{
    e.preventDefault();
    setErrorMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password})
      });

      const data = await res.json();
      if(res.ok){
        // Save token and user (if returned) to localStorage
        localStorage.setItem('token', data.token || '');
        if (data.user) localStorage.setItem('user', JSON.stringify(data.user));

        // Navigate to the root/home route defined in App.jsx
        // Note: in this project the Home page is mounted at '/'
        navigate('/');
      } else {
        setErrorMessage(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error', err);
      setErrorMessage('Login failed');
    }
  }

  return (
    <div className="app">
      <div className="login-container">
        <div className="separator"></div>
       <img src={docsIcon} alt="docs icon" className="docs-icon"/>
       <img src={pencilIcon} alt="pencil icon" className="pencil-icon"/>
       <img src={peopleIcon} alt="people icon" className="people-icon"/>
       <img src={folderIcon} alt="folder icon" className="folder-icon"/>
       <img src={magnifierIcon} alt="magnifier icon" className="magnifier-icon"/>
        <div className="login-content">
          <div className="welcome-section">
            <h1>Welcome to</h1>
            <h1 className="nebwork-title">NEBWORK</h1>
          </div>
          
          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email:</label>
              <input 
                type="email" 
                className="input-field"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="underline"></div>
            </div>
            
            <div className="input-group">
              <label>Password:</label>
              <input
                type="password"
                className="input-field"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="underline"></div>
            </div>

            {errorMessage && (
              <p style={{ color: "red", fontSize: "0.9em" }}>{errorMessage}</p>
            )}
            <button type="submit" className="login-button">
              LOGIN
            </button>
          </form>
          
          <div className="forgot-password">
            Forgot password? <a href="#" className="forgot-link">Click here!</a>
          </div>

          {/* Debug button - remove in production */}
          <button 
            type="button" 
            onClick={clearStorage}
            style={{marginTop: '10px', padding: '5px 10px', fontSize: '12px', background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}
          >
            Clear Storage (Debug)
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login