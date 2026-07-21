import React from 'react';
import { motion } from 'framer-motion';
import { FiGlobe, FiExternalLink, FiThumbsUp, FiThumbsDown, FiMinus } from 'react-icons/fi';

const NewsSentimentCard = ({ data }) => {
  if (!data || !data.articles || data.articles.length === 0) return null;

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'Positive': return <FiThumbsUp className="text-green-400" size={12} />;
      case 'Negative': return <FiThumbsDown className="text-red-400" size={12} />;
      default: return <FiMinus className="text-yellow-400" size={12} />;
    }
  };
  
  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'Positive': return 'bg-green-500/10 border-green-500/20 text-green-400';
      case 'Negative': return 'bg-red-500/10 border-red-500/20 text-red-400';
      default: return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 my-2 max-w-sm w-full"
    >
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <FiGlobe className="text-blue-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">News Sentiment</h3>
        </div>
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider ${getSentimentColor(data.overall_sentiment)}`}>
          {data.overall_sentiment}
          <span className="opacity-70">({data.positive_percent})</span>
        </div>
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-700">
        {data.articles.map((item, index) => (
          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 rounded-xl bg-zinc-950/50 border border-white/5 hover:border-zinc-700 transition-colors group"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] text-zinc-500 font-medium tracking-wide">
                {item.source}
              </span>
              <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] border ${getSentimentColor(item.sentiment)}`}>
                {getSentimentIcon(item.sentiment)}
                {item.sentiment} ({item.confidence})
              </div>
            </div>
            <h4 className="text-xs font-semibold text-zinc-200 leading-snug mb-1.5 group-hover:text-blue-400 transition-colors line-clamp-2">
              {item.title}
            </h4>
            <div className="flex justify-between items-center mt-2">
              <span className="text-[10px] text-zinc-600">
                {new Date(item.published_date * 1000 || item.published_date).toLocaleDateString()}
              </span>
              <FiExternalLink className="text-zinc-600 group-hover:text-blue-400" size={12} />
            </div>
          </a>
        ))}
      </div>
    </motion.div>
  );
};

export default NewsSentimentCard;
