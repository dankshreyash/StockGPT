import React from 'react';

const MobileFrame = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-200">
      <div className="w-full h-[100dvh] overflow-hidden relative flex flex-col transition-colors duration-200">
        <div className="flex-1 overflow-hidden flex flex-col relative z-10 w-full h-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MobileFrame;
