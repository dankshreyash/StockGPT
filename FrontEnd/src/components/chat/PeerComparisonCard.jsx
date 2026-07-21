import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiAward } from 'react-icons/fi';

const PeerComparisonCard = ({ data }) => {
  if (!data || !data.comparison_table || data.comparison_table.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 my-2 max-w-sm w-full overflow-hidden"
    >
      <div className="flex items-center gap-2 mb-4 border-b border-black/10 dark:border-white/10 pb-3">
        <FiUsers className="text-purple-400" />
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">Peer Comparison</h3>
      </div>

      <div className="overflow-x-auto -mx-2 px-2 scrollbar-hide">
        <table className="w-full text-left text-xs text-zinc-700 dark:text-zinc-300">
          <thead>
            <tr className="border-b border-gray-200 dark:border-zinc-800">
              <th className="py-2 font-medium text-zinc-500">Metric</th>
              <th className="py-2 font-medium text-zinc-500 px-2 text-right">Stock A</th>
              <th className="py-2 font-medium text-zinc-500 px-2 text-right">Stock B</th>
              <th className="py-2 font-medium text-zinc-500 px-2 text-center">Winner</th>
            </tr>
          </thead>
          <tbody>
            {data.comparison_table.map((row, idx) => (
              <tr key={idx} className="border-b border-gray-200 dark:border-zinc-800/50 last:border-0 hover:bg-gray-100 dark:bg-zinc-800/20">
                <td className="py-2.5 font-medium">{row.metric}</td>
                <td className={`py-2.5 px-2 text-right ${row.winner === 'Stock A' ? 'text-green-400 font-semibold' : ''}`}>
                  {row.stock_a_value}
                </td>
                <td className={`py-2.5 px-2 text-right ${row.winner === 'Stock B' ? 'text-green-400 font-semibold' : ''}`}>
                  {row.stock_b_value}
                </td>
                <td className="py-2.5 px-2 text-center">
                  {row.winner !== 'Tie' ? (
                    <div className="inline-flex items-center justify-center gap-1 bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded text-[10px]">
                      <FiAward size={10} />
                      {row.winner}
                    </div>
                  ) : (
                    <span className="text-zinc-500 text-[10px]">Tie</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {data.text_summary && (
        <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5">
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed bg-gray-50 dark:bg-zinc-950 p-3 rounded-xl border border-black/5 dark:border-white/5">
            {data.text_summary}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default PeerComparisonCard;
