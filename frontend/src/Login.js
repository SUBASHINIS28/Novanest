import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from './api';
import './styles.css'; // Import the CSS file

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
      const data = await loginUser(formData);
      localStorage.setItem('token', data.token);
      alert('Login successful');

      // Redirect to the correct dashboard based on the user's role
      if (data.role === 'entrepreneur') {
        navigate('/entrepreneur-dashboard');
      } else if (data.role === 'investor') {
        navigate('/investor-dashboard');
      } else if (data.role === 'mentor') {
        navigate('/mentor-dashboard');
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center">
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;