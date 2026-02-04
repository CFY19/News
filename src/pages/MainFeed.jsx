import React, { useState, useMemo, useEffect } from 'react';
import TopHeader from '../components/Feed/TopHeader';
import FilterBar from '../components/Feed/FilterBar';
import TrendingTopics from '../components/Feed/TrendingTopics';
import FeedCard from '../components/Feed/FeedCard';
import { feedItems as initialFeedItems } from '../data';

const MainFeed = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeDateRange, setActiveDateRange] = useState('This Week');
  const [activeHashtag, setActiveHashtag] = useState(null);
  const [items, setItems] = useState(initialFeedItems);

  // Example of how to autoupdate the feed from an external source
  /*
  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await fetch('https://your-api-or-github-json-url.com/feed.json');
        const data = await response.json();
        if (data && data.length > 0) {
          setItems(data);
        }
      } catch (error) {
        console.error('Failed to fetch autoupdated feed:', error);
      }
    };
    fetchFeed();
    // Refresh every 30 minutes
    const interval = setInterval(fetchFeed, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  */

  const filteredItems = useMemo(() => {
    // Sanitize search query: trim and remove special characters that could be used for injection
    const sanitizedQuery = searchQuery.trim().replace(/[<>{}()]/g, '');

    let filtered = items.filter(item => {
      // Hashtag logic
      const matchesHashtag = !activeHashtag ||
                            item.tags.some(tag => tag.toLowerCase() === activeHashtag.toLowerCase());

      // Search logic
      const matchesSearch = item.title.toLowerCase().includes(sanitizedQuery.toLowerCase()) ||
                          item.summary.toLowerCase().includes(sanitizedQuery.toLowerCase()) ||
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

      return matchesHashtag && matchesSearch && matchesCategory && matchesDate;
    });

    // Sort by date descending (most recent first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Limit to top 10 for weekly/daily view if not searching, to satisfy the "10 most relevant" requirement
    if ((activeDateRange === 'This Week' || activeDateRange === 'Today') && searchQuery === '') {
      return filtered.slice(0, 10);
    }

    return filtered;
  }, [searchQuery, activeCategory, activeDateRange, activeHashtag, items]);

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
        <TrendingTopics activeHashtag={activeHashtag} setActiveHashtag={setActiveHashtag} />

        <div className="flex items-center justify-between px-4 mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-soft-gray">
              {activeHashtag ? `Stories tagged: ${activeHashtag}` : (searchQuery ? 'Search Results' : (activeCategory === 'All' ? 'Latest Stories' : `${activeCategory}`))}
            </h2>
            {activeHashtag && (
              <button
                onClick={() => setActiveHashtag(null)}
                className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-bold hover:bg-gray-300 transition-colors"
              >
                CLEAR
              </button>
            )}
          </div>
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
    </div>
  );
};

export default MainFeed;
