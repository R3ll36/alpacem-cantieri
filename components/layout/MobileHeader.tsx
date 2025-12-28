import React from 'react';
import { AlpacemLogo, MoonIcon, SunIcon } from '../Icons';

interface MobileHeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onLogout: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ theme, onToggleTheme, onLogout }) => {
  return (
    <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-20 absolute top-0 left-0 right-0">
      <div className="w-20 h-20">
         <img src="/app-icon.png" alt="Alpacem" className="w-full h-full object-contain" />
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onToggleTheme} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full dark:hover:bg-slate-800">
           {theme === 'light' ? <MoonIcon className="w-5 h-5"/> : <SunIcon className="w-5 h-5"/>}
        </button>
        <button onClick={onLogout} className="p-2 text-red-500 hover:bg-red-50 rounded-full dark:hover:bg-red-900/20">
           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        </button>
      </div>
    </header>
  );
};
