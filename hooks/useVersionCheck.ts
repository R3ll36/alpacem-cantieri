import { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext';

export const useVersionCheck = () => {
  const { showToast } = useToast();
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);

  useEffect(() => {
    const checkVersion = async () => {
      try {
        // Fetch version.json (bypass cache with timestamp)
        const response = await fetch(`/version.json?t=${Date.now()}`);
        if (!response.ok) return;

        const data = await response.json();
        const serverVersion = data.version;

        if (!currentVersion) {
          // First load: set current version
          setCurrentVersion(serverVersion);
        } else if (serverVersion !== currentVersion) {
          // Version changed: Show Update Toast
          showToast(
            "Nuova versione disponibile! 🚀",
            "info",
            {
              label: "Clicca per aggiornare",
              onClick: () => window.location.reload()
            }
          );
        }
      } catch (error) {
        console.error("Version check failed", error);
      }
    };

    // Check on load
    checkVersion();

    // Check periodically
    const interval = setInterval(checkVersion, 60 * 1000); // Every 1 minute

    // Check when coming back to app
    const onResume = () => {
      if (document.visibilityState === 'visible') {
        checkVersion();
      }
    };

    window.addEventListener('focus', checkVersion);
    document.addEventListener('visibilitychange', onResume);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', checkVersion);
      document.removeEventListener('visibilitychange', onResume);
    };
  }, [currentVersion, showToast]);
};
