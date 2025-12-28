import React from 'react';
import { MapIcon, ListIcon } from '../Icons';

interface MobileBottomNavProps {
  currentView: string;
  onNavigate: (view: 'map' | 'list') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentView, onNavigate }) => {
  return (
    <nav className="md:hidden absolute bottom-0 left-0 right-0 bg-white/10 dark:bg-slate-900/10 backdrop-blur-xl border-t border-slate-200/10 dark:border-slate-800/10 px-6 py-3 pb-safe z-30 flex justify-between items-center gap-4">
       <button
        onClick={() => onNavigate('map')}
          className={`flex-1 overflow-hidden transition-all duration-300 relative flex flex-col items-center justify-center p-2 rounded-2xl ${
            currentView === 'map'
              ? 'text-alpa-600 dark:text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <MapIcon className={`w-7 h-7 transition-transform duration-300 ${currentView === 'map' ? 'scale-110' : ''}`} />
      </button>
      <button
         onClick={() => onNavigate('list')}
         className={`flex-1 overflow-hidden transition-all duration-300 relative flex flex-col items-center justify-center p-2 rounded-2xl ${
            currentView === 'list'
              ? 'text-alpa-600 dark:text-white'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
      >
        <ListIcon className={`w-7 h-7 transition-transform duration-300 ${currentView === 'list' ? 'scale-110' : ''}`} />
      </button>
    </nav>
  );
};
