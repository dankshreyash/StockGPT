import React from 'react';
import { FiTrendingUp, FiBookmark, FiSun, FiMoon, FiMenu, FiPlus } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

const ChatHeader = ({ onOpenWatchlist, onOpenSidebar, onNewChat }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="glass px-4 py-3 flex items-center justify-between z-10 border-b border-black/10 dark:border-white/10 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-zinc-700 transition-all shadow-sm"
          title="Chat History"
        >
          <FiMenu size={18} />
        </button>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/20">
          <FiTrendingUp className="text-white text-xl" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-zinc-900 dark:text-white tracking-wide">StockGPT</h1>
            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse"></span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Premium AI Research</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onNewChat}
          className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-zinc-700 transition-all shadow-sm"
          title="New Chat"
        >
          <FiPlus size={18} />
        </button>
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-zinc-700 transition-all shadow-sm"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>
        <button
          onClick={onOpenWatchlist}
          className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-zinc-700 transition-all shadow-sm"
        >
          <FiBookmark size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
