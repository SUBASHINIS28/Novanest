import React, { useState, useEffect, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserContext } from '../../UserContext';
import axios from 'axios';

// Components
import Sidebar from './Sidebar';
import Overview from './Overview';
import Startups from './Startups';
import FindMentors from './FindMentors';
import Mentorships from './Mentorships';
import Profile from './Profile';
import StartupFormModal from './modals/StartupFormModal';
import ExpertiseFormModal from './modals/ExpertiseFormModal';
import MeetingModal from './modals/MeetingModal';

const EntrepreneurDashboard = () => {
  const { user, refreshUserData } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  
  const [startups, setStartups] = useState([]);
  const [recommendedMentors, setRecommendedMentors] = useState([]);
  const [activeMentorships, setActiveMentorships] = useState([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [metrics, setMetrics] = useState({});
  
  const [showStartupModal, setShowStartupModal] = useState(false);
  const [editingStartup, setEditingStartup] = useState(null);
  const [showExpertiseModal, setShowExpertiseModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [activeMeeting, setActiveMeeting] = useState(null);
  
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  
  // Page transition animations
  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };
  
  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Show notification toast
  const showNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Auto remove after 5 seconds
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
      // Fetch startups
      try {
        const startupsResponse = await axios.get(
          `http://localhost:5000/api/startups/entrepreneur/${user._id}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        
        // Add debugging
        console.log('Startups response:', startupsResponse.data);
        
        // More robust data validation
        if (startupsResponse.data && (
            (Array.isArray(startupsResponse.data) && startupsResponse.data.length > 0) || 
            (typeof startupsResponse.data === 'object' && Object.keys(startupsResponse.data).length > 0)
          )) {
          hasLoadedAnyData = true;
          console.log('Setting hasLoadedAnyData to true based on startups data');
        }
        
        setStartups(Array.isArray(startupsResponse.data) ? startupsResponse.data : []);
      } catch (startupsError) {
        console.error('Error fetching startups:', startupsError);
      }
      
      // Fetch recommended mentors
      try {
        const mentorsResponse = await axios.get(
          'http://localhost:5000/api/mentors/recommended',
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setRecommendedMentors(mentorsResponse.data);
        if (mentorsResponse.data.length > 0) {
          hasLoadedAnyData = true;
        }
      } catch (mentorsError) {
        console.error('Error fetching mentors:', mentorsError);
      }
      
      // Fetch mentorships
      try {
        const mentorshipsResponse = await axios.get(
          'http://localhost:5000/api/mentorships/entrepreneur',
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setActiveMentorships(mentorshipsResponse.data);
        if (mentorshipsResponse.data.length > 0) {
          hasLoadedAnyData = true;
        }
      } catch (mentorshipsError) {
        console.error('Error fetching mentorships:', mentorshipsError);
      }
      
      // Fetch upcoming meetings
      try {
        const meetingsResponse = await axios.get(
          'http://localhost:5000/api/meetings/entrepreneur',
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setUpcomingMeetings(meetingsResponse.data);
        if (meetingsResponse.data.length > 0) {
          hasLoadedAnyData = true;
        }
      } catch (meetingsError) {
        console.error('Error fetching meetings:', meetingsError);
      }
      
      // Fetch metrics
      try {
        const metricsResponse = await axios.get(
          'http://localhost:5000/api/entrepreneurs/metrics',
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setMetrics(metricsResponse.data);
      } catch (metricsError) {
        console.error('Error fetching metrics:', metricsError);
      }
      
      // If we get here, at least some API calls completed successfully
      if (hasLoadedAnyData) {
        console.log('Dashboard loaded with partial data');
      } else {
        // Debug what we received
        console.log('No data detected, showing error notification');
        showNotification('Failed to load dashboard data', 'error');
      }
    } catch (error) {
      // This will only catch errors not caught by the individual try/catch blocks
      console.error('Unexpected error fetching dashboard data:', error);
      showNotification('Failed to load dashboard data', 'error');
    } finally {
      setIsDataLoading(false);
    }
  }, [user, showNotification]);

  useEffect(() => {
    // Set theme based on localStorage or system preference
    document.documentElement.classList.toggle('dark', theme === 'dark');

    // Fetch data on mount and when user changes
    fetchDashboardData();

    // Set up refresh interval (every 2 minutes)
    const intervalId = setInterval(fetchDashboardData, 120000);
    
    return () => clearInterval(intervalId);
  }, [fetchDashboardData, theme]);
  
  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  // Handle creating/editing startup
  const handleStartupAction = (startup = null) => {
    setEditingStartup(startup);
    setShowStartupModal(true);
  };
  
  const handleStartupSubmit = async (startupData) => {
    try {
      if (editingStartup) {
        // Update existing startup
        await axios.put(
          `http://localhost:5000/api/startups/${editingStartup._id}`,
          startupData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        showNotification('Startup updated successfully', 'success');
      } else {
        // Create new startup
        await axios.post(
          'http://localhost:5000/api/startups',
          startupData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        showNotification('Startup created successfully', 'success');
      }
      
      setShowStartupModal(false);
      setEditingStartup(null);
      fetchDashboardData();
      
    } catch (error) {
      console.error('Error saving startup:', error);
      showNotification(
        error.response?.data?.message || 'Failed to save startup',
        'error'
      );
    }
  };

  // Handle expertise areas update
  const handleUpdateExpertise = () => {
    setShowExpertiseModal(true);
  };

  // Handle meeting actions
  const handleJoinMeeting = (meeting) => {
    setActiveMeeting(meeting);
    setShowMeetingModal(true);
  };

  // Handle mentorship request
  const handleMentorshipRequest = async (mentorId) => {
    try {
      await axios.post(
        'http://localhost:5000/api/mentorships/request',
        { mentorId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      showNotification('Mentorship request sent successfully', 'success');
      fetchDashboardData();
    } catch (error) {
      console.error('Error sending mentorship request:', error);
      showNotification(
        error.response?.data?.message || 'Failed to send request',
        'error'
      );
    }
  };

  return (
    <div className={`flex h-screen bg-slate-50 dark:bg-gray-900 ${theme === 'dark' ? 'dark' : ''}`}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700 shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
              {activeTab === 'overview' && 'Dashboard'}
              {activeTab === 'startups' && 'My Startups'}
              {activeTab === 'mentors' && 'Find Mentors'}
              {activeTab === 'mentorships' && 'My Mentorships'}
              {activeTab === 'profile' && 'Profile'}
            </h1>
            
            <div className="flex items-center">
              {/* Notification bell */}
              <button className="ml-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              
              {/* Theme toggle */}
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
            <motion.div 
              className="mb-8"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1 
                className="text-3xl font-bold text-gray-900 dark:text-gray-100"
                variants={{
                  hidden: { opacity: 0, y: -10 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                Welcome back, <span className="text-blue-600 dark:text-blue-400">{user?.name?.split(' ')[0] || 'Entrepreneur'}</span>
              </motion.h1>
              <motion.p 
                className="text-gray-500 dark:text-gray-400 mt-2"
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="mb-6 flex justify-between items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div>
                {activeTab === 'overview' && (
                  <h2 className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                    Here's what's happening with your startups
                  </h2>
                )}
                {activeTab === 'startups' && (
                  <h2 className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                    Manage your startup projects
                  </h2>
                )}
                {activeTab === 'mentors' && (
                  <h2 className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                    Connect with industry experts
                  </h2>
                )}
                {activeTab === 'mentorships' && (
                  <h2 className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                    View your active mentorships
                  </h2>
                )}
                {activeTab === 'profile' && (
                  <h2 className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                    Manage your personal information
                  </h2>
                )}
              </div>
              
              <div className="flex gap-3 ml-auto">
                {activeTab === 'startups' && (
                  <button 
                    onClick={() => handleStartupAction()}
                    className="inline-block px-2 py-1 text-xs font-medium rounded bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-800/40 transition-colors w-auto border border-amber-100 dark:border-amber-800/50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 inline-block" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Startup
                  </button>
                )}
                
                {activeTab === 'mentors' && (
                  <button 
                    onClick={() => setActiveTab('mentorships')}
                    className="inline-block px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-650 transition-colors w-auto border border-gray-200 dark:border-gray-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 inline-block" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    View Mentorships
                  </button>
                )}
              </div>
            </motion.div>
            
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
                    startups={startups}
                    mentorships={activeMentorships}
                    upcomingMeetings={upcomingMeetings}
                    setActiveTab={setActiveTab}
                    handleJoinMeeting={handleJoinMeeting}
                    isLoading={isDataLoading}
                  />
                )}
                
                {activeTab === 'startups' && (
                  <Startups 
                    startups={startups} 
                    onCreateStartup={() => handleStartupAction()}
                    isLoading={isDataLoading}
                  />
                )}
                
                {activeTab === 'mentors' && (
                  <FindMentors 
                    recommendedMentors={recommendedMentors}
                    onMentorshipRequest={handleMentorshipRequest}
                    isLoading={isDataLoading}
                  />
                )}
                
                {activeTab === 'mentorships' && (
                  <Mentorships
                    activeMentorships={activeMentorships}
                    upcomingMeetings={upcomingMeetings}
                    handleJoinMeeting={handleJoinMeeting}
                    isLoading={isDataLoading}
                  />
                )}
                
                {activeTab === 'profile' && (
                  <Profile 
                    expertiseAreas={user?.expertiseAreas || []}
                    onUpdateExpertise={handleUpdateExpertise}
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
                {notification.type === 'error' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
                {notification.type === 'info' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
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
        {showStartupModal && (
          <StartupFormModal 
            startup={editingStartup}
            onClose={() => {
              setShowStartupModal(false);
              setEditingStartup(null);
            }}
            onSubmit={handleStartupSubmit}
          />
        )}
        
        {showExpertiseModal && (
          <ExpertiseFormModal
            existingExpertise={user?.expertiseAreas || []}
            onClose={() => setShowExpertiseModal(false)}
            onSubmit={async (expertise) => {
              try {
                await axios.put(
                  `http://localhost:5000/api/users/${user._id}`,
                  { expertiseAreas: expertise },
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                  }
                );
                
                await refreshUserData();
                showNotification('Expertise areas updated successfully', 'success');
                setShowExpertiseModal(false);
              } catch (error) {
                console.error('Error updating expertise:', error);
                showNotification('Failed to update expertise areas', 'error');
              }
            }}
          />
        )}
        
        {showMeetingModal && (
          <MeetingModal 
            meeting={activeMeeting} 
            onClose={() => setShowMeetingModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default EntrepreneurDashboard;