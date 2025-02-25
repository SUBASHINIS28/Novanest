import React, { useState, useEffect, useContext } from 'react';
import { useLocation, Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../UserContext';

const Messages = () => {
  const location = useLocation();
  const { user, loading } = useContext(UserContext);
  const [recipient, setRecipient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingRecipient, setLoadingRecipient] = useState(true);

  // Get the recipient ID from URL query parameter
  const queryParams = new URLSearchParams(location.search);
  const recipientId = queryParams.get('to');

  useEffect(() => {
    // Fetch recipient data
    const fetchRecipient = async () => {
      if (recipientId) {
        try {
          const response = await axios.get(`http://localhost:5000/api/users/${recipientId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setRecipient(response.data);
        } catch (error) {
          console.error('Error fetching recipient:', error);
        } finally {
          setLoadingRecipient(false);
        }
      }
    };

    // Fetch messages between current user and recipient
    const fetchMessages = async () => {
      if (recipientId && user) {
        try {
          const response = await axios.get(`http://localhost:5000/api/messages/${recipientId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setMessages(response.data);
          
          // Mark messages as read
          axios.put(`http://localhost:5000/api/messages/read/${recipientId}`, {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      }
    };

    fetchRecipient();
    fetchMessages();
  }, [recipientId, user]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && recipientId && user) {
      try {
        const response = await axios.post(
          'http://localhost:5000/api/messages',
          {
            recipient: recipientId,
            content: newMessage
          },
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        );
        
        // Add the new message to the messages state
        setMessages([...messages, response.data]);
        // Clear the input field
        setNewMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  if (loading || loadingRecipient) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If no recipient ID was provided
  if (!recipientId) {
    return (
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">Messages</h2>
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <p className="text-gray-700 text-lg">Select a user to message</p>
        </div>
      </div>
    );
  }

  const getProfileLink = () => {
    if (!recipient) return null;
    
    if (recipient.role === 'entrepreneur') {
      return `/entrepreneur/${recipient._id}`;
    } else if (recipient.role === 'mentor') {
      return `/mentor/${recipient._id}`;
    } else if (recipient.role === 'investor') {
      return `/investor/${recipient._id}`;
    }
    return null;
  };

  const profileLink = getProfileLink();

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Messages</h2>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        {recipient ? (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                {recipient.profileDetails?.profilePhoto ? (
                  <img 
                    src={recipient.profileDetails.profilePhoto} 
                    alt={recipient.name} 
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  recipient.name.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{recipient.name}</h3>
                <p className="text-sm text-gray-600 capitalize">{recipient.role}</p>
              </div>
            </div>
            
            {profileLink && (
              <Link 
                to={profileLink}
                className="text-primary hover:underline"
              >
                View Profile
              </Link>
            )}
          </div>
        ) : (
          <p className="text-gray-700">User not found</p>
        )}
      </div>
      
      {/* Messages Container */}
      <div className="bg-white rounded-lg shadow-lg mb-4">
        <div className="h-96 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <p className="text-center text-gray-400 py-4">No messages yet. Start a conversation!</p>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`mb-3 max-w-3/4 ${
                  message.sender === user.id 
                    ? 'ml-auto bg-primary rounded-lg p-3 text-white' 
                    : 'bg-gray-200 rounded-lg p-3 text-gray-800'
                }`}
              >
                <p>{message.content}</p>
                <p className="text-xs opacity-75 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Message Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="form-input flex-grow"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
        />
        <button 
          onClick={handleSendMessage}
          className="btn-primary"
          disabled={!newMessage.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Messages;