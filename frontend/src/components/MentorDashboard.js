import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MentorDashboard = () => {
  const [matchedEntrepreneurs, setMatchedEntrepreneurs] = useState([]);

  useEffect(() => {
    const fetchMatchedEntrepreneurs = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/match/mentees`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        console.log('API Response:', response.data); // Log the API response
        setMatchedEntrepreneurs(response.data);
      } catch (error) {
        console.error('Error fetching matched entrepreneurs:', error);
      }
    };

    fetchMatchedEntrepreneurs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Mentor Dashboard</h2>

      {/* Potential Mentees Section */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4">Potential Mentees</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matchedEntrepreneurs.map(({ entrepreneur, matchPercentage }) => (
            entrepreneur && (
              <div key={entrepreneur._id} className="bg-white shadow-lg rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{entrepreneur.name || 'N/A'}</h3>
                <p className="text-gray-600 mb-2">{entrepreneur.profileDetails?.bio || 'N/A'}</p>
                <p className="text-gray-600 mb-2"><strong>Startup:</strong> {entrepreneur.startupDetails?.name || 'N/A'}</p>
                <p className="text-gray-600 mb-2"><strong>Match Percentage:</strong> {matchPercentage ? matchPercentage.toFixed(2) : 'N/A'}%</p>
                <Link to={`/entrepreneur/${entrepreneur._id}`} className="text-blue-500 font-semibold hover:underline">
                  View Profile →
                </Link>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;