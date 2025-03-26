import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Startups = ({ startups, handleExpressInterest, handleInvestment, isLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [fundingFilter, setFundingFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const industryOptions = [
    'All', 'Technology', 'Healthcare', 'Finance', 'Education', 
    'Retail', 'Food', 'Entertainment', 'Manufacturing', 'Other'
  ];

  const stageOptions = [
    'All', 'Idea', 'Prototype', 'MVP', 'Pre-Seed', 'Seed', 'Series A', 'Series B+'
  ];

  const fundingOptions = [
    { label: 'Any Amount', value: '' },
    { label: 'Under $50K', value: 'under50k' },
    { label: '$50K to $250K', value: '50kto250k' },
    { label: '$250K to $1M', value: '250kto1m' },
    { label: '$1M to $5M', value: '1mto5m' },
    { label: 'Over $5M', value: 'over5m' }
  ];

  // Filter and sort startups
  const filteredStartups = startups
    .filter((startup) => {
      // Filter by search query
      const nameMatches = startup.startupName?.toLowerCase().includes(searchQuery.toLowerCase());
      const taglineMatches = startup.tagline?.toLowerCase().includes(searchQuery.toLowerCase());
      const industryMatches = startup.industry?.toLowerCase().includes(searchQuery.toLowerCase());
      const queryMatches = nameMatches || taglineMatches || industryMatches;
      
      // Filter by industry
      const industryFilterMatches = !industryFilter || industryFilter === 'All' || 
        startup.industry === industryFilter;
      
      // Filter by stage
      const stageFilterMatches = !stageFilter || stageFilter === 'All' || 
        startup.stage === stageFilter;

      // Filter by funding goal
      let fundingMatches = true;
      if (fundingFilter) {
        const fundingGoal = parseInt(startup.fundingGoal || '0');
        switch(fundingFilter) {
          case 'under50k':
            fundingMatches = fundingGoal < 50000;
            break;
          case '50kto250k':
            fundingMatches = fundingGoal >= 50000 && fundingGoal <= 250000;
            break;
          case '250kto1m':
            fundingMatches = fundingGoal > 250000 && fundingGoal <= 1000000;
            break;
          case '1mto5m':
            fundingMatches = fundingGoal > 1000000 && fundingGoal <= 5000000;
            break;
          case 'over5m':
            fundingMatches = fundingGoal > 5000000;
            break;
          default:
            break;
        }
      }
      
      return queryMatches && industryFilterMatches && stageFilterMatches && fundingMatches;
    })
    .sort((a, b) => {
      // Sort startups
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'fundingGoal-high':
          return parseInt(b.fundingGoal || '0') - parseInt(a.fundingGoal || '0');
        case 'fundingGoal-low':
          return parseInt(a.fundingGoal || '0') - parseInt(b.fundingGoal || '0');
        case 'alphabetical':
          return a.startupName.localeCompare(b.startupName);
        default:
          return 0;
      }
    });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="h-64 bg-white dark:bg-gray-800 rounded-xl shadow-sm"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Discover Startups</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Find promising startups to invest in and support</p>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Box */}
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input 
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-gray-100"
                placeholder="Search by name, industry, or description"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Industry Filter */}
          <div>
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-amber-500 focus:border-amber-500 rounded-md dark:bg-gray-700 dark:text-gray-100"
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
            >
              <option value="">All Industries</option>
              {industryOptions.slice(1).map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>

          {/* Stage Filter */}
          <div>
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-amber-500 focus:border-amber-500 rounded-md dark:bg-gray-700 dark:text-gray-100"
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
            >
              <option value="">All Stages</option>
              {stageOptions.slice(1).map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          {/* Funding Range */}
          <div>
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-amber-500 focus:border-amber-500 rounded-md dark:bg-gray-700 dark:text-gray-100"
              value={fundingFilter}
              onChange={(e) => setFundingFilter(e.target.value)}
            >
              {fundingOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-amber-500 focus:border-amber-500 rounded-md dark:bg-gray-700 dark:text-gray-100"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="alphabetical">Alphabetically (A-Z)</option>
              <option value="fundingGoal-high">Funding Goal (High to Low)</option>
              <option value="fundingGoal-low">Funding Goal (Low to High)</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          <div className="md:col-span-2 flex justify-end">
            <button 
              onClick={() => {
                setSearchQuery('');
                setIndustryFilter('');
                setStageFilter('');
                setFundingFilter('');
                setSortBy('newest');
              }}
              className="inline-block px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-650 transition-colors w-auto border border-gray-200 dark:border-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 inline-block" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Startup Cards */}
      {filteredStartups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStartups.map(startup => (
            <motion.div 
              key={startup._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
              whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{startup.startupName}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 text-sm">
                  {startup.tagline || startup.problemStatement || 'No description available'}
                </p>
                <div className="flex gap-2 mb-4 flex-wrap">
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
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-medium">Funding Goal:</span> ${parseInt(startup.fundingGoal).toLocaleString()}
                    </p>
                    {startup.equityOffered && (
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Equity Offered:</span> {startup.equityOffered}%
                      </p>
                    )}
                  </div>
                )}
                
                <div className="flex justify-between items-center mt-4">
                  <Link 
                    to={`/startup/${startup._id}`}
                    className="text-amber-600 dark:text-amber-400 hover:underline text-sm font-medium"
                  >
                    View Details
                  </Link>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleExpressInterest(startup._id)}
                      className="inline-block px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-650 transition-colors w-auto border border-gray-200 dark:border-gray-600"
                    >
                      Express Interest
                    </button>
                    <button
                      onClick={() => handleInvestment(startup)}
                      className="inline-block px-2 py-1 text-xs font-medium rounded bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-800/40 transition-colors w-auto border border-amber-100 dark:border-amber-800/50"
                    >
                      Invest
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
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
        </motion.div>
      )}
    </div>
  );
};

export default Startups;