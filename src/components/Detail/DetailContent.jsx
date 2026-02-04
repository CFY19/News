import React from 'react';

const DetailContent = ({ item }) => {
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

  return (
    <main className="flex flex-col p-6 pb-12">
      <h1 className="text-slate-900 tracking-tight text-3xl font-bold leading-[1.2] mb-6">
        {content.title}
      </h1>

      <div className="flex items-center gap-4 mb-8">
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-11 w-11 border border-slate-200"
          style={{ backgroundImage: `url("${content.authorImage}")` }}
        ></div>
        <div className="flex flex-col">
          <p className="text-slate-900 text-base font-bold leading-none">{content.author}</p>
          <p className="text-slate-500 text-sm font-medium mt-1">{content.date} • {content.readTime}</p>
        </div>
      </div>

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

        {content.quote && (
          <div className="bg-soft-gray/50 border-l-4 border-slate-300 p-5 rounded-r-lg mb-6">
            <p className="text-slate-700 text-base leading-relaxed italic">
              "{content.quote}"
            </p>
          </div>
        )}
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
          <button className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-green-600">thumb_up</span>
            <span className="text-sm font-bold text-slate-700">Yes</span>
          </button>
          <button className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-red-500">thumb_down</span>
            <span className="text-sm font-bold text-slate-700">No</span>
          </button>
        </div>
        <div className="w-32 h-1.5 bg-slate-300 rounded-full mt-6 opacity-20"></div>
      </footer>
    </main>
  );
};

export default DetailContent;
