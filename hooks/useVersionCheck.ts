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

    // Initial check
    checkVersion();

    // Periodic check (every 2 minutes)
    const interval = setInterval(checkVersion, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, [currentVersion, showToast]);
};
