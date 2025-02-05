import React, { useState, useEffect, useContext, createContext } from "react";
// Create the AuthContext
const AuthContext = createContext();
// Custome hook to use AuthContext\
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null, loading: true });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setAuth({ user, loading: false });
    } else {
      setAuth({ user: null, loading: false });
    }
  }, []);

  //   Global function and login page
  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData)); // Save user data to localStorage
    setAuth({ user: userData, loading: false }); // Update the auth state
  };

  const logout = () => {
    localStorage.removeItem("user"); // Removes the user data from localStorage
    setAuth({ user: null, loading: false }); // Updates the state to indicate the user is logged out
  };
  

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {!auth.loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
