import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiAward } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const PeerComparisonCard = ({ data }) => {
  if (!data) return null;

  const hasTable = data.comparison_table && data.comparison_table.length > 0;
  const hasSummary = data.text_summary;

  if (!hasTable && !hasSummary) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 my-2 w-full overflow-hidden"
    >
      {hasSummary && (
        <div className="mb-4 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.text_summary}</ReactMarkdown>
        </div>
      )}

      {hasTable && (
        <>
          <div className="flex items-center gap-2 mb-3 border-b border-black/10 dark:border-white/10 pb-3">
            <FiUsers className="text-purple-400" />
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">Comparison</h3>
          </div>

          <div className="overflow-x-auto -mx-2 px-2">
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
                  <tr key={idx} className="border-b border-gray-200 dark:border-zinc-800/50 last:border-0 hover:bg-gray-50 dark:hover:bg-zinc-800/30">
                    <td className="py-2.5 font-medium">{row.metric}</td>
                    <td className={`py-2.5 px-2 text-right ${row.winner === 'Stock A' ? 'text-green-500 dark:text-green-400 font-semibold' : ''}`}>
                      {row.stock_a_value}
                    </td>
                    <td className={`py-2.5 px-2 text-right ${row.winner === 'Stock B' ? 'text-green-500 dark:text-green-400 font-semibold' : ''}`}>
                      {row.stock_b_value}
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      {row.winner !== 'Tie' ? (
                        <div className="inline-flex items-center justify-center gap-1 bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 px-2 py-0.5 rounded text-[10px]">
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
        </>
      )}
    </motion.div>
  );
};

export default PeerComparisonCard;
