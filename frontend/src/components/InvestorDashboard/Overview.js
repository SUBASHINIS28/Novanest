import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { format } from 'date-fns';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Overview = ({ metrics, startups, portfolio, setActiveTab, handleExpressInterest, handleInvestment, isLoading }) => {
  // Prepare data for the investment distribution chart
  const chartData = useMemo(() => {
    if (!portfolio || portfolio.length === 0) return {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1
      }]
    };
    
    // Group investments by industry
    const investmentsByIndustry = portfolio.reduce((acc, investment) => {
      const industry = investment.startup.industry || 'Other';
      if (!acc[industry]) {
        acc[industry] = 0;
      }
      acc[industry] += investment.amount;
      return acc;
    }, {});

    // Color palette for chart
    const colorPalette = [
      'rgba(255, 170, 0, 0.7)',   // amber
      'rgba(59, 130, 246, 0.7)',   // blue
      'rgba(16, 185, 129, 0.7)',   // green
      'rgba(236, 72, 153, 0.7)',   // pink
      'rgba(124, 58, 237, 0.7)',   // purple
      'rgba(245, 158, 11, 0.7)',   // yellow
      'rgba(99, 102, 241, 0.7)',   // indigo
      'rgba(6, 182, 212, 0.7)',    // cyan
    ];
    
    const industries = Object.keys(investmentsByIndustry);
    const amounts = industries.map(industry => investmentsByIndustry[industry]);
    
    return {
      labels: industries,
      datasets: [{
        data: amounts,
        backgroundColor: industries.map((_, index) => colorPalette[index % colorPalette.length]),
        borderColor: industries.map((_, index) => colorPalette[index % colorPalette.length].replace('0.7', '1')),
        borderWidth: 1
      }]
    };
  }, [portfolio]);

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 12
          },
          color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)',
          padding: 15
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw;
            return `$${value.toLocaleString()}`;
          }
        }
      }
    },
    cutout: '65%',
  };

  // Calculate startup opportunities by industry
  // eslint-disable-next-line no-unused-vars
  const startupsByIndustry = useMemo(() => {
    if (!startups || startups.length === 0) return {};
    
    return startups.reduce((acc, startup) => {
      const industry = startup.industry || 'Other';
      if (!acc[industry]) {
        acc[industry] = [];
      }
      acc[industry].push(startup);
      return acc;
    }, {});
  }, [startups]);

  // Loading state with skeleton UI
  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="h-28 bg-white dark:bg-gray-800 rounded-xl shadow-sm"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-white dark:bg-gray-800 rounded-xl shadow-sm md:col-span-1"></div>
          <div className="h-64 bg-white dark:bg-gray-800 rounded-xl shadow-sm md:col-span-2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Investor Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Track your investments and discover new opportunities</p>
      </div>
      
      {/* Investment Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Invested */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 h-full"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Invested</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                ${metrics?.totalInvested?.toLocaleString() || '0'}
              </h3>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/30 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              {metrics?.investmentTrend > 0 ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                </svg>
              )}
              <span className="text-sm ml-1 font-medium text-gray-600 dark:text-gray-400">
                {metrics?.investmentTrend > 0 ? '+' : ''}{metrics?.investmentTrend || 0}% this quarter
              </span>
            </div>
          </div>
        </motion.div>

        {/* ROI */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 h-full"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Portfolio ROI</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {metrics?.portfolioROI ? `${metrics.portfolioROI}%` : 'N/A'}
              </h3>
            </div>
            <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div 
                className="bg-green-500 h-1.5 rounded-full" 
                style={{ width: `${Math.min(Math.max(metrics?.portfolioROI || 0, 0), 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Target: 15%</p>
          </div>
        </motion.div>

        {/* Active Investments */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 h-full"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Investments</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {portfolio?.length || 0}
              </h3>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <Link 
              to="#" 
              onClick={() => setActiveTab('portfolio')}
              className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-medium"
            >
              View portfolio details →
            </Link>
          </div>
        </motion.div>

        {/* New Opportunities */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 h-full"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">New Opportunities</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {startups?.length || 0}
              </h3>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <Link 
              to="#" 
              onClick={() => setActiveTab('startups')}
              className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-medium"
            >
              Discover startups →
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Portfolio Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Investment Distribution Chart */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="border-b border-gray-100 dark:border-gray-700 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Investment Distribution</h3>
          </div>
          <div className="p-6">
            {portfolio && portfolio.length > 0 ? (
              <div className="h-[250px]">
                <Doughnut data={chartData} options={chartOptions} />
              </div>
            ) : (
              <div className="h-[250px] flex flex-col items-center justify-center text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400">No investment data</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Invest in startups to see distribution</p>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Recent Activities */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 md:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="border-b border-gray-100 dark:border-gray-700 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activities</h3>
          </div>
          <div className="p-6">
            {portfolio && portfolio.length > 0 ? (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {portfolio.slice(0, 4).map(investment => (
                  <div key={investment._id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-600">
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
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          )}
                        </div>
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          Invested in {investment.startup.startupName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          ${investment.amount.toLocaleString()} • {format(new Date(investment.date), 'MMM d, yyyy')}
                        </p>
                      </div>
                      
                      <div className="ml-3">
                        <Link 
                          to={`/startup/${investment.startup._id}`}
                          className="text-sm font-medium text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">No investment activity yet</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Start building your portfolio by investing in promising startups</p>
                <button
                  onClick={() => setActiveTab('startups')}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                  Discover Startups
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
      
      {/* Recommended Startups */}
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <div className="border-b border-gray-100 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recommended Opportunities</h3>
          <button
            onClick={() => setActiveTab('startups')}
            className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-medium flex items-center"
          >
            View all
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          {startups && startups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {startups.slice(0, 4).map(startup => (
                <div 
                  key={startup._id}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow p-4"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-600">
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
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-medium text-gray-900 dark:text-white truncate">
                          {startup.startupName}
                        </h4>
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                          {startup.stage}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {startup.shortDescription}
                      </p>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block">Funding</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">${startup.fundingGoal?.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block text-right">Progress</span>
                          <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                            <div 
                              className="bg-amber-500 h-1.5 rounded-full" 
                              style={{ width: `${Math.min((startup.currentFunding / startup.fundingGoal) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-between">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleExpressInterest(startup._id)}
                            className="inline-flex items-center px-2.5 py-1 border border-gray-300 dark:border-gray-600 shadow-sm text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                          >
                            Express Interest
                          </button>
                          
                          <button
                            onClick={() => handleInvestment(startup._id)}
                            className="inline-flex items-center px-2.5 py-1 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                          >
                            Invest
                          </button>
                        </div>
                        
                        <Link 
                          to={`/startup/${startup._id}`}
                          className="text-sm font-medium text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 flex items-center"
                        >
                          Details
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">No startup opportunities</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Check back later for new investment opportunities</p>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Investment Insights (optional, empty state for now) */}
      {metrics && Object.keys(metrics).length > 0 && (
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <div className="border-b border-gray-100 dark:border-gray-700 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Investment Insights</h3>
          </div>
          <div className="p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-base font-medium text-gray-900 dark:text-white mb-1">Investment insights coming soon</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">We're building AI-powered insights to help optimize your portfolio</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Overview;