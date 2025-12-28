import React from 'react';
import { NavigationIcon } from '../Icons';
import { ConstructionSite, User } from '../../types';

interface SiteInfoTabProps {
  site: ConstructionSite;
  user: User;
  onStatusChange: (status: string) => void;
}

export const SiteInfoTab: React.FC<SiteInfoTabProps> = ({ site, user, onStatusChange }) => {
  const openNavigation = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${site.lat},${site.lng}`, '_blank');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-6">
      <div className="space-y-6 pb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center items-center text-center">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Data</span>
            <div className="font-bold text-slate-900 dark:text-white text-xl">
              {new Date(site.date).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center items-center text-center">
             <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Orario</span>
             <div className="font-bold text-slate-900 dark:text-white text-xl">{site.time}</div>
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={openNavigation}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
          >
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Avvia Navigazione
          </button>
          <p className="text-center text-xs text-slate-400">Apre Google Maps per le indicazioni</p>
        </div>
      </div>
    </div>
  );
};
