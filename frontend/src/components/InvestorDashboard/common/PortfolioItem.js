import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const PortfolioItem = ({ investment, layout = 'card', showActions = true }) => {
  // Format date properly
  const formattedDate = format(new Date(investment.date), 'MMM d, yyyy');
  
  // Handle error in case startup data is missing
  if (!investment.startup) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-4 rounded-lg">
        <p className="text-sm text-red-600 dark:text-red-400">Invalid investment data</p>
      </div>
    );
  }

  // List layout
  if (layout === 'list') {
    return (
      <div className="border-b border-gray-100 dark:border-gray-700 last:border-b-0 py-4 first:pt-0 last:pb-0">
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-4">
            <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-600">
              {investment.startup.logoUrl ? (
                <img 
                  src={investment.startup.logoUrl} 
                  alt={investment.startup.startupName} 
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/company-placeholder.png";
                  }}
                />
              ) : (
                <div className="h-full w-full bg-amber-100 dark:bg-amber-800 flex items-center justify-center">
                  <span className="text-amber-800 dark:text-amber-200 text-lg font-bold">
                    {investment.startup.startupName?.charAt(0) || 'S'}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-medium text-gray-900 dark:text-white truncate">
                {investment.startup.startupName}
              </h4>
              <span className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                ${investment.amount.toLocaleString()}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                {investment.startup.industry}
              </span>
              {investment.equity && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                  {investment.equity}% equity
                </span>
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formattedDate}
              </span>
            </div>
            
            {showActions && (
              <div className="mt-2 flex justify-end">
                <Link 
                  to={`/startup/${investment.startup._id}`}
                  className="text-sm font-medium text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300"
                >
                  View Details
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // Card layout (default)
  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-600 mr-3">
              {investment.startup.logoUrl ? (
                <img 
                  src={investment.startup.logoUrl} 
                  alt={investment.startup.startupName} 
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/company-placeholder.png";
                  }}
                />
              ) : (
                <div className="h-full w-full bg-amber-100 dark:bg-amber-800 flex items-center justify-center">
                  <span className="text-amber-800 dark:text-amber-200 text-base font-bold">
                    {investment.startup.startupName?.charAt(0) || 'S'}
                  </span>
                </div>
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
              {investment.startup.startupName}
            </h3>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-md">
            <span className="font-medium text-amber-800 dark:text-amber-400">
              ${investment.amount.toLocaleString()}
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
            {investment.startup.industry}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
            {investment.startup.stage}
          </span>
          {investment.equity && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
              {investment.equity}% equity
            </span>
          )}
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Invested on {formattedDate}
        </div>
        
        {showActions && (
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
            <Link 
              to={`/startup/${investment.startup._id}`}
              className="text-sm font-medium text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 flex items-center justify-end"
            >
              View Startup
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PortfolioItem;