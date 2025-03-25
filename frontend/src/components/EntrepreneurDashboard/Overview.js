import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Overview = ({ 
  metrics, 
  startups, 
  mentorships, 
  upcomingMeetings, 
  setActiveTab,
  handleJoinMeeting,
  isLoading 
}) => {
  // Loading state with skeleton UI
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="h-32 bg-white dark:bg-gray-800 rounded-lg shadow-sm"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-white dark:bg-gray-800 rounded-lg shadow-sm"></div>
          <div className="h-64 bg-white dark:bg-gray-800 rounded-lg shadow-sm"></div>
        </div>
        <div className="h-64 bg-white dark:bg-gray-800 rounded-lg shadow-sm"></div>
      </div>
    );
  }

  // Sample data for the chart
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Progress',
        data: [30, 40, 45, 50, 65, metrics?.progressScore || 70],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20
        },
        grid: {
          color: 'rgba(160, 160, 160, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Metrics Section */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Active Startups Metric */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 h-full"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Startups</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{metrics?.activeStartups || 0}</h3>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          
          {metrics?.startupsTrend !== undefined && (
            <div className="mt-4 flex items-center">
              {metrics.startupsTrend > 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                </svg>
              )}
              <span className={`text-xs font-medium ml-1 ${metrics.startupsTrend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(metrics.startupsTrend)}% from last month
              </span>
            </div>
          )}
        </motion.div>

        {/* Mentorship Sessions Metric */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 h-full"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Mentorship Sessions</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{metrics?.mentorshipSessions || 0}</h3>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${metrics?.sessionCompletionRate || 0}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {metrics?.completedSessions || 0} completed of {metrics?.totalScheduledSessions || 0} scheduled
            </p>
          </div>
        </motion.div>

        {/* Mentors Engaged Metric */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 h-full"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Mentors Engaged</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{metrics?.mentorsEngaged || 0}</h3>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/30 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 rounded-full font-medium">
              {metrics?.pendingMentorRequests || 0} pending requests
            </span>
          </div>
        </motion.div>

        {/* Progress Score Metric with Chart */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 h-full"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Progress Score</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{metrics?.progressScore || 0}</h3>
            </div>
            <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between mb-1 text-xs text-gray-500 dark:text-gray-400">
              <span>Progress</span>
              <span>{metrics?.progressScore || 0}/100</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-3">
              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${metrics?.progressScore || 0}%` }}></div>
            </div>
            <div className="h-20 w-full">
              <Line data={chartData} options={chartOptions} height={80} />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Startups and Sessions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Startups */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="border-b border-gray-100 dark:border-gray-700 p-6 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Startups</h3>
            <button 
              onClick={() => setActiveTab('startups')}
              className="inline-block px-2 py-1 text-xs font-medium rounded bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-800/40 transition-colors w-auto border border-amber-100 dark:border-amber-800/50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 inline-block" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              View All
            </button>
          </div>
          
          <div className="p-6">
            {startups && startups.length > 0 ? (
              <div className="space-y-4">
                {startups.slice(0, 3).map(startup => (
                  <div key={startup._id} className="flex items-start border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                    <div className="flex-1">
                      <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">{startup.startupName}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                        {startup.tagline || startup.problemStatement || 'No description available'}
                      </p>
                      <div className="flex items-center">
                        <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-2 py-0.5 rounded-full">
                          {startup.industry}
                        </span>
                        <span className="text-xs ml-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">
                          {startup.stage}
                        </span>
                      </div>
                    </div>
                    <Link 
                      to={`/startup/${startup._id}`} 
                      className="flex-shrink-0 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm ml-4"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400 mb-4">No startups yet</p>
                <button
                  onClick={() => setActiveTab('startups')}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Startup
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Upcoming Meetings */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="border-b border-gray-100 dark:border-gray-700 p-6 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Meetings</h3>
            <button 
              onClick={() => setActiveTab('mentors')}
              className="inline-block px-2 py-1 text-xs font-medium rounded bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-800/40 transition-colors w-auto border border-amber-100 dark:border-amber-800/50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 inline-block" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
              Find Mentors
            </button>
          </div>
          
          <div className="p-6">
            {upcomingMeetings && upcomingMeetings.length > 0 ? (
              <div className="space-y-4">
                {upcomingMeetings.map(meeting => {
                  const meetingTime = new Date(meeting.startTime);
                  const formattedDate = meetingTime.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  });
                  const formattedTime = meetingTime.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true
                  });
                  
                  return (
                    <div key={meeting._id} className="flex items-center border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                      <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-3 mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formattedDate} · {formattedTime}
                        </p>
                        <h4 className="text-base font-medium text-gray-900 dark:text-white">
                          {meeting.title || 'Mentorship Session'}
                        </h4>
                        <div className="flex items-center mt-1">
                          <img 
                            src={meeting.mentor?.profilePhoto || "/avatar-placeholder.png"} 
                            alt={meeting.mentor?.name} 
                            className="h-5 w-5 rounded-full mr-2"
                          />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{meeting.mentor?.name}</span>
                        </div>
                      </div>
                      {meeting.canJoin && (
                        <button
                          onClick={() => handleJoinMeeting(meeting)}
                          className="ml-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1.5 px-3 rounded-md"
                        >
                          Join
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400 mb-4">No upcoming meetings</p>
                <button
                  onClick={() => setActiveTab('mentors')}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Find Mentors
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="border-b border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
        </div>
        
        <div className="p-6">
          {mentorships && mentorships.length > 0 ? (
            <div className="space-y-6">
              {mentorships.slice(0, 5).map((activity, idx) => (
                <div key={idx} className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      {activity.type === 'message' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                          <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                        </svg>
                      ) : activity.type === 'request' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-800 dark:text-gray-200">
                      {activity.content}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(activity.timestamp).toLocaleDateString('en-US', { 
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400">No recent activity to display</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Overview;