import React, { useContext } from 'react';
import { UserContext } from './UserContext';
import EntrepreneurDashboard from './components/EntrepreneurDashboard';
import InvestorDashboard from './components/InvestorDashboard';
import MentorDashboard from './components/MentorDashboard';
import ProfileCard from './components/ProfileCard';
import Settings from './components/Settings';
import Chat from './components/Chat';
import Dashboard from './components/Dashboard';

const Profile = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Error loading user data</div>;
  }

  return (
    <Dashboard>
      <ProfileCard profile={user} />
      <Settings />
      <Chat />
      {user.role === 'entrepreneur' && <EntrepreneurDashboard />}
      {user.role === 'investor' && <InvestorDashboard />}
      {user.role === 'mentor' && <MentorDashboard />}
    </Dashboard>
  );
};

export default Profile;