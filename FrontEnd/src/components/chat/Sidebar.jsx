import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMessageSquare, FiTrash2, FiX } from 'react-icons/fi';

function groupByDay(conversations) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const weekAgo = new Date(today); weekAgo.setDate(today.getDate() - 7);
  const monthAgo = new Date(today); monthAgo.setDate(today.getDate() - 30);

  const groups = {
    'Today': [],
    'Yesterday': [],
    'Previous 7 Days': [],
    'Previous 30 Days': [],
    'Older': []
  };

  conversations.forEach(c => {
    const d = new Date(c.createdAt);
    if (d >= today) groups['Today'].push(c);
    else if (d >= yesterday) groups['Yesterday'].push(c);
    else if (d >= weekAgo) groups['Previous 7 Days'].push(c);
    else if (d >= monthAgo) groups['Previous 30 Days'].push(c);
    else groups['Older'].push(c);
  });

  return Object.entries(groups).filter(([, items]) => items.length > 0);
}

const Sidebar = ({ isOpen, onClose, conversations, activeId, onSelect, onNew, onDelete }) => {
  const [hoveredId, setHoveredId] = useState(null);
  const grouped = groupByDay(conversations);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-full w-72 bg-gray-50 dark:bg-zinc-900 border-r border-black/10 dark:border-white/10 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-black/10 dark:border-white/10">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">History</h2>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-800 text-zinc-500 transition-colors">
                <FiX size={16} />
              </button>
            </div>

            {/* New Chat button */}
            <div className="p-3">
              <button
                onClick={() => { onNew(); onClose(); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors shadow-sm"
              >
                <FiPlus size={16} />
                New Chat
              </button>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto px-3 pb-4 custom-scrollbar">
              {grouped.map(([label, items]) => (
                <div key={label} className="mb-4">
                  <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider px-1 mb-2">{label}</p>
                  <div className="space-y-0.5">
                    {items.map(c => (
                      <div
                        key={c.id}
                        onMouseEnter={() => setHoveredId(c.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={() => { onSelect(c.id); onClose(); }}
                        className={`group flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer text-sm transition-all ${
                          activeId === c.id
                            ? 'bg-green-600/10 text-green-700 dark:text-green-400 border border-green-600/20'
                            : 'text-zinc-700 dark:text-zinc-300 hover:bg-gray-200 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <FiMessageSquare size={14} className="shrink-0 opacity-50" />
                        <span className="truncate flex-1">{c.title}</span>
                        {hoveredId === c.id && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onDelete(c.id); }}
                            className="p-1 rounded-md hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"
                          >
                            <FiTrash2 size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
