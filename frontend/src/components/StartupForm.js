import React, { useState, useEffect } from 'react';

const StartupForm = ({ initialData = {}, onSubmit, onClose, isEditing = false }) => {
  const [formData, setFormData] = useState({
    startupName: '',
    tagline: '',
    industry: '',
    stage: 'Idea',
    location: '',
    website: '',
    problemStatement: '',
    solution: '',
    businessModel: '',
    targetAudience: '',
    businessModelType: '',
    fundingGoal: '',
    useOfFunds: '',
    equityOffered: '',
    founderBackground: '',
    teamMembers: '',
    mentorsAdvisors: '',
    competitors: '',
    marketSize: '',
    customerValidation: '',
    goToMarketStrategy: '',
    currentCustomers: '',
    revenueModel: '',
    currentRevenue: '',
    burnRate: '',
    previousFunding: '',
    projectedGrowth: '',
    pitchDeck: null,
    demoVideoURL: '',
    // Add other fields as needed
  });

  // Populate form with existing data if provided
  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      setFormData(prevData => ({
        ...prevData,
        ...initialData,
        pitchDeck: null // File inputs can't be prefilled
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prevData => ({ ...prevData, [e.target.name]: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formPayload = new FormData();
    
    // Append all text fields
    Object.keys(formData).forEach(key => {
      if (key !== 'pitchDeck' && formData[key]) {
        formPayload.append(key, formData[key]);
      }
    });
    
    // Append file if selected
    if (formData.pitchDeck) {
      formPayload.append('pitchDeck', formData.pitchDeck);
    }
    
    onSubmit(formPayload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Startup Name*
          </label>
          <input
            type="text"
            name="startupName"
            value={formData.startupName}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tagline
          </label>
          <input
            type="text"
            name="tagline"
            value={formData.tagline}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Industry*
          </label>
          <select
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Select Industry</option>
            <option value="SaaS">SaaS</option>
            <option value="Fintech">Fintech</option>
            <option value="Healthtech">Healthtech</option>
            <option value="E-commerce">E-commerce</option>
            <option value="Edtech">Edtech</option>
            <option value="AI/ML">AI/ML</option>
            <option value="Blockchain">Blockchain</option>
            <option value="Mobile">Mobile</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Stage*
          </label>
          <select
            name="stage"
            value={formData.stage}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="Idea">Idea</option>
            <option value="Prototype">Prototype</option>
            <option value="MVP">MVP</option>
            <option value="Pre-Seed">Pre-Seed</option>
            <option value="Seed">Seed</option>
            <option value="Series A">Series A</option>
            <option value="Series B+">Series B+</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Problem & Solution */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Problem Statement*
        </label>
        <textarea
          name="problemStatement"
          value={formData.problemStatement}
          onChange={handleChange}
          required
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Solution
        </label>
        <textarea
          name="solution"
          value={formData.solution}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        ></textarea>
      </div>

      {/* Funding Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Funding Goal
          </label>
          <input
            type="text"
            name="fundingGoal"
            value={formData.fundingGoal}
            onChange={handleChange}
            placeholder="e.g., 250000"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Equity Offered (%)
          </label>
          <input
            type="text"
            name="equityOffered"
            value={formData.equityOffered}
            onChange={handleChange}
            placeholder="e.g., 10"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Website & Video */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Website
          </label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://yourwebsite.com"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Demo Video URL
          </label>
          <input
            type="url"
            name="demoVideoURL"
            value={formData.demoVideoURL}
            onChange={handleChange}
            placeholder="https://youtube.com/watch?v=..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Pitch Deck */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Pitch Deck
        </label>
        <input
          type="file"
          name="pitchDeck"
          onChange={handleFileChange}
          accept=".pdf,.ppt,.pptx"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
        <p className="text-xs text-gray-500 mt-1">Upload your pitch deck (PDF or PowerPoint)</p>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          {isEditing ? 'Update Startup' : 'Create Startup'}
        </button>
      </div>
    </form>
  );
};

export default StartupForm;