import React from 'react';
import { motion } from 'framer-motion';
import { FiTarget, FiArrowUp, FiArrowDown } from 'react-icons/fi';

const ForecastCard = ({ data }) => {
  if (!data || !data.forecast) return null;
  const forecast = data.forecast;

  const ProgressBar = ({ label, current, target, isRisk }) => {
    // Basic percentage calc for visual bar
    const maxVal = Math.max(current, target) * 1.1;
    const currentPercent = (current / maxVal) * 100;
    const targetPercent = (target / maxVal) * 100;
    const color = isRisk ? 'bg-red-500' : 'bg-green-500';
    
    return (
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-zinc-400">{label}</span>
          <span className="font-semibold text-zinc-200">{target.toFixed(2)}</span>
        </div>
        <div className="relative h-2 bg-zinc-950 rounded-full overflow-hidden border border-white/5">
          {/* Target marker */}
          <div 
            className={`absolute top-0 bottom-0 ${color} opacity-30`} 
            style={{ width: `${targetPercent}%`, left: 0 }} 
          />
          {/* Current line */}
          <div 
            className="absolute top-0 bottom-0 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" 
            style={{ width: '4px', left: `${currentPercent}%`, marginLeft: '-2px' }} 
          />
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 my-2 max-w-sm w-full"
    >
      <div className="flex items-center justify-between mb-5 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <FiTarget className="text-indigo-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">Price Forecast</h3>
        </div>
        <div className="text-xs font-semibold text-blue-400 bg-blue-400/10 px-2 py-1 rounded-md border border-blue-400/20">
          Current: {forecast.current_price?.toFixed(2)}
        </div>
      </div>

      <div className="space-y-2 mb-2">
        {forecast.expected_3m && (
          <ProgressBar label="3 Month Expected" current={forecast.current_price} target={forecast.expected_3m} />
        )}
        {forecast.expected_6m && (
          <ProgressBar label="6 Month Expected" current={forecast.current_price} target={forecast.expected_6m} />
        )}
        {forecast.expected_1y && (
          <ProgressBar label="1 Year Expected" current={forecast.current_price} target={forecast.expected_1y} />
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/5">
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-2 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-green-500/80 uppercase">Upside Prob</span>
            <span className="text-sm font-bold text-green-400">{forecast.upside_probability}</span>
          </div>
          <FiArrowUp className="text-green-500 opacity-50" />
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-2 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-red-500/80 uppercase">Downside Risk</span>
            <span className="text-sm font-bold text-red-400">{forecast.downside_risk}</span>
          </div>
          <FiArrowDown className="text-red-500 opacity-50" />
        </div>
      </div>
    </motion.div>
  );
};

export default ForecastCard;
