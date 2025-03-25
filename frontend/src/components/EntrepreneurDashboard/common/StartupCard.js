import React from 'react';
import { Link } from 'react-router-dom';

const StartupCard = ({ startup }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md rounded-lg overflow-hidden transition-all duration-200 border border-gray-100 dark:border-gray-700 flex flex-col">
      <div className="p-4 flex-grow">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">{startup.startupName}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm line-clamp-2">
          {startup.tagline || startup.problemStatement || 'No description available'}
        </p>
        
        <div className="flex items-center mb-3">
          <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-2 py-0.5 rounded-full">
            {startup.industry}
          </span>
          <span className="text-xs ml-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">
            {startup.stage}
          </span>
        </div>
      </div>
      
      <div className="border-t border-gray-100 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-750 flex justify-end">
        <Link 
          to={`/startup/${startup._id}`} 
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium flex items-center transition-colors"
        >
          View Details
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default StartupCard;