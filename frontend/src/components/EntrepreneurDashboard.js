import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Modal from './Modal';
import StartupForm from './StartupForm';
import ExpertiseForm from './ExpertiseForm';
import Chatbot from './Chatbot'; // Import Chatbot
import { UserContext } from '../UserContext';

const EntrepreneurDashboard = () => {
  const { user, loading } = useContext(UserContext);
  const [showForm, setShowForm] = useState(false);
  const [showExpertiseForm, setShowExpertiseForm] = useState(false);
  const [startups, setStartups] = useState([]);
  const [expertiseAreas, setExpertiseAreas] = useState([]);
  const [recommendedMentors, setRecommendedMentors] = useState([]);

  useEffect(() => {
    if (user) {
      setExpertiseAreas(user.expertiseAreas || []);
      const fetchStartups = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/entrepreneurs/${user.id}/startups`);
          setStartups(response.data);
        } catch (error) {
          console.error('Error fetching startups:', error);
        }
      };
      fetchStartups();

      const fetchRecommendedMentors = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/match/mentors`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setRecommendedMentors(response.data);
        } catch (error) {
          console.error('Error fetching recommended mentors:', error);
        }
      };
      fetchRecommendedMentors();
    }
  }, [user]);

  const handleCreateStartup = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);
  const handleSubmit = async (formData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/startups', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Startup submitted successfully');
      handleCloseForm();
      // Refresh the startups list
      const updatedStartupsResponse = await axios.get(`http://localhost:5000/api/entrepreneurs/${user.id}/startups`);
      setStartups(updatedStartupsResponse.data);
    } catch (error) {
      console.error('Error submitting startup:', error);
      alert(`Error submitting startup: ${error.response?.data || 'Unknown error'}`);
    }
  };

  const handleUpdateExpertise = async (updatedExpertiseAreas) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${user.id}/expertise`, { expertiseAreas: updatedExpertiseAreas });
      setExpertiseAreas(updatedExpertiseAreas);
      setShowExpertiseForm(false);
    } catch (error) {
      console.error('Error updating expertise areas:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Error loading user data</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-white shadow-md p-4 rounded-lg">
        <h2 className="text-3xl font-bold text-gray-800">Entrepreneur Dashboard</h2>
      </div>

      {/* Add Startup Button */}
      <button 
        onClick={handleCreateStartup}
        className="w-full md:w-auto bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md mb-6"
      >
        + Post Your Startup
      </button>

      <Modal show={showForm} onClose={handleCloseForm}>
        <StartupForm onSubmit={handleSubmit} onClose={handleCloseForm} />
      </Modal>

      {/* Startup Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {startups.map((startup) => (
          <div key={startup._id} className="bg-white shadow-lg rounded-lg p-4 transition-transform transform hover:scale-105">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{startup.name}</h3>
            <p className="text-gray-600 mb-3">{startup.description}</p>
            <Link to={`/startup/${startup._id}`} className="text-blue-500 font-semibold hover:underline">
              View Details →
            </Link>
          </div>
        ))}
      </div>

      {/* Update Expertise Section */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4">Update Expertise</h3>
        <button 
          onClick={() => setShowExpertiseForm(true)}
          className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200 shadow-md"
        >
          Update Expertise
        </button>
        <Modal show={showExpertiseForm} onClose={() => setShowExpertiseForm(false)}>
          <ExpertiseForm expertiseAreas={expertiseAreas} onSubmit={handleUpdateExpertise} onClose={() => setShowExpertiseForm(false)} />
        </Modal>
      </div>

      {/* Recommended Mentors Section */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4">Recommended Mentors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedMentors.map(({ mentor, matchPercentage }) => (
            mentor && (
              <div key={mentor._id} className="bg-white shadow-lg rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{mentor.name || 'N/A'}</h3>
                <p className="text-gray-600 mb-2">{mentor.profileDetails?.bio || 'N/A'}</p>
                <p className="text-gray-600 mb-2"><strong>Expertise:</strong> {mentor.mentorshipAreas.join(', ')}</p>
                <p className="text-gray-600 mb-2"><strong>Match Percentage:</strong> {matchPercentage ? matchPercentage.toFixed(2) : 'N/A'}%</p>
                <Link to={`/mentor/${mentor._id}`} className="text-blue-500 font-semibold hover:underline">
                  View Profile →
                </Link>
              </div>
            )
          ))}
        </div>
      </div>

      {/* AI Chatbot */}
      <Chatbot />
    </div>
  );
};

export default EntrepreneurDashboard;
