import React, { useState } from 'react';
import { ConstructionSite, User, Note } from '../types';
import { SiteInfoTab } from './site-detail/SiteInfoTab';
import { SiteNotesTab } from './site-detail/SiteNotesTab';
import { SitePhotosTab } from './site-detail/SitePhotosTab';

interface SiteDetailProps {
  site: ConstructionSite;
  user: User;
  onClose: () => void;
  onUpdate: (updatedSite: ConstructionSite) => void;
  onEdit: (site: ConstructionSite) => void;
  onDelete: (siteId: string) => void;
}

export const SiteDetail: React.FC<SiteDetailProps> = ({ site, user, onClose, onUpdate, onEdit, onDelete }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'notes' | 'photos'>('info');

  const handleStatusChange = (status: string) => {
    onUpdate({ ...site, status: status as any });
  };

  const handleAddNote = (text: string) => {
    const note: Note = {
      id: Date.now().toString(),
      text: text,
      authorId: user.uid,
      authorName: user.displayName,
      timestamp: Date.now()
    };
    onUpdate({ ...site, notes: [...site.notes, note] });
  };

  const handlePhotoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      onUpdate({ ...site, images: [...site.images, reader.result as string] });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm pointer-events-auto transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <div className="pointer-events-auto w-full md:w-[480px] h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col transform transition-transform duration-700 animate-in slide-in-from-right">

        {/* Header */}
        <div className="flex-none p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-white dark:bg-slate-900 z-10">
          <div className="pr-4">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-tight">{site.name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium truncate">{site.address}</p>
          </div>
          <div className="flex items-center gap-2">
            {user.role !== 'guest' && (
              <button
                 onClick={() => onEdit(site)}
                 className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors"
                 title="Modifica"
              >
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
            )}
            {user.role === 'admin' && (
              <button
                 onClick={() => {
                    if (confirm('Sei sicuro di voler eliminare questo cantiere?')) {
                       onDelete(site.id);
                    }
                 }}
                 className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors"
                 title="Elimina"
              >
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            )}
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
            <button
              onClick={onClose}
              className="flex-none w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex-none flex px-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          {['info', 'notes', 'photos'].map((tab) => (
             <button
             key={tab}
             onClick={() => setActiveTab(tab as any)}
             className={`mr-8 py-4 text-sm font-semibold relative transition-colors ${activeTab === tab ? 'text-alpa-600 dark:text-alpa-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
           >
             {tab.charAt(0).toUpperCase() + tab.slice(1)}
             <span className="ml-1.5 text-xs opacity-70 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">
                {tab === 'notes' ? site.notes.length : tab === 'photos' ? site.images.length : ''}
                {tab === 'info' && 'ℹ️'}
             </span>
             {activeTab === tab && (
               <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-alpa-500 rounded-t-full"></span>
             )}
           </button>
          ))}
        </div>

        {/* Content Container - Managed by specific tabs */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
            {activeTab === 'info' && (
                <SiteInfoTab
                    site={site}
                    user={user}
                    onStatusChange={handleStatusChange}
                />
            )}

            {activeTab === 'notes' && (
                <SiteNotesTab
                    site={site}
                    user={user}
                    onAddNote={handleAddNote}
                />
            )}

            {activeTab === 'photos' && (
                <SitePhotosTab
                    site={site}
                    user={user}
                    onPhotoUpload={handlePhotoUpload}
                />
            )}
        </div>
      </div>
    </div>
  );
};
