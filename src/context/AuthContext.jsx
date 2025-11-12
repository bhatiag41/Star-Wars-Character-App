import { createContext, useState, useEffect } from 'react';
import { login as authLogin, logout as authLogout, isAuthenticated, refreshToken } from '../services/auth';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = () => {
      if (isAuthenticated()) {
        const tokenData = localStorage.getItem('sw_token');
        if (tokenData) {
          try {
            const data = JSON.parse(tokenData);
            setUser({ username: data.username });
          } catch (error) {
            authLogout();
          }
        }
      }
      setLoading(false);
    };

    checkAuth();

    // Set up token refresh timer (refresh every hour)
    const refreshInterval = setInterval(() => {
      if (isAuthenticated()) {
        refreshToken();
      }
    }, 60 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, []);

  const login = async (username, password) => {
    try {
      const result = await authLogin(username, password);
      const tokenData = localStorage.getItem('sw_token');
      if (tokenData) {
        const data = JSON.parse(tokenData);
        setUser({ username: data.username });
      }
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

