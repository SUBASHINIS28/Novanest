import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Check if theme exists in localStorage, otherwise default to light
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  // Update document's class and localStorage when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove previous theme class and add new one
    root.classList.remove('light-mode', 'dark-mode');
    root.classList.add(`${theme}-mode`);
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Function to toggle theme
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};