import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MentorProfile = () => {
  const { id } = useParams();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setMentor(response.data);
      } catch (error) {
        console.error('Error fetching mentor details:', error);
      }
      setLoading(false);
    };

    fetchMentor();
  }, [id]);

  const handleRequestMentorship = () => {
    // Implement the logic to send a mentorship request
    alert('Mentorship request sent!');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!mentor) {
    return <div>Error loading mentor details</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-2xl font-bold mb-4">{mentor.name}</h2>
      <p><strong>Bio:</strong> {mentor.profileDetails.bio}</p>
      <p><strong>Expertise:</strong> {mentor.mentorshipAreas.join(', ')}</p>
      <img src={mentor.profileDetails.profilePhoto} alt="Profile" className="w-16 h-16 rounded-full" />
      <button onClick={handleRequestMentorship} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
        Request Mentorship
      </button>
    </div>
  );
};

export default MentorProfile;