import React from 'react';

const ExpertiseTag = ({ text }) => {
  return (
    <span className="inline-flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-0.5 rounded-full">
      {text}
    </span>
  );
};

export default ExpertiseTag;
