import React, { useState, useMemo, useEffect } from 'react';
import TopHeader from '../components/Feed/TopHeader';
import FilterBar from '../components/Feed/FilterBar';
import TrendingTopics from '../components/Feed/TrendingTopics';
import FeedCard from '../components/Feed/FeedCard';
import { fetchAllNews } from '../services/newsService';

const MainFeed = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeDateRange, setActiveDateRange] = useState('All Time');
  const [activeHashtag, setActiveHashtag] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      const data = await fetchAllNews();
      setItems(data);
      setLoading(false);
    };
    loadNews();

    // Refresh news every 15 minutes
    const interval = setInterval(loadNews, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredItems = useMemo(() => {
    const sanitizedQuery = searchQuery.trim().replace(/[<>{}()]/g, '');

    let filtered = items.filter(item => {
      // Hashtag logic
      const matchesHashtag = !activeHashtag ||
                            item.tags.some(tag => tag.toLowerCase() === activeHashtag.toLowerCase());

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

      return matchesHashtag && matchesSearch && matchesCategory && matchesDate;
    });

    // Sort by XR priority then date descending
    filtered.sort((a, b) => {
      const xrTags = ['xr', 'vr', 'ar', 'mixedreality', 'spatialcomputing', 'vision pro'];
      const aIsXR = a.tags.some(t => xrTags.includes(t.toLowerCase())) || a.title.toLowerCase().includes('vision pro');
      const bIsXR = b.tags.some(t => xrTags.includes(t.toLowerCase())) || b.title.toLowerCase().includes('vision pro');

      if (aIsXR && !bIsXR) return -1;
      if (!aIsXR && bIsXR) return 1;

      return new Date(b.date) - new Date(a.date);
    });

    // Limit to top 10 for weekly/daily view if not searching
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
        <TrendingTopics items={items} activeHashtag={activeHashtag} setActiveHashtag={setActiveHashtag} />

        <div className="flex items-center justify-between px-4 mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold uppercase tracking-widest text-soft-gray">
              {activeHashtag ? `Stories tagged: #${activeHashtag}` : (searchQuery ? 'Search Results' : (activeCategory === 'All' ? 'Latest Stories' : `${activeCategory}`))}
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
          {searchQuery === '' && (activeDateRange === 'This Week' || activeDateRange === 'Today') && filteredItems.length > 0 && (
            <span className="text-[10px] font-bold text-primary uppercase">Top Picks</span>
          )}
        </div>

        <div className="space-y-6 px-4">
          {loading ? (
            <div className="flex flex-col items-center py-20">
              <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
              <p className="text-soft-gray font-medium">Fetching real-time tech news...</p>
            </div>
          ) : filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <FeedCard key={item.id} item={item} />
            ))
          ) : (
            <div className="py-20 text-center">
              <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">search_off</span>
              <p className="text-soft-gray font-medium">No results found for your filters.</p>
              {activeDateRange !== 'All Time' && (
                <button
                  onClick={() => setActiveDateRange('All Time')}
                  className="mt-4 text-primary text-sm font-bold underline"
                >
                  Show all stories
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MainFeed;
