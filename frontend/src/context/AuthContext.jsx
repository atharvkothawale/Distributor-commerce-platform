import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('shopnova_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('shopnova_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.get('/auth/me')
        .then((res) => {
          if (res.data.success) {
            setUser(res.data.data);
            localStorage.setItem('shopnova_user', JSON.stringify(res.data.data));
          }
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const data = res.data.data;
      setToken(data.token);
      const userObj = {
        id: data.userId,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
      };
      setUser(userObj);
      localStorage.setItem('shopnova_token', data.token);
      localStorage.setItem('shopnova_user', JSON.stringify(userObj));
      return { success: true, user: userObj };
    }
    return { success: false, message: res.data.message };
  };

  const register = async (fullName, email, password, role = 'ROLE_CUSTOMER') => {
    const res = await api.post('/auth/register', { fullName, email, password, role });
    if (res.data.success) {
      const data = res.data.data;
      setToken(data.token);
      const userObj = {
        id: data.userId,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
      };
      setUser(userObj);
      localStorage.setItem('shopnova_token', data.token);
      localStorage.setItem('shopnova_user', JSON.stringify(userObj));
      return { success: true, user: userObj };
    }
    return { success: false, message: res.data.message };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('shopnova_token');
    localStorage.removeItem('shopnova_user');
  };

  const isAdmin = user?.role === 'ROLE_ADMIN';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
