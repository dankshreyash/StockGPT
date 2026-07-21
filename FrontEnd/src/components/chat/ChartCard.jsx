import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ComposedChart, Line } from 'recharts';
import { FiActivity } from 'react-icons/fi';

const ChartCard = ({ data }) => {
  const [timeframe, setTimeframe] = useState('1Y');
  
  if (!data || !data.historical || data.historical.length === 0) return null;

  // Filter data based on timeframe
  const getFilteredData = () => {
    const hist = data.historical;
    const now = new Date();
    
    let cutoff = new Date();
    switch (timeframe) {
      case '1D': cutoff.setDate(now.getDate() - 2); break; // Typically intra-day, but using recent daily if not available
      case '5D': cutoff.setDate(now.getDate() - 7); break;
      case '1M': cutoff.setMonth(now.getMonth() - 1); break;
      case '6M': cutoff.setMonth(now.getMonth() - 6); break;
      case '1Y': cutoff.setFullYear(now.getFullYear() - 1); break;
      default: cutoff.setFullYear(now.getFullYear() - 1);
    }
    
    return hist.filter(d => new Date(d.date) >= cutoff);
  };

  const chartData = getFilteredData();
  
  // Determine color based on trend
  const isUp = chartData.length > 0 && chartData[chartData.length - 1].close >= chartData[0].close;
  const color = isUp ? '#22c55e' : '#ef4444';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-4 my-2 max-w-sm w-full overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4 border-b border-black/10 dark:border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <FiActivity className="text-blue-400" />
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight">Price Chart</h3>
        </div>
        
        <div className="flex gap-1 bg-gray-50 dark:bg-zinc-950 p-1 rounded-lg border border-black/5 dark:border-white/5">
          {['1D', '5D', '1M', '6M', '1Y'].map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`text-[10px] px-2 py-1 rounded-md transition-colors ${
                timeframe === tf 
                  ? 'bg-gray-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold' 
                  : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-300'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="h-48 w-full -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <defs>
              <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#71717a', fontSize: 10 }} 
              tickFormatter={(val) => val.substring(5)}
              axisLine={false} 
              tickLine={false}
              minTickGap={20}
            />
            <YAxis 
              domain={['auto', 'auto']} 
              tick={{ fill: '#71717a', fontSize: 10 }} 
              axisLine={false} 
              tickLine={false}
              orientation="right"
              width={40}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px' }}
              itemStyle={{ color: '#e4e4e7' }}
              labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
            />
            <Area type="monotone" dataKey="close" stroke={color} fillOpacity={1} fill="url(#colorClose)" strokeWidth={2} />
            
            {/* Show Moving Averages on longer timeframes */}
            {['6M', '1Y'].includes(timeframe) && (
              <>
                <Line type="monotone" dataKey="sma50" stroke="#fbbf24" strokeWidth={1} dot={false} strokeOpacity={0.8} />
                <Line type="monotone" dataKey="sma200" stroke="#a78bfa" strokeWidth={1} dot={false} strokeOpacity={0.8} />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      {['6M', '1Y'].includes(timeframe) && (
        <div className="flex gap-4 mt-2 justify-center text-[10px] text-zinc-500">
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-400 opacity-80"></div> 50 SMA</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-400 opacity-80"></div> 200 SMA</div>
        </div>
      )}
    </motion.div>
  );
};

export default ChartCard;
