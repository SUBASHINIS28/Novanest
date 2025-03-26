import React, { useState, useContext, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import axios from 'axios';

const Profile = ({ showNotification }) => {
  const { user, refreshUserData } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.profileDetails?.bio || '',
    company: user?.profileDetails?.company || '',
    title: user?.profileDetails?.title || '',
    website: user?.profileDetails?.website || '',
    linkedIn: user?.profileDetails?.socialLinks?.linkedIn || '',
    twitter: user?.profileDetails?.socialLinks?.twitter || '',
    investmentFocus: user?.profileDetails?.investmentFocus || '',
    investmentRange: user?.profileDetails?.investmentRange || '',
    previousInvestments: user?.profileDetails?.previousInvestments || ''
  });
  
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(user?.profileDetails?.profilePhoto || null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const fileInputRef = useRef(null);
  
  const [profileSettings, setProfileSettings] = useState({
    visibility: user?.profileSettings?.visibility !== false,
    emailNotifications: user?.profileSettings?.emailNotifications !== false,
    interestAlerts: user?.profileSettings?.interestAlerts !== false
  });

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.profileDetails?.bio || '',
        company: user.profileDetails?.company || '',
        title: user.profileDetails?.title || '',
        website: user.profileDetails?.website || '',
        linkedIn: user.profileDetails?.socialLinks?.linkedIn || '',
        twitter: user.profileDetails?.socialLinks?.twitter || '',
        investmentFocus: user.profileDetails?.investmentFocus || '',
        investmentRange: user.profileDetails?.investmentRange || '',
        previousInvestments: user.profileDetails?.previousInvestments || ''
      });
      setPhotoPreview(user.profileDetails?.profilePhoto || null);
      setProfileSettings({
        visibility: user?.profileSettings?.visibility !== false,
        emailNotifications: user?.profileSettings?.emailNotifications !== false,
        interestAlerts: user?.profileSettings?.interestAlerts !== false
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 1MB)
    if (file.size > 1024 * 1024) {
      showNotification('Image must be smaller than 1MB', 'error');
      return;
    }

    setProfilePhoto(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    
    try {
      // Update user profile
      const profileData = {
        name: formData.name,
        profileDetails: {
          bio: formData.bio,
          company: formData.company,
          title: formData.title,
          website: formData.website,
          investmentFocus: formData.investmentFocus,
          investmentRange: formData.investmentRange,
          previousInvestments: formData.previousInvestments,
          socialLinks: {
            linkedIn: formData.linkedIn,
            twitter: formData.twitter
          }
        }
      };

      await axios.put(
        `http://localhost:5000/api/users/${user._id}`, 
        profileData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // If there's a new profile photo, upload it separately
      if (profilePhoto) {
        const photoFormData = new FormData();
        photoFormData.append('profilePhoto', profilePhoto);

        await axios.put(
          `http://localhost:5000/api/users/${user._id}`, 
          photoFormData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      }

      // Refresh user data
      await refreshUserData();
      
      setIsEditing(false);
      setSaveSuccess(true);
      showNotification('Profile updated successfully!', 'success');
      
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data || 
                      (typeof error.message === 'string' ? error.message : 
                      'Failed to update profile. Please try again.');
      setSaveError(errorMessage);
      showNotification('Error updating profile', 'error');
    } finally {
      setSaving(false);
    }
  };
  
  // Handle settings changes
  const updateProfileSettings = async (newSettings) => {
    try {
      setSaving(true);
      
      await axios.put(
        `http://localhost:5000/api/users/${user._id}/settings`, 
        newSettings,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      showNotification('Settings updated successfully', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveError('Failed to save settings. Please try again.');
      showNotification('Failed to update settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your investor profile and preferences</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Column */}
        <div className="lg:col-span-2">
          {/* Profile Information Card */}
          <motion.div 
            className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="border-b border-gray-100 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Investor Profile</h3>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="inline-block px-1.5 py-0.5 text-xs font-medium rounded bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-800/40 transition-colors w-auto border border-amber-100 dark:border-amber-800/50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5 inline-block" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Edit
                </button>
              )}
            </div>
            
            {isEditing ? (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="h-28 w-28 rounded-full p-1 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 shadow-xl">
                      <div className="rounded-full w-full h-full overflow-hidden border-2 border-white dark:border-gray-800">
                        <img
                          src={photoPreview || "/avatar-placeholder.png"}
                          alt="Profile"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/avatar-placeholder.png";
                          }}
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="absolute bottom-0 right-0 bg-blue-600 dark:bg-blue-500 text-white p-1.5 rounded-full hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">Upload a professional profile photo</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 text-center mb-4">JPG, GIF or PNG. 1MB max.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Email cannot be changed</p>
                  </div>
                </div>
                
                <div className="mt-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Professional Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Share your background, investment philosophy, and expertise..."
                  ></textarea>
                </div>
                
                <div className="mt-5 flex flex-col md:flex-row gap-5">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Company/Organization
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="e.g. Venture Partners"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Title/Position
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="e.g. Managing Partner"
                    />
                  </div>
                </div>
                
                <div className="mt-5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6">
                  <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-4">Investment Details</h4>
                  
                  <div className="mt-5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Investment Focus
                    </label>
                    <textarea
                      name="investmentFocus"
                      value={formData.investmentFocus}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="e.g. FinTech, Healthcare, Early Stage"
                    ></textarea>
                  </div>
                  
                  <div className="mt-5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Investment Range
                    </label>
                    <input
                      type="text"
                      name="investmentRange"
                      value={formData.investmentRange}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="e.g. $25k - $250k"
                    />
                  </div>
                  
                  <div className="mt-5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Previous Investments
                    </label>
                    <textarea
                      name="previousInvestments"
                      value={formData.previousInvestments}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="List your notable previous investments"
                    ></textarea>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6">
                  <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-4">Social Links</h4>
                  
                  <div className="mt-5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      LinkedIn Profile
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 sm:text-sm">
                        linkedin.com/in/
                      </span>
                      <input
                        type="text"
                        name="linkedIn"
                        value={formData.linkedIn.replace(/^https?:\/\/(?:www\.)?linkedin\.com\/in\//i, '')}
                        onChange={(e) => setFormData(prev => ({ ...prev, linkedIn: `https://linkedin.com/in/${e.target.value}` }))}
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="yourprofile"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Twitter/X Profile
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 sm:text-sm">
                        twitter.com/
                      </span>
                      <input
                        type="text"
                        name="twitter"
                        value={formData.twitter.replace(/^https?:\/\/(?:www\.)?twitter\.com\//i, '')}
                        onChange={(e) => setFormData(prev => ({ ...prev, twitter: `https://twitter.com/${e.target.value}` }))}
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="username"
                      />
                    </div>
                  </div>
                </div>

                {saveSuccess && (
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-md flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Profile updated successfully!
                  </div>
                )}
                
                {saveError && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-md flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {typeof saveError === 'string' ? saveError : 'An error occurred while saving your profile.'}
                  </div>
                )}
                
                <div className="mt-5 flex justify-end space-x-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 flex items-center"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6">
                <div className="flex flex-col items-center md:flex-row md:items-start mb-8">
                  <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 shadow-xl mb-4 md:mb-0 md:mr-6">
                    <div className="rounded-full w-full h-full overflow-hidden border-2 border-white dark:border-gray-800">
                      <img
                        src={user?.profileDetails?.profilePhoto || "/avatar-placeholder.png"}
                        alt={user?.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/avatar-placeholder.png";
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{user?.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {user?.profileDetails?.title && user?.profileDetails?.company ? 
                        `${user.profileDetails.title} at ${user.profileDetails.company}` : 
                        user?.profileDetails?.title || user?.profileDetails?.company || 'Investor'
                      }
                    </p>
                    
                    <div className="mt-4 space-y-2">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Email:</span> {user?.email}
                      </div>
                      
                      {user?.profileDetails?.website && (
                        <div className="text-sm">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Website:</span>{' '}
                          <a 
                            href={user.profileDetails.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-amber-600 dark:text-amber-400 hover:underline"
                          >
                            {user.profileDetails.website.replace(/^https?:\/\//i, '')}
                          </a>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                      {user?.profileDetails?.socialLinks?.linkedIn && (
                        <a 
                          href={user.profileDetails.socialLinks.linkedIn} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors"
                        >
                          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                          LinkedIn
                        </a>
                      )}
                      
                      {user?.profileDetails?.socialLinks?.twitter && (
                        <a 
                          href={user.profileDetails.socialLinks.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-colors"
                        >
                          <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                          </svg>
                          Twitter/X
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                
                {user?.profileDetails?.bio && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-line">
                      {user.profileDetails.bio}
                    </p>
                  </div>
                )}

                {(user?.profileDetails?.investmentFocus || user?.profileDetails?.investmentRange || user?.profileDetails?.previousInvestments) && (
                  <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Investment Profile</h4>
                    
                    {user?.profileDetails?.investmentFocus && (
                      <div className="mb-4">
                        <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Investment Focus</h5>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {user.profileDetails.investmentFocus}
                        </p>
                      </div>
                    )}
                    
                    {user?.profileDetails?.investmentRange && (
                      <div className="mb-4">
                        <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Investment Range</h5>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {user.profileDetails.investmentRange}
                        </p>
                      </div>
                    )}
                    
                    {user?.profileDetails?.previousInvestments && (
                      <div>
                        <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Previous Investments</h5>
                        <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-line">
                          {user.profileDetails.previousInvestments}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </motion.div>
          
          {/* Notification Settings */}
          <motion.div 
            className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="border-b border-gray-100 dark:border-gray-700 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notification Settings</h3>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Profile Visibility</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Allow entrepreneurs to find and connect with you</p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <button 
                    type="button" 
                    className={`${profileSettings.visibility ? 'bg-amber-500' : 'bg-gray-200 dark:bg-gray-600'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2`}
                    role="switch" 
                    aria-checked={profileSettings.visibility}
                    onClick={() => {
                      const newSettings = {
                        ...profileSettings,
                        visibility: !profileSettings.visibility
                      };
                      setProfileSettings(newSettings);
                      updateProfileSettings(newSettings);
                    }}
                  >
                    <span className="sr-only">Use setting</span>
                    <span 
                      aria-hidden="true" 
                      className={`${profileSettings.visibility ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    ></span>
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Receive updates via email</p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <button 
                    type="button" 
                    className={`${profileSettings.emailNotifications ? 'bg-amber-500' : 'bg-gray-200 dark:bg-gray-600'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2`}
                    role="switch" 
                    aria-checked={profileSettings.emailNotifications}
                    onClick={() => {
                      const newSettings = {
                        ...profileSettings,
                        emailNotifications: !profileSettings.emailNotifications
                      };
                      setProfileSettings(newSettings);
                      updateProfileSettings(newSettings);
                    }}
                  >
                    <span className="sr-only">Use setting</span>
                    <span 
                      aria-hidden="true" 
                      className={`${profileSettings.emailNotifications ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    ></span>
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Interest Alerts</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Get notified about startups in your interest areas</p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <button 
                    type="button" 
                    className={`${profileSettings.interestAlerts ? 'bg-amber-500' : 'bg-gray-200 dark:bg-gray-600'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2`}
                    role="switch" 
                    aria-checked={profileSettings.interestAlerts}
                    onClick={() => {
                      const newSettings = {
                        ...profileSettings,
                        interestAlerts: !profileSettings.interestAlerts
                      };
                      setProfileSettings(newSettings);
                      updateProfileSettings(newSettings);
                    }}
                  >
                    <span className="sr-only">Use setting</span>
                    <span 
                      aria-hidden="true" 
                      className={`${profileSettings.interestAlerts ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    ></span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Side Column */}
        <div className="lg:col-span-1">
          <motion.div
            className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-300 mt-6 lg:mt-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="border-b border-gray-100 dark:border-gray-700 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Preview Profile</h3>
            </div>
            <div className="p-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">See how your profile appears to entrepreneurs</p>
              <Link 
                to={`/investor/${user?._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Public Profile
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Profile;