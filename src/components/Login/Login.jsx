import './login.css'
import docsIcon from '../../assets/icons/icon-docs.svg'
import pencilIcon from '../../assets/icons/icon-pencil.svg'
import peopleIcon from '../../assets/icons/icon-people.svg'
import folderIcon from '../../assets/icons/icon-folder.svg'
import magnifierIcon from '../../assets/icons/icon-magnifier.svg'

function Login() {
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
          
          <form className="login-form">
            <div className="input-group">
              <label>Email:</label>
              <input 
                type="email" 
                className="input-field"
                placeholder=" "
              />
              <div className="underline"></div>
            </div>
            
            <div className="input-group">
              <label>Password:</label>
              <input 
                type="password" 
                className="input-field"
                placeholder=" "
              />
              <div className="underline"></div>
            </div>
            
            <button type="submit" className="login-button">
              LOGIN
            </button>
          </form>
          
          <div className="forgot-password">
            Forgot password? <a href="#" className="forgot-link">Click here!</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login