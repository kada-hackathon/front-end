import React, { useState, useEffect } from 'react'
import MenuBar from '../components/menubar/menubar';
import FriendsList from '../components/friends-list/friend-list';
import Navbar from '../components/navbar/navbar';
import PostFeed from '../components/post/PostFeed';
import './home.css';

const Home =()=> {
  const [showMenuBar, setShowMenuBar] = useState(true);
  const [showFriendsList, setShowFriendsList] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setShowMenuBar(true); // Always show menubar for logo display
      setShowFriendsList(!isMobile);
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Removed toggleMenuBar function as hamburger button is removed

  const toggleFriendsList = () => {
    setShowFriendsList(!showFriendsList);
  };

 return (
    <div className={`home-container ${showMenuBar ? 'menubar-visible' : 'menubar-hidden'} ${showFriendsList ? 'friends-visible' : 'friends-hidden'}`}>
    <Navbar onToggleFriendsList={toggleFriendsList} />
    <div className="main-content">
      {showMenuBar && <MenuBar />}
      <div className="content-area">
        <PostFeed />
        {showFriendsList && <FriendsList/>}
      </div>
    </div>
    </div>

  )
}

export default Home;
