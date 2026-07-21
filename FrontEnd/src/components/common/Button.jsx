import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Button = React.forwardRef(({ className, variant = 'primary', size = 'default', children, ...props }, ref) => {
  const variants = {
    primary: 'bg-green-accent hover:bg-green-600 text-white shadow-lg shadow-green-accent/20',
    secondary: 'bg-zinc-800 hover:bg-zinc-700 text-white',
    ghost: 'hover:bg-zinc-800/50 text-zinc-300 hover:text-white',
    icon: 'p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white'
  };

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-8 rounded-md px-3 text-xs',
    lg: 'h-12 rounded-md px-8',
    icon: 'h-10 w-10'
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
});
Button.displayName = 'Button';

export default Button;
