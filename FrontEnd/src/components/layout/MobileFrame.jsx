import React from 'react';

const MobileFrame = ({ children }) => {
  return (
    <div className="min-h-screen bg-black flex justify-center">
      <div className="w-full max-w-4xl h-[100dvh] bg-zinc-950 md:border-x md:border-white/5 overflow-hidden relative flex flex-col">
        <div className="flex-1 overflow-hidden flex flex-col relative z-10 w-full h-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MobileFrame;
