import React from 'react';
import { useNavigate } from 'react-router-dom';
import './post.css';

const Post = ({ post }) => {
  const navigate = useNavigate();

  const handlePostClick = () => {
    navigate(`/post/${post.id}`);
  };

  return (
    <div className="post" onClick={handlePostClick} style={{ cursor: 'pointer' }}>
      {/* Post Header */}
      <div className="post-header">
        <div className="post-user">
          <img
            src={post.userAvatar || 'https://via.placeholder.com/40'}
            alt="User Avatar"
            className="user-avatar"
          />
          <div className="user-info">
            <span className="username">{post.username || 'Username'}</span>
            <span className="timestamp">{post.timestamp || '2h ago'}</span>
          </div>
        </div>
        <button className="more-options" onClick={(e) => e.stopPropagation()}>...</button>
      </div>

      {/* Post Content */}
      <div className="post-content">
        {post.text && <p className="post-text">{post.text}</p>}
        {post.image && (
          <img
            src={post.image}
            alt="Post content"
            className="post-image"
          />
        )}
      </div>
    </div>
  );
};

export default Post;
