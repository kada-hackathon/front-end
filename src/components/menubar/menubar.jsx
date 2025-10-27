import React, { useState } from 'react';
import './menubar.css';
import { Home, MessageCircle, ClipboardList, ChevronDown, ArrowLeft } from 'lucide-react';

export default function MenuBar() {
  const [isProjectOpen, setIsProjectOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('Home');
  const [activeProject, setActiveProject] = useState(null);

  const menuItems = [
    { name: 'Home', icon: Home },
    { name: 'Chat Bot', icon: MessageCircle },
    { name: 'Work Log', icon: ClipboardList }
  ];

  const projects = ['NEW-Project', 'Project-KADA', 'Pembuatan-chatbot'];

  const handleMenuClick = (menuName) => {
    setActiveMenu(menuName);
    setActiveProject(null); // Reset active project when menu is clicked
    console.log('Menu clicked:', menuName);
  };

  const handleProjectClick = (projectName) => {
    setActiveProject(projectName);
    setActiveMenu(null); // Reset active menu when project is clicked
    console.log('Project clicked:', projectName);
  };

  const handleBackClick = () => {
    console.log('Back button clicked');
  };

  return (
    <div className="menubar-container">
      {/* Header with Logo */}
      <div className="menubar-header">
        <svg className="twitter-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
        <h1 className="menubar-title">NebWork</h1>
      </div>

      {/* Back Button */}
      <div className="back-button-container">
        <button className="back-button" onClick={handleBackClick}>
          <ArrowLeft className="back-icon" />
        </button>
      </div>

      {/* Menus Section */}
      <div className="menus-section">
        <h2 className="section-title">Menus</h2>
        
        <div className="menu-items">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleMenuClick(item.name)}
              className={`menu-item ${activeMenu === item.name ? 'active' : ''}`}
            >
              <item.icon className="menu-icon" />
              <span className="menu-text">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="divider"></div>

      {/* Recent Project Section */}
      <div className="project-section">
        <button
          onClick={() => setIsProjectOpen(!isProjectOpen)}
          className="project-header"
        >
          <h2 className="section-title">Recent Project</h2>
          <ChevronDown className={`chevron-icon ${isProjectOpen ? 'open' : ''}`} />
        </button>

        {isProjectOpen && (
          <div className="project-list">
            {projects.map((project) => (
              <button
                key={project}
                onClick={() => handleProjectClick(project)}
                className={`project-item ${activeProject === project ? 'active-project' : ''}`}
              >
                {project}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}