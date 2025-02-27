
import React from 'react';
import { Loader2 } from 'lucide-react';

const CardLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[120px] w-full">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-2 border-t-indigo-500 border-r-purple-500 border-b-pink-500 border-l-indigo-300 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center">
            <Loader2 className="h-4 w-4 text-indigo-500 animate-pulse" />
          </div>
        </div>
      </div>
      <p className="mt-2 text-sm font-medium bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
        Chargement...
      </p>
    </div>
  );
};

export default CardLoader;
