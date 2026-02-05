import React, { useMemo } from 'react';

const TrendingTopics = ({ items, activeHashtag, setActiveHashtag }) => {
  const trendingTopics = useMemo(() => {
    if (!items || items.length === 0) return [];

    const tagCounts = {};
    items.forEach(item => {
      item.tags.forEach(tag => {
        const t = tag.toLowerCase();
        tagCounts[t] = (tagCounts[t] || 0) + 1;
      });
    });

    // Bias: Always include XR and force it to the first position
    const sortedEntries = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1]);

    // Find XR entry
    const xrIndex = sortedEntries.findIndex(([name]) => name === 'xr');
    let xrEntry;

    if (xrIndex !== -1) {
      xrEntry = sortedEntries.splice(xrIndex, 1)[0];
    } else {
      xrEntry = ['xr', 0];
    }

    // Re-insert XR at the beginning
    const finalEntries = [xrEntry, ...sortedEntries].slice(0, 5);

    return finalEntries.map(([name, count], index) => {
      const colors = [
        'text-brand-teal', // XR (Teal)
        'text-primary',    // 2nd
        'text-deep-charcoal',
        'text-rose-500',
        'text-blue-600'
      ];
      return {
        id: index + 1,
        name: `#${name.toUpperCase()}`,
        tagName: name,
        count: `${count} stories`,
        color: colors[index % colors.length]
      };
    });
  }, [items]);

  const handleHashtagClick = (tag) => {
    if (activeHashtag === tag) {
      setActiveHashtag(null);
    } else {
      setActiveHashtag(tag);
    }
  };

  if (trendingTopics.length === 0) return null;

  return (
    <section className="py-6">
      <div className="flex items-center justify-between px-4 mb-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-soft-gray">Trending Topics</h2>
        <span className="material-symbols-outlined text-primary text-sm">trending_up</span>
      </div>
      <div className="flex gap-3 px-4 overflow-x-auto no-scrollbar">
        {trendingTopics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => handleHashtagClick(topic.tagName)}
            className={`flex-none text-left rounded-xl p-3.5 w-44 shadow-sm transition-all border ${
              activeHashtag === topic.tagName
                ? 'bg-primary/10 border-primary ring-1 ring-primary'
                : 'bg-white border-gray-200 hover:border-primary/50'
            }`}
          >
            <p className={`${topic.color} text-xs font-bold mb-1`}>{topic.name}</p>
            <p className="text-[10px] text-soft-gray font-medium">{topic.count}</p>
          </button>
        ))}
      </div>
    </section>
  );
};

export default TrendingTopics;
