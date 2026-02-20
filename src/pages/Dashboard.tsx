
import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50">
      {/* Unsplash Hero Background */}
      <img
        src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80"
        alt="Dashboard Hero"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-60 z-0"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-700/70 via-secondary-700/60 to-accent-700/50 z-10" />
      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center px-6 py-12 rounded-2xl shadow-xl bg-white/80 backdrop-blur-md max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary-900 mb-4 drop-shadow-lg text-center">
          Welcome to the Dashboard
        </h1>
        <p className="text-lg md:text-xl text-secondary-800 mb-6 text-center">
          Your main dashboard content will appear here. Enjoy a modern, visually appealing experience!
        </p>
        <div className="flex gap-4 mt-4">
          <button className="px-6 py-2 rounded-lg bg-primary-600 text-white font-semibold shadow hover:bg-primary-700 transition">Explore</button>
          <button className="px-6 py-2 rounded-lg bg-accent-600 text-white font-semibold shadow hover:bg-accent-700 transition">Get Started</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
