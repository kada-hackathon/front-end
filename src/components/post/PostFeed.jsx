import React from 'react';
import Post from './post';
import './post.css';

const PostFeed = () => {
  // Sample data - in a real app, this would come from an API
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

  return (
    <div className="post-feed" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostFeed;
