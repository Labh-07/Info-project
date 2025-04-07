import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './FormStyle.css';
import buildingImage from './assets/building pic for sign up page.jpg';
import CommunityLogo from './assets/Logo.jpg';

const AdminDetails = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [details, setDetails] = useState({
        name: '', phone: '', societyId: '', societyName: '', 
        societyAddress: '', city: '', district: '', postal: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const storedEmail = localStorage.getItem("userEmail");
        if (storedEmail) {
            setEmail(storedEmail);
        } else {
            console.error("Email not found in localStorage.");
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetails({ ...details, [name]: value });
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const phoneRegex = /^[0-9]{10}$/; // Simple 10-digit phone number validation
        const postalRegex = /^[0-9]{6}$/; // 6-digit postal code validation

        // Name validation
        if (!details.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (details.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        // Phone validation
        if (!details.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!phoneRegex.test(details.phone)) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }

        // Society ID validation
        if (!details.societyId.trim()) {
            newErrors.societyId = 'Society ID is required';
        }

        // Society Name validation
        if (!details.societyName.trim()) {
            newErrors.societyName = 'Society name is required';
        }

        // Society Address validation
        if (!details.societyAddress.trim()) {
            newErrors.societyAddress = 'Society address is required';
        }

        // City validation
        if (!details.city.trim()) {
            newErrors.city = 'City is required';
        }

        // District validation
        if (!details.district.trim()) {
            newErrors.district = 'District is required';
        }

        // Postal Code validation
        if (!details.postal) {
            newErrors.postal = 'Postal code is required';
        } else if (!postalRegex.test(details.postal)) {
            newErrors.postal = 'Please enter a valid 6-digit postal code';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        if (!email) {
            console.error("Email not found in state.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/user/admin-details?email=${email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(details),
            });

            if (response.ok) {
                console.log("Admin details saved successfully");
                navigate('/success');
            } else {
                console.error("Error saving admin details");
                const errorData = await response.json();
                alert(`Error: ${errorData.message || 'Failed to save details'}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className="login-page-container">
            <div className="login_section">
                <div className="login_img">
                    <img src={buildingImage} alt="building" />
                </div>
                <div className="login_form">
                    <img src={CommunityLogo} id="logo" alt="community logo" />
                    <h3>Admin Details</h3>
                    <p className="email-display">Email: {email ? email : "Loading..."}</p>

                    <form onSubmit={handleRegister}>
                        <label>Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={details.name} 
                            onChange={handleChange} 
                            className={errors.name ? 'error' : ''}
                        />
                        {errors.name && <span className="error-message">{errors.name}</span>}
                        
                        <label>Phone Number</label>
                        <input 
                            type="tel" 
                            name="phone" 
                            value={details.phone} 
                            onChange={handleChange} 
                            className={errors.phone ? 'error' : ''}
                            maxLength="10"
                        />
                        {errors.phone && <span className="error-message">{errors.phone}</span>}
                        
                        <label>Society ID</label>
                        <input 
                            type="text" 
                            name="societyId" 
                            value={details.societyId} 
                            onChange={handleChange} 
                            className={errors.societyId ? 'error' : ''}
                        />
                        {errors.societyId && <span className="error-message">{errors.societyId}</span>}
                        
                        <label>Society Name</label>
                        <input 
                            type="text" 
                            name="societyName" 
                            value={details.societyName} 
                            onChange={handleChange} 
                            className={errors.societyName ? 'error' : ''}
                        />
                        {errors.societyName && <span className="error-message">{errors.societyName}</span>}
                        
                        <label>Society Address</label>
                        <input 
                            type="text" 
                            name="societyAddress" 
                            value={details.societyAddress} 
                            onChange={handleChange} 
                            className={errors.societyAddress ? 'error' : ''}
                        />
                        {errors.societyAddress && <span className="error-message">{errors.societyAddress}</span>}
                        
                        <label>City</label>
                        <input 
                            type="text" 
                            name="city" 
                            value={details.city} 
                            onChange={handleChange} 
                            className={errors.city ? 'error' : ''}
                        />
                        {errors.city && <span className="error-message">{errors.city}</span>}
                        
                        <label>District</label>
                        <input 
                            type="text" 
                            name="district" 
                            value={details.district} 
                            onChange={handleChange} 
                            className={errors.district ? 'error' : ''}
                        />
                        {errors.district && <span className="error-message">{errors.district}</span>}
                        
                        <label>Postal Code</label>
                        <input 
                            type="text" 
                            name="postal" 
                            value={details.postal} 
                            onChange={handleChange} 
                            className={errors.postal ? 'error' : ''}
                            maxLength="6"
                        />
                        {errors.postal && <span className="error-message">{errors.postal}</span>}

                        <button type="submit" className="button">Register</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminDetails;