import { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../config/config';
import { loginPoliceStation, registerPoliceStation, updateFCMToken } from '../services/apiService';
import { requestNotificationPermission } from '../services/firebaseService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const stationData = localStorage.getItem(STORAGE_KEYS.STATION_DATA);
    
    if (token && stationData) {
      try {
        setStation(JSON.parse(stationData));
      } catch (error) {
        console.error('Error parsing station data:', error);
        logout();
      }
    }
    
    setLoading(false);
  }, []);

  // Register new police station
  const register = async (formData) => {
    try {
      setLoading(true);
      const response = await registerPoliceStation(formData);
      
      if (response.success) {
        toast.success('Registration successful! Please login.');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Login police station
  const login = async (phone) => {
    try {
      setLoading(true);
      const response = await loginPoliceStation(phone);
      
      if (response.success && response.data) {
        const { station: stationData, token } = response.data;
        
        // Save to localStorage
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.STATION_DATA, JSON.stringify(stationData));
        
        // Set state
        setStation(stationData);
        
        // Request notification permission and update FCM token
        const fcmToken = await requestNotificationPermission();
        if (fcmToken) {
          localStorage.setItem(STORAGE_KEYS.FCM_TOKEN, fcmToken);
          await updateFCMToken(stationData._id, fcmToken);
        }
        
        toast.success(`Welcome, ${stationData.stationName}!`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.STATION_DATA);
    localStorage.removeItem(STORAGE_KEYS.FCM_TOKEN);
    setStation(null);
    toast.success('Logged out successfully');
  };

  const value = {
    station,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!station,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};