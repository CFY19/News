import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Feed', icon: 'home', path: '/' },
    { label: 'Explore', icon: 'explore', path: '/explore' },
    { label: 'Add', icon: 'add', path: '/add', isAction: true },
    { label: 'Saved', icon: 'bookmark', path: '/saved' },
    { label: 'Profile', icon: 'account_circle', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 glass-effect border-t border-gray-200 px-6 py-3 pb-8 z-50">
      <div className="max-w-screen-md mx-auto flex justify-between items-center">
        {navItems.map((item) => (
          item.isAction ? (
            <button key={item.label} className="size-14 -mt-10 bg-primary rounded-2xl shadow-lg shadow-primary/30 flex items-center justify-center text-white ring-4 ring-off-white">
              <span className="material-symbols-outlined text-2xl">{item.icon}</span>
            </button>
          ) : (
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
          )
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
