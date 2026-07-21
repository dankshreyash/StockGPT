import React from 'react';
import { motion } from 'framer-motion';

const ComparisonCard = ({ data }) => {
  if (!data || !data.stockA || !data.stockB) return null;
  
  const { stockA, stockB } = data;

  const MetricRow = ({ label, valA, valB, isBetterA = null }) => {
    return (
      <div className="flex items-center justify-between py-2 border-b border-black/5 dark:border-white/5 text-sm">
        <div className="w-1/3 font-semibold text-zinc-800 dark:text-zinc-200 text-left truncate pr-2">{valA || 'N/A'}</div>
        <div className="w-1/3 text-center text-zinc-500 text-xs uppercase tracking-wider">{label}</div>
        <div className="w-1/3 font-semibold text-zinc-800 dark:text-zinc-200 text-right truncate pl-2">{valB || 'N/A'}</div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 my-2 max-w-sm w-full"
    >
      <div className="flex items-center justify-between mb-4 border-b border-black/10 dark:border-white/10 pb-3">
        <div className="text-left w-2/5">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight truncate" title={stockA.symbol}>{stockA.symbol}</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate" title={stockA.company}>{stockA.company}</p>
        </div>
        <div className="text-center w-1/5 text-zinc-600 font-bold italic">VS</div>
        <div className="text-right w-2/5">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight truncate" title={stockB.symbol}>{stockB.symbol}</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate" title={stockB.company}>{stockB.company}</p>
        </div>
      </div>
      
      <div className="flex flex-col">
        <MetricRow 
          label="Price" 
          valA={`${stockA.currency === 'USD' ? '$' : '₹'}${stockA.price?.toFixed(2) || 'N/A'}`} 
          valB={`${stockB.currency === 'USD' ? '$' : '₹'}${stockB.price?.toFixed(2) || 'N/A'}`} 
        />
        <MetricRow 
          label="Market Cap" 
          valA={stockA.market_cap_display} 
          valB={stockB.market_cap_display} 
        />
        <MetricRow 
          label="P/E Ratio" 
          valA={stockA.pe?.toFixed(2)} 
          valB={stockB.pe?.toFixed(2)} 
        />
        <MetricRow 
          label="52W High" 
          valA={`${stockA.currency === 'USD' ? '$' : '₹'}${stockA.high52?.toFixed(2) || 'N/A'}`} 
          valB={`${stockB.currency === 'USD' ? '$' : '₹'}${stockB.high52?.toFixed(2) || 'N/A'}`} 
        />
        <MetricRow 
          label="Sector" 
          valA={stockA.sector} 
          valB={stockB.sector} 
        />
      </div>
    </motion.div>
  );
};

export default ComparisonCard;
