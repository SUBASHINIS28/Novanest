import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ExpertiseTag from './ExpertiseTag';

const MentorCard = ({ mentor }) => {
  // Take only first 3 expertise areas for display
  const displayExpertise = mentor.expertiseAreas?.slice(0, 3) || [];
  const additionalExpertiseCount = mentor.expertiseAreas?.length > 3 ? mentor.expertiseAreas.length - 3 : 0;

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-6 flex-grow">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <img 
              src={mentor.profileDetails?.profilePhoto || "/avatar-placeholder.png"} 
              alt={mentor.name}
              className="h-12 w-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
              onError={(e) => { 
                e.target.onerror = null; 
                e.target.src = "/avatar-placeholder.png";
              }}
            />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{mentor.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {mentor.profileDetails?.title || 'Mentor'} 
              {mentor.profileDetails?.company && ` at ${mentor.profileDetails.company}`}
            </p>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
            {mentor.profileDetails?.bio || 'No bio available'}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {displayExpertise.map((expertise, idx) => (
            <ExpertiseTag key={idx} text={expertise} />
          ))}
          {additionalExpertiseCount > 0 && (
            <span className="inline-flex items-center bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full">
              +{additionalExpertiseCount} more
            </span>
          )}
        </div>
        
        {mentor.matchPercentage && (
          <div className="flex items-center mb-2">
            <div className="flex-grow mr-2 bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full">
              <div 
                className="bg-green-500 h-1.5 rounded-full" 
                style={{ width: `${mentor.matchPercentage}%` }}
              ></div>
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{mentor.matchPercentage}% Match</span>
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-100 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-750 flex justify-between items-center">
        <Link 
          to={`/mentor/${mentor._id}`} 
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium flex items-center transition-colors"
        >
          View Profile
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </Link>
        
        <Link 
          to={`/messages?to=${mentor._id}`} 
          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Connect
        </Link>
      </div>
    </motion.div>
  );
};

export default MentorCard;