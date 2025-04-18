import React, { useEffect, useState } from "react";
import './App.css'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import { useAuth, AuthProvider } from './context/AuthContext';
import Homepage from "./pages/Homepage";
import ProfilePage from "./pages/ProfilePage";
import ClassesDetails from "./pages/ClassesDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import {ToastContainer, toast}  from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';


const ProtectedRoute = ({ children }) => {
  const { auth, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{
    const checkLoginStatus = async ()=>{
      setLoading(true);  // ✅ Add this to prevent premature rendering
      try{
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/checklogin`, {
          method: 'GET',
          credentials: 'include', // Include cookies for the auth token
        });
        const data = await response.json();
        if (response.ok && data.ok) {
          login({ userId: data.userId }); // Set user in context
          setLoading(false); // User is logged in, loading is done
        } else {
          toast.error(data.message || 'Session expired. Please log in again.');
          navigate('/login');
        }
      }
      catch (error) {
        toast.error('Error checking login status.');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    }
    checkLoginStatus();

  },[]);

  if (loading) {
    return <div>Loading...
      <CircularProgress />
    </div>; // You can add a spinner or loading indicator here
  }
  return auth.user ? children : <Navigate to="login" />; // Check user login or not if login then show data orelse navigate login page
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Homepage />
              </ProtectedRoute>
            }
          ></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
           <Route
            path="/classes/:classid"
            element={
              <ProtectedRoute>
                <ClassesDetails />
              </ProtectedRoute>
            }
          />
        </Routes>
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
}

export default App;
