import React from 'react';

const categories = ['All', 'Articles', 'Videos', 'Tools', 'Reels', 'Posts'];
const dateRanges = ['Today', 'This Week', 'This Month', 'All Time'];
const popularityFilters = ['Latest', 'Most Viewed', 'Most Liked'];

const FilterBar = ({
  activeCategory,
  setActiveCategory,
  activeDateRange,
  setActiveDateRange,
  activeSort,
  setActiveSort,
  availableCategories = []
}) => {
  const visibleCategories = categories.filter(cat =>
    cat === 'All' || availableCategories.includes(cat) || availableCategories.includes(cat.slice(0, -1))
  );

  return (
    <div className="flex flex-col gap-3 pt-2 pb-4">
      {/* Category Chips - Primary Row */}
      <div className="flex gap-2 px-4 overflow-x-auto no-scrollbar">
        {visibleCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
              activeCategory === cat
                ? 'bg-primary text-white shadow-md border-primary'
                : 'bg-white text-soft-gray border-gray-200 hover:border-primary/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Consolidated Time & Sort Row - Compact Chips */}
      <div className="flex px-4 overflow-x-auto no-scrollbar items-center gap-4 py-2 bg-gray-50/50 border-y border-gray-100">
        {/* Time Chips */}
        <div className="flex items-center gap-2 pr-4 border-r border-gray-200 h-8">
          <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Time:</span>
          {dateRanges.map((range) => (
            <button
              key={range}
              onClick={() => setActiveDateRange(range)}
              className={`px-3 py-1 rounded-md text-[11px] font-bold whitespace-nowrap transition-all ${
                activeDateRange === range
                  ? 'bg-brand-teal text-white shadow-sm'
                  : 'bg-white text-soft-gray border border-gray-200 hover:bg-brand-teal/5'
              }`}
            >
              {range === 'This Week' ? 'Week' : range === 'This Month' ? 'Month' : range === 'All Time' ? 'All' : range}
            </button>
          ))}
        </div>

        {/* Sort Chips */}
        <div className="flex items-center gap-2 h-8">
          <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Sort:</span>
          {popularityFilters.map((sort) => (
            <button
              key={sort}
              onClick={() => setActiveSort(sort)}
              className={`px-3 py-1 rounded-md text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                activeSort === sort
                  ? 'bg-deep-charcoal text-white shadow-sm'
                  : 'bg-white text-soft-gray border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {sort === 'Most Viewed' ? 'Viewed' : sort === 'Most Liked' ? 'Liked' : sort}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
