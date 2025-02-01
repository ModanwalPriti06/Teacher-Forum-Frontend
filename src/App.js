import React from "react";
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
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const ProtectedRoute = ({ children }) => {
  const { auth } = useAuth();
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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
