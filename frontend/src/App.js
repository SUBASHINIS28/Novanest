import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import Profile from './Profile';
import StartupProfile from './components/StartupProfile';
import HomePage from './components/HomePage';
import EntrepreneurDashboard from './components/EntrepreneurDashboard';
import InvestorDashboard from './components/InvestorDashboard';
import MentorDashboard from './components/MentorDashboard';
import MentorProfile from './components/MentorProfile';
import EntrepreneurProfile from './components/EntrepreneurProfile'; // Import EntrepreneurProfile
import { UserProvider } from './UserContext';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/startup/:id" element={<StartupProfile />} />
            <Route path="/entrepreneur-dashboard" element={<EntrepreneurDashboard />} />
            <Route path="/investor-dashboard" element={<InvestorDashboard />} />
            <Route path="/mentor-dashboard" element={<MentorDashboard />} />
            <Route path="/mentor/:id" element={<MentorProfile />} />
            <Route path="/entrepreneur/:id" element={<EntrepreneurProfile />} /> {/* Add EntrepreneurProfile route */}
            <Route path="/" element={<HomePage />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;