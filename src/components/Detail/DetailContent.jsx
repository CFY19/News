import React, { useState, useEffect } from 'react';
import { trackHelpful, getMetricsForArticles, hasVotedHelpful } from '../../services/metricsService';

const DetailContent = ({ item }) => {
  const [metrics, setMetrics] = useState({ views: 0, helpful: 0 });
  const [isHelpful, setIsHelpful] = useState(false);

  useEffect(() => {
    const loadMetrics = async () => {
      const data = await getMetricsForArticles([item.id]);
      if (data[item.id]) {
        setMetrics(data[item.id]);
      }
      setIsHelpful(hasVotedHelpful(item.id));
    };
    loadMetrics();
  }, [item.id]);

  const handleHelpfulClick = async () => {
    const newHelpfulCount = await trackHelpful(item.id);
    setMetrics(prev => ({ ...prev, helpful: newHelpfulCount }));
    setIsHelpful(hasVotedHelpful(item.id));
  };

  const content = item.fullContent || {
    title: item.title,
    author: item.author,
    date: new Date(item.date).toLocaleDateString(),
    readTime: item.readTime,
    authorImage: item.authorImage,
    tldr: [item.description],
    tags: item.tags,
    paragraphs: [item.description],
    quote: null
  };

  const handleImageError = (e) => {
    e.target.style.display = 'none';
  };

  const authorImage = content.authorImage || `https://ui-avatars.com/api/?name=${content.author}&background=random`;

  return (
    <main className="flex flex-col p-6 pb-12">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 text-soft-gray">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-base">visibility</span>
            <span className="text-xs font-bold">{metrics.views} views</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-base text-brand-teal">thumb_up</span>
            <span className="text-xs font-bold">{metrics.helpful} found this helpful</span>
          </div>
        </div>
      </div>

      <h1 className="text-slate-900 tracking-tight text-3xl font-bold leading-[1.2] mb-6">
        {content.title}
      </h1>

      <div className="flex items-center gap-4 mb-8">
        <img
          src={authorImage}
          alt={content.author}
          className="rounded-full h-11 w-11 border border-slate-200 object-cover"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${content.author}&background=random`;
          }}
        />
        <div className="flex flex-col">
          <p className="text-slate-900 text-base font-bold leading-none">{content.author}</p>
          <p className="text-slate-500 text-sm font-medium mt-1">{content.date} • {content.readTime}</p>
        </div>
      </div>

      {item.imageUrl && (
        <div className="mb-8 rounded-2xl overflow-hidden shadow-sm">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-auto object-cover max-h-96"
            onError={handleImageError}
          />
        </div>
      )}

      <div className="mb-8 relative">
        <div className="flex flex-col gap-3 rounded-2xl bg-tldr-tint border border-blue-100/50 p-6">
          <div className="flex items-center gap-2 text-blue-700">
            <span className="material-symbols-outlined font-bold" style={{ fontSize: '18px' }}>auto_awesome</span>
            <p className="text-xs font-bold uppercase tracking-widest">TL;DR Summary</p>
          </div>
          <ul className="text-slate-700 text-[15px] leading-relaxed space-y-3">
            {content.tldr.map((point, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {content.tags.map(tag => (
          <span key={tag} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-wider border border-slate-200/50">
            {tag.toUpperCase()}
          </span>
        ))}
      </div>

      <div className="max-w-none">
        {content.paragraphs.map((p, i) => (
          <p key={i} className="text-slate-800 text-lg leading-relaxed mb-6">
            {p}
          </p>
        ))}
      </div>

      <div className="mt-4 mb-12">
        <a
          href={item.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 bg-deep-charcoal text-white gap-3 text-lg font-bold leading-normal tracking-wide transition-all active:scale-95 shadow-md"
        >
          <span>Read Full Source</span>
          <span className="material-symbols-outlined text-sm">open_in_new</span>
        </a>
        <p className="text-center text-slate-400 text-[10px] mt-4 font-bold uppercase tracking-widest">
          External link to original content
        </p>
      </div>

      <footer className="mt-auto border-t border-slate-100 p-8 flex flex-col items-center gap-4 bg-slate-50/50 -mx-6">
        <p className="text-sm font-medium text-slate-500">Was this summary helpful?</p>
        <div className="flex gap-4">
          <button
            onClick={handleHelpfulClick}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-full border shadow-sm transition-all ${
              isHelpful
                ? 'bg-primary text-white border-primary'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className={`material-symbols-outlined ${isHelpful ? 'fill-1' : ''}`}>thumb_up</span>
            <span className="text-sm font-bold">{isHelpful ? 'Helpful' : 'Yes'}</span>
          </button>
          {!isHelpful && (
            <button className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined text-red-500">thumb_down</span>
              <span className="text-sm font-bold text-slate-700">No</span>
            </button>
          )}
        </div>
        <div className="w-32 h-1.5 bg-slate-300 rounded-full mt-6 opacity-20"></div>
      </footer>
    </main>
  );
};

export default DetailContent;
