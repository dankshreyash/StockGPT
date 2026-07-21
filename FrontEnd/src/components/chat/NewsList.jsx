import React from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink, FiClock } from 'react-icons/fi';

const NewsList = ({ data }) => {
  if (!data || !Array.isArray(data) || data.length === 0) return null;

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <div className="flex flex-col gap-3 my-2 max-w-sm w-full">
      {data.map((item, idx) => (
        <motion.a
          key={idx}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 hover:bg-zinc-800/80 transition-colors group block relative overflow-hidden"
        >
          <div className="flex justify-between items-start gap-2 mb-2">
            <h4 className="text-sm font-semibold text-zinc-200 line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">
              {item.title}
            </h4>
            <FiExternalLink className="text-zinc-600 flex-shrink-0 mt-0.5 group-hover:text-blue-400" />
          </div>
          
          {item.summary && (
            <p className="text-xs text-zinc-400 line-clamp-2 mb-2">
              {item.summary}
            </p>
          )}
          
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[10px] text-zinc-500 uppercase tracking-wide">
            <span className="font-medium text-zinc-400">{item.source}</span>
            {item.published_date && (
              <div className="flex items-center gap-1">
                <FiClock />
                <span>{formatDate(item.published_date)}</span>
              </div>
            )}
          </div>
        </motion.a>
      ))}
    </div>
  );
};

export default NewsList;
