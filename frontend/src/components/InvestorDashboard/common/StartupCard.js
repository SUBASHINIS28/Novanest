import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const StartupCard = ({ startup, onExpressInterest, onInvest }) => {
  // Calculate funding progress percentage
  const fundingProgress = startup.fundingGoal 
    ? Math.min(Math.round((startup.currentFunding / startup.fundingGoal) * 100), 100) 
    : 0;

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full"
      whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-6 flex-grow">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1 truncate">
              {startup.startupName}
            </h3>
          </div>
          
          <div className="flex-shrink-0 ml-4">
            <div className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-600">
              {startup.logoUrl ? (
                <img 
                  src={startup.logoUrl} 
                  alt={startup.startupName} 
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/company-placeholder.png";
                  }}
                />
              ) : (
                <div className="h-full w-full bg-amber-100 dark:bg-amber-800 flex items-center justify-center">
                  <span className="text-amber-800 dark:text-amber-200 text-lg font-bold">
                    {startup.startupName?.charAt(0) || 'S'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 text-sm h-10">
          {startup.tagline || startup.shortDescription || startup.problemStatement || 'No description available'}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-2 py-1 rounded-full">
            {startup.industry}
          </span>
          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full">
            {startup.stage}
          </span>
          {startup.location && (
            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded-full">
              {startup.location}
            </span>
          )}
        </div>
        
        {startup.fundingGoal && (
          <div className="mb-4">
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-medium text-gray-700 dark:text-gray-300">Funding Goal: ${startup.fundingGoal.toLocaleString()}</span>
              <span className="text-amber-600 dark:text-amber-400 font-medium">{fundingProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div 
                className="bg-amber-500 h-1.5 rounded-full" 
                style={{ width: `${fundingProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {startup.equityOffered && (
          <div className="mb-4">
            <div className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 rounded text-sm border border-amber-100 dark:border-amber-900/30">
              <span className="font-medium text-amber-800 dark:text-amber-300">{startup.equityOffered}%</span>
              <span className="text-gray-600 dark:text-gray-400"> equity offered</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-100 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-750">
        <div className="flex items-center justify-between">
          <Link 
            to={`/startup/${startup._id}`}
            className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 text-sm font-medium"
          >
            View Details
          </Link>
          
          <div className="flex gap-2">
            <button
              onClick={() => onExpressInterest(startup._id)}
              className="inline-block px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-650 transition-colors border border-gray-200 dark:border-gray-600"
            >
              Express Interest
            </button>
            
            <button
              onClick={() => onInvest(startup)}
              className="inline-block px-2 py-1 text-xs font-medium rounded bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-800/40 transition-colors border border-amber-100 dark:border-amber-800/50"
            >
              Invest
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StartupCard;