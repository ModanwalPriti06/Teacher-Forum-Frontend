import React,{useState} from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import './Signup.css'


function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [role, setRole] = useState("student");

  const navigate = useNavigate();
  const {login}= useAuth();

  const handleSubmit = (e)=>{
    e.preventDefault();
    // handle backend logic api here
    const userData = {email, role};
    login(userData);
    navigate('/');
  }

  const handleSendOtp = ()=>{

  }

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
          <button type='button' onClick={handleSendOtp} className='send-otp-btn'>Send Otp</button>
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
        <select value={role} onChange={(e)=>setRole(e.target.value)}>
            <option value='teacher'>Teacher</option>
            <option value='student'>Student</option>
        </select>

         <button type="submit" onClick={handleSubmit}>Signup</button>

      </form>
      <div className='login-link'>
        <p>Already have an account? <Link to='/login'>Login Here</Link></p>
      </div>
    </div>
  )
}

export default Signup