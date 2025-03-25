import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../ThemeContext';
import ThemeToggle from '../common/ThemeToggle';

const Sidebar = ({ activeTab, setActiveTab, user }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useContext(ThemeContext);
  
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
      name: 'My Startups',
      id: 'startups',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      name: 'Find Mentors',
      id: 'mentors',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      ),
    },
    {
      name: 'Mentorships',
      id: 'mentorships',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
          <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
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
    <div className={`bg-gradient-to-b ${
      theme === 'dark' 
        ? 'from-gray-900 via-gray-800 to-slate-900' 
        : 'from-slate-800 to-slate-900'
    } shadow-xl h-full transition-all duration-300 ease-in-out flex flex-col relative overflow-hidden`}>
      {/* Add subtle accent line */}
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
        theme === 'dark'
          ? 'from-amber-500/30 to-slate-500/30'
          : 'from-amber-500/40 to-slate-400/40'
      }`}></div>
      
      {/* Header with logo */}
      <div className="flex items-center justify-between h-20 px-6 border-b border-gray-700">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-amber-500 p-2 rounded-lg shadow-md border border-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-white text-lg tracking-tight">Novanest</span>
              <p className="text-xs text-gray-400">Entrepreneur Dashboard</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-full hover:bg-gray-700 focus:outline-none transition-all duration-200 border border-gray-600"
        >
          {collapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      
      {/* User profile section */}
      <div className="py-6 flex flex-col flex-grow">
        {collapsed ? (
          <div className="flex flex-col items-center mb-8">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 p-0.5">
              <div className="rounded-full w-full h-full overflow-hidden border-2 border-gray-800">
                <img
                  src={user?.profileDetails?.profilePhoto || "/avatar-placeholder.png"}
                  alt={user?.name || "Entrepreneur"}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/avatar-placeholder.png";
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="px-6 mb-8">
            <div className="flex items-center p-3 bg-gray-800 rounded-xl shadow-md">
              <div className="relative">
                <div className="h-14 w-14 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 p-0.5 shadow-lg">
                  <div className="rounded-full w-full h-full overflow-hidden border-2 border-gray-700">
                    <img
                      src={user?.profileDetails?.profilePhoto || "/avatar-placeholder.png"}
                      alt={user?.name || "Entrepreneur"}
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
                <p className="text-sm font-medium text-gray-200">{user?.name || "Entrepreneur"}</p>
                <div className="flex items-center">
                  <span className="bg-gray-700/70 text-amber-400 text-xs px-2 py-0.5 rounded-full border border-gray-600">
                    Entrepreneur
                  </span>
                  <div className="w-2 h-2 rounded-full bg-green-500 ml-2"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Navigation */}
        <nav className={`mt-2 flex-1 ${collapsed ? 'px-3' : 'px-4'} space-y-2`}>
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`${
                activeTab === item.id
                  ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-amber-400 border-r-4 border-amber-500'
                  : 'text-gray-400 hover:bg-gray-800/50'
              } group flex items-center ${collapsed ? 'px-3 justify-center' : 'px-4'} py-3 text-sm font-medium rounded-lg transition-all duration-150 w-full`}
            >
              <div className={`${
                activeTab === item.id ? 'text-amber-400' : 'text-gray-500 group-hover:text-gray-300'
              } ${collapsed ? '' : 'mr-3'} flex-shrink-0`}>
                {item.icon}
              </div>
              {!collapsed && <span className="font-medium">{item.name}</span>}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Footer with theme toggle and sign out */}
      <div className="border-t border-gray-700 p-4">
        <div className="flex justify-center mb-4">
          <ThemeToggle />
        </div>
        
        {collapsed ? (
          <button className="p-2 rounded-lg hover:bg-gray-800 w-full flex justify-center transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
          </button>
        ) : (
          <Link to="/logout" className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg text-gray-300 hover:bg-gray-800 transition-colors border border-gray-700 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Sign out
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;