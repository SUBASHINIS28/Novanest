import React from 'react';
import { motion } from 'framer-motion';
import StartupForm from '../../StartupForm';

const StartupFormModal = ({ onSubmit, onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        <div className="sticky top-0 z-10 flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-4 border-b border-gray-200 dark:border-gray-600">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Startup</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <StartupForm 
            onSubmit={onSubmit} 
            onClose={onClose}
            initialData={{
              startupName: '',
              tagline: '',
              website: '',
              location: '',
              industry: '',
              stage: 'Idea',
              problemStatement: '',
              solution: '',
              businessModel: '',
              targetAudience: '',
              businessModelType: '',
              fundingGoal: '',
              useOfFunds: '',
              equityOffered: '',
              founderBackground: '',
            }}
            isEditing={false}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StartupFormModal;