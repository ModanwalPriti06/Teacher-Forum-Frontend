import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import './Login.css'

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {login} = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e)=>{
    e.preventDefault();
    // handle backend logic here
    const userData = {email, role: 'student'};
    login(userData);
    navigate('/');
  }

  return (
    <div className='login-page'>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
      <input
          type="email"
          id="email"
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          <button type="submit" onClick={handleSubmit}>Login</button>
      </form>
      <div className='signup-link'>
        <p>Don't have an account? <Link to='/signup'>Sign up</Link></p>
      </div>
    </div>
  )
}

export default Login