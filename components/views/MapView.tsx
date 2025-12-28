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

            {/* FAB Moved to App.tsx for persistence */}
        </div>
    );
};
