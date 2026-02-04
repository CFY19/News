import React from 'react';
import { trendingTopics } from '../../data';

const TrendingTopics = () => {
  return (
    <section className="py-6">
      <div className="flex items-center justify-between px-4 mb-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-soft-gray">Trending Topics</h2>
        <span className="material-symbols-outlined text-primary text-sm">trending_up</span>
      </div>
      <div className="flex gap-3 px-4 overflow-x-auto no-scrollbar">
        {trendingTopics.map((topic) => (
          <div
            key={topic.id}
            className={`flex-none ${topic.bg} border ${topic.border} rounded-xl p-3.5 w-44 shadow-sm`}
          >
            <p className={`${topic.color} text-xs font-bold mb-1`}>{topic.tag}</p>
            <p className="text-[10px] text-soft-gray font-medium">{topic.stats}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrendingTopics;
