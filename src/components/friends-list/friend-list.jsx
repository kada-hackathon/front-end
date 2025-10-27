import React from 'react';
import './friend-list.css';

export default function FriendsList() {
  const friends = [
    { name: 'Arrizal anru M', division: 'Nama_Divisi', avatar: '/src/assets/DSC_0067.JPG' },
    { name: 'Regina alhajiz', division: 'Nama_Divisi', avatar: '/src/assets/IMG_6474.JPG' },
    { name: 'Jovan munthe', division: 'Nama_Divisi', avatar: '/src/assets/main.jpg' }
  ];

  return (
    <div className="friends-list">
      {/* Friends Section */}
      <div className="friends-section">
        <h2 className="friends-title">Your Friends</h2>
        <div className="friends-items">
          {friends.map((friend, index) => (
            <div key={index} className="friend-item">
              <div className="friend-avatar">
                <img src={friend.avatar} alt="Friend Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              </div>
              <div className="friend-info">
                <h4 className="friend-name">{friend.name}</h4>
                <p className="friend-division">{friend.division}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}