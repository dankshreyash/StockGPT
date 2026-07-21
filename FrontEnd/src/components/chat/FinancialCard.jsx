import React from 'react';
import { motion } from 'framer-motion';
import { FiDollarSign, FiPieChart } from 'react-icons/fi';

const FinancialCard = ({ data }) => {
  if (!data || Object.keys(data).length === 0) return null;

  const MetricBox = ({ label, value, highlight = false }) => (
    <div className={`p-2.5 rounded-xl border ${highlight ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-gray-50 dark:bg-zinc-950/50 border-black/5 dark:border-white/5'} flex flex-col justify-center`}>
      <span className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 block truncate">{label}</span>
      <span className={`text-sm font-semibold truncate ${highlight ? 'text-emerald-400' : 'text-zinc-800 dark:text-zinc-200'}`}>{value ?? 'N/A'}</span>
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
          <FiPieChart className="text-emerald-400" />
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">Financial Health</h3>
        </div>
        {data.quarter_ended && (
          <span className="text-[10px] text-zinc-500 bg-gray-50 dark:bg-zinc-950 px-2 py-1 rounded-md border border-black/5 dark:border-white/5">
            Q: {data.quarter_ended}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <MetricBox label="Market Cap" value={data.market_cap} highlight />
        <MetricBox label="Revenue" value={data.revenue} />
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-2">
        <MetricBox label="P/E Ratio" value={data.pe} />
        <MetricBox label="P/B Ratio" value={data.pb} />
        <MetricBox label="EPS" value={data.eps} />
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <MetricBox label="Net Profit" value={data.net_income} />
        <MetricBox label="EBITDA" value={data.ebitda} />
        <MetricBox label="ROE" value={data.roe} />
        <MetricBox label="Debt/Equity" value={data.debt_to_equity} />
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <MetricBox label="Net Margin" value={data.net_margin} />
        <MetricBox label="Op Margin" value={data.operating_margin} />
        <MetricBox label="Div Yield" value={data.dividend_yield} />
      </div>

    </motion.div>
  );
};

export default FinancialCard;
