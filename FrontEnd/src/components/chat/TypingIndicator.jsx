import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator = () => {
  const dotVariants = {
    start: { y: 0 },
    end: { y: -5 }
  };

  const containerVariants = {
    start: { transition: { staggerChildren: 0.2 } },
    end: { transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="flex items-center gap-3 p-4 self-start bg-white dark:bg-zinc-900 rounded-2xl rounded-tl-sm w-fit border border-black/5 dark:border-white/5">
      <motion.div
        variants={containerVariants}
        initial="start"
        animate="end"
        className="flex gap-1"
      >
        {[0, 1, 2].map((index) => (
          <motion.span
            key={index}
            variants={dotVariants}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            className="w-1.5 h-1.5 bg-green-500 rounded-full"
          />
        ))}
      </motion.div>
      <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Searching stock...</span>
    </div>
  );
};

export default TypingIndicator;
