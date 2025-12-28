import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { ConstructionSite } from '../types';
import { stringToColor } from '../utils/colorUtils';

interface SiteModalProps {
  initialLat: number;
  initialLng: number;
  initialAddress?: string;
  userUid: string;
  onClose: () => void;
  onSave: (site: ConstructionSite) => void;
  siteToEdit?: ConstructionSite | null;
  existingSites: ConstructionSite[];
}

export const SiteModal: React.FC<SiteModalProps> = ({ initialLat, initialLng, initialAddress, userUid, onClose, onSave, siteToEdit, existingSites }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: siteToEdit?.name || '',
    address: siteToEdit?.address || initialAddress || '',
    date: siteToEdit?.date || new Date().toISOString().split('T')[0],
    time: siteToEdit?.time || '08:00',
    volume: siteToEdit?.volume || 0,
  });

  // Mutable coordinates (either from props or parsed from address)
  const [coords, setCoords] = useState<{lat: number, lng: number}>({
    lat: siteToEdit?.lat || initialLat,
    lng: siteToEdit?.lng || initialLng
  });

  // State for link resolution (prevents duplicate requests)
  const [isResolving, setIsResolving] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Check if this is a manual entry (we passed 0,0 from the FAB) AND we are not editing
  const isManualEntry = !siteToEdit && initialLat === 0 && initialLng === 0;

  useEffect(() => {
    if (initialAddress && !siteToEdit) {
      setFormData(prev => ({ ...prev, address: initialAddress }));
    }
  }, [initialAddress, siteToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if client exists and has a color, otherwise generate one
    const existingClientSite = existingSites.find(s => s.name === formData.name);
    const clientColor = existingClientSite ? existingClientSite.color : stringToColor(formData.name);

    const newSite: ConstructionSite = {
      id: siteToEdit?.id || Date.now().toString(),
      ...formData,
      ...formData,
      lat: coords.lat,
      lng: coords.lng,
      status: siteToEdit?.status || 'planned',
      notes: siteToEdit?.notes || [],
      images: siteToEdit?.images || [],
      color: clientColor,
      createdBy: siteToEdit?.createdBy || userUid
    };
    onSave(newSite);
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Form */}
      <div className="relative w-full md:w-[420px] h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col animate-in slide-in-from-right duration-700">

        {/* Header */}
        <div className="flex-none bg-slate-900 dark:bg-slate-950 p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          <h2 className="text-xl font-bold relative z-10">{siteToEdit ? 'Modifica Cantiere' : 'Nuovo Cantiere'}</h2>
          <div className="flex items-center gap-2 text-slate-300 text-xs mt-2 relative z-10 font-mono">
            {isManualEntry ? (
              <>
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                   <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                 </svg>
                 <span>Inserimento Manuale</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                  <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.006.003.002.001.003.001a.75.75 0 00.014-.001zM10 15a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                </svg>
                <span>{coords.lat ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` : 'Nessuna posizione'}</span>
              </>
            )}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 p-6">
          <form id="site-form" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Cliente / Cantiere</label>
              <input
                required
                autoFocus
                type="text"
                className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-alpa-500 focus:border-alpa-500 outline-none transition-all shadow-sm"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="Es. Impresa Rossi"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                Indirizzo
                {(isResolving || isSearching) && (
                  <span className="ml-2 text-alpa-500 text-xs font-normal">
                    🔍 Ricerca in corso...
                  </span>
                )}
              </label>
              <div className="relative">
                <input
                  required
                  type="text"
                  className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-alpa-500 focus:border-alpa-500 outline-none transition-all shadow-sm"
                  value={formData.address}
                  onChange={async (e) => {
                      const text = e.target.value;
                      setFormData({...formData, address: text});

                      // Clear previous search timeout
                      if (searchTimeoutRef.current) {
                          clearTimeout(searchTimeoutRef.current);
                      }

                      // 1. Standard Coordinate Extraction (Fast, runs first)
                      const coordRegex = /[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)/;
                      const match = text.match(coordRegex);

                      if (match) {
                          const [fullMatch] = match;
                          const [latStr, lngStr] = fullMatch.split(',');
                          const lat = parseFloat(latStr.trim());
                          const lng = parseFloat(lngStr.trim());
                          if (!isNaN(lat) && !isNaN(lng)) {
                              setCoords({ lat, lng });
                              return; // Found coords, no need to resolve links or search
                          }
                      }

                      // 2. Link Decoding (Slower, only if no direct coords found)
                      const shortLinkRegex = /(https?:\/\/(maps\.app\.goo\.gl|goo\.gl|bit\.ly)\/[^\s]+)/;
                      const linkMatch = text.match(shortLinkRegex);

                      if (linkMatch && !isResolving) {
                          const shortUrl = linkMatch[0];
                          setIsResolving(true);
                          try {
                              const res = await fetch(`https://unshorten.me/json/${shortUrl}`);
                              const data = await res.json();
                              if (data.success && data.resolved_url) {
                                  const decodedUrl = decodeURIComponent(data.resolved_url);
                                  const robustRegex = /(-?\d{1,3}\.\d{3,})[,\s]\s*(?:\+)?(-?\d{1,3}\.\d{3,})/;
                                  const coordsMatch = decodedUrl.match(robustRegex);

                                  if (coordsMatch) {
                                      const lat = parseFloat(coordsMatch[1]);
                                      const lng = parseFloat(coordsMatch[2]);
                                      if(!isNaN(lat) && !isNaN(lng)) {
                                          setCoords({lat, lng});
                                          showToast("Posizione trovata dal link!", "success");
                                      }
                                  }
                              }
                          } catch (err) {
                              console.error("Link expansion failed", err);
                          } finally {
                              setIsResolving(false);
                          }
                          return; // Link found, don't search address
                      }

                      // 3. Address Geocoding (Slowest, debounced)
                      // Only search if text is long enough and doesn't look like coords/links
                      if (text.length >= 5 && !text.startsWith('http')) {
                          searchTimeoutRef.current = setTimeout(async () => {
                              setIsSearching(true);
                              try {
                                  // Use Nominatim OpenStreetMap Geocoding API (Free, no API key needed)
                                  const encodedAddress = encodeURIComponent(text);
                                  const res = await fetch(
                                      `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1&addressdetails=1`,
                                      {
                                          headers: {
                                              'User-Agent': 'Alpacem-Cantieri-App'
                                          }
                                      }
                                  );
                                  const data = await res.json();

                                  if (data && data.length > 0) {
                                      const result = data[0];
                                      const lat = parseFloat(result.lat);
                                      const lng = parseFloat(result.lon);

                                      if (!isNaN(lat) && !isNaN(lng)) {
                                          setCoords({ lat, lng });
                                          showToast(`Posizione trovata: ${result.display_name.substring(0, 50)}...`, "success");
                                      }
                                  }
                              } catch (err) {
                                  console.error("Address geocoding failed", err);
                              } finally {
                                  setIsSearching(false);
                              }
                          }, 1000); // Wait 1 second after user stops typing
                      }
                  }}
                  placeholder={isManualEntry ? "Coordinate o Indirizzo" : "Via Principale 12, Città"}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Data</label>
                <input
                  type="date"
                  className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-alpa-500 shadow-sm"
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Ora</label>
                <input
                  type="time"
                  className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-alpa-500 shadow-sm"
                  value={formData.time}
                  onChange={e => setFormData({...formData, time: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Metri Cubi</label>
              <div className="relative">
                <input
                  type="number"
                  className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-alpa-500 shadow-sm"
                  value={formData.volume}
                  onChange={e => setFormData({...formData, volume: Number(e.target.value)})}
                />
                <span className="absolute right-4 top-3.5 text-slate-400 text-sm">m³</span>
              </div>
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="flex-none p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              Annulla
            </button>
            <button
              type="submit"
              form="site-form"
              className="flex-[2] py-3.5 bg-alpa-500 hover:bg-alpa-600 text-white font-bold rounded-xl shadow-lg shadow-alpa-500/30 transition-all transform active:scale-[0.98]"
            >
              {siteToEdit ? 'Salva Modifiche' : 'Conferma Cantiere'}
            </button>
        </div>
      </div>
    </div>
  );
};
