import React from 'react';
import { ListIcon } from '../Icons';
import { ConstructionSite } from '../../types';

interface ListViewProps {
  sites: ConstructionSite[];
  onSelectSite: (site: ConstructionSite) => void;
  onEdit: (site: ConstructionSite) => void;
  onDelete: (siteId: string) => void;
}

export const ListView: React.FC<ListViewProps> = ({ sites, onSelectSite, onEdit, onDelete }) => {
  return (
    <div className="w-full h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 pt-32 md:pt-6 pb-24 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Cantieri Attivi</h2>
          <span className="text-sm text-slate-500 bg-white dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
            {sites.length} Cantieri
          </span>
        </div>

        {sites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
            <ListIcon className="w-12 h-12 mb-4 opacity-20" />
            <p>Nessun cantiere in programma.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sites.map(site => (
              <div
                key={site.id}
                onClick={() => onSelectSite(site)}
                className="group bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md hover:border-alpa-200 dark:hover:border-alpa-900 transition-all cursor-pointer relative overflow-hidden"
              >
                  <div
                    className="absolute top-0 left-0 w-1.5 h-full opacity-80"
                    style={{ backgroundColor: site.color }}
                  ></div>

                  <div className="flex justify-between items-start mb-3 pl-3">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{site.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{site.address}</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <div
                        className="w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 shadow-sm"
                        style={{ backgroundColor: site.color }}
                      ></div>
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); onEdit(site); }}
                          className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                          title="Modifica"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button
                           onClick={(e) => {
                             e.stopPropagation();
                             if(confirm('Eliminare cantiere?')) onDelete(site.id);
                           }}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                          title="Elimina"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pl-2 mt-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      {new Date(site.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short'})}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {site.time}
                    </div>
                    <div className="ml-auto font-mono text-slate-900 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {site.volume} m³
                    </div>
                  </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
