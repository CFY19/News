import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TopHeader from '../components/Feed/TopHeader';
import FilterBar from '../components/Feed/FilterBar';
import TrendingTopics from '../components/Feed/TrendingTopics';
import FeedCard from '../components/Feed/FeedCard';
import { fetchAllNews } from '../services/newsService';
import { getHistory, saveToHistory, shouldFetchNewData } from '../services/storageService';
import { getMetricsForArticles } from '../services/metricsService';

const MainFeed = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeDateRange, setActiveDateRange] = useState('This Week');
  const [activeSort, setActiveSort] = useState('Latest');
  const [activeHashtag, setActiveHashtag] = useState(null);
  const [items, setItems] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);

  const availableCategories = useMemo(() => {
    return [...new Set(items.map(item => item.type))];
  }, [items]);

  useEffect(() => {
    const loadNews = async (force = false) => {
      setLoading(true);

      let data = getHistory();

      if (data.length === 0 || force || shouldFetchNewData()) {
        const freshData = await fetchAllNews();
        data = saveToHistory(freshData);
      }

      setItems(data);

      // Load metrics for these items
      const ids = data.map(item => item.id);
      const m = await getMetricsForArticles(ids);
      setMetrics(m);

      setLoading(false);
    };

    loadNews();

    // Auto-refresh logic (once a day check)
    const interval = setInterval(() => loadNews(), 12 * 60 * 60 * 1000);
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

    // Sorting Logic
    filtered.sort((a, b) => {
      // Priority 1 items always stay up if we are in "Latest" or "All"
      if (activeSort === 'Latest') {
        if (b.priority !== a.priority) return b.priority - a.priority;
        return new Date(b.date) - new Date(a.date);
      }

      if (activeSort === 'Most Viewed') {
        const viewsA = metrics[a.id]?.views || 0;
        const viewsB = metrics[b.id]?.views || 0;
        return viewsB - viewsA;
      }

      if (activeSort === 'Most Liked') {
        const likesA = metrics[a.id]?.helpful || 0;
        const likesB = metrics[b.id]?.helpful || 0;
        return likesB - likesA;
      }

      return 0;
    });

    return filtered;
  }, [searchQuery, activeCategory, activeDateRange, activeSort, activeHashtag, items, metrics]);

  return (
    <div className="bg-off-white min-h-screen">
      <TopHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <main className="max-w-screen-md mx-auto pb-28">
        <FilterBar
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          activeDateRange={activeDateRange}
          setActiveDateRange={setActiveDateRange}
          activeSort={activeSort}
          setActiveSort={setActiveSort}
          availableCategories={availableCategories}
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
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase hover:opacity-70 transition-opacity"
          >
            <span className="material-symbols-outlined text-xs">refresh</span>
            Update
          </button>
        </div>

        <div className="space-y-6 px-4">
          {loading ? (
            <div className="flex flex-col items-center py-20">
              <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
              <p className="text-soft-gray font-medium">Loading Fyware’s Curated Feed...</p>
            </div>
          ) : (
            <div className="relative">
              <AnimatePresence mode="popLayout">
                {filteredItems.length > 0 ? (
                  filteredItems.map(item => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="mb-6 last:mb-0"
                    >
                      <FeedCard item={item} />
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-20 text-center"
                  >
                    <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">search_off</span>
                    <p className="text-soft-gray font-medium">No results found for your filters.</p>
                    <button
                      onClick={() => {
                        setActiveDateRange('All Time');
                        setActiveCategory('All');
                        setSearchQuery('');
                      }}
                      className="mt-4 text-primary text-sm font-bold underline"
                    >
                      Clear all filters
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MainFeed;
