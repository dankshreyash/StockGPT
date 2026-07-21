import React from 'react';
import { motion } from 'framer-motion';
import { cn } from './Button';

const Loader = ({ className }) => {
  return (
    <div className={cn('flex items-center justify-center p-4', className)}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full"
      />
    </div>
  );
};

export default Loader;
