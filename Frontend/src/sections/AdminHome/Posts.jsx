import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Pen, Plus, X, Trash2 } from 'lucide-react';
import "./Posts.css";

const API_BASE_URL = 'http://localhost:8080';

// Base64 encoded fallback image
const FALLBACK_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMDAgMjAwIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2NjYiPkltYWdlIE5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=';

// API service functions
const fetchPosts = async () => {
  const response = await axios.get(`${API_BASE_URL}/posts`);
  return response.data;
};

const isValidMongoId = (id) => {
  return id && typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
};

const createPost = async (postData) => {
  const formData = new FormData();
  formData.append('title', postData.title);
  formData.append('caption', postData.caption);
  formData.append('image', postData.image);
  
  const response = await axios.post(`${API_BASE_URL}/posts/add-post`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

const deletePost = async (postId) => {
  if (!postId) {
    throw new Error("Post ID is required");
  }
  await axios.delete(`${API_BASE_URL}/posts/${postId}`);
};

function Posts() {
  const [posts, setPosts] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    caption: '',
    image: null,
    previewImage: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageLoadStates, setImageLoadStates] = useState({});
  const isValidId = (id) => /^[0-9a-fA-F]{24}$/.test(id);
  const initialLoadStates = {};

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
          initialLoadStates[post.id] = true;  // Changed from post._id to post.id
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPost(prev => ({
        ...prev,
        image: file,
        previewImage: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const createdPost = await createPost(newPost);
      setPosts([createdPost, ...posts]);
      setShowPostForm(false);
      setNewPost({
        title: '',
        caption: '',
        image: null,
        previewImage: null
      });
    } catch (error) {
      setError('Failed to create post');
      console.error('Error creating post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  

  const handleDeletePost = async (postId) => {
    // Enhanced validation
    if (!isValidMongoId(postId)) {
      console.error('Invalid ID format:', postId);
      setError('Invalid post ID format');
      return;
    }
  
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
  
    try {
      setIsLoading(true);
      
      await deletePost(postId);
      
      // CORRECTED: Use functional update to ensure fresh state
      setPosts(currentPosts => currentPosts.filter(post => post.id !== postId));
      
    } catch (error) {
      console.error('Full delete error:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      setError(error.response?.data?.message || 'Delete failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
      {/* Header */}
      <div className="posts-header">
        <h1><Pen size={24} /> Posts</h1>
        <button 
          className="add-post-btn"
          onClick={() => setShowPostForm(true)}
        >
          <Plus size={16} /> Add Post
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Loading Spinner */}
      {isLoading && !showPostForm && (
        <div className="loading-spinner">Loading posts...</div>
      )}

      {/* Posts Grid */}
      <div className="posts-grid">
        {posts.map(post => (
          <div key={post._id} className="post-card">
             <div className="image-container">
  {imageLoadStates[post.id] && (  // Changed from post._id to post.id
    <div className="image-loading">Loading image...</div>
  )}
  <img
    src={`${API_BASE_URL}/uploads/${post.imageUrl}`}
    alt={post.title}
    className="post-image"
    onLoad={() => handleImageLoaded(post.id)}  // Changed here
    onError={(e) => {
      e.target.src = FALLBACK_IMAGE;
      handleImageError(post.id);  // Changed here
    }}
    style={{ display: imageLoadStates[post.id] ? 'none' : 'block' }}  // Changed here
  />
</div>
            <div className="post-content">
              <h2 className="post-title">{post.title}</h2>
              <p className="post-caption">{post.caption}</p>
              <button 
  className="delete-post-btn"
  onClick={() => handleDeletePost(post.id)}  // Changed from post._id to post.id
  disabled={isLoading}
>
  <Trash2 size={16} /> Delete
</button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Post Modal */}
      {showPostForm && (
        <div className="post-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Post</h2>
              <button onClick={() => setShowPostForm(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={newPost.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Caption</label>
                <textarea
                  name="caption"
                  value={newPost.caption}
                  onChange={handleInputChange}
                  rows={3}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
                {newPost.previewImage && (
                  <div className="image-preview">
                    <img 
                      src={newPost.previewImage} 
                      alt="Preview" 
                    />
                  </div>
                )}
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setShowPostForm(false)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Posting...' : 'Add Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Posts;