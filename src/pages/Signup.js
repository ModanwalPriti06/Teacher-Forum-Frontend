import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import './Signup.css'
import { toast } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress';

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false); // For loading state

  const navigate = useNavigate();
  const { login } = useAuth();

  //handle signup submit button
  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!name || !email || !password || !otp) {
      toast.error('All fields are required');
      return;
    }
    try {
      setLoading(true); // Show loading state
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, otp, role }), // Send all form data
        credentials: 'include', // Include cookies for CORS
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Registration successful');
        // Log in the user after successful registration
        login({ email, role });
        navigate('/');
        setName('');
        setEmail('');
        setPassword('');
        setOtp('');
        setRole('');
      } else {
        toast.error(data.message || 'Registration failed');
      }
    }
    catch (error) {
      toast.error('Error during registration');
    } finally {
      setLoading(false); // Reset loading state
    }
 }

  // handle send otp function
  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/sendotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }), // Only send email
        credentials: "include",
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("OTP sent successfully!");
      } else {
        toast.error(data.message || "Failed to send OTP.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='signup-page'>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="name"
          value={name}
          placeholder='name'
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div className='email-otp-container'>
          <input
            type="email"
            id="email"
            value={email}
            placeholder='Email'
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type='button' onClick={handleSendOtp} className='send-otp-btn' disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Send OTP'}
          </button>
        </div>
        <input
          type="text"
          id="otp"
          placeholder='Enter OTP'
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <input
          type="password"
          id="password"
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option>Select</option>
          <option value='teacher'>Teacher</option>
          <option value='student'>Student</option>
        </select>

        <button type="submit">Signup</button>

      </form>
      <div className='login-link'>
        <p>Already have an account? <Link to='/login'>Login Here</Link></p>
      </div>
    </div>
  )
}

export default Signup