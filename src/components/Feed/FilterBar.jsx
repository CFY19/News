import React from 'react';

const categories = ['All', 'Articles', 'Videos', 'Tools', 'Reels', 'Posts'];
const dateRanges = ['All Time', 'Today', 'This Week', 'This Month'];

const FilterBar = ({
  activeCategory,
  setActiveCategory,
  activeDateRange,
  setActiveDateRange
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 px-4 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
              activeCategory === cat
                ? 'bg-primary text-white shadow-sm border-primary'
                : 'bg-white text-soft-gray border-gray-200 hover:border-primary/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="flex gap-2 px-4 pb-2 overflow-x-auto no-scrollbar border-b border-gray-100">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 self-center mr-1">Time:</span>
        {dateRanges.map((range) => (
          <button
            key={range}
            onClick={() => setActiveDateRange(range)}
            className={`px-4 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
              activeDateRange === range
                ? 'bg-brand-teal text-white border-brand-teal'
                : 'bg-white text-soft-gray border-gray-200 hover:border-brand-teal/50'
            }`}
          >
            {range}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
