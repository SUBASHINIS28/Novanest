import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser  } from './api';
import './styles.css'; // Import the CSS file

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'entrepreneur',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser (formData);
      alert('User  registered successfully');
      navigate('/login'); // Redirect to login page
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center">
      <div className="signup-container bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-4xl font-bold mb-6 text-center text-gray-800">Create an Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Role</label>
            <select
              name="role"
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            >
              <option value="entrepreneur">Entrepreneur</option>
              <option value="investor">Investor</option>
              <option value="mentor">Mentor</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 shadow-lg"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;