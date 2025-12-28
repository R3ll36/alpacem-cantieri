import React from 'react';
import { CameraIcon } from '../Icons';
import { ConstructionSite, User } from '../../types';

interface SitePhotosTabProps {
  site: ConstructionSite;
  user: User;
  onPhotoUpload: (file: File) => void;
}

export const SitePhotosTab: React.FC<SitePhotosTabProps> = ({ site, user, onPhotoUpload }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onPhotoUpload(e.target.files[0]);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-6">
      <div className="space-y-6 pb-6">
        {site.images.length === 0 && user.role === 'guest' && (
            <div className="text-center py-10 text-slate-400">Nessuna foto disponibile.</div>
        )}

        <div className="grid grid-cols-2 gap-4">
            {site.images.map((img, idx) => (
            <div key={idx} className="aspect-square rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 relative group shadow-sm border border-slate-200 dark:border-slate-800">
                <img src={img} alt="Site" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>
            ))}
        </div>

        {user.role !== 'guest' && (
            <label className="flex flex-col items-center justify-center gap-3 w-full p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl cursor-pointer hover:bg-white dark:hover:bg-slate-900 hover:border-alpa-400 transition-all group bg-slate-100/50 dark:bg-slate-900/50">
            <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-sm group-hover:shadow-md transition-all">
                <CameraIcon className="w-6 h-6 text-slate-400 group-hover:text-alpa-500" />
            </div>
            <span className="text-sm font-semibold text-slate-500 group-hover:text-alpa-600">Scatta o Carica foto</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
        )}
      </div>
    </div>
  );
};
