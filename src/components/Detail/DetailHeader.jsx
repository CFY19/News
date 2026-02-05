import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleShare } from '../../utils/share';

const DetailHeader = ({ item }) => {
  const navigate = useNavigate();
  const [shareStatus, setShareStatus] = useState(null);

  const onShare = async () => {
    if (!item) return;
    const result = await handleShare(item);
    if (result.success && result.method === 'clipboard') {
      setShareStatus('Copied!');
      setTimeout(() => setShareStatus(null), 2000);
    }
  };

  return (
    <header className="flex items-center bg-off-white/80 backdrop-blur-md p-4 sticky top-0 z-10 justify-between border-b border-slate-100">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <span className="material-symbols-outlined text-slate-900">arrow_back_ios</span>
        <span className="text-sm font-bold uppercase tracking-widest text-slate-500">Back</span>
      </div>
      <div className="flex items-center gap-3">
        {shareStatus && <span className="text-[10px] font-bold text-blue-600 uppercase">{shareStatus}</span>}
        <button
          onClick={onShare}
          className="flex items-center justify-center rounded-full h-10 w-10 bg-slate-100 hover:bg-slate-200 transition-colors"
          title="Share"
        >
          <span className="material-symbols-outlined text-slate-700" style={{ fontSize: '20px' }}>share</span>
        </button>
      </div>
    </header>
  );
};

export default DetailHeader;
