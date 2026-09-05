import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

const POOL = [
  "Analyze HCL Technologies",
  "Analyze Reliance",
  "Analyze TCS",
  "Analyze Infosys",
  "Analyze HDFC Bank",
  "Analyze SBI",
  "Analyze ITC",
  "Analyze Tata Motors",
  "Analyze Bajaj Finserv",
  "Analyze Tata Steel",
  "Compare Reliance vs TCS",
  "Compare Infosys vs HCL Tech",
  "Compare SBI vs HDFC Bank",
  "Compare Tata Motors vs Tata Steel",
  "Compare HPCL vs BPCL",
  "Why did Reliance fall?",
  "Why did TCS rise?",
  "Is Infosys a good buy?",
  "Should I invest in SBI?",
  "Technical analysis for Reliance",
  "Financial health of TCS",
  "Latest news for HDFC Bank",
  "Best IT stocks to buy",
  "Top banking stocks in India",
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const SuggestedPrompts = ({ onSelect }) => {
  const [key, setKey] = useState(0);

  const prompts = useMemo(() => shuffle(POOL).slice(0, 5), [key]);

  // Re-shuffle every time component mounts (new chat, page refresh)
  useEffect(() => {
    setKey(k => k + 1);
  }, []);

  return (
    <div className="flex flex-wrap gap-2 p-4 pt-0">
      {prompts.map((prompt, index) => (
        <motion.button
          key={`${key}-${index}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(prompt)}
          className="text-xs bg-gray-100 dark:bg-zinc-800/80 hover:bg-gray-200 dark:hover:bg-zinc-700 border border-gray-300 dark:border-zinc-700/50 text-zinc-700 dark:text-zinc-300 py-2 px-3 rounded-full transition-colors whitespace-nowrap shadow-sm backdrop-blur-sm"
        >
          {prompt}
        </motion.button>
      ))}
    </div>
  );
};

export default SuggestedPrompts;
