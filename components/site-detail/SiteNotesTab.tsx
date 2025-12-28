import React, { useState, useRef, useEffect } from 'react';
import { SendIcon } from '../Icons';
import { ConstructionSite, User } from '../../types';

interface SiteNotesTabProps {
  site: ConstructionSite;
  user: User;
  onAddNote: (text: string) => void;
}

export const SiteNotesTab: React.FC<SiteNotesTabProps> = ({ site, user, onAddNote }) => {
  const [newNote, setNewNote] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [site.notes]);

  const handleSend = () => {
      if (!newNote.trim()) return;
      onAddNote(newNote);
      setNewNote('');
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-slate-950">
      <div className="flex-1 overflow-y-auto p-6 space-y-4 mb-0">
        <div className="flex-1 space-y-4">
            {site.notes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-slate-400 space-y-3">
                    <span className="text-4xl opacity-20">💬</span>
                    <p className="text-sm">Nessuna nota presente</p>
                </div>
            ) : (
                site.notes.map((note) => (
                <div key={note.id} className={`flex flex-col ${note.authorId === user.uid ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-sm text-sm leading-relaxed ${
                    note.authorId === user.uid
                        ? 'bg-alpa-500 text-white rounded-br-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 rounded-bl-sm border border-slate-200 dark:border-slate-800'
                    }`}>
                    {note.text}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1 font-medium">
                    {note.authorName} • {new Date(note.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                </div>
                ))
            )}
            <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Footer for Actions */}
      {user.role !== 'guest' && (
        <div className="flex-none p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <div className="flex gap-2 items-end bg-slate-50 dark:bg-slate-950 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-alpa-500/20 transition-all">
            <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                }
                }}
                placeholder="Scrivi una nota..."
                className="flex-1 bg-transparent border-none outline-none text-slate-800 dark:text-white placeholder-slate-400 text-sm p-2 resize-none max-h-24 min-h-[44px]"
                rows={1}
            />
            <button
                onClick={handleSend}
                disabled={!newNote.trim()}
                className="p-2.5 bg-alpa-500 text-white rounded-xl hover:bg-alpa-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-0.5"
            >
                <SendIcon className="w-5 h-5" />
            </button>
            </div>
        </div>
      )}
    </div>
  );
};
