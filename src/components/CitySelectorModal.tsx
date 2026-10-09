import React, { useState } from 'react';
import { City } from '../types.ts';
import { DEFAULT_CITIES } from '../data/cityData.ts';
import { searchGeocode } from '../services/api.ts';
import { X, Search, MapPin, Globe, Sparkles, Check, ArrowRight } from 'lucide-react';

interface CitySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: City;
  onSelectCity: (city: City) => void;
}

export const CitySelectorModal: React.FC<CitySelectorModalProps> = ({
  isOpen,
  onClose,
  selectedCity,
  onSelectCity
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [liveSearchResults, setLiveSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLiveSearch = async (query: string) => {
    setSearchTerm(query);
    if (query.trim().length < 2) {
      setLiveSearchResults([]);
      setSearchError(null);
      return;
    }

    setSearching(true);
    setSearchError(null);

    try {
      const results = await searchGeocode(query);
      setLiveSearchResults(results || []);
    } catch (err: any) {
      console.warn('Live geocode search issue:', err);
      setSearchError('Live search request timed out or returned no results.');
    } finally {
      setSearching(false);
    }
  };

  const handleSelectNominatimResult = (item: any) => {
    const cityName = item.name || item.address?.city || item.address?.town || item.address?.state || item.display_name.split(',')[0];
    const country = item.address?.country || 'Global';
    const newCity: City = {
      id: `custom-${item.place_id}`,
      name: cityName,
      country: country,
      countryCode: item.address?.country_code?.toUpperCase() || 'GL',
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      zoom: 13,
      timezone: 'auto',
      currency: 'Local',
      language: 'Local',
      flag: '🌐',
      tagline: item.display_name,
      description: `Discovered via OpenStreetMap Nominatim: ${item.display_name}`
    };

    onSelectCity(newCity);
    onClose();
  };

  // Filter curated default cities
  const filteredCuratedCities = DEFAULT_CITIES.filter((c) => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q) || c.tagline.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-700">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Select or Search Any City</h3>
              <p className="text-xs text-slate-500">Explore major global hubs or search any destination worldwide</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar Input */}
        <div className="p-4 bg-slate-50/70 border-b border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => handleLiveSearch(e.target.value)}
              placeholder="Type city name (e.g. Pune, Tokyo, Barcelona, Austin, Seoul)..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition"
            />
            {searching && (
              <span className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin absolute right-3.5 top-1/2 -translate-y-1/2" />
            )}
          </div>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Live OpenStreetMap Nominatim search results */}
          {liveSearchResults.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>OpenStreetMap Global Results ({liveSearchResults.length})</span>
              </div>
              <div className="space-y-2">
                {liveSearchResults.map((item) => (
                  <button
                    key={item.place_id}
                    onClick={() => handleSelectNominatimResult(item)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-teal-400 hover:bg-teal-50/20 text-left transition flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition">
                          {item.display_name.split(',')[0]}
                        </div>
                        <div className="text-xs text-slate-500 line-clamp-1">
                          {item.display_name}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 transition shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Curated Global Hubs */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span>Verified Global Cities</span>
              <span className="text-[10px] text-slate-500 font-semibold">Full POIs & Official Safety Data</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredCuratedCities.map((c) => {
                const isSelected = selectedCity.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectCity(c);
                      onClose();
                    }}
                    className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer group ${
                      isSelected
                        ? 'bg-teal-50 border-teal-300 shadow-2xs'
                        : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl shrink-0">{c.flag}</span>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition truncate">
                          {c.name}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {c.country} • {c.currency}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Real-time Geocoding powered by OpenStreetMap</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
