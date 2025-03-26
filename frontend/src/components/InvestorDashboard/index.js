import React, { useState, useEffect, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserContext } from '../../UserContext';
import axios from 'axios';

// Components
import Sidebar from './Sidebar';
import Overview from './Overview';
import Startups from './Startups';
import Portfolio from './Portfolio';
import Profile from './Profile';
import InvestmentModal from './modals/InvestmentModal';

const InvestorDashboard = () => {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  
  const [startups, setStartups] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [activeStartup, setActiveStartup] = useState(null);
  
  const [notifications, setNotifications] = useState([]);

  // Page transition animations
  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  // Show notification toast
  const showNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification.id !== id)
      );
    }, 5000);
  }, []);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    if (!user?._id) return;
    
    setIsDataLoading(true);
    let hasLoadedAnyData = false;
    
    try {
      // Fetch startups for investment
      try {
        const startupsResponse = await axios.get(
          'http://localhost:5000/api/startups',
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        
        if (startupsResponse.data && Array.isArray(startupsResponse.data) && startupsResponse.data.length > 0) {
          setStartups(startupsResponse.data);
          hasLoadedAnyData = true;
        }
      } catch (error) {
        console.error('Error fetching startups:', error);
      }
      
      // Fetch investor portfolio
      try {
        const portfolioResponse = await axios.get(
          'http://localhost:5000/api/investments/investor',
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        
        if (portfolioResponse.data && Array.isArray(portfolioResponse.data) && portfolioResponse.data.length > 0) {
          setPortfolio(portfolioResponse.data);
          hasLoadedAnyData = true;
        }
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      }
      
      // Fetch metrics data
      try {
        const metricsResponse = await axios.get(
          'http://localhost:5000/api/investors/metrics',
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setMetrics(metricsResponse.data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
      
      if (hasLoadedAnyData) {
        console.log('Dashboard loaded with partial data');
      } else {
        console.log('No data detected, showing error notification');
        showNotification('Failed to load dashboard data', 'error');
      }
    } catch (error) {
      console.error('Unexpected error fetching dashboard data:', error);
      showNotification('Failed to load dashboard data', 'error');
    } finally {
      setIsDataLoading(false);
    }
  }, [user, showNotification]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    fetchDashboardData();
    
    const intervalId = setInterval(fetchDashboardData, 120000);
    return () => clearInterval(intervalId);
  }, [fetchDashboardData, theme]);
  
  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  // Handle investment process
  const handleInvestment = (startup) => {
    setActiveStartup(startup);
    setShowInvestmentModal(true);
  };
  
  // Submit investment 
  const handleInvestmentSubmit = async (investmentData) => {
    try {
      await axios.post(
        `http://localhost:5000/api/investments`,
        {
          startupId: activeStartup._id,
          ...investmentData
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      showNotification('Investment submitted successfully', 'success');
      setShowInvestmentModal(false);
      setActiveStartup(null);
      fetchDashboardData();
    } catch (error) {
      console.error('Error submitting investment:', error);
      showNotification(
        error.response?.data?.message || 'Failed to submit investment',
        'error'
      );
    }
  };

  // Handle expressing interest
  const handleExpressInterest = async (startupId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/startups/${startupId}/interest`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      showNotification('Interest expressed successfully', 'success');
    } catch (error) {
      console.error('Error expressing interest:', error);
      showNotification('Failed to express interest', 'error');
    }
  };

  return (
    <div className={`flex h-screen bg-slate-50 dark:bg-gray-900 ${theme === 'dark' ? 'dark' : ''}`}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700 shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
              {activeTab === 'overview' && 'Investor Dashboard'}
              {activeTab === 'startups' && 'Discover Startups'}
              {activeTab === 'portfolio' && 'My Investments'}
              {activeTab === 'profile' && 'Investor Profile'}
            </h1>
            
            <div className="flex items-center">
              <button 
                onClick={toggleTheme}
                className="ml-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                {theme === 'dark' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 p-6">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {activeTab === 'overview' && (
                  <Overview 
                    metrics={metrics}
                    portfolio={portfolio}
                    startups={startups}
                    setActiveTab={setActiveTab}
                    isLoading={isDataLoading}
                    handleExpressInterest={handleExpressInterest}
                    handleInvestment={handleInvestment}
                  />
                )}
                
                {activeTab === 'startups' && (
                  <Startups 
                    startups={startups}
                    handleExpressInterest={handleExpressInterest}
                    handleInvestment={handleInvestment}
                    isLoading={isDataLoading}
                  />
                )}
                
                {activeTab === 'portfolio' && (
                  <Portfolio
                    portfolio={portfolio}
                    isLoading={isDataLoading}
                  />
                )}
                
                {activeTab === 'profile' && (
                  <Profile 
                    showNotification={showNotification}
                    isLoading={isDataLoading}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
      
      {/* Notifications */}
      <div className="fixed top-5 right-5 z-50 flex flex-col space-y-2">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`rounded-lg shadow-lg p-4 text-white ${
                notification.type === 'success' ? 'bg-green-500' : 
                notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
              }`}
            >
              <div className="flex items-center">
                {notification.type === 'success' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                <p>{notification.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Modals */}
      <AnimatePresence>
        {showInvestmentModal && activeStartup && (
          <InvestmentModal
            startup={activeStartup}
            onClose={() => {
              setShowInvestmentModal(false);
              setActiveStartup(null);
            }}
            onSubmit={handleInvestmentSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default InvestorDashboard;