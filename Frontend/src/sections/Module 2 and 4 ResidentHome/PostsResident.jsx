import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Pen } from 'lucide-react';
import "./styles/PostsResident.css"; 

const API_BASE_URL = 'http://localhost:8080';

// Base64 encoded fallback image
const FALLBACK_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMDAgMjAwIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2NjYiPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';

const fetchPosts = async () => {
  const response = await axios.get(`${API_BASE_URL}/posts`);
  return response.data;
};

function ResidentPosts() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageLoadStates, setImageLoadStates] = useState({});

  // Fetch posts on component mount
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        const posts = await fetchPosts();
        setPosts(posts);
        // Initialize image load states
        const initialLoadStates = {};
        posts.forEach(post => {
          initialLoadStates[post.id] = true;
        });
        setImageLoadStates(initialLoadStates);
      } catch (error) {
        setError('Failed to load posts');
        console.error('Error loading posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPosts();
  }, []);

  const handleImageLoaded = (postId) => {
    setImageLoadStates(prev => ({
      ...prev,
      [postId]: false
    }));
  };

  const handleImageError = (postId) => {
    setImageLoadStates(prev => ({
      ...prev,
      [postId]: false
    }));
  };

  return (
    <div className="posts-container">
      {/* Header - Simplified for resident */}
      <div className="posts-header">
        <h1><Pen size={24} /> Community Posts</h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Loading Spinner */}
      {isLoading && (
        <div className="loading-spinner">Loading posts...</div>
      )}

      {/* Posts Grid */}
      <div className="posts-grid">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <div className="image-container">
              {imageLoadStates[post.id] && (
                <div className="image-loading">Loading image...</div>
              )}
              <img
                src={`${API_BASE_URL}/uploads/${post.imageUrl}`}
                alt={post.title}
                className="post-image"
                onLoad={() => handleImageLoaded(post.id)}
                onError={(e) => {
                  e.target.src = FALLBACK_IMAGE;
                  handleImageError(post.id);
                }}
                style={{ display: imageLoadStates[post.id] ? 'none' : 'block' }}
              />
            </div>
            <div className="post-content">
              <h2 className="post-title">{post.title}</h2>
              <p className="post-caption">{post.caption}</p>
              {/* No delete button for residents */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResidentPosts;