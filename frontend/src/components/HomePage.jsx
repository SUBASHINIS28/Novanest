import React from 'react';
import { Link } from 'react-router-dom';
import '../floating.css'; // Import the floating CSS file

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col relative">
      <header className="bg-transparent w-full py-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-4xl font-extrabold">Novanest</h1>
          <nav>
            <Link to="/signup" className="text-white mx-4 hover:underline">Sign Up</Link>
            <Link to="/login" className="text-white mx-4 hover:underline">Login</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center">
        <h2 className="text-5xl font-extrabold text-white mb-4">Welcome to Novanest</h2>
        <p className="text-white text-lg mb-8 max-w-md">
          Your AI-powered incubation platform for entrepreneurs, investors, and mentors.
        </p>
        <div>
          <Link to="/signup" className="bg-white text-blue-600 py-3 px-6 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition duration-300 ease-in-out mr-4">Get Started</Link>
          <Link to="/login" className="bg-gray-800 text-white py-3 px-6 rounded-full shadow-lg hover:bg-gray-700 transition duration-300 ease-in-out">Login</Link>
        </div>
      </main>
      <footer className="bg-gray-900 w-full py-4">
        <div className="container mx-auto text-center text-white">
          &copy; 2025 Novanest. All rights reserved.
        </div>
      </footer>
      <div className="floating floating-1"></div>
      <div className="floating floating-2"></div>
      <div className="floating floating-3"></div>
    </div>
  );
};

export default HomePage;