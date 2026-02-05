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
  // Only show categories that have items, or at least 'All'
  const visibleCategories = categories.filter(cat =>
    cat === 'All' || availableCategories.includes(cat) || availableCategories.includes(cat.slice(0, -1))
  );

  return (
    <div className="flex flex-col gap-3 py-2">
      {/* Category Filters */}
      <div className="flex gap-2 px-4 overflow-x-auto no-scrollbar">
        {visibleCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
              activeCategory === cat
                ? 'bg-primary text-white shadow-md border-primary scale-105'
                : 'bg-white text-soft-gray border-gray-200 hover:border-primary/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Time & Sorting Filters */}
      <div className="flex flex-col gap-2 bg-gray-50/50 py-3 border-y border-gray-100">
        <div className="flex gap-2 px-4 overflow-x-auto no-scrollbar items-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mr-2">Time:</span>
          {dateRanges.map((range) => (
            <button
              key={range}
              onClick={() => setActiveDateRange(range)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeDateRange === range
                  ? 'bg-brand-teal text-white shadow-sm'
                  : 'bg-white text-soft-gray border border-gray-200 hover:bg-brand-teal/5'
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        <div className="flex gap-2 px-4 overflow-x-auto no-scrollbar items-center mt-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mr-2">Sort:</span>
          {popularityFilters.map((sort) => (
            <button
              key={sort}
              onClick={() => setActiveSort(sort)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                activeSort === sort
                  ? 'bg-deep-charcoal text-white shadow-sm'
                  : 'bg-white text-soft-gray border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {sort === 'Most Viewed' && <span className="material-symbols-outlined text-xs">visibility</span>}
              {sort === 'Most Liked' && <span className="material-symbols-outlined text-xs">thumb_up</span>}
              {sort === 'Latest' && <span className="material-symbols-outlined text-xs">schedule</span>}
              {sort}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
