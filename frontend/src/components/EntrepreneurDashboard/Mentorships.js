import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isPast, addHours, isToday } from 'date-fns';

const Mentorships = ({ activeMentorships = [], mentorshipRequests = [], handleJoinMeeting, isLoading }) => {
  const [activeTab, setActiveTab] = useState('active');
  
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-6 w-1/4"></div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-6 w-1/2"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  const hasMentorships = activeMentorships.length > 0;
  const hasRequests = mentorshipRequests.length > 0;
  
  // Format date for display
  const formatSessionDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`;
    }
    return format(date, 'MMM d, yyyy • h:mm a');
  };
  
  // Check if a session is active now (within the hour)
  const isSessionActive = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    // The 'now' variable was declared but not used
    // isPast() internally uses the current time for comparison
    return !isPast(date) && isPast(addHours(date, -1));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Mentorships</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your mentorship connections and requests</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex px-4 pt-2" aria-label="Tabs">
            <button
              className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-t-lg ${
                activeTab === 'active'
                  ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-500'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('active')}
            >
              Active Mentorships
              {hasMentorships && (
                <span className="ml-2 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-medium px-1.5 py-0.5 rounded-full border border-amber-100 dark:border-amber-800/50">
                  {activeMentorships.length}
                </span>
              )}
            </button>
            <button
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-t-lg ${
                activeTab === 'requests'
                  ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-500'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('requests')}
            >
              Sent Requests
              {hasRequests && (
                <span className="ml-2 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-medium px-2 py-0.5 rounded-full border border-amber-100 dark:border-amber-800/50">
                  {mentorshipRequests.length}
                </span>
              )}
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'active' ? (
              <motion.div
                key="active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {!hasMentorships ? (
                  <div className="text-center py-8">
                    <div className="mx-auto w-16 h-16 bg-amber-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">No active mentorships</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-5 max-w-md mx-auto">
                      Connect with experienced mentors to get guidance for your startup journey.
                    </p>
                    <button
                      onClick={() => setActiveTab('find')}
                      className="inline-block px-2 py-1 text-xs font-medium rounded bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-800/40 transition-colors w-auto border border-amber-100 dark:border-amber-800/50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 inline-block" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                      </svg>
                      Find a Mentor
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeMentorships.map((mentorship) => (
                      <motion.div 
                        key={mentorship._id}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                      >
                        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between">
                          <div className="flex items-start">
                            <div className="relative">
                              <img 
                                src={mentorship.mentor.profileDetails?.profilePhoto || "/avatar-placeholder.png"} 
                                alt={mentorship.mentor.name} 
                                className="h-12 w-12 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/avatar-placeholder.png";
                                }}
                              />
                              <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 border-2 border-white dark:border-gray-700"></span>
                            </div>
                            <div className="ml-4">
                              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                                {mentorship.mentor.name}
                              </h3>
                              <div className="flex items-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {mentorship.mentor.profileDetails?.title || 'Mentor'}
                                  {mentorship.mentor.profileDetails?.company && 
                                    ` at ${mentorship.mentor.profileDetails.company}`
                                  }
                                </p>
                                {mentorship.startup && (
                                  <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">
                                    {mentorship.startup.name}
                                  </span>
                                )}
                              </div>
                              {mentorship.nextSession && (
                                <div className="mt-1.5 flex items-center text-xs">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                  </svg>
                                  <span className={`${isSessionActive(mentorship.nextSession) ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                                    {formatSessionDate(mentorship.nextSession)}
                                    {isSessionActive(mentorship.nextSession) && " (Active now)"}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                            {mentorship.nextSession && isSessionActive(mentorship.nextSession) && (
                              <button
                                onClick={() => handleJoinMeeting(mentorship)}
                                className="inline-block px-2 py-0.75 text-xs font-medium rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800/40 transition-colors w-auto border border-green-200 dark:border-green-800/50"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5 inline-block" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                </svg>
                                Join
                              </button>
                            )}
                            
                            <button
                              className="inline-block px-2 py-0.75 text-xs font-medium rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-650 transition-colors w-auto border border-gray-200 dark:border-gray-600"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5 inline-block" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                              </svg>
                              Message
                            </button>
                            
                            <button className="p-1.5 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        {mentorship.lastSessionNotes && (
                          <div className="px-5 pb-4 pt-0 border-t border-gray-100 dark:border-gray-700 mt-1">
                            <details className="text-sm">
                              <summary className="text-amber-600 dark:text-amber-400 cursor-pointer font-medium">Last session notes</summary>
                              <p className="mt-2 text-gray-600 dark:text-gray-400">{mentorship.lastSessionNotes}</p>
                            </details>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="requests"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {!hasRequests ? (
                  <div className="text-center py-8">
                    <div className="mx-auto w-16 h-16 bg-amber-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">No pending requests</h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                      Browse our mentor database and send mentorship requests to experts in your industry.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mentorshipRequests.map((request) => (
                      <motion.div 
                        key={request._id}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                      >
                        <div className="p-4 sm:p-5">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center">
                              <img 
                                src={request.mentor.profileDetails?.profilePhoto || "/avatar-placeholder.png"} 
                                alt={request.mentor.name} 
                                className="h-10 w-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/avatar-placeholder.png";
                                }}
                              />
                              <div className="ml-3">
                                <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
                                  {request.mentor.name}
                                </h3>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  {request.mentor.profileDetails?.title || 'Mentor'}
                                  {request.mentor.profileDetails?.company && 
                                    ` at ${request.mentor.profileDetails.company}`
                                  }
                                </p>
                              </div>
                            </div>
                            
                            <div>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                                ${request.status === 'accepted' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400' 
                                  : request.status === 'rejected'
                                    ? 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400'
                                    : 'bg-amber-100 text-amber-800 dark:bg-amber-800/30 dark:text-amber-400'
                                }`}
                              >
                                {request.status === 'accepted' 
                                  ? 'Accepted' 
                                  : request.status === 'rejected'
                                    ? 'Declined'
                                    : 'Pending'}
                              </span>
                            </div>
                          </div>
                          
                          {request.message && (
                            <div className="bg-gray-50 dark:bg-gray-750 p-3 rounded-md border border-gray-100 dark:border-gray-700 mb-3 text-sm">
                              <p className="text-gray-600 dark:text-gray-400">
                                {request.message}
                              </p>
                            </div>
                          )}
                          
                          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span>Sent {new Date(request.createdAt).toLocaleDateString()}</span>
                            
                            <div className="flex space-x-2">
                              {request.status === 'pending' && (
                                <>
                                  <button className="inline-block px-2 py-0.75 text-xs font-medium rounded bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-800/40 transition-colors w-auto border border-amber-100 dark:border-amber-800/50">
                                    Cancel Request
                                  </button>
                                </>
                              )}
                              
                              {request.status === 'accepted' && (
                                <button className="inline-block px-2 py-0.75 text-xs font-medium rounded bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-800/40 transition-colors w-auto border border-amber-100 dark:border-amber-800/50">
                                  Schedule Meeting
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Mentorships;