import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const StartupProfile = () => {
  const { id } = useParams();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStartup = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/startups/${id}`);
        setStartup(response.data);
      } catch (error) {
        console.error('Error fetching startup details:', error);
      }
      setLoading(false);
    };

    fetchStartup();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!startup) {
    return <div>Error loading startup details</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-2xl font-bold mb-4">{startup.name}</h2>
      <p><strong>Industry:</strong> {startup.industry}</p>
      <p><strong>Description:</strong> {startup.description}</p>
      <p><strong>Funding Needed:</strong> {startup.fundingNeeded}</p>
      <a href={startup.pitchDeckUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
        View Pitch Deck
      </a>
      <div className="mt-4">
        <h3 className="text-xl font-bold">Founder Info</h3>
        <p><strong>Name:</strong> {startup.createdBy.name}</p>
        <p><strong>Email:</strong> {startup.createdBy.email}</p>
        <p><strong>Experience:</strong> {startup.createdBy.profileDetails.experience}</p>
        <p><strong>Bio:</strong> {startup.createdBy.profileDetails.bio}</p>
        <img src={startup.createdBy.profileDetails.profilePhoto} alt="Profile" className="w-16 h-16 rounded-full" />
      </div>
    </div>
  );
};

export default StartupProfile;