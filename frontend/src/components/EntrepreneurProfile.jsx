import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EntrepreneurProfile = () => {
  const { id } = useParams();
  const [entrepreneur, setEntrepreneur] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntrepreneur = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setEntrepreneur(response.data);
      } catch (error) {
        console.error('Error fetching entrepreneur details:', error);
      }
      setLoading(false);
    };

    fetchEntrepreneur();
  }, [id]);

  const handleRequestMentor = () => {
    // Implement the logic to send a mentorship request
    alert('Mentorship request sent!');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!entrepreneur) {
    return <div>Error loading entrepreneur details</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-2xl font-bold mb-4">{entrepreneur.name}</h2>
      <p><strong>Bio:</strong> {entrepreneur.profileDetails.bio}</p>
      <p><strong>Startup:</strong> {entrepreneur.startupDetails?.name || 'N/A'}</p>
      <img src={entrepreneur.profileDetails.profilePhoto} alt="Profile" className="w-16 h-16 rounded-full" />
      <button onClick={handleRequestMentor} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
        Request Mentor
      </button>
    </div>
  );
};

export default EntrepreneurProfile;