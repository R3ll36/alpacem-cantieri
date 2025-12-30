import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { ConstructionSite } from '../types';
import { TargetIcon } from './Icons';

interface MapProps {
  sites: ConstructionSite[];
  onMapClick: (lat: number, lng: number) => void;
  onMapRightClick: (lat: number, lng: number, address: string) => void;
  onSiteClick: (site: ConstructionSite) => void;
  center?: [number, number];
  theme: 'light' | 'dark';
  onLocationFound?: (lat: number, lng: number) => void;
}

export const MapComponent: React.FC<MapProps> = ({ sites, onMapClick, onMapRightClick, onSiteClick, center, theme, onLocationFound }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userLocationLayerRef = useRef<L.LayerGroup | null>(null);
  const hasCenteredRef = useRef(false);
  const lastLocationRef = useRef<L.LatLng | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Create Map
    const map = L.map(mapContainerRef.current, {
      center: [45.4642, 9.1900], // Milan default fallback
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });

    // Add Attribution (Bottom Right)
    L.control.attribution({ position: 'bottomright' }).addTo(map);

    // Google Maps Tiles
    L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; Google Maps'
    }).addTo(map);

    // Layers
    const markersLayer = L.layerGroup().addTo(map);
    const userLocationLayer = L.layerGroup().addTo(map);

    markersLayerRef.current = markersLayer;
    userLocationLayerRef.current = userLocationLayer;
    mapInstanceRef.current = map;

    // Handlers
    map.on('click', (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    });

    map.on('contextmenu', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      // Use precise coordinates instead of reverse geocoding address
      const positionString = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      onMapRightClick(lat, lng, positionString);
    });

    // Handle User Location Found
    map.on('locationfound', (e) => {
      lastLocationRef.current = e.latlng;
      if (onLocationFound) onLocationFound(e.latlng.lat, e.latlng.lng);

      userLocationLayer.clearLayers();
      const radius = e.accuracy / 2;

      // Accuracy Circle
      L.circle(e.latlng, {
        radius: radius,
        color: '#3b82f6', // Tailwind blue-500
        fillColor: '#3b82f6',
        fillOpacity: 0.1,
        weight: 1,
        interactive: false
      }).addTo(userLocationLayer);

      // User Dot (Google Maps style)
      L.circleMarker(e.latlng, {
        radius: 8,
        fillColor: '#3b82f6',
        fillOpacity: 1,
        color: '#ffffff',
        weight: 3,
        interactive: false
      }).addTo(userLocationLayer);

      // Safe Auto-Center on Load (Only once, if no specific center provided)
      if (!center && !hasCenteredRef.current) {
        // Use setTimeout to ensure map is fully initialized
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo(e.latlng, 15, { duration: 1.5 });
          }
        }, 100);
        hasCenteredRef.current = true;
      }
    });

    // Handle Location Error - Progressive Strategy
    let hasTriedLowAccuracy = false;
    map.on('locationerror', (e) => {
      console.warn('Location error:', e.message, e.code);

      // Error codes: 1=PERMISSION_DENIED, 2=POSITION_UNAVAILABLE, 3=TIMEOUT
      if (e.code === 1) {
        console.error('Location permission denied by user');
        return; // Don't retry if user denied permission
      }

      // If high accuracy failed and we haven't tried low accuracy yet, retry with low accuracy
      if (!hasTriedLowAccuracy && (e.code === 2 || e.code === 3)) {
        hasTriedLowAccuracy = true;
        console.log('Retrying with low accuracy (WiFi/Cell)...');
        map.locate({
          watch: true,
          enableHighAccuracy: false,
          timeout: 30000, // Longer timeout for WiFi triangulation
          maximumAge: 300000 // Accept cached location up to 5 minutes old
        });
      }
    });

    // PROGRESSIVE STRATEGY: Try GPS first (high accuracy), fallback to WiFi/Cell if fails
    // Check if geolocation is available
    if (!navigator.geolocation) {
      console.error('⛔ Geolocation is not supported by this browser');
      return;
    }

    console.log('✅ Geolocation API available');

    // Check permissions if API is available
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' as PermissionName }).then((result) => {
        console.log('🔐 Geolocation permission status:', result.state);

        if (result.state === 'denied') {
          console.error('⛔ Location permission DENIED by user. Please enable it in browser settings.');
        }

        // Start location watch regardless (will trigger permission prompt if needed)
        map.locate({
          watch: true,
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        });
      }).catch((err) => {
        console.warn('⚠️ Permissions API not supported or error:', err);
        // Fallback: Start anyway
        map.locate({
          watch: true,
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        });
      });
    } else {
      console.warn('⚠️ Permissions API not available in this browser');
      map.locate({
        watch: true,
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      });
    }

    // Clean up
    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Watch for container resize AND invalidate size immediately on mount
  useEffect(() => {
    if (!mapContainerRef.current || !mapInstanceRef.current) return;

    setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
    }, 50);

    const resizeObserver = new ResizeObserver(() => {
      mapInstanceRef.current?.invalidateSize();
    });

    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Handle Center Updates (Manual)
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.invalidateSize();
      mapInstanceRef.current.flyTo(center, 18, { duration: 1.5 });
    }
  }, [center]);

  // Handle Site Markers Updates
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    sites.forEach(site => {
      const colors = site.color
        ? { fill: site.color, stroke: '#ffffff' }
        : getPinColors(site.status);

      const svgIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${colors.fill}" stroke="${colors.stroke}" stroke-width="1.5" style="filter: drop-shadow(0px 3px 3px rgba(0,0,0,0.3));">
          <path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
        </svg>
      `;

      const icon = L.divIcon({
        className: 'bg-transparent border-none',
        html: svgIcon,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
      });

      const marker = L.marker([site.lat, site.lng], { icon });
      marker.on('click', () => onSiteClick(site));
      marker.addTo(markersLayerRef.current!);
    });

  }, [sites]);

  const handleLocateMe = () => {
    if (mapInstanceRef.current) {
        if (lastLocationRef.current) {
            mapInstanceRef.current.flyTo(lastLocationRef.current, 18, { duration: 1.5 });
        } else {
            // Force restart location search with progressive strategy (try GPS first)
            mapInstanceRef.current.locate({ setView: true, maxZoom: 18, enableHighAccuracy: true, timeout: 10000 });
        }
    }
  };

  return (
    <div className="w-full h-full relative bg-slate-100 dark:bg-slate-800 isolate">
      <div ref={mapContainerRef} className="w-full h-full z-0 outline-none select-none" style={{ WebkitTouchCallout: 'none' }} />

      {/* Disclaimer */}
      <div className="absolute bottom-1 left-1 z-[400] text-[10px] text-slate-500 bg-white/50 px-1 rounded backdrop-blur pointer-events-none">
        Leaflet + Google
      </div>

      {/* Locate Me Button */}
      <button
        onClick={handleLocateMe}
        className="absolute top-36 md:top-10 right-6 md:right-10 z-[400] w-14 h-14 bg-white dark:bg-alpa-500 text-slate-900 dark:text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
        title="La mia posizione"
      >
        <TargetIcon className="w-7 h-7" />
      </button>
    </div>
  );
};

// Helper for colors
const getPinColors = (status: string) => {
  switch (status) {
    case 'active': return { fill: '#fbbf24', stroke: '#d97706' }; // Amber
    case 'completed': return { fill: '#4ade80', stroke: '#16a34a' }; // Green
    case 'issue': return { fill: '#f87171', stroke: '#dc2626' }; // Red
    default: return { fill: '#60a5fa', stroke: '#2563eb' }; // Blue
  }
};
