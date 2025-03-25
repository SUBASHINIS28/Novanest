import React from 'react';
import { motion } from 'framer-motion';

const MeetingModal = ({ meeting, onClose }) => {
  if (!meeting) return null;

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
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg overflow-hidden relative"
      >
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
          <h3 className="text-xl font-semibold">Meeting Details</h3>
          <p className="text-blue-100 mt-1">
            {new Date(meeting.startTime).toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            })}
          </p>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">With</h4>
            <div className="flex items-center">
              <img
                src={meeting.mentor?.profilePhoto || "/avatar-placeholder.png"}
                alt={meeting.mentor?.name}
                className="h-12 w-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
              />
              <div className="ml-3">
                <p className="font-medium text-gray-900 dark:text-white">{meeting.mentor?.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{meeting.mentor?.title || 'Mentor'}</p>
              </div>
            </div>
          </div>
          
          {meeting.agenda && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Agenda</h4>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{meeting.agenda}</p>
            </div>
          )}
          
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Meeting Link</h4>
            <a
              href={meeting.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-3 rounded-lg text-blue-600 dark:text-blue-400 hover:underline"
            >
              {meeting.meetingLink}
            </a>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              Close
            </button>
            
            <a
              href={meeting.meetingLink}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
              Join Meeting
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MeetingModal;