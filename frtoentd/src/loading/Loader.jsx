import React from 'react';
import loaderImage from "./WhatsApp Image 2024-12-21 at 10.45.16_a14ecb57.jpg"

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="text-center">
       
        <div className="relative">
          <img 
            src={loaderImage} 
            alt="Loading"
            className="w-32 h-32 mx-auto object-contain animate-bounce"
          />
          
          {/* Spinner around the image */}
          <div className="absolute inset-0 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" 
               style={{ margin: '-8px' }} />
        </div>
      </div>

      <style jsx>{`
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;