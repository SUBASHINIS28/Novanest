import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Portfolio = ({ portfolio, isLoading }) => {
  const [sortBy, setSortBy] = useState('date-desc');
  
  // Calculate portfolio metrics
  const metrics = useMemo(() => {
    if (!portfolio || portfolio.length === 0) return {
      totalInvested: 0,
      averageInvestment: 0,
      startupCount: 0,
      investmentsByIndustry: {}
    };
    
    // Total amount invested across all startups
    const totalInvested = portfolio.reduce((sum, investment) => sum + investment.amount, 0);
    
    // Average investment amount
    const averageInvestment = totalInvested / portfolio.length;
    
    // Count of startups invested in
    const startupCount = new Set(portfolio.map(investment => investment.startup._id)).size;
    
    // Group investments by industry for chart
    const investmentsByIndustry = portfolio.reduce((acc, investment) => {
      const industry = investment.startup.industry || 'Other';
      if (!acc[industry]) {
        acc[industry] = 0;
      }
      acc[industry] += investment.amount;
      return acc;
    }, {});
    
    return {
      totalInvested,
      averageInvestment,
      startupCount,
      investmentsByIndustry
    };
  }, [portfolio]);
  
  // Prepare chart data
  const chartData = useMemo(() => {
    if (!metrics.investmentsByIndustry) return {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1
      }]
    };
    
    // Color palette for chart
    const colorPalette = [
      'rgba(255, 99, 132, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(153, 102, 255, 0.7)',
      'rgba(255, 159, 64, 0.7)',
      'rgba(255, 99, 255, 0.7)',
      'rgba(54, 162, 64, 0.7)',
    ];
    
    const industries = Object.keys(metrics.investmentsByIndustry);
    const amounts = industries.map(industry => metrics.investmentsByIndustry[industry]);
    
    return {
      labels: industries,
      datasets: [{
        data: amounts,
        backgroundColor: industries.map((_, index) => colorPalette[index % colorPalette.length]),
        borderColor: industries.map((_, index) => colorPalette[index % colorPalette.length].replace('0.7', '1')),
        borderWidth: 1
      }]
    };
  }, [metrics.investmentsByIndustry]);
  
  // Sort investments
  const sortedInvestments = useMemo(() => {
    if (!portfolio) return [];
    
    return [...portfolio].sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date) - new Date(a.date);
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });
  }, [portfolio, sortBy]);
  
  // Chart options
  const chartOptions = {
    responsive: true,
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
  
  // Loading state with skeleton UI
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="h-28 bg-white dark:bg-gray-800 rounded-xl shadow-sm"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-white dark:bg-gray-800 rounded-xl shadow-sm md:col-span-1"></div>
          <div className="h-64 bg-white dark:bg-gray-800 rounded-xl shadow-sm md:col-span-2"></div>
        </div>
        <div className="h-96 bg-white dark:bg-gray-800 rounded-xl shadow-sm"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Investment Portfolio</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Track and manage your startup investments</p>
      </div>
      
      {/* Portfolio metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Total invested */}
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
                ${metrics.totalInvested.toLocaleString()}
              </h3>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/30 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Average investment */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 h-full"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Investment</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                ${Math.round(metrics.averageInvestment).toLocaleString()}
              </h3>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Startups count */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 h-full"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Startups Invested</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {metrics.startupCount}
              </h3>
            </div>
            <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Portfolio Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Industry Distribution Chart */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 md:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="border-b border-gray-100 dark:border-gray-700 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Investment Distribution</h3>
          </div>
          <div className="p-6">
            {Object.keys(metrics.investmentsByIndustry).length > 0 ? (
              <div className="h-[250px] flex items-center justify-center">
                <Doughnut data={chartData} options={chartOptions} />
              </div>
            ) : (
              <div className="h-[250px] flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  No investment data available
                </p>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Recent Activity */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 md:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="border-b border-gray-100 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Investments</h3>
          </div>
          <div className="p-6">
            {portfolio && portfolio.length > 0 ? (
              <div className="space-y-4">
                {sortedInvestments.slice(0, 3).map(investment => (
                  <div key={investment._id} className="flex items-start">
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
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {investment.startup.startupName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ${investment.amount.toLocaleString()} · {investment.equity && `${investment.equity}% equity`} · {format(new Date(investment.date), 'MMM d, yyyy')}
                      </p>
                    </div>
                    
                    <Link 
                      to={`/startup/${investment.startup._id}`}
                      className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 text-sm font-medium ml-4 whitespace-nowrap"
                    >
                      View Startup
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500 dark:text-gray-400 mb-2">No recent investments</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
      
      {/* Portfolio List */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <div className="border-b border-gray-100 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All Investments</h3>
          <div>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>
        </div>
        
        {portfolio && portfolio.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Startup
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Industry
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Equity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {sortedInvestments.map(investment => (
                  <tr 
                    key={investment._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-600">
                          {investment.startup.logoUrl ? (
                            <img 
                              src={investment.startup.logoUrl} 
                              alt={investment.startup.startupName} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {investment.startup.startupName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {investment.startup.stage}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                        {investment.startup.industry}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 font-medium">
                      ${investment.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {investment.equity ? `${investment.equity}%` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {format(new Date(investment.date), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        to={`/startup/${investment.startup._id}`}
                        className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No investments yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">You haven't made any investments in startups.</p>
            <Link
              to="/startups"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
              </svg>
              Discover Startups
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Portfolio;