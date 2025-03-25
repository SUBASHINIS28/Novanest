import React, { useState } from 'react';
import { motion } from 'framer-motion';

const COMMON_EXPERTISE = [
  'Web Development', 'Mobile Development', 'UI/UX Design', 'Data Science',
  'Machine Learning', 'Blockchain', 'Digital Marketing', 'E-commerce',
  'Fintech', 'Healthtech', 'SaaS', 'Product Management', 'Business Strategy',
  'Growth Hacking', 'Sales', 'Fundraising', 'Legal', 'Finance',
  'Operations', 'Human Resources', 'Supply Chain'
];

const ExpertiseFormModal = ({ existingExpertise = [], onClose, onSubmit }) => {
  const [expertise, setExpertise] = useState([...existingExpertise]);
  const [newExpertise, setNewExpertise] = useState('');
  const [commonVisible, setCommonVisible] = useState(false);

  const handleAddExpertise = () => {
    if (newExpertise.trim() && !expertise.includes(newExpertise.trim())) {
      setExpertise(prev => [...prev, newExpertise.trim()]);
      setNewExpertise('');
    }
  };

  const handleRemoveExpertise = (index) => {
    setExpertise(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddCommon = (item) => {
    if (!expertise.includes(item)) {
      setExpertise(prev => [...prev, item]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(expertise);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden relative"
      >
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
          <h3 className="text-xl font-semibold">Update Your Expertise</h3>
          <p className="text-blue-100 mt-1">Add areas of expertise to help find matching mentors</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Your Areas of Expertise
            </label>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {expertise.map((item, index) => (
                <div 
                  key={index}
                  className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full flex items-center"
                >
                  <span>{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveExpertise(index)}
                    className="ml-1.5 text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newExpertise}
                onChange={(e) => setNewExpertise(e.target.value)}
                placeholder="Add your expertise"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <button
                type="button"
                onClick={handleAddExpertise}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex-shrink-0"
              >
                Add
              </button>
            </div>
          </div>

          <div className="mb-6">
            <button
              type="button"
              onClick={() => setCommonVisible(!commonVisible)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
            >
              {commonVisible ? 'Hide suggestions' : 'Show suggested expertise'}
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-1 transition-transform ${commonVisible ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {commonVisible && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Common Areas of Expertise
              </label>
              <div className="flex flex-wrap gap-2">
                {COMMON_EXPERTISE.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleAddCommon(item)}
                    className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded-full"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-3 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ExpertiseFormModal;