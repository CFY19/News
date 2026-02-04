import React from 'react';
import { useNavigate } from 'react-router-dom';

const DetailHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center bg-off-white/80 backdrop-blur-md p-4 sticky top-0 z-10 justify-between border-b border-slate-100">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <span className="material-symbols-outlined text-slate-900">arrow_back_ios</span>
        <span className="text-sm font-bold uppercase tracking-widest text-slate-500">Back</span>
      </div>
      <div className="flex items-center gap-4">
        <button className="flex items-center justify-center rounded-full h-10 w-10 bg-slate-100 hover:bg-slate-200 transition-colors">
          <span className="material-symbols-outlined text-slate-700" style={{ fontSize: '20px' }}>share</span>
        </button>
        <button className="flex items-center justify-center rounded-full h-10 w-10 bg-slate-100 hover:bg-slate-200 transition-colors">
          <span className="material-symbols-outlined text-slate-700" style={{ fontSize: '20px' }}>bookmark</span>
        </button>
      </div>
    </header>
  );
};

export default DetailHeader;
