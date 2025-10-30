import { FileText, Pen, Users, Folder, Search } from "lucide-react";
import './Employee.css'

function Employee() {
    return (
    <div className="app">
        <div className="separator"></div>
       <FileText className="docs-icon"/>
       <Pen className="pencil-icon"/>
       <Users className="people-icon"/>
       <Folder className="folder-icon"/>
       <Search className="magnifier-icon"/>
        <div className="login-content">
          <div className="welcome-section">
            <h1>Welcome to</h1>
            <h1 className="nebwork-title">NEBWORK</h1>
          </div>
          
          <form className="login-form">
            <div className="input-group">
              <label>Full Name :</label>
              <input 
                type="Text" 
                className="input-field"
                placeholder=" ex: Salwanetta Mahendra Supratman"
              />
              <div className="underline"></div>
            </div>
            
            <div className="input-group">
              <label>Division :</label>
              <input 
                type="Text" 
                className="input-field"
                placeholder=""
              />
              <div className="underline"></div>
            </div>

             <div className="input-group">
              <label>Email:</label>
              <input 
                type="email" 
                className="input-field"
                placeholder="ex: Salwanetta@gmail.com"
              />
              <div className="underline"></div>
            </div>

             <div className="input-group">
              <label>Date of Join:</label>
              <input 
                type="Date" 
                className="input-field"
                placeholder=" "
              />
              <div className="underline"></div>
            </div>
            
            <button type="submit" className="login-button">
              Registrasi
            </button>
          </form>
          
        </div>
      </div>
  );
}

export default Employee
