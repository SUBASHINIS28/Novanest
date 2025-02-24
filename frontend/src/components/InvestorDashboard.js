import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InvestorDashboard = () => {
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await axios.get('http://localhost:5000/investment-opportunities');
        setOpportunities(response.data);
      } catch (error) {
        console.error('Error fetching investment opportunities:', error);
      }
    };

    fetchOpportunities();
  }, []);

  return (
    <div>
      <h2>Investor Dashboard</h2>
      <div>
        {opportunities.map((opportunity) => (
          <div key={opportunity.id} className="bg-white shadow-md rounded-lg p-4 mb-4">
            <h3 className="text-xl font-bold">{opportunity.name}</h3>
            <p className="text-gray-600">{opportunity.description}</p>
            <a href={opportunity.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
              View Details
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvestorDashboard;