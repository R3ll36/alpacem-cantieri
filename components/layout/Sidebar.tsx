import React from 'react';
import { AlpacemLogo, MapIcon, ListIcon, MoonIcon, SunIcon } from '../Icons';
import { AppState } from '../../types';

interface SidebarProps {
  appState: AppState;
  onNavigate: (view: 'map' | 'list') => void;
  onToggleTheme: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ appState, onNavigate, onToggleTheme, onLogout }) => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-30">
      <div className="p-6">
        <div className="w-28">
           <AlpacemLogo className="w-full" />
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        <button
          onClick={() => onNavigate('map')}
          className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${appState.view === 'map' ? 'bg-alpa-50 text-alpa-600 dark:bg-alpa-900/20 dark:text-alpa-400 shadow-sm ring-1 ring-black/5 dark:ring-white/5' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
        >
          <MapIcon className="w-5 h-5" />
          Mappa Cantieri
        </button>
        <button
          onClick={() => onNavigate('list')}
          className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${appState.view === 'list' ? 'bg-alpa-50 text-alpa-600 dark:bg-alpa-900/20 dark:text-alpa-400 shadow-sm ring-1 ring-black/5 dark:ring-white/5' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
        >
          <ListIcon className="w-5 h-5" />
          Clienti
        </button>
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
         <div className="flex items-center justify-between mb-4 px-2">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xs">
               {appState.user?.displayName.charAt(0)}
             </div>
             <div className="flex flex-col">
               <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[100px]">{appState.user?.displayName}</span>
               <span className="text-[10px] text-slate-400 capitalize">{appState.user?.role}</span>
             </div>
           </div>
         </div>

         <div className="flex gap-2">
           <button
            onClick={onToggleTheme}
            className="flex-1 py-2 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-white hover:bg-slate-50 dark:bg-alpa-500 dark:hover:bg-alpa-600 transition-colors"
          >
            {appState.theme === 'light' ? <MoonIcon className="w-4 h-4"/> : <SunIcon className="w-4 h-4"/>}
          </button>

          <button
            onClick={onLogout}
            className="flex-1 py-2 flex items-center justify-center rounded-lg border border-red-200 dark:border-red-900/30 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
         </div>
      </div>
    </aside>
  );
};
