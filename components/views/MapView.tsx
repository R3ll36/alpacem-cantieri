import React from 'react';
import { MapComponent } from '../MapContainer';
import { PlusIcon } from '../Icons';
import { AppState, ConstructionSite } from '../../types';

interface MapViewProps {
    appState: AppState;
    center?: [number, number];
    onMapClick: (lat: number, lng: number) => void;
    onMapRightClick: (lat: number, lng: number, address: string) => void;
    onSelectSite: (site: ConstructionSite | null) => void;
    onManualAdd: () => void;
    onLocationFound: (lat: number, lng: number) => void;
}

export const MapView: React.FC<MapViewProps> = ({
    appState,
    center,
    onMapClick,
    onMapRightClick,
    onSelectSite,
    onManualAdd,
    onLocationFound
}) => {
    return (
        <div className="w-full h-full">
            <MapComponent
                sites={appState.sites}
                center={center}
                onMapClick={onMapClick}
                onMapRightClick={onMapRightClick}
                onSiteClick={onSelectSite}
                onLocationFound={onLocationFound}
                theme={appState.theme}
            />

            {/* FAB for Mobile Only - MANUAL ADD */}
            {appState.user?.role === 'admin' && (
                <div className="absolute bottom-24 right-4 md:bottom-8 md:right-8 z-[400]">
                    <button
                        onClick={onManualAdd}
                        className="w-14 h-14 bg-alpa-500 text-white rounded-full shadow-xl shadow-alpa-500/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                    >
                        <PlusIcon className="w-7 h-7" />
                    </button>
                </div>
            )}
        </div>
    );
};
