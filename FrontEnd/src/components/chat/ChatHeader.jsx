import React from 'react';
import { FiTrendingUp, FiBookmark } from 'react-icons/fi';

const ChatHeader = ({ onOpenWatchlist }) => {
  return (
    <div className="glass px-4 py-3 flex items-center justify-between z-10 border-b border-white/10 shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/20">
          <FiTrendingUp className="text-white text-xl" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-white tracking-wide">StockGPT</h1>
            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse"></span>
          </div>
          <p className="text-xs text-zinc-400">Premium AI Research</p>
        </div>
      </div>
      <button 
        onClick={onOpenWatchlist}
        className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-700 transition-all shadow-sm"
      >
        <FiBookmark size={18} />
      </button>
    </div>
  );
};

export default ChatHeader;
