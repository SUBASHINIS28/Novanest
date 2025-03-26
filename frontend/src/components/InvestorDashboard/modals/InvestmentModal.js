import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

const InvestmentModal = ({ startup, onClose, onSubmit }) => {
  const [investmentData, setInvestmentData] = useState({
    amount: '',
    equity: '',
    note: '',
    date: format(new Date(), 'yyyy-MM-dd')
  });
  
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvestmentData(prev => ({
      ...prev,
      [name]: name === 'amount' || name === 'equity' ? value.replace(/[^0-9.]/g, '') : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  // Validate the form
  const validateForm = () => {
    const newErrors = {};
    
    if (!investmentData.amount) {
      newErrors.amount = 'Investment amount is required';
    } else if (parseFloat(investmentData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than zero';
    }
    
    if (investmentData.equity && (parseFloat(investmentData.equity) <= 0 || parseFloat(investmentData.equity) > 100)) {
      newErrors.equity = 'Equity percentage must be between 0 and 100';
    }
    
    if (!investmentData.date) {
      newErrors.date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setProcessing(true);
    
    try {
      const formatted = {
        ...investmentData,
        amount: parseFloat(investmentData.amount),
        equity: investmentData.equity ? parseFloat(investmentData.equity) : null
      };
      
      await onSubmit(formatted);
    } catch (error) {
      console.error('Error submitting investment:', error);
      setErrors(prev => ({ ...prev, submit: 'Failed to submit investment. Please try again.' }));
    } finally {
      setProcessing(false);
    }
  };
  
  // Overlay animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  // Modal animation variants
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
  
  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
      >
        <motion.div
          className="relative max-w-md w-full mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-500 px-6 py-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full -ml-10 -mb-10"></div>
            
            <h3 className="text-xl font-bold text-white relative z-10">Invest in {startup.startupName}</h3>
            <p className="text-amber-100 text-sm mt-1">{startup.industry} • {startup.stage}</p>

            {/* Close button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-1.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <div className="mb-6 flex items-start">
              <div className="flex-shrink-0 mr-4">
                <div className="h-14 w-14 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-600">
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
              
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-medium text-gray-900 dark:text-white truncate mb-1">
                  {startup.shortDescription || 'Innovative solution in the ' + startup.industry + ' space'}
                </h4>
                
                {startup.fundingGoal && (
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                      ${startup.fundingGoal.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">funding goal</span>
                    
                    {startup.equityOffered && (
                      <>
                        <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          {startup.equityOffered}% equity
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Investment Form */}
            <form onSubmit={handleSubmit}>
              {errors.submit && (
                <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm rounded">
                  {errors.submit}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Investment Amount (USD)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
                    </div>
                    <input
                      type="text"
                      name="amount"
                      id="amount"
                      className={`pl-7 block w-full shadow-sm rounded-md ${
                        errors.amount 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-300 dark:border-gray-600 focus:ring-amber-500 focus:border-amber-500'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                      placeholder="10000"
                      value={investmentData.amount}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="equity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Equity Percentage (optional)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="equity"
                      id="equity"
                      className={`block w-full shadow-sm rounded-md ${
                        errors.equity 
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-300 dark:border-gray-600 focus:ring-amber-500 focus:border-amber-500'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                      placeholder="5"
                      value={investmentData.equity}
                      onChange={handleChange}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400 sm:text-sm">%</span>
                    </div>
                  </div>
                  {errors.equity && (
                    <p className="mt-1 text-sm text-red-600">{errors.equity}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Investment Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    className={`block w-full shadow-sm rounded-md ${
                      errors.date 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 dark:border-gray-600 focus:ring-amber-500 focus:border-amber-500'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                    value={investmentData.date}
                    onChange={handleChange}
                  />
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="note" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Note (optional)
                  </label>
                  <textarea
                    name="note"
                    id="note"
                    rows="3"
                    className="block w-full shadow-sm border-gray-300 dark:border-gray-600 rounded-md focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Any additional details about your investment"
                    value={investmentData.note}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                  disabled={processing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 flex items-center"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>Submit Investment</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InvestmentModal;