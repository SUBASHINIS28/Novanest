import React, { useState } from 'react';

const StartupForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    description: '',
    fundingNeeded: '',
    pitchDeck: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      pitchDeck: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4">Submit Your Startup</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Startup Name</label>
          <input
            type="text"
            name="name"
            className="w-full p-2 border rounded"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Industry</label>
          <input
            type="text"
            name="industry"
            className="w-full p-2 border rounded"
            value={formData.industry}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            className="w-full p-2 border rounded"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Funding Needed</label>
          <input
            type="text"
            name="fundingNeeded"
            className="w-full p-2 border rounded"
            value={formData.fundingNeeded}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Upload Pitch Deck (PDF/Video)</label>
          <input
            type="file"
            name="pitchDeck"
            className="w-full p-2 border rounded"
            onChange={handleFileChange}
            required
          />
        </div>
        <div className="flex justify-end">
          <button type="button" onClick={onClose} className="mr-4 bg-gray-500 text-white py-2 px-4 rounded">
            Cancel
          </button>
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default StartupForm;