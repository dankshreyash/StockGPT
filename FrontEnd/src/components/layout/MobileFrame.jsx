import React from 'react';

const MobileFrame = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-200 dark:bg-black flex justify-center transition-colors duration-200">
      <div className="w-full max-w-4xl h-[100dvh] bg-gray-50 dark:bg-zinc-950 md:border-x md:border-black/5 dark:border-white/5 overflow-hidden relative flex flex-col transition-colors duration-200">
        <div className="flex-1 overflow-hidden flex flex-col relative z-10 w-full h-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MobileFrame;
