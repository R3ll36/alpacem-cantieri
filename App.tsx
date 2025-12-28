import React from 'react';
import { useAppLogic } from './hooks/useAppLogic';
import { Sidebar } from './components/layout/Sidebar';
import { MobileHeader } from './components/layout/MobileHeader';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { LoginView } from './components/views/LoginView';
import { ClientsView } from './components/views/ClientsView';
import { MapView } from './components/views/MapView';
import { SiteDetail } from './components/SiteDetail';
import { SiteModal } from './components/SiteModal';
import { InstallPrompt } from './components/InstallPrompt';

import { useToast } from './context/ToastContext';
import { useVersionCheck } from './hooks/useVersionCheck';

const App: React.FC = () => {
  const { showToast } = useToast();
  useVersionCheck(); // Active auto-update check

  const {
    appState,
    selectedSite,
    isAddingSite,
    setSelectedSite,
    setIsAddingSite,
    handleLogin,
    handleRegister,
    handleGoogleLogin,
    handleLogout,
    toggleTheme,
    handleMapClick,
    handleMapRightClick,
    handleSaveNewSite,
    handleUpdateSite,
    handleDeleteSite,
    handleUpdateClientColor,
    editingSite,
    setEditingSite,
    mapCenter,
    setMapCenter,
    setView,
    userLocation,
    setUserLocation,
    isAuthLoading
  } = useAppLogic();

  const handleNavigate = (view: 'map' | 'list') => {
    if (view === 'map') {
      setMapCenter(null);
      setSelectedSite(null);
    }
    setView(view);
  };

  const handleManualAdd = () => {
    // 1. Try cached location from Map (Instant)
    if (userLocation) {
        setIsAddingSite({
            lat: userLocation.lat,
            lng: userLocation.lng,
            address: `${userLocation.lat.toFixed(6)}, ${userLocation.lng.toFixed(6)}`
        });
        return;
    }

    showToast("Ricerca posizione in corso...", "info");

    // 2. PROGRESSIVE STRATEGY: Try GPS first, then WiFi/Cell
    if (navigator.geolocation) {
      // ATTEMPT 1: High Accuracy (GPS)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // ✅ GPS Success - Best accuracy
          setIsAddingSite({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
          });
        },
        (error) => {
          console.warn("High accuracy (GPS) failed, trying low accuracy...", error);

          // Don't retry if permission was denied
          if (error.code === 1) {
            showToast("Permesso posizione negato. Inserisci manualmente.", "error");
            setIsAddingSite({ lat: 0, lng: 0, address: '' });
            return;
          }

          // ATTEMPT 2: Low Accuracy (WiFi/Cell)
          navigator.geolocation.getCurrentPosition(
            (position) => {
              // ✅ WiFi/Cell Success - Approximate location
              setIsAddingSite({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
              });
            },
            (error2) => {
              // ❌ Both attempts failed
              console.error("Both location attempts failed", error2);
              showToast("Impossibile trovare la posizione. Uso 0,0.", "warning");
              // 3. Last resort: Default 0,0
              setIsAddingSite({ lat: 0, lng: 0, address: '' });
            },
            { timeout: 30000, enableHighAccuracy: false, maximumAge: 300000 }
          );
        },
        { timeout: 15000, enableHighAccuracy: true, maximumAge: 0 }
      );
    } else {
      setIsAddingSite({ lat: 0, lng: 0, address: '' });
    }
  };

  // HANDLE SHARE TARGET (Deep Links from WhatsApp/Maps)
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedTitle = params.get('title') || '';
    const sharedText = params.get('text') || '';
    const sharedUrl = params.get('url') || '';

    // Combine all shared content to search for coordinates/links
    const fullContent = `${sharedTitle} ${sharedText} ${sharedUrl}`;

    if (!sharedText && !sharedUrl && !sharedTitle) return;

    // DEBUG: Inform user we received something
    showToast(`Analisi link condiviso...`, 'info');
    console.log("Received Share:", { sharedTitle, sharedText, sharedUrl });

    // 1. Try to find coordinates directly (e.g. "46.123, 13.456")
    // Matches: "46.123, 13.456" or "q=46.123,13.456" or "@46.123,13.456"
    const coordRegex = /[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)/;
    const match = fullContent.match(coordRegex);

    if (match) {
        const [fullMatch] = match;
        const [latStr, lngStr] = fullMatch.split(',');
        const lat = parseFloat(latStr.trim());
        const lng = parseFloat(lngStr.trim());

        if (!isNaN(lat) && !isNaN(lng)) {
            // Found valid coordinates!
            setIsAddingSite({
                lat,
                lng,
                address: sharedText || sharedTitle || 'Posizione Condivisa'
            });
            // Clean URL
            window.history.replaceState({}, '', window.location.pathname);
            return;
        }
    }

    // 2. Fallback: If no coords found but we have text, open Modal with 0,0 and pre-fill address text
    // This allows user to use the text to search or valid manually
    if (sharedText || sharedUrl) {
        setIsAddingSite({
            lat: 0,
            lng: 0,
            address: (sharedText + ' ' + sharedUrl).trim()
        });
        window.history.replaceState({}, '', window.location.pathname);
    }

  }, []);

  if (isAuthLoading) {
    return (
        <div className="h-full w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950">
            <div className="animate-pulse flex flex-col items-center">
                 <div className="w-24 mb-4">
                     {/* Importing Icons here might be tricky if not available, usually Logo is global or component */}
                     <img src="/app-icon.png" className="w-full h-full object-contain opacity-50" alt="Loading..." />
                 </div>
                 <p className="text-slate-400 font-medium">Caricamento...</p>
            </div>
        </div>
    );
  }

  if (appState.view === 'login') {
    return (
        <LoginView
            onLogin={handleLogin}
            onRegister={handleRegister}
            onGoogleLogin={handleGoogleLogin}
        />
    );
  }

  return (
    <div className="h-full w-full flex bg-slate-50 dark:bg-slate-950 overflow-hidden">

      {/* DESKTOP SIDEBAR (Hidden on mobile) */}
      <Sidebar
        appState={appState}
        onNavigate={handleNavigate}
        onToggleTheme={toggleTheme}
        onLogout={handleLogout}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 relative flex flex-col h-full overflow-hidden">

        {/* MOBILE HEADER (Visible only on mobile) */}
        <MobileHeader
            theme={appState.theme}
            onToggleTheme={toggleTheme}
            onLogout={handleLogout}
        />

        {/* CONTENT CONTAINER */}
        <div className="flex-1 relative w-full h-full md:pt-0 pt-0">
           {appState.view === 'map' && (
               <MapView
                  appState={appState}
                  center={mapCenter || undefined}
                  onMapClick={handleMapClick}
                  onMapRightClick={handleMapRightClick}
                  onSelectSite={setSelectedSite}
                  onManualAdd={handleManualAdd}
                  onLocationFound={(lat, lng) => setUserLocation({ lat, lng })}
               />
           )}

           {appState.view === 'list' && (
               <ClientsView
                  sites={appState.sites}
                  user={appState.user}
                  onNavigateToSite={(site) => {
                    setMapCenter([site.lat, site.lng]);
                    setSelectedSite(null);
                    setView('map');
                  }}
                  onUpdateClientColor={handleUpdateClientColor}
                  onEdit={setEditingSite}
                  onDelete={handleDeleteSite}
               />
           )}
        </div>

        {/* MOBILE BOTTOM NAV */}
        <MobileBottomNav
            currentView={appState.view}
            onNavigate={handleNavigate}
        />

        {/* PERSISTENT FAB (Manual Add) - z-index higher than Modal (100) */}
        {appState.user?.role === 'admin' && appState.view === 'map' && !isAddingSite && (
             <div className="absolute bottom-28 right-6 md:bottom-10 md:right-10 z-[50]">
                <button
                    onClick={handleManualAdd}
                    className="w-14 h-14 bg-white dark:bg-alpa-500 text-slate-900 dark:text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300"
                >
                    <div className="w-7 h-7 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </div>
                </button>
             </div>
        )}
      </main>

      {/* DRAWERS / MODALS - NOW HANDLED AS SLIDE-OVERS FOR BETTER UX */}
      {isAddingSite && appState.user && (
        <SiteModal
          initialLat={isAddingSite.lat}
          initialLng={isAddingSite.lng}
          initialAddress={isAddingSite.address}
          userUid={appState.user.uid}
          onClose={() => setIsAddingSite(null)}
          onSave={(site) => {
              handleSaveNewSite(site);
              setMapCenter([site.lat, site.lng]);
              setView('map');
          }}
          existingSites={appState.sites}
        />
      )}

      {editingSite && appState.user && (
        <SiteModal
          initialLat={editingSite.lat}
          initialLng={editingSite.lng}
          initialAddress={editingSite.address}
          userUid={appState.user.uid}
          siteToEdit={editingSite}
          onClose={() => setEditingSite(null)}
          onSave={(updatedSite) => {
             handleUpdateSite(updatedSite);
             setEditingSite(null);
          }}
          existingSites={appState.sites}
        />
      )}

      {selectedSite && appState.user && (
        <SiteDetail
          site={selectedSite}
          user={appState.user}
          onClose={() => setSelectedSite(null)}
          onUpdate={handleUpdateSite}
          onEdit={(site) => {
            setSelectedSite(null); // Close detail when editing
            setEditingSite(site);
          }}
          onDelete={(siteId) => {
            handleDeleteSite(siteId);
            setSelectedSite(null);
          }}
        />
      )}

      {/* PWA INSTALL PROMPT (Visible on both login and main app if not installed) */}
      <InstallPrompt />
    </div>
  );
};

export default App;
