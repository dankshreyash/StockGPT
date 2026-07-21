import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiBookmark, FiTrash2 } from 'react-icons/fi';

const WatchlistDrawer = ({ isOpen, onClose, onSelect }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [newTicker, setNewTicker] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('stockgpt_watchlist');
    if (saved) {
      setWatchlist(JSON.parse(saved));
    }
  }, []);

  const saveWatchlist = (list) => {
    setWatchlist(list);
    localStorage.setItem('stockgpt_watchlist', JSON.stringify(list));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTicker.trim()) return;
    const upper = newTicker.trim().toUpperCase();
    if (!watchlist.includes(upper)) {
      saveWatchlist([...watchlist, upper]);
    }
    setNewTicker('');
  };

  const handleRemove = (ticker) => {
    saveWatchlist(watchlist.filter(t => t !== ticker));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-72 bg-zinc-900 border-l border-zinc-800 z-50 flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <FiBookmark className="text-blue-400" />
                <h2 className="font-bold text-white tracking-tight">Watchlist</h2>
              </div>
              <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/5 transition-colors">
                <FiX size={18} />
              </button>
            </div>

            <div className="p-4 border-b border-white/5">
              <form onSubmit={handleAdd} className="flex gap-2">
                <input
                  type="text"
                  value={newTicker}
                  onChange={(e) => setNewTicker(e.target.value)}
                  placeholder="Add symbol..."
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50 uppercase placeholder:normal-case placeholder:text-zinc-600"
                />
                <button type="submit" className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                  Add
                </button>
              </form>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {watchlist.length === 0 ? (
                <div className="text-center text-zinc-500 text-sm mt-10">
                  Your watchlist is empty.<br/>Add some stocks to track them!
                </div>
              ) : (
                watchlist.map(ticker => (
                  <div key={ticker} className="flex items-center justify-between bg-zinc-950 border border-white/5 p-3 rounded-xl group hover:border-zinc-700 transition-colors cursor-pointer" onClick={() => { onSelect(ticker); onClose(); }}>
                    <span className="font-bold text-zinc-200">{ticker}</span>
                    <button onClick={(e) => { e.stopPropagation(); handleRemove(ticker); }} className="p-1.5 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded hover:bg-white/5">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WatchlistDrawer;
