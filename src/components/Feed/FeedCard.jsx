import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleShare } from '../../utils/share';
import { getMetricsForArticles, trackView } from '../../services/metricsService';

const FeedCard = ({ item }) => {
  const navigate = useNavigate();
  const [shareStatus, setShareStatus] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [metrics, setMetrics] = useState({ views: 0, helpful: 0 });

  useEffect(() => {
    const loadMetrics = async () => {
      const data = await getMetricsForArticles([item.id]);
      if (data[item.id]) {
        setMetrics(data[item.id]);
      }
    };
    loadMetrics();
  }, [item.id]);

  const handleCardClick = async () => {
    // Increment view count
    await trackView(item.id);
    navigate(`/detail/${item.id}`, { state: { item } });
  };

  const getBadgeColor = (type) => {
    switch (type) {
      case 'Article': return 'bg-primary/10 text-primary';
      case 'Tool': return 'bg-brand-teal/10 text-brand-teal';
      case 'Video': return 'bg-rose-500/10 text-rose-500';
      case 'Reel': return 'bg-primary/10 text-primary';
      case 'Post': return 'bg-deep-charcoal/10 text-deep-charcoal';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const onShare = async (e) => {
    e.stopPropagation();
    const result = await handleShare(item);
    if (result.success && result.method === 'clipboard') {
      setShareStatus('Copied!');
      setTimeout(() => setShareStatus(null), 2000);
    }
  };

  const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const displayImage = item.imageUrl || item.image;
  const authorImage = item.authorImage || `https://ui-avatars.com/api/?name=${item.author}&background=random`;

  return (
    <article
      onClick={handleCardClick}
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-soft hover:shadow-lg transition-all duration-300 cursor-pointer group"
    >
      {displayImage && !imageError && (
        <div className="relative h-56 bg-cover bg-center overflow-hidden">
          <img
            src={displayImage}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
          {item.type === 'Video' && (
            <div className="absolute inset-0 flex items-center justify-center">
               <button className="size-16 rounded-full bg-white/20 glass-effect flex items-center justify-center text-white border border-white/40 shadow-2xl scale-100 group-hover:scale-110 transition-transform duration-300">
                <span className="material-symbols-outlined text-4xl fill-1">play_arrow</span>
              </button>
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className={`${getBadgeColor(item.type)} text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md`}>
              {item.type}
            </span>
            <span className="text-soft-gray text-[10px] font-medium uppercase tracking-tighter">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-3 text-soft-gray">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">visibility</span>
              <span className="text-[10px] font-bold">{metrics.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-brand-teal">thumb_up</span>
              <span className="text-[10px] font-bold">{metrics.helpful}</span>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold leading-tight mb-3 text-deep-charcoal tracking-tight group-hover:text-primary transition-colors">
          {item.title}
        </h3>

        <p className="text-soft-gray text-[15px] leading-relaxed mb-5 line-clamp-3">
          {item.description}
        </p>

        <div className="flex flex-wrap gap-2.5 mb-5">
          {item.tags.map(tag => (
            <span key={tag} className="text-primary text-xs font-semibold">#{tag}</span>
          ))}
        </div>

        <div className="pt-5 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={authorImage}
              alt={item.author}
              className="size-7 rounded-full bg-gray-100 border border-gray-200 object-cover"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${item.author}&background=random`;
              }}
            />
            <span className="text-xs font-semibold text-deep-charcoal">{item.author}</span>
          </div>
          <div className="flex items-center gap-2">
            {shareStatus && <span className="text-[10px] font-bold text-brand-teal animate-pulse uppercase">{shareStatus}</span>}
            <button
              className="text-gray-400 hover:text-primary transition-colors p-2"
              onClick={onShare}
              title="Share"
            >
              <span className="material-symbols-outlined text-2xl">share</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default FeedCard;
