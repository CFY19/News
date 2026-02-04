import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Feed', icon: 'home', path: '/' },
    { label: 'Explore', icon: 'explore', path: '/explore' },
    { label: 'Saved', icon: 'bookmark', path: '/saved' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 glass-effect border-t border-gray-200 px-6 py-3 pb-8 z-50">
      <div className="max-w-screen-md mx-auto flex justify-around items-center">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 transition-colors ${
              location.pathname === item.path ? 'text-primary' : 'text-soft-gray hover:text-primary'
            }`}
          >
            <span className={`material-symbols-outlined text-2xl ${location.pathname === item.path ? 'fill-1' : ''}`}>
              {item.icon}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
