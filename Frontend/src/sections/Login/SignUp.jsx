import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignUp.css';
import buildingImage from './assets/building pic for sign up page.jpg';
import CommunityLogo from './assets/Logo.jpg';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Resident');
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();

        const user = { email, password, role };
        console.log("Sending data to backend:", user);

        try {
            const response = await fetch('http://localhost:8080/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user),
            });

            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem("userEmail", email);
                if (role === 'Resident') {
                    navigate('/resident-details');
                } else {
                    navigate('/admin-details');
                }
            } else {
                console.error("Signup failed:", data.message);
                alert(`Signup failed: ${data.message}`);
            }
        } catch (error) {
            console.error("Error connecting to backend:", error);
            alert("An error occurred. Please try again.");
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
                            required
                        />
                        <br /><br />

                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <br /><br />

                        <label>Role</label>
                        <select 
                            value={role} 
                            onChange={(e) => setRole(e.target.value)}
                            className="role-select"
                        >
                            <option value="Admin">Admin</option>
                            <option value="Resident">Resident</option>
                        </select>
                        <br /><br />

                        <button type="submit" className="button" id="button">
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