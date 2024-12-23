import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative">
        {/* Main spinner */}
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        
        {/* Inner spinner */}
        <div className="absolute top-1/2 left-1/2 w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin-reverse" 
             style={{ transform: 'translate(-50%, -50%)' }} />
             
        {/* Loading text */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-blue-600 font-medium animate-pulse">
          Loading...
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-reverse {
          from {
            transform: translate(-50%, -50%) rotate(360deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(0deg);
          }
        }
        .animate-spin-reverse {
          animation: spin-reverse 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Loader;