import React from 'react';
import { MapIcon, ListIcon } from '../Icons';

interface MobileBottomNavProps {
  currentView: string;
  onNavigate: (view: 'map' | 'list') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentView, onNavigate }) => {
  return (
    <nav className="md:hidden absolute bottom-0 left-0 right-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50 px-6 py-3 pb-safe z-30 flex justify-between items-center gap-4">
       <button
        onClick={() => onNavigate('map')}
          className={`flex-1 overflow-hidden transition-all duration-300 relative flex flex-col items-center justify-center p-2 rounded-2xl ${
            currentView === 'map'
              ? 'text-alpa-600 dark:text-alpa-400 bg-alpa-50 dark:bg-alpa-900/20'
              : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <MapIcon className={`w-7 h-7 transition-transform duration-300 ${currentView === 'map' ? 'scale-110' : ''}`} />
      </button>
      <button
         onClick={() => onNavigate('list')}
         className={`flex-1 overflow-hidden transition-all duration-300 relative flex flex-col items-center justify-center p-2 rounded-2xl ${
            currentView === 'list'
              ? 'text-alpa-600 dark:text-alpa-400 bg-alpa-50 dark:bg-alpa-900/20'
              : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
      >
        <ListIcon className={`w-7 h-7 transition-transform duration-300 ${currentView === 'list' ? 'scale-110' : ''}`} />
      </button>
    </nav>
  );
};
