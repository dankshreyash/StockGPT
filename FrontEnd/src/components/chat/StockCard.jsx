import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown, FiActivity, FiGlobe } from 'react-icons/fi';

const StockCard = ({ data }) => {
  const isPositive = data.change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 my-2 max-w-sm w-full relative overflow-hidden group"
    >
      {/* Decorative gradient blob */}
      <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20 ${isPositive ? 'bg-green-500' : 'bg-red-500'}`} />

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="max-w-[65%]">
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">{data.symbol}</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate" title={data.company}>{data.company}</p>
        </div>
        <div className={`flex flex-col items-end ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          <span className="text-xl font-bold">₹{data.price ? data.price.toFixed(2) : 'N/A'}</span>
          <div className="flex items-center gap-1 text-sm font-medium">
            {isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
            <span>{isPositive ? '+' : ''}{data.change ? data.change.toFixed(2) : '0.00'} ({data.change_percent ? data.change_percent.toFixed(2) : '0.00'}%)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
        <div className="bg-gray-50 dark:bg-zinc-950/50 p-2 rounded-xl border border-black/5 dark:border-white/5">
          <p className="text-xs text-zinc-500 mb-1">Market Cap</p>
          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{data.market_cap_display || 'N/A'}</p>
        </div>
        <div className="bg-gray-50 dark:bg-zinc-950/50 p-2 rounded-xl border border-black/5 dark:border-white/5">
          <p className="text-xs text-zinc-500 mb-1">P/E Ratio</p>
          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{data.pe ? data.pe.toFixed(2) : 'N/A'}</p>
        </div>
        <div className="bg-gray-50 dark:bg-zinc-950/50 p-2 rounded-xl border border-black/5 dark:border-white/5">
          <p className="text-xs text-zinc-500 mb-1">52W High</p>
          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">₹{data.high52 ? data.high52.toFixed(2) : 'N/A'}</p>
        </div>
        <div className="bg-gray-50 dark:bg-zinc-950/50 p-2 rounded-xl border border-black/5 dark:border-white/5">
          <p className="text-xs text-zinc-500 mb-1">52W Low</p>
          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">₹{data.low52 ? data.low52.toFixed(2) : 'N/A'}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-3 border-t border-black/10 dark:border-white/10 relative z-10">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500">Sector</span>
          <span className="text-zinc-700 dark:text-zinc-300 font-medium text-right">{data.sector || 'N/A'}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-500">Industry</span>
          <span className="text-zinc-700 dark:text-zinc-300 font-medium text-right">{data.industry || 'N/A'}</span>
        </div>
        {data.website && (
          <div className="flex items-center gap-1 mt-1">
            <FiGlobe className="text-zinc-500 text-xs" />
            <a href={data.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline truncate">
              {data.website}
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StockCard;
