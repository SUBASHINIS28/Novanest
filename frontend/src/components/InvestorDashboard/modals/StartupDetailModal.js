import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const StartupDetailModal = ({ startup, onClose, onExpress, onInvest }) => {
  const [activeTab, setActiveTab] = useState('overview'); // overview, team, financials, traction
  
  if (!startup) return null;
  
  // Format the funding goal in a readable way
  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    } else {
      return `$${amount}`;
    }
  };
  
  // Calculate funding progress percentage
  const fundingProgress = startup.fundingGoal ? 
    Math.min(Math.round((startup.currentFunding / startup.fundingGoal) * 100), 100) : 0;
  
  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring",
        duration: 0.5,
        bounce: 0.3
      }
    },
    exit: { 
      opacity: 0, 
      y: 50, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };
  
  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <motion.div
          className="relative max-w-6xl w-full max-h-[90vh] mx-4 my-8 flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Header */}
          <div className="sticky top-0 z-10">
            <div className="relative h-40 md:h-52 overflow-hidden">
              {startup.coverImage ? (
                <img 
                  src={startup.coverImage} 
                  alt={startup.startupName} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/startup-cover-placeholder.jpg";
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-amber-500 to-amber-700 dark:from-amber-700 dark:to-amber-900"></div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              
              {/* Close button */}
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white p-1.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end">
                <div className="mr-4 flex-shrink-0">
                  <div className="h-16 w-16 md:h-20 md:w-20 rounded-lg bg-white dark:bg-gray-700 shadow-lg flex items-center justify-center overflow-hidden">
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
                        <span className="text-amber-800 dark:text-amber-200 text-2xl font-bold">
                          {startup.startupName?.charAt(0) || 'S'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl md:text-3xl font-bold text-white truncate mb-1">
                    {startup.startupName}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                      {startup.industry}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                      {startup.stage}
                    </span>
                    {startup.location && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {startup.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <nav className="flex" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'overview'
                      ? 'border-b-2 border-amber-500 text-amber-600 dark:text-amber-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('team')}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'team'
                      ? 'border-b-2 border-amber-500 text-amber-600 dark:text-amber-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Team
                </button>
                <button
                  onClick={() => setActiveTab('financials')}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'financials'
                      ? 'border-b-2 border-amber-500 text-amber-600 dark:text-amber-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Financials
                </button>
                <button
                  onClick={() => setActiveTab('traction')}
                  className={`px-4 py-3 text-sm font-medium ${
                    activeTab === 'traction'
                      ? 'border-b-2 border-amber-500 text-amber-600 dark:text-amber-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  Traction
                </button>
              </nav>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="p-6"
                >
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Tagline
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-lg italic">
                      {startup.tagline || "No tagline available"}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Problem Statement
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {startup.problemStatement || "No problem statement available"}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Solution
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {startup.solution || "No solution description available"}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Business Model
                    </h3>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <p className="text-gray-600 dark:text-gray-300">
                          {startup.businessModel || "No business model description available"}
                        </p>
                      </div>
                      {startup.businessModelType && (
                        <div className="bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-lg p-3 md:w-48">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Model Type
                          </p>
                          <p className="text-gray-900 dark:text-white font-medium">
                            {startup.businessModelType}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Target Market
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {startup.targetAudience || "No target market information available"}
                    </p>
                  </div>
                  
                  {startup.website && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Website
                      </h3>
                      <a 
                        href={startup.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-amber-600 dark:text-amber-400 hover:underline flex items-center"
                      >
                        <span>{startup.website.replace(/^https?:\/\//, '')}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                        </svg>
                      </a>
                    </div>
                  )}
                  
                  {startup.pitchDeckURL && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Pitch Deck
                      </h3>
                      <a 
                        href={startup.pitchDeckURL} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                        View Pitch Deck
                      </a>
                    </div>
                  )}
                </motion.div>
              )}
              
              {activeTab === 'team' && (
                <motion.div
                  key="team"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="p-6"
                >
                  {/* Founder Info */}
                  {startup.founderId && (
                    <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 p-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Founder
                      </h3>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-4">
                          <img 
                            src={startup.founderId.profileDetails?.profilePhoto || "/avatar-placeholder.png"} 
                            alt={startup.founderId.name} 
                            className="h-14 w-14 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                            onError={(e) => {
                              e.target.onerror = null; 
                              e.target.src = "/avatar-placeholder.png";
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                            {startup.founderId.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {startup.founderId.profileDetails?.title} {startup.founderId.profileDetails?.company && `at ${startup.founderId.profileDetails?.company}`}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {startup.founderId.email}
                          </p>
                          
                          <div className="mt-3 flex gap-2">
                            {startup.founderId.profileDetails?.socialLinks?.linkedIn && (
                              <a 
                                href={startup.founderId.profileDetails.socialLinks.linkedIn} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-600 hover:text-blue-800"
                                title="LinkedIn Profile"
                              >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                              </a>
                            )}
                            
                            {startup.founderId.profileDetails?.socialLinks?.twitter && (
                              <a 
                                href={startup.founderId.profileDetails.socialLinks.twitter} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-400 hover:text-blue-600"
                                title="Twitter Profile"
                              >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                </svg>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Founder Background */}
                  {startup.founderBackground && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Founder Background
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                        {startup.founderBackground}
                      </p>
                    </div>
                  )}

                  {/* Team Members */}
                  {startup.teamMembers && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Team Members
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                        {startup.teamMembers}
                      </p>
                    </div>
                  )}
                  
                  {/* Mentors & Advisors */}
                  {startup.mentorsAdvisors && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Mentors & Advisors
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                        {startup.mentorsAdvisors}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
              
              {activeTab === 'financials' && (
                <motion.div
                  key="financials"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="p-6"
                >
                  {/* Funding Goal & Progress */}
                  <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-100 dark:border-amber-900/30">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                      Funding Goal
                    </h3>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-1">
                          ${startup.fundingGoal?.toLocaleString() || '0'}
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: `${fundingProgress}%` }}></div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ${startup.currentFunding?.toLocaleString() || '0'} raised
                          </span>
                          <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                            {fundingProgress}% of goal
                          </span>
                        </div>
                      </div>
                      
                      {startup.equityOffered && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700 md:w-48">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Equity Offered
                          </p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {startup.equityOffered}%
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Use of Funds */}
                  {startup.useOfFunds && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Use of Funds
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                        {startup.useOfFunds}
                      </p>
                    </div>
                  )}
                  
                  {/* Revenue Model */}
                  {startup.revenueModel && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Revenue Model
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {startup.revenueModel}
                      </p>
                    </div>
                  )}
                  
                  {/* Previous Funding */}
                  {startup.previousFunding && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Previous Funding
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {startup.previousFunding}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
              
              {activeTab === 'traction' && (
                <motion.div
                  key="traction"
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="p-6"
                >
                  {/* Traction & Metrics */}
                  {startup.traction && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Current Traction
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                        {startup.traction}
                      </p>
                    </div>
                  )}
                  
                  {/* Market Size */}
                  {startup.marketSize && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Market Size (TAM)
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {startup.marketSize}
                      </p>
                    </div>
                  )}
                  
                  {/* Competitive Advantage */}
                  {startup.competitiveAdvantage && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Competitive Advantage
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {startup.competitiveAdvantage}
                      </p>
                    </div>
                  )}
                  
                  {/* Milestones */}
                  {startup.milestones && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Milestones
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                        {startup.milestones}
                      </p>
                    </div>
                  )}
                  
                  {/* Projected Growth */}
                  {startup.projectedGrowth && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Projected Growth
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {startup.projectedGrowth}
                      </p>
                    </div>
                  )}

                  {/* Partnerships or Customers */}
                  {startup.partnerships && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Partnerships & Customers
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                        {startup.partnerships}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Action footer */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
            <div>
              <Link 
                to={`/startup/${startup._id}`} 
                target="_blank"
                className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 text-sm font-medium"
              >
                View Full Profile
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 inline-block" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => onExpress(startup._id)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                Express Interest
              </button>
              <button
                onClick={() => onInvest(startup)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                Invest Now
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StartupDetailModal;