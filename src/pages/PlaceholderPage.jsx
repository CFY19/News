import React from 'react';
import BottomNav from '../components/Shared/BottomNav';

const PlaceholderPage = ({ title }) => {
  return (
    <div className="bg-off-white min-h-screen">
      <header className="p-4 border-b border-gray-200 bg-white sticky top-0 z-50">
        <h1 className="text-xl font-bold">{title}</h1>
      </header>
      <main className="flex flex-col items-center justify-center py-40">
        <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">construction</span>
        <p className="text-soft-gray font-medium">{title} is coming soon!</p>
      </main>
      <BottomNav />
    </div>
  );
};

export default PlaceholderPage;
