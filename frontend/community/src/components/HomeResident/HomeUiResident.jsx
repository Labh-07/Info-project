import React, { useState, useEffect } from "react";
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import "./HomeUiResident.css";
import Notices from './NoticesResident'; 
import Posts from './PostsResident'; 
import Parking from './ParkingResident'; 
import { Calendar, Cog, AlertCircle, Bell, Pen, Phone, FileText, LogOut, ParkingSquare, LayoutDashboard, User, Search } from 'lucide-react';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from './ServiceResident/apiResident.js';

import RazorpayPayment from './PaymentPage.jsx'; // Adjust the path as needed

import logo from "./assets/Natural Care Logo.jpg";
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
`;

// Main component
function HomeUI() {
  const [activeSection, setActiveSection] = useState("dashboard-section");
  const [activeBlock, setActiveBlock] = useState('A','B');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [residents, setResidents] = useState([]);
  const [filteredResidents, setFilteredResidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingResidents, setIsLoadingResidents] = useState(false);
  const [residentError, setResidentError] = useState(null);

  

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
   const [serviceFormData, setServiceFormData] = useState({
    serviceType: 'Water Can',
    name: userData?.name || '',
    address: '',
    phoneNo: '',
    additionalNotes: ''
  });
  console.log("Current user data:", userData);
console.log("Current service requests:", serviceRequests);

  // Complaint states
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
const [complaintStats, setComplaintStats] = useState({
  total: 0,
  solved: 0,
  pending: 0,
  blockA: 0,
  blockB: 0
});

//billing : 
const [paymentHistory, setPaymentHistory] = useState([]);
  
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


  // Removed duplicate declaration of handleSearchChange

  //resident section : 

  // Fetch user data from localStorage
  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    const userEmail = localStorage.getItem("userEmail");
    const userRole = localStorage.getItem("userRole");

    if (storedUserData && userEmail && userRole) {
      setUserData({ ...storedUserData, email: userEmail, role: userRole });
    }
  }, []);

  // Filter residents when block or search term changes
  useEffect(() => {
    let results = residents;
    
    if (activeBlock) {
      results = results.filter(resident => 
        resident.residentDetails?.block === activeBlock
      );
    }
    
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



  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
    if (sectionId !== "dashboard-section") {
      setActiveBlock(null);
    }
  };



  //edit dashboard form :

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

//request service section :
const handleSearchChange = (e) => {
  setSearchTerm(e.target.value);
};

const handleServiceFormChange = (e) => {
  const { name, value } = e.target;
  setServiceFormData(prev => ({
    ...prev,
    [name]: value
  }));
};

  //request service section :

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoadingRequests(true);
      setRequestError(null);
      
      // Debug: Log current form data
      console.log('Submitting form data:', serviceFormData);
      
      // Validate required fields
      const requiredFields = ['serviceType', 'name', 'address', 'phoneNo'];
      const missingFields = requiredFields.filter(field => !serviceFormData[field]?.trim());
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
  
      // Validate phone number format
      if (!/^\d{10}$/.test(serviceFormData.phoneNo)) {
        throw new Error('Phone number must be 10 digits');
      }
  
      const response = await axios.post(
        'http://localhost:8080/service-requests/add-services', 
        serviceFormData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
  
      if ([200, 201].includes(response.status)) {
        // Refresh the requests list
        const { data } = await axios.get(
          'http://localhost:8080/service-requests/all-services',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        
        setServiceRequests(data);
        setServiceFormData({
          serviceType: 'Water Can',
          name: userData?.name || '',
          address: '',
          phoneNo: '',
          additionalNotes: ''
        });
        alert('Service request submitted successfully!');
      } else {
        throw new Error(response.data?.message || 'Unexpected response from server');
      }
    } catch (err) {
      console.error('Error submitting request:', err);
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Failed to submit request. Please check all fields.';
      setRequestError(errorMessage);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  // Add this near your other useEffect hooks
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
            },
            params: {
              residentId: userData?.id // Add this if your backend filters by resident
            }
          }
        );
        
        // Debug log to check what's being returned
        console.log("Service requests data:", response.data);
        
        setServiceRequests(response.data);
      } catch (err) {
        console.error("Full error:", err);
        setRequestError(err.response?.data?.message || 'Failed to load service requests');
      } finally {
        setIsLoadingRequests(false);
      }
    };
    
    fetchServiceRequests();
  }, [activeSection, userData?.id]); // Add userData.id as dependency

const fetchServiceRequests = async () => {
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

  //complaint section : 
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
    
    fetchComplaints(); // Actually call the function
  }, [activeSection]);

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
  }, [activeSection]);

  const handleComplaintFormChange = (e) => {
    const { name, value } = e.target;
    setComplaintFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
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
          status: 'Pending' // Default status
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
  
  // Helper function to count complaints
  const countComplaints = () => {
    const total = complaints.length;
    const solved = complaints.filter(c => c.status === 'Solved').length;
    const unsolved = total - solved;
    const blockA = complaints.filter(c => c.block === 'A').length;
    const blockB = complaints.filter(c => c.block === 'B').length;
    
    return { total, solved, unsolved, blockA, blockB };
  };
  
  const complaintCounts = countComplaints();

  const fetchComplaints = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/complaints');
      setComplaints(response.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      // Optional: Show error to user
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/complaints/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Optional: Show error to user
    }
  };

  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:8080/api/complaints/${complaintId}/status`,
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      // Refresh complaints list
      const { data } = await axios.get(
        'http://localhost:8080/api/complaints',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      setComplaints(data);
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };


  //payment :
  const [bills, setBills] = useState([
    {
      id: 1,
      type: 'Maintenance',
      amount: 2500,
      dueDate: '15th Apr 2023',
      paid: false
    },
    {
      id: 2,
      type: 'Water Bill',
      amount: 800,
      dueDate: '20th Apr 2023',
      paid: false
    },
    {
      id: 3,
      type: 'Electricity (Common)',
      amount: 350,
      dueDate: '25th Apr 2023',
      paid: false
    }
  ]);
  
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  
  // Add this payment handler function
  const handlePaymentSuccess = (response, billId) => {
    console.log('Payment successful:', response);
    setPaymentSuccess(true);
    
    // Update the bill status
    setBills(prevBills => 
      prevBills.map(bill => 
        bill.id === billId ? { ...bill, paid: true } : bill
      )
    );
    
    setSelectedBill(null);
    
    // Show success message for 3 seconds
    setTimeout(() => {
      setPaymentSuccess(false);
    }, 3000);
  };

  // Fetch bills for resident
const fetchBills = async (residentId) => {
  try {
    const response = await axios.get(`http://localhost:8080/api/bills/resident/${residentId}`);
    setBills(response.data);
  } catch (error) {
    console.error("Error fetching bills:", error);
  }
};

// Process payment
const handlePayment = async (billId, amount, paymentResponse) => {
  try {
    const paymentData = {
      billId,
      residentId: userData.id, // Assuming userData contains the resident ID
      amount,
      paymentMethod: "Razorpay",
      transactionId: paymentResponse.razorpay_payment_id
    };
    
    const response = await axios.post('http://localhost:8080/api/bills/pay', paymentData);
    console.log("Payment processed:", response.data);
    setPaymentSuccess(true);
    
    // Refresh bills
    fetchBills(userData.id);
  } catch (error) {
    console.error("Payment processing failed:", error);
  }
};

useEffect(() => {
  if (activeSection === "billings-section" && userData?.id) {
    const fetchBillingData = async () => {
      try {
        // Fetch bills
        const billsResponse = await axios.get(
          `http://localhost:8080/api/bills/resident/${userData.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        setBills(billsResponse.data);
        
        // Fetch payment history
        const paymentsResponse = await axios.get(
          `http://localhost:8080/api/payments/resident/${userData.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        setPaymentHistory(paymentsResponse.data);
      } catch (error) {
        console.error("Error fetching billing data:", error);
      }
    };
    
    fetchBillingData();
  }
}, [activeSection, userData]);

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
  <div className="dashboard-section">
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


            {/* Complaints Section */}
{activeSection === "complaints-section" && (
  <div>
    <div className="stats-grid">
    <div className="stat-card stat-card-blue">
    <div className="stat-number">{complaintStats.total}</div>
    <div>Total no of Complaints</div>
  </div>
  <div className="stat-card stat-card-purple">
    <div className="stat-number stat-number-purple">{complaintStats.solved}</div>
    <div>Total no of Complaints Solved</div>
  </div>
  <div className="stat-card stat-card-blue-dark">
    <div className="stat-number">{complaintStats.pending}</div>
    <div>Total no of Complaints Pending</div>
  </div>
  <div className="stat-card stat-card-orange">
    <div className="stat-number stat-number-orange">{complaintStats.blockB}</div>
    <div>Total no of Complaints in Block B</div>
  </div>
  <div className="stat-card stat-card-green">
    <div className="stat-number stat-number-green">{complaintStats.blockA}</div>
    <div>Total no of Complaints in Block A</div>
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
      <h2 className="section-title">My Complaints</h2>
      {isLoadingComplaints ? (
        <div className="loading-spinner">Loading complaints...</div>
      ) : complaintError ? (
        <div className="error-message">
          {complaintError}
          <button onClick={() => window.location.reload()} className="retry-btn">Retry</button>
        </div>
      ) : complaints.length > 0 ? (
        <div className="complaints-grid">
  {complaints
    .filter(complaint => complaint.email === (userData?.email || ''))
    .map((complaint) => (
      <div key={complaint.id} className="complaint-card">
        <h3>{complaint.title}</h3>
        <p><strong>Submitted by:</strong> {complaint.name}</p>
        <p><strong>Date:</strong> {new Date(complaint.createdAt).toLocaleString()}</p>
        {/* <p><strong>Block:</strong> {complaint.block}</p>
        <p><strong>Flat No:</strong> {complaint.flatNo}</p> */}
        <p><strong>Description:</strong> {complaint.description}</p>
        <p>
          <strong>Status:</strong> 
          <span className={`complaint-status ${complaint.status}`}>
            {complaint.status}
          </span>
          <br /><br /><hr /><br />
        </p>
        
        {/* Add the admin status dropdown here */}
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
    ))
  }
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
    <div className="card">
      <h2 className="section-title">Submit Service Request</h2>
      {requestError && (
        <div className="error-message" style={{ marginBottom: '1rem' }}>
          {requestError}
        </div>
      )}
      <form onSubmit={handleServiceSubmit} className="form-container">
        {/* Service Type Dropdown */}
        <div className="form-group">
          <label className="form-label" htmlFor="serviceType">
            Select Service Type *
          </label>
          <select 
            className="form-select" 
            id="serviceType"
            name="serviceType"
            value={serviceFormData.serviceType}
            onChange={handleServiceFormChange}
            required
          >
            <option value="Water Can">Water Can</option>
            <option value="House Keeping">House Keeping</option>
            <option value="Gas">Gas</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Garbage Collection">Garbage Collection</option>
          </select>
        </div>

        {/* Name Field */}
        <div className="form-group">
          <label className="form-label" htmlFor="name">
            Your Name *
          </label>
          <input
            className="form-input"
            id="name"
            name="name"
            placeholder="Enter your name"
            type="text"
            value={serviceFormData.name}
            onChange={handleServiceFormChange}
            required
          />
        </div>

        {/* Address Field */}
        <div className="form-group">
          <label className="form-label" htmlFor="address">
            Address *
          </label>
          <input
            className="form-input"
            id="address"
            name="address"
            placeholder="Enter your Address here"
            type="text"
            value={serviceFormData.address}
            onChange={handleServiceFormChange}
            required
          />
        </div>

        {/* Phone Number Field */}
        <div className="form-group">
          <label className="form-label" htmlFor="phoneNo">
            Phone Number *
          </label>
          <input
            className="form-input"
            id="phoneNo"
            name="phoneNo"
            placeholder="Enter your phone number"
            type="tel"
            value={serviceFormData.phoneNo}
            onChange={handleServiceFormChange}
            required
            pattern="[0-9]{10}"
            title="Please enter a 10-digit phone number"
          />
        </div>

        {/* Additional Notes */}
        <div className="form-group">
          <label className="form-label" htmlFor="additionalNotes">
            Additional Notes
          </label>
          <textarea
            className="form-textarea"
            id="additionalNotes"
            name="additionalNotes"
            placeholder="Any specific details"
            value={serviceFormData.additionalNotes}
            onChange={handleServiceFormChange}
          ></textarea>
        </div>

        <button
          className="btn btn-primary"
          type="submit"
          disabled={isLoadingRequests}
        >
          {isLoadingRequests ? 'Submitting...' : 'Send Request'}
        </button>
      </form>
    </div>
    
    <div className="card" style={{ marginTop: '1.5rem' }}>
      <div className="section-header">
        <h2 className="section-title">My Service Requests</h2>
        <button 
          onClick={fetchServiceRequests} 
          className="btn-refresh"
          disabled={isLoadingRequests}
        >
          {isLoadingRequests ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {isLoadingRequests ? (
        <div className="loading-spinner">Loading requests...</div>
      ) : requestError ? (
        <div className="error-message">
          {requestError}
          <button onClick={fetchServiceRequests} className="retry-btn">
            Retry
          </button>
        </div>
      ) : serviceRequests.filter(r => r.name === userData?.name).length === 0 ? (
        <div className="no-requests">
          <p>No service requests found.</p>
          <p>Submit a request using the form above.</p>
        </div>
      ) : (
        <div className="requests-grid">
  {serviceRequests
    .filter(request => 
      request.name === userData?.name || 
      request.email === userData?.email ||
      request.residentId === userData?.id
    )
    .map((request) => (
      <div key={request._id || request.id} className="request-card">
        <h3>{request.serviceType || 'Service Request'}</h3>
        <p><strong>Status:</strong>
          <span className={`request-status ${request.status?.replace(/\s+/g, '') || 'Pending'}`}>
            {request.status || 'Pending'}
          </span>
        </p>
        <p><strong>Submitted:</strong> {new Date(request.createdAt).toLocaleString()}</p>
        
        {request.address && <p><strong>Address:</strong> {request.address}</p>}
        {request.phoneNo && <p><strong>Phone:</strong> {request.phoneNo}</p>}
        {request.additionalNotes && <p><strong>Notes:</strong> {request.additionalNotes}</p>}
        
        {/* Admin response section */}
        {request.status === 'Approved' && request.adminNotes && (
          <div className="admin-response">
            <p><strong>Admin Response:</strong> {request.adminNotes}</p>
            {request.approvalDate && (
              <p><small>Approved on: {new Date(request.approvalDate).toLocaleString()}</small></p>
            )}
          </div>
        )}
        
        {request.status === 'Rejected' && request.rejectionReason && (
          <div className="admin-response rejected">
            <p><strong>Reason for Rejection:</strong> {request.rejectionReason}</p>
          </div>
        )}
      </div>
    ))
  }
</div>
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
                    
                    height="auto"
                  />
                </div>

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
      
      {paymentSuccess && (
        <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
          Payment successful! Thank you for your payment.
        </div>
      )}
      
      <div style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ fontWeight: "700", marginBottom: "0.5rem" }}>Current Month</h3>
        <div className="billing-grid">
        {bills.map((bill) => (
  <div key={bill.id} className={`bill-card ${bill.paid ? 'bill-card-paid' : ''}`}>
    <h4>{bill.type}</h4>
    <p className="bill-amount">₹{bill.amount.toLocaleString()}</p>
    <p className="bill-due">Due: {new Date(bill.dueDate).toLocaleDateString()}</p>
    {bill.paid ? (
      <div className="paid-badge">Paid</div>
    ) : (
      <RazorpayPayment
  amount={bill.amount}
  description={`Payment for ${bill.type}`}
  billId={bill.id}
  residentId={userData.id}
  onSuccess={(response, billId) => {
    // Handle successful payment
    setBills(prev => prev.map(b => 
      b.id === billId ? {...b, paid: true} : b
    ));
  }}
  onClose={() => console.log('Payment closed')}
/>
    )}
  </div>
))}
        </div>
      </div>
      
      <div className="payment-history" style={{ marginTop: '2rem' }}>
  <h3 style={{ fontWeight: "700", marginBottom: "0.5rem" }}>Payment History</h3>
  {paymentHistory.length > 0 ? (
    <table className="payment-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Amount</th>
          <th>Bill Type</th>
          <th>Transaction ID</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {paymentHistory.map(payment => (
          <tr key={payment.id}>
            <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
            <td>₹{payment.amount}</td>
            <td>
              {bills.find(bill => bill.id === payment.billId)?.type || 'N/A'}
            </td>
            <td>{payment.transactionId}</td>
            <td>
              <span className={`payment-status ${payment.status.toLowerCase()}`}>
                {payment.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>No payment history available</p>
  )}
</div>
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