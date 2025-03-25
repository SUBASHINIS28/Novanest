import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MentorCard from './common/MentorCard';

const FindMentors = ({ recommendedMentors, isLoading, onRequestMentorship }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [expertiseFilter, setExpertiseFilter] = useState('');

  // Extract unique expertise areas for filter dropdown
  const allExpertiseAreas = recommendedMentors
    .flatMap(mentor => mentor.expertiseAreas || [])
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort();

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/3"></div>
        <div className="flex space-x-4">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex-grow"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-40"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-48"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="h-80 bg-white dark:bg-gray-800 rounded-xl shadow-sm"></div>
          ))}
        </div>
      </div>
    );
  }

  const filteredMentors = recommendedMentors.filter(mentor => {
    const matchesQuery = searchQuery.trim() === '' || 
      mentor.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      mentor.profileDetails?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.profileDetails?.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.profileDetails?.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.expertiseAreas?.some(area => area.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesExpertise = !expertiseFilter || 
      mentor.expertiseAreas?.some(area => area === expertiseFilter);
      
    const baseMatch = matchesQuery && matchesExpertise;
    
    if (filter === 'all') return baseMatch;
    if (filter === 'highMatch') return baseMatch && mentor.matchPercentage >= 80;
    if (filter === 'recent') return baseMatch && mentor.isRecentlyActive;
    
    return baseMatch;
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Find Mentors</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Connect with experienced mentors who can help guide your startup journey</p>
      </div>
      
      <motion.div 
        className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              type="search"
              className="block w-full p-2.5 pl-10 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Search by name, expertise, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-auto">
            <select
              className="w-full md:w-auto bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block p-2.5"
              value={expertiseFilter}
              onChange={(e) => setExpertiseFilter(e.target.value)}
            >
              <option value="">All Expertise Areas</option>
              {allExpertiseAreas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-auto">
            <select
              className="w-full md:w-auto bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block p-2.5"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Mentors</option>
              <option value="highMatch">High Match (80%+)</option>
              <option value="recent">Recently Active</option>
            </select>
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-between text-sm">
          <p className="text-gray-500 dark:text-gray-400">
            {filteredMentors.length} mentor{filteredMentors.length !== 1 ? 's' : ''} found
          </p>
          {(searchQuery || expertiseFilter || filter !== 'all') && (
            <button 
              onClick={() => {
                setSearchQuery('');
                setExpertiseFilter('');
                setFilter('all');
              }}
              className="inline-block px-1.5 py-0.5 text-xs font-medium rounded bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-800/40 transition-colors w-auto border border-amber-100 dark:border-amber-800/50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5 inline-block" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Clear
            </button>
          )}
        </div>
      </motion.div>
      
      {filteredMentors.length === 0 ? (
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-100 dark:border-gray-700 shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mx-auto w-16 h-16 bg-amber-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">No mentors found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            {searchQuery.trim() !== '' || expertiseFilter || filter !== 'all'
              ? "Try adjusting your search criteria or filters" 
              : "We'll help you connect with mentors based on your expertise and startup needs"}
          </p>
          {(searchQuery || expertiseFilter || filter !== 'all') && (
            <button 
              onClick={() => {
                setSearchQuery('');
                setExpertiseFilter('');
                setFilter('all');
              }}
              className="inline-block px-2 py-0.5 text-xs font-medium rounded-md bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-800/50 hover:bg-amber-100 dark:hover:bg-amber-800/40 transition-colors w-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5 inline-block" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Clear
            </button>
          )}
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {filteredMentors.map((mentor) => (
            <MentorCard 
              key={mentor._id} 
              mentor={mentor} 
              onRequestMentorship={onRequestMentorship}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default FindMentors;