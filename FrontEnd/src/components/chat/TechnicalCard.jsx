import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown, FiMinus, FiActivity } from 'react-icons/fi';

const TechnicalCard = ({ data }) => {
  if (!data || Object.keys(data).length === 0) return null;

  const getTrendIcon = () => {
    if (data.trend === 'Bullish') return <FiTrendingUp className="text-green-400" />;
    if (data.trend === 'Bearish') return <FiTrendingDown className="text-red-400" />;
    return <FiMinus className="text-yellow-400" />;
  };

  const MetricBox = ({ label, value }) => (
    <div className="bg-gray-50 dark:bg-zinc-950/50 p-2 rounded-lg border border-black/5 dark:border-white/5 flex flex-col justify-center items-center">
      <span className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">{label}</span>
      <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{value ?? 'N/A'}</span>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 my-2 max-w-sm w-full"
    >
      <div className="flex items-center justify-between mb-4 border-b border-black/10 dark:border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <FiActivity className="text-purple-400" />
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">Technical Analysis</h3>
        </div>
        <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-zinc-950 px-2.5 py-1 rounded-full border border-black/5 dark:border-white/5">
          {getTrendIcon()}
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{data.trend}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <MetricBox label="RSI" value={data.rsi} />
        <MetricBox label="MACD" value={data.macd} />
        <MetricBox label="Signal" value={data.macd_signal} />
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-3">
        <MetricBox label="SMA 20" value={data.sma20} />
        <MetricBox label="SMA 50" value={data.sma50} />
        <MetricBox label="EMA 20" value={data.ema20} />
        <MetricBox label="EMA 50" value={data.ema50} />
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-black/5 dark:border-white/5">
        <div className="flex justify-between items-center px-1">
          <span className="text-xs text-zinc-500">Support</span>
          <span className="text-xs font-semibold text-green-400">{data.support ?? 'N/A'}</span>
        </div>
        <div className="flex justify-between items-center px-1">
          <span className="text-xs text-zinc-500">Resistance</span>
          <span className="text-xs font-semibold text-red-400">{data.resistance ?? 'N/A'}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default TechnicalCard;
