import { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      const savedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (token) {
        try {
          const res = await api.get('/api/users/me');
          if (res && res.data) {
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
            return;
          }
        } catch (err) {
          // fallback to stored user if fetch fails
          if (savedUser) setUser(JSON.parse(savedUser));
          return;
        }
      }

      if (savedUser) setUser(JSON.parse(savedUser));
    };

    init();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};