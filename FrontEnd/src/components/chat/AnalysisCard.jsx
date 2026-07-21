import React from 'react';
import { motion } from 'framer-motion';
import { FiCpu, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

const AnalysisCard = ({ data }) => {
  if (!data || Object.keys(data).length === 0) return null;

  // Handle fallback if data format is old
  const score = data.ai_score || 50;
  const label = data.score_label || data.recommendation || 'Neutral';
  
  const getScoreColor = () => {
    if (score >= 70) return 'text-green-400 border-green-400/30 bg-green-400/10';
    if (score >= 40) return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
    return 'text-red-400 border-red-400/30 bg-red-400/10';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 my-2 max-w-sm w-full"
    >
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <FiCpu className="text-blue-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">AI Investment Score</h3>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center mb-6 pt-2">
        <div className={`relative flex items-center justify-center w-24 h-24 rounded-full border-4 ${getScoreColor()}`}>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold">{score}</span>
            <span className="text-[10px] uppercase tracking-wider opacity-80">/ 100</span>
          </div>
        </div>
        <div className={`mt-3 px-4 py-1 rounded-full text-xs font-bold tracking-wide border ${getScoreColor()}`}>
          {label.toUpperCase()}
        </div>
      </div>

      {data.summary && (
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Summary</h4>
          <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-950/50 p-3 rounded-xl border border-white/5">
            {data.summary}
          </p>
        </div>
      )}

      {data.strengths && data.strengths.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Key Strengths</h4>
          <ul className="space-y-1.5">
            {data.strengths.map((str, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                <FiCheckCircle className="text-green-400 mt-0.5 shrink-0" />
                <span className="leading-snug">{str}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.weaknesses && data.weaknesses.length > 0 && (
        <div className="mb-2">
          <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Key Weaknesses</h4>
          <ul className="space-y-1.5">
            {data.weaknesses.map((wk, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                <FiAlertTriangle className="text-yellow-400 mt-0.5 shrink-0" />
                <span className="leading-snug">{wk}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Backwards compatibility for 'risks' array from previous iteration */}
      {data.risks && data.risks.length > 0 && !data.weaknesses && (
         <div className="mb-2">
          <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Risk Factors</h4>
          <ul className="space-y-1.5">
            {data.risks.map((risk, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                <FiAlertTriangle className="text-yellow-400 mt-0.5 shrink-0" />
                <span className="leading-snug">{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default AnalysisCard;
