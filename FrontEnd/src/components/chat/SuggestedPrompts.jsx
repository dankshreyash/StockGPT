import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTrendingPrompts } from '../../services/api';

const SuggestedPrompts = ({ onSelect }) => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrompts = async () => {
      setLoading(true);
      const data = await getTrendingPrompts();
      setPrompts(data);
      setLoading(false);
    };
    
    fetchPrompts();
  }, []);

  return (
    <div className="flex flex-wrap gap-2 p-4 pt-0">
      {loading ? (
        // Loading shimmers
        Array.from({ length: 4 }).map((_, i) => (
          <div 
            key={`skeleton-${i}`} 
            className="h-8 w-24 bg-gray-200 dark:bg-zinc-800/80 rounded-full animate-pulse border border-gray-300 dark:border-zinc-700/50"
            style={{ width: `${Math.random() * (120 - 80) + 80}px` }}
          ></div>
        ))
      ) : (
        prompts.map((prompt, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(prompt)}
            className="text-xs bg-gray-100 dark:bg-zinc-800/80 hover:bg-gray-200 dark:hover:bg-zinc-700 border border-gray-300 dark:border-zinc-700/50 text-zinc-700 dark:text-zinc-300 py-2 px-3 rounded-full transition-colors whitespace-nowrap shadow-sm backdrop-blur-sm"
          >
            {prompt}
          </motion.button>
        ))
      )}
    </div>
  );
};

export default SuggestedPrompts;
