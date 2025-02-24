import React, { createContext, useState, useEffect } from 'react';
import { getUserProfile } from './api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const data = await getUserProfile(token);
          setUser(data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};