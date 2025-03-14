import React from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const Overview = ({ 
  metrics, 
  activeMentorships = [], 
  matchedEntrepreneurs = [], 
  setActiveTab, 
  handleJoinMeeting 
}) => {
  return (
    <>
      {/* Metrics Overview */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Your Mentor Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Active Mentees */}
          <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-blue-500">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Active Mentees</h3>
            <p className="text-2xl font-bold text-gray-800">{metrics.totalMentees}</p>
            <div className="mt-2 text-xs text-blue-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              View active mentees
            </div>
          </div>

          {/* Mentor Requests */}
          <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-green-500">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Mentor Requests</h3>
            <p className="text-2xl font-bold text-gray-800">{metrics.activeRequests}</p>
            <div className="mt-2 text-xs text-blue-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              View pending requests
            </div>
          </div>
          
          {/* Total Sessions */}
          <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-purple-500">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Sessions</h3>
            <p className="text-2xl font-bold text-gray-800">{metrics.mentorshipSessions}</p>
            <div className="mt-2 text-xs text-purple-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              Schedule a session
            </div>
          </div>
          
          {/* Impact Score */}
          <div className="bg-white rounded-lg shadow-sm p-5 border-l-4 border-yellow-500">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Impact Score</h3>
            <p className="text-2xl font-bold text-gray-800">{metrics.impactScore}</p>
            <div className="mt-2 text-xs text-yellow-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Based on activity
            </div>
          </div>
        </div>
      </section>
              
      {/* Recent Activity Section */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4">
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {activeMentorships.slice(0, 3).map((mentorship, idx) => (
                  <li key={mentorship._id || idx} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img 
                          className="h-10 w-10 rounded-full"
                          src={mentorship.mentee?.profilePhoto || "/avatar-placeholder.png"}
                          alt=""
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {mentorship.mentee?.name || 'Entrepreneur'}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          Session scheduled for {format(new Date(mentorship.nextSession || Date.now()), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div>
                        <button 
                          className="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
                          onClick={() => handleJoinMeeting(mentorship)}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
                {activeMentorships.length === 0 && (
                  <li className="py-4">
                    <p className="text-center text-gray-500">No recent activity</p>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>
              
      {/* Potential Mentee Matches Section */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Potential Mentee Matches</h2>
          <button onClick={() => setActiveTab('mentees')} className="text-blue-600 text-sm hover:underline">View All</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {matchedEntrepreneurs.slice(0, 3).map(({ entrepreneur, matchPercentage }) => (
            entrepreneur && (
              <div key={entrepreneur._id} className="bg-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg p-5 border border-gray-100">
                <div className="flex items-start">
                  <img
                    src={entrepreneur.profileDetails?.profilePhoto || "/avatar-placeholder.png"}
                    alt={entrepreneur.name} 
                    className="h-12 w-12 rounded-full mr-4 object-cover"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = "/avatar-placeholder.png";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{entrepreneur.name || 'N/A'}</h3>
                    <div className="flex items-center mb-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${matchPercentage || 0}%` }}></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-600 whitespace-nowrap">{matchPercentage?.toFixed(0) || 0}% Match</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">{entrepreneur.profileDetails?.bio || 'No bio available'}</p>
                <div className="mt-4 flex justify-between">
                  <Link to={`/entrepreneur/${entrepreneur._id}`} className="text-blue-600 text-sm font-medium hover:text-blue-800">
                    View Profile
                  </Link>
                  <button className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-xs font-medium rounded text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Offer Mentorship
                  </button>
                </div>
              </div>
            )
          ))}
          {matchedEntrepreneurs.length === 0 && (
            <div className="col-span-full bg-white shadow-sm rounded-lg p-6 text-center">
              <p className="text-gray-500">No potential matches found based on your expertise.</p>
              <button className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Complete Your Profile
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Overview;