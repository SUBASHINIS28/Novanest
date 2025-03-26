import React from 'react';
import { motion } from 'framer-motion';

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  iconBgColor = 'amber', 
  trend = null, 
  trendDirection = 'up', 
  trendText = '',
  footer = null,
  onClick = null
}) => {
  // Generate the appropriate color classes for the icon background
  const getIconBgClasses = (color) => {
    const colorMap = {
      amber: 'bg-amber-50 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400',
      blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400',
      green: 'bg-green-50 dark:bg-green-900/30 text-green-500 dark:text-green-400',
      purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-500 dark:text-purple-400',
      red: 'bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400',
      gray: 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
    };
    return colorMap[color] || colorMap.amber;
  };

  // Determine trend color
  const getTrendColor = () => {
    if (trend === null) return '';
    return trendDirection === 'up' 
      ? 'text-green-500 dark:text-green-400' 
      : 'text-red-500 dark:text-red-400';
  };

  // Get trend icon
  const getTrendIcon = () => {
    if (trendDirection === 'up') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
        </svg>
      );
    }
  };

  return (
    <motion.div 
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 h-full ${onClick ? 'cursor-pointer' : ''}`}
      whileHover={onClick ? { y: -5, transition: { duration: 0.2 } } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-lg ${getIconBgClasses(iconBgColor)}`}>
          {icon}
        </div>
      </div>
      
      {(trend !== null || footer !== null) && (
        <div className="mt-4">
          {trend !== null && (
            <div className="flex items-center">
              <span className={`${getTrendColor()}`}>
                {getTrendIcon()}
              </span>
              <span className={`text-sm ml-1 font-medium ${getTrendColor()}`}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
              {trendText && (
                <span className="text-sm ml-1 text-gray-600 dark:text-gray-400">
                  {trendText}
                </span>
              )}
            </div>
          )}
          {footer !== null && (
            <div className="mt-2">
              {footer}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default MetricCard;