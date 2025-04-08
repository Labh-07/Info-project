import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Bell, Loader2 } from 'lucide-react';
import './styles/NoticeResident.css';

const API_BASE_URL = 'http://localhost:8080';

function Notices() {
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch notices from backend
  useEffect(() => {
    const loadNotices = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/notices`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setNotices(response.data);
      } catch (error) {
        setError('Failed to load notices. Please try again later.');
        console.error('Error fetching notices:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadNotices();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="notice-container">
      <div className="notice-header">
        <h1><Bell size={24} /> Notices</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="notice-content">
        {isLoading && notices.length === 0 ? (
          <div className="loading-spinner">
            <Loader2 className="spin" size={24} />
            Loading notices...
          </div>
        ) : notices.length === 0 ? (
          <div className="no-notices">No notices available</div>
        ) : (
          <div className="notice-list">
            {notices.map(notice => (
              <div key={notice.id} className="notice-card">
                <div className="notice-card-content">
                  <div className="notice-meta">
                    <span className="notice-date">{formatDate(notice.scheduleAt)}</span>
                    <span className="notice-author">{notice.createdBy || 'Admin'}</span>
                  </div>
                  <div className="notice-text-content">
                    <h3 className="notice-title">{notice.title}</h3>
                    <div className="notice-content-text">{notice.content}</div>
                  </div>
                  {notice.isImportant && (
                    <div className="notice-important">IMPORTANT</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notices;