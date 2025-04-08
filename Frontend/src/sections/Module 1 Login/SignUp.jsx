import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Style/SignUp.css';
import buildingImage from './assets/building pic for sign up page.jpg';
import CommunityLogo from './assets/Logo.jpg';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Resident');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Validate email format
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    // Validate password strength
    const validatePassword = (password) => {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return re.test(password);
    };

    // Validate entire form
    const validateForm = () => {
        const newErrors = {};

        // Email validation
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!validatePassword(password)) {
            newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignUp = async (e) => {
        e.preventDefault(); 

        // Validate form before submission
        if (!validateForm()) {
            return;
        }

        const user = { email, password, role };
        console.log("Sending data to backend:", user);

        try {
            const response = await fetch('http://localhost:8080/auth/signup', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(user),
            });

            console.log("Raw response:", response);

            // First check if response is ok
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Signup failed:", errorData.message || response.statusText);
                alert(`Signup failed: ${errorData.message || response.statusText}`);
                return;
            }

            const data = await response.json();
            console.log("Response data:", data);

            if (response.ok) {
                console.log("Signup successful! Redirecting...");
                localStorage.setItem("userEmail", email); // Store email in localStorage

                if (role === 'Resident') {
                    navigate('/resident-details');
                } else {
                    navigate('/admin-details');
                }
            }
        } catch (error) {
            console.error("Error connecting to backend:", error);
            alert("An error occurred. Please check console for details.");
        }
    };

    return (
        <div className="signup-page-container">
            <div className="signup_section">
                <div className="signup_img">
                    <img src={buildingImage} alt="building" />
                </div>
                <div className="signup_form">
                    <img src={CommunityLogo} id="logo" alt="community logo" />
                    <h3>Sign Up</h3>

                    <form onSubmit={handleSignUp}>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={errors.email ? 'error' : ''}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                        <br /><br />

                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={errors.password ? 'error' : ''}
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                        <br /><br />

                        <label>Role</label>
                        <select 
                            value={role} 
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="Admin">Admin</option>
                            <option value="Resident">Resident</option>
                        </select>
                        <br /><br />

                        <button type="submit" className="button">
                            Sign Up
                        </button>
                    </form>
                    <p className="signup_prompt">
                        Already have an account? <Link to="/login">Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;