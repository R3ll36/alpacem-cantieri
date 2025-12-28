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

import { useVersionCheck } from './hooks/useVersionCheck';

const App: React.FC = () => {
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

    // 2. Fallback: Try fresh GPS request (Slower, might timeout)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsAddingSite({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
          });
        },
        (error) => {
          console.error("Error getting location", error);
          // 3. Last resort: Default 0,0
          setIsAddingSite({ lat: 0, lng: 0, address: '' });
        },
        // Add timeout and high accuracy options
        { timeout: 5000, enableHighAccuracy: true, maximumAge: 0 }
      );
    } else {
      setIsAddingSite({ lat: 0, lng: 0, address: '' });
    }
  };

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
      </main>

      {/* DRAWERS / MODALS - NOW HANDLED AS SLIDE-OVERS FOR BETTER UX */}
      {isAddingSite && appState.user && (
        <SiteModal
          initialLat={isAddingSite.lat}
          initialLng={isAddingSite.lng}
          initialAddress={isAddingSite.address}
          userUid={appState.user.uid}
          onClose={() => setIsAddingSite(null)}
          onSave={handleSaveNewSite}
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
