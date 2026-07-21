import React from 'react';
import { motion } from 'framer-motion';
import { FiAlertCircle } from 'react-icons/fi';
import { cn } from './Button';

const ErrorMessage = ({ message, className }) => {
  if (!message) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-lg text-sm border border-red-500/20', className)}
    >
      <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
      <p>{message}</p>
    </motion.div>
  );
};

export default ErrorMessage;
