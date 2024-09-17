import React, { createContext, useState, useContext, useEffect } from 'react';
import { getProfileData } from '../redux/slice/volumeSlice'; // Import the membership action
import { refreshToken, logoutAction } from '../redux/slice/authSlice'; // Import the membership action
import { useDispatch } from 'react-redux';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userProfile, setUserProfile] = useState(null); 
    const dispatch = useDispatch();
  
    useEffect(() => {
      const refreshTokens = async () => {
        try {
          const storedRefreshToken = localStorage.getItem('REFRESH_TOKEN');
          if (storedRefreshToken) {
            const response = await dispatch(refreshToken(storedRefreshToken));
            const { access } = response.payload;
            localStorage.setItem('ACCESS_TOKEN', access);
            // Fetch user profile data using getProfileData thunk
            const profileResponse = await dispatch(getProfileData()).unwrap();
            setUserProfile(profileResponse); // Set user profile data in state
          
            setIsLoggedIn(true);
          }
        } catch (error) {
          console.error('Error refreshing token:', error);
          setIsLoggedIn(false);
          dispatch(logoutAction()); // Dispatch logout action on token refresh failure
        }
      };
  
      const minute = 25; // Example interval for token refresh
      refreshTokens(); // Call refreshTokens on mount
      const interval = setInterval(refreshTokens, minute * 1000 * 60); // Set interval for token refresh
  
      const accessToken = localStorage.getItem('ACCESS_TOKEN');
      if (accessToken) {
        setIsLoggedIn(true);
      }
  
      return () => clearInterval(interval); // Clean up the interval on component unmount
    }, [dispatch]);
  
    const login = () => {
      // Implement your login logic here
    };
  
    const logout = async () => {
      try {
        const storedRefreshToken = localStorage.getItem('REFRESH_TOKEN');
        if (storedRefreshToken) {
          await dispatch(logoutAction(storedRefreshToken)); // Dispatch logout action with refresh token
        }
      } catch (error) {
        console.error('Error revoking token:', error);
      }
  
      localStorage.clear();
      setIsLoggedIn(false);
      window.location.href = '/login'; // Redirect to login page after logout
    };
  
    return (
      <AuthContext.Provider value={{ isLoggedIn, login, logout , userProfile }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = () => useContext(AuthContext);