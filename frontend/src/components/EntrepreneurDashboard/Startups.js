import React, { useState } from 'react';
import { motion } from 'framer-motion';
import StartupCard from './common/StartupCard';

const Startups = ({ startups, onCreateStartup, onEditStartup, isLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Filter and sort startups
  const filteredStartups = startups
    .filter((startup) => {
      // Filter by search query
      const nameMatches = startup.startupName?.toLowerCase().includes(searchQuery.toLowerCase());
      const taglineMatches = startup.tagline?.toLowerCase().includes(searchQuery.toLowerCase());
      const industryMatches = startup.industry?.toLowerCase().includes(searchQuery.toLowerCase());
      const queryMatches = nameMatches || taglineMatches || industryMatches;
      
      // Filter by stage
      const stageMatches = filterStage === 'all' || startup.stage === filterStage;
      
      return queryMatches && stageMatches;
    })
    .sort((a, b) => {
      // Sort startups
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'name':
          return a.startupName.localeCompare(b.startupName);
        case 'industry':
          return a.industry.localeCompare(b.industry);
        default:
          return 0;
      }
    });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="h-64 bg-white dark:bg-gray-800 rounded-xl shadow-sm"></div>
          ))}
        </div>
      </div>
    );
  }

  const stageOptions = [
    'all', 'Idea', 'Prototype', 'MVP', 'Pre-Seed', 'Seed', 'Series A', 'Series B+'
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Startups</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your startup projects and track their progress</p>
      </div>

      {startups.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-1 min-w-0 items-center">
            <div className="relative rounded-md shadow-sm flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                className="focus:ring-amber-500 focus:border-amber-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100"
                placeholder="Search by name, tagline, or industry"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div>
              <label htmlFor="stage-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 sr-only">
                Filter by stage
              </label>
              <select
                id="stage-filter"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-gray-100"
                value={filterStage}
                onChange={(e) => setFilterStage(e.target.value)}
              >
                <option value="all">All Stages</option>
                {stageOptions.slice(1).map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 dark:text-gray-300 sr-only">
                Sort by
              </label>
              <select
                id="sort-by"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-gray-100"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name</option>
                <option value="industry">Industry</option>
              </select>
            </div>

            <button 
              onClick={onCreateStartup}
              className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-800/40 transition-colors border border-amber-100 dark:border-amber-800/50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Startup
            </button>
          </div>
        </div>
      )}

      {startups.length === 0 ? (
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-dashed border-gray-300 dark:border-gray-700 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-amber-500/50 dark:text-amber-600/50 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">No startups yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Track your startup journey by creating your first startup profile. This helps mentors understand your business and provide targeted guidance.
          </p>
          <button 
            onClick={onCreateStartup}
            className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-800/40 transition-colors border border-amber-100 dark:border-amber-800/50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create Your First Startup
          </button>
        </motion.div>
      ) : filteredStartups.length === 0 ? (
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700 shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No startups match your filters</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Try adjusting your search or filter criteria</p>
          <button 
            onClick={() => {
              setSearchQuery('');
              setFilterStage('all');
              setSortBy('newest');
            }}
            className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-650 transition-colors border border-gray-200 dark:border-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Clear Filters
          </button>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {filteredStartups.map((startup) => (
            <StartupCard 
              key={startup._id} 
              startup={startup} 
              onEdit={() => onEditStartup(startup)}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Startups;