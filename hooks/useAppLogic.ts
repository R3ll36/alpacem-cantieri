import { useState, useEffect } from 'react';
import { storageService } from '../services/storage';
import { authService } from '../services/auth';
import { AppState, ConstructionSite, User, UserRole } from '../types';

export const useAppLogic = () => {
  const [appState, setAppState] = useState<AppState>({
    user: null,
    sites: [],
    theme: 'light',
    view: 'login'
  });

  const [selectedSite, setSelectedSite] = useState<ConstructionSite | null>(null);
  const [isAddingSite, setIsAddingSite] = useState<{ lat: number, lng: number, address?: string } | null>(null);
  const [editingSite, setEditingSite] = useState<ConstructionSite | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Initial Load & Auth Listener
  useEffect(() => {
    // Theme & Storage Local Init
    const initLocal = async () => {
      const theme = storageService.getTheme();
      storageService.saveTheme(theme);
      setAppState(prev => ({ ...prev, theme }));
    };
    initLocal();

    // Sites Subscription (or fetch)
    const loadSites = async () => {
      const sites = await storageService.getSites();
      setAppState(prev => ({ ...prev, sites }));
    };
    loadSites();

    // Auth Listener
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setAppState(prev => ({
        ...prev,
        user,
        view: user ? 'map' : 'login'
      }));
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Auth Handlers
  const handleLogin = async (email: string, pass: string) => {
    try {
      await authService.login(email, pass);
    } catch (error) {
      console.error("Login failed", error);
      alert("Errore durante il login. Controlla le credenziali.");
    }
  };

  const handleRegister = async (email: string, pass: string, name: string, role: UserRole) => {
    try {
      await authService.register(email, pass, name, role);
    } catch (error) {
      console.error("Registration failed", error);
      alert("Errore durante la registrazione: " + (error as any).message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authService.loginWithGoogle();
    } catch (error) {
      console.error("Google Login failed", error);
      alert("Errore login Google");
    }
  };


  const handleLogout = async () => {
    await authService.logout();
    setAppState(prev => ({ ...prev, user: null, view: 'login' }));
  };

  const toggleTheme = () => {
    const newTheme = appState.theme === 'light' ? 'dark' : 'light';
    storageService.saveTheme(newTheme);
    setAppState(prev => ({ ...prev, theme: newTheme }));
  };

  const handleMapClick = (lat: number, lng: number) => {
    if (selectedSite) {
      setSelectedSite(null);
    }
  };

  const handleMapRightClick = (lat: number, lng: number, address: string) => {
    if (appState.user?.role === 'admin') {
      setIsAddingSite({ lat, lng, address });
    }
  };

  const handleSaveNewSite = async (site: ConstructionSite) => {
    // Optimistic Update
    setAppState(prev => ({ ...prev, sites: [...prev.sites, site] }));
    setIsAddingSite(null);

    // Async Save
    await storageService.saveSite(site);
  };

  const handleUpdateSite = async (site: ConstructionSite) => {
    // Optimistic Update
    setAppState(prev => ({
      ...prev,
      sites: prev.sites.map(s => s.id === site.id ? site : s)
    }));
    setSelectedSite(site); // Update selected if open

    // Async Save
    await storageService.saveSite(site);
  };

  const handleDeleteSite = async (siteId: string) => {
    // Optimistic Update
    setAppState(prev => ({
      ...prev,
      sites: prev.sites.filter(s => s.id !== siteId)
    }));
    setSelectedSite(null);

    // Async Delete
    await storageService.deleteSite(siteId);
  };

  const handleUpdateClientColor = async (clientName: string, newColor: string) => {
    // Optimistic Update
    const updatedSites = appState.sites.map(site => {
      if (site.name === clientName) {
        return { ...site, color: newColor };
      }
      return site;
    });
    setAppState(prev => ({ ...prev, sites: updatedSites }));

    // Async Save (Updating multiple docs - simpler to just loop calls here without batch for now)
    const sitesToUpdate = updatedSites.filter(s => s.name === clientName);
    await Promise.all(sitesToUpdate.map(s => storageService.saveSite(s)));
  };


  const setView = (view: 'map' | 'list' | 'login') => {
    setAppState(prev => ({ ...prev, view }));
  };

  return {
    appState,
    selectedSite,
    isAddingSite,
    editingSite,
    mapCenter,
    setAppState,
    setSelectedSite,
    setIsAddingSite,
    setEditingSite,
    setMapCenter,
    userLocation,
    setUserLocation,
    handleLogin,
    handleRegister,
    handleGoogleLogin,
    handleLogout,
    isAuthLoading, // Export this
    toggleTheme,
    handleMapClick,
    handleMapRightClick,
    handleSaveNewSite,
    handleUpdateSite,
    handleDeleteSite,
    handleUpdateClientColor,
    setView
  };
};
