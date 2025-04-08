import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Style/FormStyle.css'; 
import buildingImage from './assets/building pic for sign up page.jpg';
import CommunityLogo from './assets/Logo.jpg';

const ResidentDetails = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [details, setDetails] = useState({
        name: '', phone: '', societyId: '', societyName: '', flatNo: '', block: '', postal: '',
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
        const phoneRegex = /^[0-9]{10}$/;
        const postalRegex = /^[0-9]{6}$/;
        const flatNoRegex = /^[A-Za-z0-9\-]+$/;

        if (!details.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (details.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!details.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!phoneRegex.test(details.phone)) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }

        if (!details.societyId.trim()) {
            newErrors.societyId = 'Society ID is required';
        }

        if (!details.societyName.trim()) {
            newErrors.societyName = 'Society name is required';
        }

        if (!details.block.trim()) {
            newErrors.block = 'Block is required';
        }

        if (!details.flatNo.trim()) {
            newErrors.flatNo = 'Flat number is required';
        } else if (!flatNoRegex.test(details.flatNo)) {
            newErrors.flatNo = 'Flat number can only contain letters, numbers, and hyphens';
        }

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
            const firstError = Object.keys(errors)[0];
            if (firstError) {
                document.querySelector(`[name="${firstError}"]`).scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
            return;
        }

        if (!email) {
            console.error("Email not found in state.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/user/resident-details?email=${email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(details),
            });

            if (response.ok) {
                console.log("Resident details saved successfully");
                navigate('/success');
            } else {
                console.error("Error saving resident details");
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
                    <h3>Resident Details</h3>
                    <p className="email-display">Email: {email ? email : "Loading..."}</p>

                    <div className="scrollable-form-container">
                        <form onSubmit={handleRegister} className="compact-form">
                            <div className="form-row">
                                <label>Name</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={details.name} 
                                    onChange={handleChange} 
                                    className={errors.name ? 'error' : ''}
                                />
                                {errors.name && <div className="error-text">{errors.name}</div>}
                            </div>
                            
                            <div className="form-row">
                                <label>Phone Number</label>
                                <input 
                                    type="tel" 
                                    name="phone" 
                                    value={details.phone} 
                                    onChange={handleChange} 
                                    className={errors.phone ? 'error' : ''}
                                    maxLength="10"
                                />
                                {errors.phone && <div className="error-text">{errors.phone}</div>}
                            </div>
                            
                            <div className="form-row">
                                <label>Society ID</label>
                                <input 
                                    type="text" 
                                    name="societyId" 
                                    value={details.societyId} 
                                    onChange={handleChange} 
                                    className={errors.societyId ? 'error' : ''}
                                />
                                {errors.societyId && <div className="error-text">{errors.societyId}</div>}
                            </div>
                            
                            <div className="form-row">
                                <label>Society Name</label>
                                <input 
                                    type="text" 
                                    name="societyName" 
                                    value={details.societyName} 
                                    onChange={handleChange} 
                                    className={errors.societyName ? 'error' : ''}
                                />
                                {errors.societyName && <div className="error-text">{errors.societyName}</div>}
                            </div>
                            
                            <div className="form-row">
                                <label>Block</label>
                                <input 
                                    type="text" 
                                    name="block" 
                                    value={details.block} 
                                    onChange={handleChange} 
                                    className={errors.block ? 'error' : ''}
                                />
                                {errors.block && <div className="error-text">{errors.block}</div>}
                            </div>
                            
                            <div className="form-row">
                                <label>Flat No.</label>
                                <input 
                                    type="text" 
                                    name="flatNo" 
                                    value={details.flatNo} 
                                    onChange={handleChange} 
                                    className={errors.flatNo ? 'error' : ''}
                                />
                                {errors.flatNo && <div className="error-text">{errors.flatNo}</div>}
                            </div>
                            
                            <div className="form-row">
                                <label>Postal Code</label>
                                <input 
                                    type="text" 
                                    name="postal" 
                                    value={details.postal} 
                                    onChange={handleChange} 
                                    className={errors.postal ? 'error' : ''}
                                    maxLength="6"
                                />
                                {errors.postal && <div className="error-text">{errors.postal}</div>}
                            </div>

                            <button type="submit" className="button">Register</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResidentDetails;