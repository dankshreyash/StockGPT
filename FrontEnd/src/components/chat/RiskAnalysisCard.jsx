import React from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiAlertOctagon } from 'react-icons/fi';

const RiskAnalysisCard = ({ data }) => {
  if (!data || !data.risk_analysis || data.risk_analysis.length === 0) return null;

  const getRiskColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-gray-300 dark:border-zinc-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 my-2 max-w-sm w-full"
    >
      <div className="flex items-center gap-2 mb-4 border-b border-black/10 dark:border-white/10 pb-3">
        <FiShield className="text-rose-400" />
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">Risk Analysis</h3>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {data.risk_analysis.map((risk, index) => (
          <div key={index} className="bg-gray-50 dark:bg-zinc-950 p-2.5 rounded-xl border border-black/5 dark:border-white/5 flex flex-col justify-between">
            <div className="flex items-start gap-1.5 mb-2">
              <FiAlertOctagon className="text-zinc-500 mt-0.5 shrink-0" size={12} />
              <span className="text-xs text-zinc-700 dark:text-zinc-300 font-medium leading-tight">{risk.name}</span>
            </div>
            <div className={`self-start px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getRiskColor(risk.level)}`}>
              {risk.level}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default RiskAnalysisCard;
