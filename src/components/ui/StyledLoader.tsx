import React from 'react';
import { Loader2 } from 'lucide-react';

const StyledLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full min-h-screen">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-4 border-t-indigo-500 border-r-purple-500 border-b-pink-500 border-l-indigo-300 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-16 w-16 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-indigo-500 animate-pulse" />
          </div>
        </div>
      </div>
      <p className="mt-4 text-lg font-medium bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
        Chargement...
      </p>
    </div>
  );
};

export default StyledLoader;