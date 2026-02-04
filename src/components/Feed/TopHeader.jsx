import React from 'react';

const TopHeader = ({ searchQuery, setSearchQuery }) => {
  return (
    <header className="sticky top-0 z-50 bg-off-white/80 glass-effect border-b border-gray-200/60">
      <div className="flex items-center p-4 justify-between">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm">
            <span className="material-symbols-outlined text-xl">terminal</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-deep-charcoal">Tech Feed</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-soft-gray hover:text-primary transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </div>
      <div className="px-4 pb-2">
        <div className="relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
            <span className="material-symbols-outlined text-xl">search</span>
          </div>
          <input
            className="w-full bg-gray-100 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-500"
            placeholder="Search articles, tools, videos..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
