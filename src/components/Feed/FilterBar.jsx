import React from 'react';

const categories = ['All', 'Articles', 'Videos', 'Tools', 'Posts'];
const dateRanges = ['Today', 'Week', 'Month', 'All'];
const popularityFilters = ['Latest', 'Viewed', 'Liked'];

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
      {/* Category Selection */}
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

      {/* ULTRA-COMPACT Consolidated Row: Time + Sort */}
      <div className="flex px-4 overflow-x-auto no-scrollbar items-center gap-4 py-2 bg-gray-50/50 border-y border-gray-100">
        <div className="flex items-center gap-1.5 pr-3 border-r border-gray-200 h-8">
          <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Time</span>
          {dateRanges.map((range) => (
            <button
              key={range}
              onClick={() => setActiveDateRange(range === 'Week' ? 'This Week' : range === 'Month' ? 'This Month' : range === 'All' ? 'All Time' : range)}
              className={`px-3 py-1 rounded-md text-[10px] font-bold whitespace-nowrap transition-all ${
                (activeDateRange === range ||
                 (range === 'Week' && activeDateRange === 'This Week') ||
                 (range === 'Month' && activeDateRange === 'This Month') ||
                 (range === 'All' && activeDateRange === 'All Time'))
                  ? 'bg-brand-teal text-white shadow-sm'
                  : 'bg-white text-soft-gray border border-gray-200 hover:bg-brand-teal/5'
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 h-8">
          <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Sort</span>
          {popularityFilters.map((sort) => (
            <button
              key={sort}
              onClick={() => setActiveSort(sort === 'Viewed' ? 'Most Viewed' : sort === 'Liked' ? 'Most Liked' : sort)}
              className={`px-3 py-1 rounded-md text-[10px] font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                (activeSort === sort ||
                 (sort === 'Viewed' && activeSort === 'Most Viewed') ||
                 (sort === 'Liked' && activeSort === 'Most Liked'))
                  ? 'bg-deep-charcoal text-white shadow-sm'
                  : 'bg-white text-soft-gray border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {sort}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
