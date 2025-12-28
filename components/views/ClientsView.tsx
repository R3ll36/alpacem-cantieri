
import React, { useState } from 'react';
import { ConstructionSite, User } from '../../types';
import { ListIcon } from '../Icons';
import { stringToColor } from '../../utils/colorUtils';

interface ClientsViewProps {
  sites: ConstructionSite[];
  user: User | null;
  onNavigateToSite: (site: ConstructionSite) => void;
  onUpdateClientColor: (clientName: string, newColor: string) => void;
  onEdit: (site: ConstructionSite) => void;
  onDelete: (siteId: string) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  sites,
  user,
  onNavigateToSite,
  onUpdateClientColor,
  onEdit,
  onDelete
}) => {

  // Group sites by Client Name
  const groupedSites = sites.reduce((acc, site) => {
    if (!acc[site.name]) {
      acc[site.name] = [];
    }
    acc[site.name].push(site);
    return acc;
  }, {} as Record<string, ConstructionSite[]>);

  const clientNames = Object.keys(groupedSites).sort();

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 pt-32 md:pt-6 pb-24 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Clienti & Cantieri</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Gestisci i colori e naviga verso i cantieri</p>
          </div>
          <span className="text-sm font-medium text-slate-500 bg-white dark:bg-slate-800 px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
            {clientNames.length} Clienti / {sites.length} Cantieri
          </span>
        </div>

        {sites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
            <ListIcon className="w-12 h-12 mb-4 opacity-20" />
            <p>Nessun cantiere attivo.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {clientNames.map(clientName => {
              const clientSites = groupedSites[clientName];
              const clientColor = clientSites[0]?.color || '#cbd5e1';

              return (
                <div key={clientName} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">

                  {/* Client Header */}
                  <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative group">
                        <div
                          className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 shadow-md cursor-pointer transition-transform hover:scale-110"
                          style={{ backgroundColor: clientColor }}
                        ></div>
                        <input
                          type="color"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          value={clientColor} // Note: This assumes hex or simple color. HSL might need conversion for input type=color if we want it to show correctly, but it works for setting.
                          onChange={(e) => onUpdateClientColor(clientName, e.target.value)}
                          title="Cambia colore cliente"
                        />
                         <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 p-0.5 rounded-full border border-slate-200 dark:border-slate-700 pointer-events-none">
                           <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                         </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{clientName}</h3>
                        <p className="text-xs text-slate-500 font-medium">{clientSites.length} {clientSites.length === 1 ? 'Cantiere' : 'Cantieri'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Sites List */}
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {clientSites.map(site => (
                      <div
                        key={site.id}
                        onClick={() => onNavigateToSite(site)}
                        className="group flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                           <div className="w-2 h-12 rounded-full opacity-30 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: site.color }}></div>
                           <div className="min-w-0 flex-1">
                             <h4 className="font-semibold text-slate-900 dark:text-white truncate pr-2" title={site.address}>
                               {site.address.length > 35 ? site.address.substring(0, 35) + '...' : site.address}
                             </h4>
                             <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                               <span className="flex items-center gap-1">
                                 <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                 {new Date(site.date).toLocaleDateString()}
                               </span>
                               <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300 font-mono">
                                 {site.volume} m³
                               </span>
                             </div>
                           </div>
                        </div>

                        <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            {user?.role !== 'guest' && (
                              <button
                                onClick={(e) => { e.stopPropagation(); onEdit(site); }}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-600 transition-colors"
                                title="Modifica"
                              >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                              </button>
                            )}
                            {user?.role === 'admin' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if(confirm('Eliminare cantiere?')) onDelete(site.id);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-600 transition-colors"
                            title="Elimina"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        )}
                            <div className="w-8 h-8 flex items-center justify-center text-slate-300">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
