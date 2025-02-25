import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import Profile from './Profile';
import StartupProfile from './components/StartupProfile';
import HomePage from './components/HomePage';
import EntrepreneurDashboard from './components/EntrepreneurDashboard';
import InvestorDashboard from './components/InvestorDashboard';
import MentorDashboard from './components/MentorDashboard';
import MentorProfile from './components/MentorProfile';
import EntrepreneurProfile from './components/EntrepreneurProfile';
import PitchDeck from './components/PitchDeck';
import Messages from './components/Messages';
import NavBar from './components/NavBar';
import StartupSearch from './components/StartupSearch';
import NotificationCenter from './components/NotificationCenter';
import Settings from './components/Settings';
import { UserProvider } from './UserContext';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <>
      <NavBar />
      {children}
    </>
  );
};

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<><NavBar /><Profile /></>} />
            <Route path="/startup/:id" element={<><NavBar /><StartupProfile /></>} />
            <Route path="/entrepreneur-dashboard" element={<><NavBar /><EntrepreneurDashboard /></>} />
            <Route path="/investor-dashboard" element={<><NavBar /><InvestorDashboard /></>} />
            <Route path="/mentor-dashboard" element={<><NavBar /><MentorDashboard /></>} />
            <Route path="/mentor/:id" element={<><NavBar /><MentorProfile /></>} />
            <Route path="/entrepreneur/:id" element={<><NavBar /><EntrepreneurProfile /></>} />
            <Route path="/pitchdeck" element={<><NavBar /><PitchDeck /></>} />
            <Route path="/messages" element={<><NavBar /><Messages /></>} />
            <Route path="/startups/search" element={
              <ProtectedRoute>
                <StartupSearch />
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <NotificationCenter />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;