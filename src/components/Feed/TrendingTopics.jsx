import React from 'react';
import { trendingTopics } from '../../data';

const TrendingTopics = ({ activeHashtag, setActiveHashtag }) => {
  const handleHashtagClick = (tag) => {
    if (activeHashtag === tag) {
      setActiveHashtag(null);
    } else {
      setActiveHashtag(tag);
    }
  };

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
            onClick={() => handleHashtagClick(topic.name)}
            className={`flex-none text-left rounded-xl p-3.5 w-44 shadow-sm transition-all border ${
              activeHashtag === topic.name
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
