import React, { useState, useEffect } from "react";
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import "./HomeUi4.css";
import Notices from './Notices'; 
import Posts from './Posts'; 
import Parking from './Parking'; 
import { Calendar, Cog, AlertCircle, Bell, Pen, Phone, FileText, LogOut, ParkingSquare, LayoutDashboard, User, Search } from 'lucide-react';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '../services/api';

import logo from "../assets/Natural Care Logo.jpg";

// CSS styles
const styles = `
  /* Previous styles remain the same */
  .resident-list-container {
    margin-top: 1.5rem;
  }
  .filter-controls {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    align-items: center;
  }
  .search-input {
    padding: 0.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    flex-grow: 1;
    max-width: 300px;
  }
  .block-filter {
    display: flex;
    gap: 0.5rem;
  }
  .block-btn {
    padding: 0.5rem 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    cursor: pointer;
    background: white;
  }
  .block-btn.active {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }
  .resident-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
  }
  .resident-card {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1rem;
  }
  .resident-card h3 {
    margin-bottom: 0.5rem;
    color: #3b82f6;
  }
  .resident-card p {
    margin: 0.25rem 0;
    color: #4b5563;
  }
  .loading-spinner {
    display: flex;
    justify-content: center;
    padding: 20px;
    color: #3b82f6;
  }
  .error-message {
    background-color: #fee2e2;
    color: #dc2626;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 15px;
    text-align: center;
  }
  .requests-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }
  .request-card {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1rem;
    background-color: white;
  }
  .request-card h3 {
    margin-top: 0;
    color: #3b82f6;
  }
  .request-status {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-weight: 500;
    margin-left: 0.5rem;
  }
  .request-status.Pending {
    background-color: #fef3c7;
    color: #92400e;
  }
  .request-status.Completed {
    background-color: #d1fae5;
    color: #065f46;
  }
  .request-status.InProgress {
    background-color: #dbeafe;
    color: #1e40af;
  }
  .request-status.Cancelled {
    background-color: #fee2e2;
    color: #991b1b;
  }
`;

// Main component
function HomeUI() {

  axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS';

  const [activeSection, setActiveSection] = useState("dashboard-section");
  const [activeBlock, setActiveBlock] = useState('A','B');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [residents, setResidents] = useState([]);
  const [filteredResidents, setFilteredResidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingResidents, setIsLoadingResidents] = useState(false);
  const [residentError, setResidentError] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentResident, setCurrentResident] = useState(null);
  const [editFormData, setEditFormData] = useState({
      name: '',
      block: '',
      flatNo: '',
      phone: ''
  });

  // Event states
  const [eventFormData, setEventFormData] = useState({
    title: '',
    start: '',
    end: '',
    description: '',
    allDay: true,
    imageUrl: ''
  });
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Request Services State
  const [serviceRequests, setServiceRequests] = useState([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [requestError, setRequestError] = useState(null);

  //complaint status :
  const [complaints, setComplaints] = useState([]);
  const [isLoadingComplaints, setIsLoadingComplaints] = useState(false);
  const [complaintError, setComplaintError] = useState(null);
  const [complaintFormData, setComplaintFormData] = useState({
    name: userData?.name || '',
    title: '',
    description: '',
    block: userData?.block || '',
    flatNo: userData?.flatNo || '',
    status: 'Pending'
  });

  const countComplaints = () => {
    const total = complaints.length;
    const solved = complaints.filter(c => c.status === 'Solved').length;
    const unsolved = total - solved;
    const blockA = complaints.filter(c => c.block === 'A').length;
    const blockB = complaints.filter(c => c.block === 'B').length;
    
    return { total, solved, unsolved, blockA, blockB };
  };

  const [complaintStats, setComplaintStats] = useState({
    total: 0,
    solved: 0,
    pending: 0,
    blockA: 0,
    blockB: 0
  });
  const complaintCounts = countComplaints();

  // API states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user data from localStorage
  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    const userEmail = localStorage.getItem("userEmail");
    const userRole = localStorage.getItem("userRole");

    if (storedUserData && userEmail && userRole) {
      setUserData({ ...storedUserData, email: userEmail, role: userRole });
    }
  }, []);

  // Fetch residents from backend
  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/user/residents');
        setResidents(response.data);
        setFilteredResidents(response.data); // Initialize with all residents
      } catch (error) {
        console.error("Error fetching residents:", error);
      }
    };
    
    fetchResidents();
  }, []);
  
  // Filter residents when block or search term changes
  useEffect(() => {
    let results = residents;
    
    // Filter by block
    if (activeBlock) {
      results = results.filter(resident => 
        resident.residentDetails?.block === activeBlock
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(resident =>
        resident.email.toLowerCase().includes(term) ||
        (resident.residentDetails?.name && 
         resident.residentDetails.name.toLowerCase().includes(term))
      );
    }
    
    setFilteredResidents(results);
  }, [residents, activeBlock, searchTerm]);

  // Fetch service requests when service section is active
  useEffect(() => {
    const fetchServiceRequests = async () => {
      if (activeSection !== "request-services-section") return;
      
      setIsLoadingRequests(true);
      setRequestError(null);
      try {
        const response = await axios.get(
          'http://localhost:8080/service-requests/all-services',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        setServiceRequests(response.data);
      } catch (err) {
        setRequestError('Failed to load service requests. Please try again later.');
        console.error('Error fetching service requests:', err);
      } finally {
        setIsLoadingRequests(false);
      }
    };
    
    fetchServiceRequests();
  }, [activeSection]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Fetch events from backend
  useEffect(() => {
    const loadEvents = async () => {
      if (activeSection !== "events-section") return;
      
      setIsLoading(true);
      setError(null);
      try {
        const events = await fetchEvents();
        setEvents(events);
      } catch (err) {
        setError('Failed to load events. Please try again later.');
        console.error('Error fetching events:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadEvents();
  }, [activeSection]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Event handlers
  const handleDateClick = (arg) => {
    setShowEventForm(true);
    setSelectedEvent(null);
    setEventFormData({
      title: '',
      start: arg.dateStr,
      end: '',
      description: '',
      allDay: true,
      imageUrl: ''  // Make sure this is included
    });
  };
  

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setShowEventDetails(true);
  };

  const handleEventFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEventFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (selectedEvent) {
        const updatedEvent = await updateEvent(selectedEvent.id, eventFormData);
        setEvents(events.map(event => 
          event.id === selectedEvent.id ? {
            ...event,
            title: updatedEvent.title,
            start: updatedEvent.start,
            end: updatedEvent.end || undefined,
            extendedProps: { 
              description: updatedEvent.description,
              imageUrl: updatedEvent.imageUrl
            },
            allDay: updatedEvent.allDay
          } : event
        ));
      } else {
        const newEvent = await createEvent(eventFormData);
        setEvents([...events, {
          id: newEvent.id,
          title: newEvent.title,
          start: newEvent.start,
          end: newEvent.end || undefined,
          allDay: newEvent.allDay,
          extendedProps: { 
            description: newEvent.description,
            imageUrl: newEvent.imageUrl
          }
        }]);
      }
  
      setShowEventForm(false);
      setSelectedEvent(null);
    } catch (err) {
      setError(selectedEvent ? 'Failed to update event' : 'Failed to create event');
      console.error('Error saving event:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventDelete = async () => {
    if (!selectedEvent) return;
    
    setIsLoading(true);
    setError(null);
    try {
      await deleteEvent(selectedEvent.id);
      setEvents(events.filter(event => event.id !== selectedEvent.id));
      setShowEventForm(false);
      setShowEventDetails(false);
      setSelectedEvent(null);
    } catch (err) {
      setError('Failed to delete event');
      console.error('Error deleting event:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventChange = async (changeInfo) => {
    try {
      await updateEvent(changeInfo.event.id, {
        title: changeInfo.event.title,
        start: changeInfo.event.start,
        end: changeInfo.event.end || null,
        description: changeInfo.event.extendedProps.description,
        allDay: changeInfo.event.allDay,
        imageUrl: changeInfo.event.extendedProps.imageUrl || null
      });
      
      setEvents(events.map(event => 
        event.id === changeInfo.event.id ? changeInfo.event : event
      ));
    } catch (err) {
      setError('Failed to reschedule event');
      console.error('Error updating event:', err);
      changeInfo.revert();
    }
  };
  

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
    if (sectionId !== "dashboard-section") {
      setActiveBlock(null);
    }
  };

  const handleBlockClick = (blockId) => {
    setActiveBlock(blockId);
  };

  //edit dashboard form :
  const handleEditClick = (resident) => {
    setCurrentResident(resident);
    setEditFormData({
        name: resident.residentDetails?.name || '',
        block: resident.residentDetails?.block || '',
        flatNo: resident.residentDetails?.flatNo || '',
        phone: resident.residentDetails?.phone || ''
    });
    setEditModalOpen(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.put(`http://localhost:8080/api/user/resident-details?email=${currentResident.email}`, editFormData);
        // Refresh residents after update
        fetchResidents();
        setEditModalOpen(false);
    } catch (err) {
        console.error("Error updating resident:", err);
    }
  };

  const fetchResidents = async () => {
    setIsLoadingResidents(true);
    setResidentError(null);
    try {
      const response = await axios.get('http://localhost:8080/api/user/residents');
      const residentsData = response.data.map(user => ({
        ...user,
        name: user.residentDetails?.name || user.email.split('@')[0],
        block: user.residentDetails?.block || 'N/A',
        flatNo: user.residentDetails?.flatNo || 'N/A',
        phone: user.residentDetails?.phone || 'N/A'
      }));
      setResidents(residentsData);
      setFilteredResidents(residentsData);
    } catch (err) {
      setResidentError('Failed to load residents. Please try again later.');
      console.error('Error fetching residents:', err);
    } finally {
      setIsLoadingResidents(false);
    }
  };

  //complaint :
  

  useEffect(() => {
    const fetchComplaints = async () => {
      if (activeSection !== "complaints-section") return;
      
      setIsLoadingComplaints(true);
      setComplaintError(null);
      try {
        const response = await axios.get(
          'http://localhost:8080/api/complaints',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        setComplaints(response.data);
      } catch (err) {
        setComplaintError('Failed to load complaints. Please try again later.');
        console.error('Error fetching complaints:', err);
      } finally {
        setIsLoadingComplaints(false);
      }
    };
    
    fetchComplaints();
  }, [activeSection]);
  
  // Add this useEffect to fetch complaint stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8080/api/complaints/stats',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        setComplaintStats(response.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };
    
    if (activeSection === "complaints-section") {
      fetchStats();
    }
  }, [activeSection, complaints]); // Add complaints to dependencies to update stats when complaints change
  
  
  // Add the status update handler
  const handleStatusUpdate = async (complaintId, newStatus) => {
  try {
    // Using proxy URL
    const response = await axios.patch(
      `/api/api/complaints/${complaintId}/status`,
      { status: newStatus },
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("token")}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Update local state
    setComplaints(complaints.map(c => 
      c.id === complaintId ? { ...c, status: newStatus } : c
    ));
    
  } catch (err) {
    console.error('Status update failed:', err);
    alert('Failed to update status. See console for details.');
  }
};
  
  // Add the complaint form change handler
  const handleComplaintFormChange = (e) => {
    const { name, value } = e.target;
    setComplaintFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Add the complaint submission handler
  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoadingComplaints(true);
      setComplaintError(null);
      
      if (!complaintFormData.title || !complaintFormData.description) {
        throw new Error('Title and description are required');
      }
  
      const response = await axios.post(
        'http://localhost:8080/api/complaints',
        {
          name: complaintFormData.name,
          email: userData?.email || '',
          title: complaintFormData.title,
          description: complaintFormData.description,
          block: complaintFormData.block,
          flatNo: complaintFormData.flatNo,
          status: 'Pending'
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
  
      if ([200, 201].includes(response.status)) {
        // Refresh the complaints list
        const { data } = await axios.get(
          'http://localhost:8080/api/complaints',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        
        setComplaints(data);
        setComplaintFormData(prev => ({
          ...prev,
          title: '',
          description: ''
        }));
        alert('Complaint submitted successfully!');
      }
    } catch (err) {
      setComplaintError(err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setIsLoadingComplaints(false);
    }
  };

  

  const getSectionTitle = () => {
    switch (activeSection) {
      case "dashboard-section": return "Residents of the society";
      case "request-services-section": return "Request Services";
      case "complaints-section": return "Complaints";
      case "events-section": return "Events";
      case "notices-section": return "Notices";
      case "posts-section": return "Posts";
      case "parking-section": return "Parking";
      case "emergency-contacts-section": return "Emergency Contacts";
      case "billings-section": return "Billings";
      case "logout-section": return "Logout";
      default: return "Dashboard";
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="home-container">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-logo">
          <img src={logo} alt="Logo" className="h-12 w-12" />
          </div>
          <nav className="sidebar-nav">
            <NavItem
              icon={<LayoutDashboard />}
              title="Dashboard"
              isActive={activeSection === "dashboard-section"}
              onClick={() => handleNavClick("dashboard-section")}
            />
            <NavItem
              icon={<Cog />}
              title="Request Services"
              isActive={activeSection === "request-services-section"}
              onClick={() => handleNavClick("request-services-section")}
            />
            <NavItem
              icon={<AlertCircle />}
              title="Complaints"
              isActive={activeSection === "complaints-section"}
              onClick={() => handleNavClick("complaints-section")}
            />
            <NavItem
              icon={<Calendar />}
              title="Events"
              isActive={activeSection === "events-section"}
              onClick={() => handleNavClick("events-section")}
            />
            <NavItem
              icon={<Bell />}
              title="Notices"
              isActive={activeSection === "notices-section"}
              onClick={() => handleNavClick("notices-section")}
            />
            <NavItem
              icon={<Pen />}
              title="Posts"
              isActive={activeSection === "posts-section"}
              onClick={() => handleNavClick("posts-section")}
            />
            <NavItem
              icon={<ParkingSquare />}
              title="Parking"
              isActive={activeSection === "parking-section"}
              onClick={() => handleNavClick("parking-section")}
            />
            <NavItem
              icon={<Phone />}
              title="Emergency Contacts"
              isActive={activeSection === "emergency-contacts-section"}
              onClick={() => handleNavClick("emergency-contacts-section")}
            />
            <NavItem
              icon={<FileText />}
              title="Billings"
              isActive={activeSection === "billings-section"}
              onClick={() => handleNavClick("billings-section")}
            />
            <NavItem
              icon={<LogOut />}
              title="Logout"
              isActive={activeSection === "logout-section"}
              onClick={() => handleNavClick("logout-section")}
            />
          </nav>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="content-wrapper">
            {/* Header */}
            <div className="header">
              <h1>{getSectionTitle()}</h1>
              <div className="user-info" onClick={() => setIsProfileOpen(true)}>
                <span>{userData ? userData.name : "User"}</span>
                <User />
              </div>
            </div>


           {/* Dashboard Section */}


{activeSection === "dashboard-section" && (
  <div className="section-container dashboard-section">
    <div className="section-header">
      <h2 className="section-title">Residents of the Society</h2>
      
      <div className="apartment-filters">
        <h3 className="filter-title">Apartments</h3>
        <div className="filter-controls">
          <div className="search-container">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search residents..."
              className="search-input"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="block-filters">
            <button
              className={`block-filter-btn ${activeBlock === "A" ? "active" : ""}`}
              onClick={() => setActiveBlock("A")}
            >
              Block A
            </button>
            <button
              className={`block-filter-btn ${activeBlock === "B" ? "active" : ""}`}
              onClick={() => setActiveBlock("B")}
            >
              Block B
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Residents List */}
    <div className="resident-list-container">
      {isLoadingResidents ? (
        <div className="loading-spinner">Loading residents...</div>
      ) : residentError ? (
        <div className="error-message">
          {residentError}
          <button onClick={fetchResidents} className="retry-btn">Retry</button>
        </div>
      ) : filteredResidents.length > 0 ? (
        <div className="resident-grid">
          {filteredResidents.map((resident) => (
            <div key={resident.id} className="resident-card">
              <h3>{resident.residentDetails?.name || resident.email.split('@')[0]}</h3>
              <p><strong>Email:</strong> {resident.email}</p>
              <p><strong>Block:</strong> {resident.residentDetails?.block || 'N/A'}</p>
              <p><strong>Flat No:</strong> {resident.residentDetails?.flatNo || 'N/A'}</p>
              <p><strong>Phone:</strong> {resident.residentDetails?.phone || 'N/A'}</p>
              <p><strong>Role:</strong> {resident.role}</p>
              <button 
                onClick={() => handleEditClick(resident)}
                className="edit-btn"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-residents">
          No residents found in Block {activeBlock}
        </div>
      )}
    </div>
  </div>
)}

{/* resident edit form : */}
{editModalOpen && (
    <div className="modal-overlay">
        <div className="modal-content">
            <h3>Edit Resident Details</h3>
            <form onSubmit={handleEditSubmit}>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={editFormData.name}
                        onChange={handleEditFormChange}
                    />
                </div>
                <div className="form-group">
                    <label>Block</label>
                    <input
                        type="text"
                        name="block"
                        value={editFormData.block}
                        onChange={handleEditFormChange}
                    />
                </div>
                <div className="form-group">
                    <label>Flat No</label>
                    <input
                        type="text"
                        name="flatNo"
                        value={editFormData.flatNo}
                        onChange={handleEditFormChange}
                    />
                </div>
                <div className="form-group">
                    <label>Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={editFormData.phone}
                        onChange={handleEditFormChange}
                    />
                </div>
                <div className="modal-actions">
                    <button type="button" onClick={() => setEditModalOpen(false)}>
                        Cancel
                    </button>
                    <button type="submit">Save Changes</button>
                </div>
            </form>
        </div>
    </div>
)}

            {/* Complaints Section */}
{activeSection === "complaints-section" && (
  <div className="card complaints-section">
    <div className="stats-grid">
      <div className="stat-card stat-card-blue">
        <div className="stat-number">{complaintStats.total}</div>
        <div>Total Complaints</div>
      </div>
      <div className="stat-card stat-card-green">
        <div className="stat-number stat-number-green">{complaintStats.solved}</div>
        <div>Solved</div>
      </div>
      <div className="stat-card stat-card-yellow">
        <div className="stat-number stat-number-yellow">{complaintStats.pending}</div>
        <div>Pending</div>
      </div>
      <div className="stat-card stat-card-purple">
        <div className="stat-number stat-number-purple">{complaintStats.blockA}</div>
        <div>Block A</div>
      </div>
      <div className="stat-card stat-card-blue-dark">
        <div className="stat-number">{complaintStats.blockB}</div>
        <div>Block B</div>
      </div>
    </div>
    
    <div className="card" style={{ marginTop: '1.5rem' }}>
      <h2 className="section-title">Submit Complaint</h2>
      {complaintError && (
        <div className="error-message" style={{ marginBottom: '1rem' }}>
          {complaintError}
        </div>
      )}
      <form onSubmit={handleComplaintSubmit} className="form-container">
        <div className="form-group">
          <label className="form-label" htmlFor="name">
            Name
          </label>
          <input
            className="form-input"
            id="name"
            name="name"
            placeholder="Enter your Name here"
            type="text"
            value={complaintFormData.name}
            onChange={handleComplaintFormChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="title">
            Title *
          </label>
          <input
            className="form-input"
            id="title"
            name="title"
            placeholder="Enter the Title here"
            type="text"
            value={complaintFormData.title}
            onChange={handleComplaintFormChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="description">
            Description *
          </label>
          <textarea
            className="form-textarea"
            id="description"
            name="description"
            placeholder="Enter the Description here"
            value={complaintFormData.description}
            onChange={handleComplaintFormChange}
            required
          ></textarea>
        </div>
        <button
          className="btn btn-primary"
          type="submit"
          disabled={isLoadingComplaints}
        >
          {isLoadingComplaints ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
    
    <div className="card" style={{ marginTop: '1.5rem' }}>
      <h2 className="section-title">All Complaints</h2>
      {isLoadingComplaints ? (
        <div className="loading-spinner">Loading complaints...</div>
      ) : complaintError ? (
        <div className="error-message">
          {complaintError}
          <button onClick={() => window.location.reload()} className="retry-btn">Retry</button>
        </div>
      ) : complaints.length > 0 ? (
        <div className="complaints-grid">
          {complaints.map((complaint) => (
            <div key={complaint.id} className="complaint-card">
              <h3>{complaint.title}</h3>
              <p><strong>Submitted by:</strong> {complaint.name}</p>
              <p><strong>Date:</strong> {new Date(complaint.createdAt).toLocaleString()}</p>
              <p><strong>Block:</strong> {complaint.block}</p>
              <p><strong>Flat No:</strong> {complaint.flatNo}</p>
              <p><strong>Description:</strong> {complaint.description}</p>
              <p>
                <strong>Status:</strong> 
                <span className={`complaint-status ${complaint.status}`}>
                  {complaint.status}
                </span>
              </p>
              
              {userData?.role === 'Admin' && (
                <div className="status-actions">
                  <select 
                    value={complaint.status}
                    onChange={(e) => handleStatusUpdate(complaint.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Solved">Solved</option>
                  </select>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No complaints found.</p>
      )}
    </div>
  </div>
)}

            {/* Request Services Section */}
            {activeSection === "request-services-section" && (
              <div>
                <div className="card" style={{ marginTop: '1.5rem' }}>
                  <h2 className="section-title">Service Requests</h2>
                  {isLoadingRequests ? (
                    <div className="loading-spinner">Loading requests...</div>
                  ) : requestError ? (
                    <div className="error-message">
                      {requestError}
                      <button onClick={() => window.location.reload()} className="retry-btn">Retry</button>
                    </div>
                  ) : serviceRequests.length > 0 ? (
                    <div className="requests-grid">
                      {serviceRequests.map((request) => (
                        <div key={request.id} className="request-card">
                          <h3>{request.serviceType}</h3>
                          <p><strong>Requested by:</strong> {request.name}</p>
                          <p><strong>Date:</strong> {new Date(request.createdAt).toLocaleString()}</p>
                          <p><strong>Address:</strong> {request.address}</p>
                          <p><strong>Phone:</strong> {request.phoneNo}</p>
                          {request.additionalNotes && <p><strong>Notes:</strong> {request.additionalNotes}</p>}
                          <p>
                            <strong>Status:</strong> 
                            <span className={`request-status ${request.status || 'Pending'}`}>
                              {request.status || 'Pending'}
                            </span>
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No service requests found.</p>
                  )}
                </div>
              </div>
            )}

            {/* Events Section */}
            {activeSection === "events-section" && (
              <div>
                {isLoading && <div className="loading-spinner">Loading events...</div>}
                {error && <div className="error-message">{error}</div>}
                
                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 className="section-title">Society Events</h2>
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      setShowEventForm(true);
                      setSelectedEvent(null);
                      setEventFormData({
                        title: '',
                        start: new Date().toISOString().split('T')[0],
                        end: '',
                        description: '',
                        allDay: true,
                        imageUrl: ''  // Add this line
                      });
                    }}
                    disabled={isLoading}
                  >
                    + Add Event
                  </button>
                </div>

                <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
                  <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                      left: 'prev,next today',
                      center: 'title',
                      right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    events={events}
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={true}
                    dateClick={handleDateClick}
                    eventClick={handleEventClick}
                    eventChange={handleEventChange}
                    height="auto"
                  />
                </div>

                {/* Event Form Modal */}
                {showEventForm && (
                  <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                  }}>
                    <div style={{
                      backgroundColor: 'white',
                      padding: '2rem',
                      borderRadius: '0.5rem',
                      width: '100%',
                      maxWidth: '500px'
                    }}>
                      <h2 style={{ marginBottom: '1.5rem' }}>
                        {selectedEvent ? 'Edit Event' : 'Add New Event'}
                      </h2>
                      <form onSubmit={handleEventSubmit}>

                      <div className="form-group" style={{ marginBottom: '1rem' }}>
      <label className="form-label">Image URL</label>
      <input
        className="form-input"
        type="text"
        name="imageUrl"
        value={eventFormData.imageUrl}
        onChange={handleEventFormChange}
        placeholder="Optional image URL"
        disabled={isLoading}
      />
    </div>

                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                          <label className="form-label">Event Title</label>
                          <input
                            className="form-input"
                            type="text"
                            name="title"
                            value={eventFormData.title}
                            onChange={handleEventFormChange}
                            required
                            disabled={isLoading}
                          />
                        </div>
                        
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                          <label className="form-label">Start Date</label>
                          <input
                            className="form-input"
                            type="date"
                            name="start"
                            value={eventFormData.start}
                            onChange={handleEventFormChange}
                            required
                            disabled={isLoading}
                          />
                        </div>
                        
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                          <label className="form-label">End Date</label>
                          <input
                            className="form-input"
                            type="date"
                            name="end"
                            value={eventFormData.end}
                            onChange={handleEventFormChange}
                            disabled={isLoading}
                          />
                        </div>
                        
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                          <label className="form-label">All Day Event</label>
                          <input
                            type="checkbox"
                            name="allDay"
                            checked={eventFormData.allDay}
                            onChange={handleEventFormChange}
                            style={{ marginLeft: '0.5rem' }}
                            disabled={isLoading}
                          />
                        </div>
                        
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                          <label className="form-label">Description</label>
                          <textarea
                            className="form-textarea"
                            name="description"
                            value={eventFormData.description}
                            onChange={handleEventFormChange}
                            rows="4"
                            disabled={isLoading}
                          />
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setShowEventForm(false)}
                            disabled={isLoading}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isLoading}
                          >
                            {isLoading ? 'Saving...' : selectedEvent ? 'Update Event' : 'Add Event'}
                          </button>
                          {selectedEvent && (
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={handleEventDelete}
                              style={{ backgroundColor: '#ef4444', marginLeft: '0.5rem' }}
                              disabled={isLoading}
                            >
                              {isLoading ? 'Deleting...' : 'Delete'}
                            </button>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Event Details Modal */}
{showEventDetails && selectedEvent && (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  }}>
    <div style={{
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '0.5rem',
      width: '100%',
      maxWidth: '500px'
    }}>
      {selectedEvent.extendedProps?.imageUrl && (
        <div style={{ marginBottom: '1rem' }}>
          <img 
            src={selectedEvent.extendedProps.imageUrl} 
            alt={selectedEvent.title}
            style={{ 
              maxWidth: '100%', 
              maxHeight: '200px', 
              borderRadius: '4px',
              objectFit: 'cover'
            }}
          />
        </div>
      )}
      
      <h2 style={{ marginBottom: '1rem' }}>{selectedEvent.title}</h2>
      <p style={{ marginBottom: '0.5rem' }}>
        <strong>Date:</strong> {new Date(selectedEvent.start).toLocaleDateString()}
        {selectedEvent.end && ` to ${new Date(selectedEvent.end).toLocaleDateString()}`}
      </p>
      {selectedEvent.extendedProps?.description && (
        <p style={{ marginBottom: '1.5rem' }}>
          <strong>Description:</strong> {selectedEvent.extendedProps.description}
        </p>
      )}
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end',
        gap: '1rem'
      }}>
        <button
          className="btn btn-danger"
          onClick={handleEventDelete}
          disabled={isLoading}
        >
          Delete
        </button>
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowEventDetails(false);
            setShowEventForm(true);
            setEventFormData({
              title: selectedEvent.title,
              start: selectedEvent.startStr,
              end: selectedEvent.endStr || '',
              description: selectedEvent.extendedProps?.description || '',
              allDay: selectedEvent.allDay,
              imageUrl: selectedEvent.extendedProps?.imageUrl || ''
            });
          }}
          disabled={isLoading}
        >
          Edit
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => setShowEventDetails(false)}
          disabled={isLoading}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}
              </div>
            )}

            {/* Notices Section */}
            {activeSection === "notices-section" && <Notices />}

            {/* Posts Section */}
            {activeSection === "posts-section"  && <Posts />}

            {/* Parking Section */}
            {activeSection === "parking-section" && <Parking />}

            {/* Emergency Contacts Section */}
            {activeSection === "emergency-contacts-section" && (
              <div>
                <div className="card">
                  <h2 className="section-title">Emergency Contacts</h2>
                  <div className="contacts-grid">
                    <div className="contact-card contact-card-red">
                      <h3>Fire Department</h3>
                      <p>Phone: 101</p>
                    </div>
                    <div className="contact-card contact-card-blue">
                      <h3>Police</h3>
                      <p>Phone: 100</p>
                    </div>
                    <div className="contact-card contact-card-green">
                      <h3>Ambulance</h3>
                      <p>Phone: 102</p>
                    </div>
                    <div className="contact-card contact-card-yellow">
                      <h3>Society Security</h3>
                      <p>Phone: 9876543210</p>
                    </div>
                    <div className="contact-card contact-card-purple">
                      <h3>Maintenance</h3>
                      <p>Phone: 9876543211</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

             {/* Billings Section */}
             {activeSection === "billings-section" && (
              <div>
                <div className="billing-card">
                  <h2 className="section-title">Billing Information</h2>
                  <div style={{ marginBottom: "1.5rem" }}>
                    <h3 style={{ fontWeight: "700", marginBottom: "0.5rem" }}>Current Month</h3>
                    <div className="billing-grid">
                      <div className="bill-card bill-card-blue">
                        <h4>Maintenance</h4>
                        <p className="bill-amount">₹2,500</p>
                        <p className="bill-due">Due: 15th Apr 2023</p>
                      </div>
                      <div className="bill-card bill-card-green">
                        <h4>Water Bill</h4>
                        <p className="bill-amount">₹800</p>
                        <p className="bill-due">Due: 20th Apr 2023</p>
                      </div>
                      <div className="bill-card bill-card-yellow">
                        <h4>Electricity (Common)</h4>
                        <p className="bill-amount">₹350</p>
                        <p className="bill-due">Due: 25th Apr 2023</p>
                      </div>
                    </div>
                  </div>
                  <button className="btn btn-primary">
                    Pay Bills
                  </button>
                </div>
              </div>
            )}

            {/* Logout Section */}
            {activeSection === "logout-section" && (
              <div>
                <div className="logout-card">
                  <h2>Are you sure you want to logout?</h2>
                  <div className="btn-group">
                    <button className="btn-danger" onClick={handleLogout}>
                      Yes, Logout
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => handleNavClick("dashboard-section")}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      






      {/* Profile Modal */}
      {isProfileOpen && userData && (
        <div className="profile-modal">
          <div className="modal-content">
            <h2>Welcome, {userData.name}!</h2>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Role:</strong> {userData.role}</p>
            <p><strong>Phone:</strong> {userData.phone || 'Not provided'}</p>
            {userData.societyId && <p><strong>Society ID:</strong> {userData.societyId}</p>}
            {userData.societyName && <p><strong>Society Name:</strong> {userData.societyName}</p>}

            {userData.role === "Admin" ? (
              <div className="admin-details">
                <h3>Admin Profile</h3>
                {userData.societyAddress && <p><strong>Society Address:</strong> {userData.societyAddress}</p>}
                {userData.city && <p><strong>City:</strong> {userData.city}</p>}
                {userData.district && <p><strong>District:</strong> {userData.district}</p>}
                {userData.postal && <p><strong>Postal Code:</strong> {userData.postal}</p>}
              </div>
            ) : (
              <div className="resident-details">
                <h3>Resident Profile</h3>
                {userData.flatNo && <p><strong>Flat No:</strong> {userData.flatNo}</p>}
                {userData.block && <p><strong>Block:</strong> {userData.block}</p>}
                {userData.postal && <p><strong>Postal Code:</strong> {userData.postal}</p>}
              </div>
            )}

            <button 
              onClick={() => setIsProfileOpen(false)} 
              className="close-modal"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// Navigation Item Component
function NavItem({ icon, title, isActive, onClick }) {
  return (
    <button
      className={`nav-item ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      {icon}
      <span>{title}</span>
    </button>
  );
}

export default HomeUI;