import React, { useState, useMemo } from 'react';
import TopHeader from '../components/Feed/TopHeader';
import FilterBar from '../components/Feed/FilterBar';
import TrendingTopics from '../components/Feed/TrendingTopics';
import FeedCard from '../components/Feed/FeedCard';
import BottomNav from '../components/Shared/BottomNav';
import { feedItems } from '../data';

const MainFeed = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeDateRange, setActiveDateRange] = useState('This Week');

  const filteredItems = useMemo(() => {
    // Sanitize search query: trim and remove special characters that could be used for injection
    const sanitizedQuery = searchQuery.trim().replace(/[<>{}()]/g, '');

    let items = feedItems.filter(item => {
      // Search logic
      const matchesSearch = item.title.toLowerCase().includes(sanitizedQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(sanitizedQuery.toLowerCase()) ||
                          item.tags.some(tag => tag.toLowerCase().includes(sanitizedQuery.toLowerCase()));

      // Category logic
      const categoryMap = {
        'Articles': 'Article',
        'Videos': 'Video',
        'Tools': 'Tool',
        'Reels': 'Reel',
        'Posts': 'Post'
      };
      const matchesCategory = activeCategory === 'All' || item.type === categoryMap[activeCategory];

      // Date logic
      const itemDate = new Date(item.date);
      const now = new Date();
      let matchesDate = true;

      if (activeDateRange === 'Today') {
        matchesDate = itemDate.toDateString() === now.toDateString();
      } else if (activeDateRange === 'This Week') {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesDate = itemDate >= oneWeekAgo;
      } else if (activeDateRange === 'This Month') {
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        matchesDate = itemDate >= oneMonthAgo;
      }

      return matchesSearch && matchesCategory && matchesDate;
    });

    // Sort by date descending (most recent first)
    items.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Limit to top 10 for weekly/daily view if not searching, to satisfy the "10 most relevant" requirement
    if ((activeDateRange === 'This Week' || activeDateRange === 'Today') && searchQuery === '') {
      return items.slice(0, 10);
    }

    return items;
  }, [searchQuery, activeCategory, activeDateRange]);

  return (
    <div className="bg-off-white min-h-screen">
      <TopHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <main className="max-w-screen-md mx-auto pb-28">
        <FilterBar
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          activeDateRange={activeDateRange}
          setActiveDateRange={setActiveDateRange}
        />
        <TrendingTopics />

        <div className="flex items-center justify-between px-4 mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-soft-gray">
            {searchQuery ? 'Search Results' : (activeCategory === 'All' ? 'Latest Stories' : `${activeCategory}`)}
          </h2>
          {searchQuery === '' && (activeDateRange === 'This Week' || activeDateRange === 'Today') && filteredItems.length === 10 && (
            <span className="text-[10px] font-bold text-primary uppercase">Top 10 Picks</span>
          )}
        </div>

        <div className="space-y-6 px-4">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <FeedCard key={item.id} item={item} />
            ))
          ) : (
            <div className="py-20 text-center">
              <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">search_off</span>
              <p className="text-soft-gray font-medium">No results found for your filters.</p>
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default MainFeed;
