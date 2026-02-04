import React from 'react';
import { useNavigate } from 'react-router-dom';

const FeedCard = ({ item }) => {
  const navigate = useNavigate();

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

  const displayImage = item.imageUrl || item.image;

  return (
    <article
      onClick={() => navigate(`/detail/${item.id}`)}
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-soft hover:shadow-lg transition-all duration-300 cursor-pointer group"
    >
      {displayImage && (
        <div className="relative h-56 bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url('${displayImage}')` }}>
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
        <div className="flex items-center gap-2 mb-4">
          <span className={`${getBadgeColor(item.type)} text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md`}>
            {item.type}
          </span>
          <span className="text-soft-gray text-xs font-medium">• {item.readTime}</span>
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
            <div
              className="size-7 rounded-full bg-gray-100 border border-gray-200 bg-cover bg-center"
              style={{ backgroundImage: `url('${item.authorImage}')` }}
            ></div>
            <span className="text-xs font-semibold text-deep-charcoal">{item.author}</span>
          </div>
          <div className="flex gap-5">
            <button className="text-gray-400 hover:text-primary transition-colors" onClick={(e) => { e.stopPropagation(); }}>
              <span className="material-symbols-outlined text-2xl">bookmark</span>
            </button>
            <button className="text-gray-400 hover:text-primary transition-colors" onClick={(e) => { e.stopPropagation(); }}>
              <span className="material-symbols-outlined text-2xl">share</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default FeedCard;
