import React from 'react';
import { MapIcon, ListIcon } from '../Icons';

interface MobileBottomNavProps {
  currentView: string;
  onNavigate: (view: 'map' | 'list') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentView, onNavigate }) => {
  return (
    <nav className="md:hidden absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-2 pb-safe z-30 flex justify-between items-center">
       <button
        onClick={() => onNavigate('map')}
        className={`flex-1 flex flex-col items-center py-2 rounded-xl transition-colors ${currentView === 'map' ? 'text-alpa-600' : 'text-slate-400'}`}
      >
        <MapIcon className={`w-6 h-6 mb-1 ${currentView === 'map' ? 'fill-current' : ''}`} />
        <span className="text-[10px] font-medium">Mappa</span>
      </button>
      <button
         onClick={() => onNavigate('list')}
         className={`flex-1 flex flex-col items-center py-2 rounded-xl transition-colors ${currentView === 'list' ? 'text-alpa-600' : 'text-slate-400'}`}
      >
        <ListIcon className={`w-6 h-6 mb-1 ${currentView === 'list' ? 'stroke-2' : ''}`} />
        <span className="text-[10px] font-medium">Clienti</span>
      </button>
    </nav>
  );
};
