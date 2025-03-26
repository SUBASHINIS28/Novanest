import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../common/ThemeToggle';

const Sidebar = ({ activeTab, setActiveTab, user }) => {
  // eslint-disable-next-line no-unused-vars
  const [collapsed, setCollapsed] = useState(false);
  
  const navigation = [
    {
      name: 'Dashboard',
      id: 'overview',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
    },
    {
      name: 'Discover Startups',
      id: 'startups',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
        </svg>
      ),
    },
    {
      name: 'My Investments',
      id: 'portfolio',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: 'Profile',
      id: 'profile',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-gradient-to-b from-slate-800 to-slate-900 shadow-xl h-full transition-all duration-300 ease-in-out flex flex-col relative overflow-hidden">
      {/* Header with logo */}
      <div className="flex items-center justify-between h-20 px-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-amber-500 p-2 rounded-lg shadow-md border border-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <span className="font-bold text-white text-lg tracking-tight">Novanest</span>
            <p className="text-xs text-gray-400">Investor Dashboard</p>
          </div>
        </div>
      </div>
      
      {/* User profile section */}
      <div className="px-6 py-6">
        <div className="flex items-center p-3 bg-gray-800 rounded-xl shadow-md">
          <div className="relative">
            <div className="h-14 w-14 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 p-0.5 shadow-lg">
              <div className="rounded-full w-full h-full overflow-hidden border-2 border-gray-700">
                <img
                  src={user?.profileDetails?.profilePhoto || "/avatar-placeholder.png"}
                  alt={user?.name || "Investor"}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/avatar-placeholder.png";
                  }}
                />
              </div>
            </div>
            <span className="absolute bottom-0 right-1 block h-3 w-3 rounded-full bg-green-400 border-2 border-gray-700"></span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-200">{user?.name || "Investor"}</p>
            <div className="flex items-center">
              <span className="bg-gray-700/70 text-green-400 text-xs px-2 py-0.5 rounded-full border border-gray-600">
                Investor
              </span>
              <div className="w-2 h-2 rounded-full bg-green-500 ml-2"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="mt-2 flex-1 px-4 space-y-2">
        {navigation.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`${
              activeTab === item.id
                ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-amber-400 border-r-4 border-amber-500'
                : 'text-gray-400 hover:bg-gray-800/50'
            } group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-150 w-full`}
          >
            <div className={`${
              activeTab === item.id ? 'text-amber-400' : 'text-gray-500 group-hover:text-gray-300'
            } mr-3 flex-shrink-0`}>
              {item.icon}
            </div>
            <span className="font-medium">{item.name}</span>
          </button>
        ))}
      </nav>
      
      {/* Footer */}
      <div className="border-t border-gray-700 p-4">
        <div className="flex justify-center mb-4">
          <ThemeToggle />
        </div>
        
        <Link to="/logout" className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg text-gray-300 hover:bg-gray-800 transition-colors border border-gray-700 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          Sign out
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;