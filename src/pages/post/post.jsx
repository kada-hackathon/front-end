import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/navbar/navbar';
import MenuBar from '../../components/menubar/menubar';
import './post.css';

const PostPage = () => {
  const { id } = useParams();

  // Sample post data - in a real app, this would come from an API based on the ID
  const posts = [
    {
      id: 1,
      username: 'john_doe',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop',
      timestamp: '2h ago',
      text: 'Just finished an amazing project! 🚀 #webdev #react',
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop'
    },
    {
      id: 2,
      username: 'sarah_design',
      userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop',
      timestamp: '4h ago',
      text: 'Beautiful sunset from my window today 🌅',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop'
    },
    {
      id: 3,
      username: 'tech_guru',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop',
      timestamp: '6h ago',
      text: 'Excited to share my latest tutorial on React hooks! Link in bio 📚'
    }
  ];

  const post = posts.find(p => p.id === parseInt(id));

  if (!post) {
    return (
      <div className="post-page-container">
        <Navbar />
        <div className="main-content">
          <MenuBar />
          <div className="post-detail-content">
            <div className="post-detail">
              <p>Post not found</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="post-page-container">
      <Navbar />
      <div className="main-content">
        <MenuBar />
        <div className="post-detail-content">
          <div className="post-detail">
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
              <button className="more-options">...</button>
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
        </div>
      </div>
    </div>
  );
};

export default PostPage;
