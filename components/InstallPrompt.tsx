import React, { useEffect, useState } from 'react';

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showAndroidPrompt, setShowAndroidPrompt] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);

  useEffect(() => {
    // 1. Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) return; // Don't show if already installed

    // 2. Detect Platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);

    if (isIOS) {
      // 3. iOS Logic: Show prompt after a delay (e.g., 3s)
      const timer = setTimeout(() => {
         setShowIOSPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      // 4. Android/Chrome Logic: Listen for event
      const handler = (e: any) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShowAndroidPrompt(true);
      };
      window.addEventListener('beforeinstallprompt', handler);
      return () => window.removeEventListener('beforeinstallprompt', handler);
    }
  }, []);

  const handleAndroidInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowAndroidPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const closePrompt = () => {
    setShowAndroidPrompt(false);
    setShowIOSPrompt(false);
  };

  if (!showAndroidPrompt && !showIOSPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[500] p-4 flex justify-center items-end pointer-events-none">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl shadow-black/20 p-5 pointer-events-auto border border-slate-100 dark:border-slate-700 animate-in slide-in-from-bottom-10 fade-in duration-500">

        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white p-1 rounded-xl flex items-center justify-center shadow-sm shrink-0 border border-slate-100">
               <img
                src="https://www.alpacem.com/wp-content/themes/alpacem/img/logo.svg"
                alt="Logo"
                className="w-full h-full object-contain"
               />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight">
                Installa App
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                Alpacem Cantieri
              </p>
            </div>
          </div>

          <button
            onClick={closePrompt}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content based on Platform */}
        {showAndroidPrompt && (
            <button
              onClick={handleAndroidInstall}
              className="w-full bg-alpa-500 hover:bg-alpa-600 text-white font-bold text-base py-3.5 rounded-xl shadow-lg shadow-alpa-500/30 active:scale-[0.98] transition-all"
            >
              Installa Ora
            </button>
        )}

        {showIOSPrompt && (
            <div className="space-y-3">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                    Installa l'app in 2 passaggi:
                </p>
                <div className="flex items-center gap-3 text-sm font-medium text-slate-800 dark:text-slate-100 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <span className="flex items-center justify-center w-6 h-6 bg-slate-200 dark:bg-slate-600 rounded-full text-xs">1</span>
                    <span>Tocca il tasto <span className="font-bold">Condividi</span></span>
                    <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-slate-800 dark:text-slate-100 p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <span className="flex items-center justify-center w-6 h-6 bg-slate-200 dark:bg-slate-600 rounded-full text-xs">2</span>
                    <span>Seleziona <span className="font-bold">Aggiungi alla Home</span></span>
                    <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};
