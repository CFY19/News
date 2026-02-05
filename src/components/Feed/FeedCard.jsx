import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { handleShare } from '../../utils/share';
import { getMetricsForArticles, trackView, toggleHelpful, hasVotedHelpful } from '../../services/metricsService';

const FeedCard = ({ item }) => {
  const [shareStatus, setShareStatus] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [metrics, setMetrics] = useState({ views: 0, helpful: 0 });
  const [isLiked, setIsLiked] = useState(false);
  const [showBurst, setShowBurst] = useState(false);

  // Recommended logic: XR / Unity Content
  const isRecommended = item.priority >= 100 || item.tags.includes('xr');

  useEffect(() => {
    const loadMetrics = async () => {
      const data = await getMetricsForArticles([item.id]);
      if (data[item.id]) {
        setMetrics(data[item.id]);
      }
      setIsLiked(hasVotedHelpful(item.id));
    };
    loadMetrics();
  }, [item.id]);

  const handleActionClick = async () => {
    await trackView(item.id);
  };

  const onLikeToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Animation trigger (only on like)
    if (!isLiked) {
      setShowBurst(true);
      setTimeout(() => setShowBurst(false), 800);
    }

    const newHelpfulCount = await toggleHelpful(item.id);
    setMetrics(prev => ({ ...prev, helpful: newHelpfulCount }));
    setIsLiked(!isLiked);
  };

  const onShare = async (e) => {
    e.preventDefault();
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
    <motion.article
      whileHover={{ y: -4 }}
      className={`bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-xl transition-all duration-300 cursor-pointer group border ${
        isRecommended ? 'border-amber-400/50 ring-1 ring-amber-400/20 shadow-amber-500/5' : 'border-gray-100'
      }`}
    >
      <a
        href={item.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleActionClick}
        className="block no-underline text-inherit"
      >
        {displayImage && !imageError && (
          <div className="relative h-56 bg-cover bg-center overflow-hidden">
            <img
              src={displayImage}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>

            {isRecommended && (
              <div className="absolute top-4 right-4 z-10">
                <span className="bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded shadow-lg flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px] fill-1">verified</span>
                  Recommended
                </span>
              </div>
            )}

            {item.type === 'Video' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="size-16 rounded-full bg-white/20 glass-effect flex items-center justify-center text-white border border-white/40 shadow-2xl">
                  <span className="material-symbols-outlined text-4xl fill-1">play_arrow</span>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className={`bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md`}>
                {item.type}
              </span>
              <span className="text-soft-gray text-xs font-bold uppercase tracking-tighter">{formattedDate}</span>
            </div>

            {/* Interactive Metrics Bar */}
            <div className="flex items-center gap-3 text-soft-gray">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">visibility</span>
                <span className="text-[10px] font-bold">{metrics.views}</span>
              </div>

              <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={onLikeToggle}
                  className={`flex items-center gap-1 transition-colors ${isLiked ? 'text-brand-teal' : 'hover:text-primary'}`}
                >
                  <motion.span
                    animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
                    className={`material-symbols-outlined text-sm ${isLiked ? 'fill-1' : ''}`}
                  >
                    thumb_up
                  </motion.span>
                  <span className="text-[10px] font-bold">{metrics.helpful}</span>
                </motion.button>

                <AnimatePresence>
                  {showBurst && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1.5 }}
                      exit={{ opacity: 0, scale: 2 }}
                      className="absolute inset-0 pointer-events-none flex items-center justify-center"
                    >
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ x: 0, y: 0 }}
                          animate={{
                            x: (i % 2 === 0 ? 1 : -1) * Math.random() * 30,
                            y: (i < 3 ? -1 : 1) * Math.random() * 30
                          }}
                          className="size-1 bg-brand-teal rounded-full absolute"
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <h3 className={`text-xl font-bold leading-tight mb-3 tracking-tight group-hover:text-primary transition-colors ${
            isRecommended ? 'text-amber-900' : 'text-deep-charcoal'
          }`}>
            {item.title}
          </h3>

          <p className="text-soft-gray text-[15px] leading-relaxed mb-5 line-clamp-3">
            {item.description}
          </p>

          <div className="flex flex-wrap gap-2.5 mb-5">
            {item.tags.map(tag => (
              <span key={tag} className={`text-xs font-semibold ${isRecommended ? 'text-amber-600' : 'text-primary'}`}>#{tag}</span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-5 border-t border-gray-50">
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

            <div className="flex items-center gap-3">
               {shareStatus && <span className="text-[10px] font-bold text-brand-teal animate-pulse uppercase">{shareStatus}</span>}
              <button
                className="text-gray-400 hover:text-primary transition-colors p-1"
                onClick={onShare}
              >
                <span className="material-symbols-outlined text-xl">share</span>
              </button>
              <span className="text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-1 group-hover:underline">
                Read
                <span className="material-symbols-outlined text-xs">open_in_new</span>
              </span>
            </div>
          </div>
        </div>
      </a>
    </motion.article>
  );
};

export default FeedCard;
