import React, { useState } from 'react';
import { City } from '../types.ts';
import { searchGeocode } from '../services/api.ts';
import {
  Globe,
  Search,
  MapPin,
  Check,
  ArrowRight,
  Sparkles,
  Compass,
  Clock,
  DollarSign
} from 'lucide-react';

interface ExploreCitiesPageProps {
  currentCity: City;
  availableCities: City[];
  onSelectCity: (city: City) => void;
  onNavigateToDashboard: () => void;
}

export const ExploreCitiesPage: React.FC<ExploreCitiesPageProps> = ({
  currentCity,
  availableCities,
  onSelectCity,
  onNavigateToDashboard
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [liveResults, setLiveResults] = useState<any[]>([]);
  const [isSearchingLive, setIsSearchingLive] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const regions = [
    { id: 'all', label: 'All Global Hubs' },
    { id: 'IN', label: 'India (Pune, Mumbai, Delhi, Bengaluru)' },
    { id: 'JP', label: 'Japan (Tokyo)' },
    { id: 'US', label: 'United States' },
    { id: 'EU', label: 'Europe (London, Paris, Berlin)' },
    { id: 'APAC', label: 'Asia-Pacific' }
  ];

  const handleLiveSearch = async (query: string) => {
    setSearchTerm(query);
    if (query.trim().length < 2) {
      setLiveResults([]);
      return;
    }

    setIsSearchingLive(true);
    try {
      const results = await searchGeocode(query);
      setLiveResults(results || []);
    } catch (err) {
      console.warn('Geocoding search issue:', err);
    } finally {
      setIsSearchingLive(false);
    }
  };

  const handleSelectNominatimResult = (item: any) => {
    const cityName =
      item.name ||
      item.address?.city ||
      item.address?.town ||
      item.address?.state ||
      item.display_name.split(',')[0];
    const country = item.address?.country || 'Global';
    const newCity: City = {
      id: `custom-${item.place_id || Date.now()}`,
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
    onNavigateToDashboard();
  };

  const filteredCurated = availableCities.filter((c) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q) ||
      c.tagline.toLowerCase().includes(q);

    let matchesRegion = true;
    if (selectedRegion === 'IN') matchesRegion = c.countryCode === 'IN';
    else if (selectedRegion === 'JP') matchesRegion = c.countryCode === 'JP';
    else if (selectedRegion === 'US') matchesRegion = c.countryCode === 'US';
    else if (selectedRegion === 'EU')
      matchesRegion = ['GB', 'FR', 'DE'].includes(c.countryCode);
    else if (selectedRegion === 'APAC')
      matchesRegion = ['JP', 'SG', 'AU', 'IN'].includes(c.countryCode);

    return matchesSearch && matchesRegion;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <Globe className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                Global Urban Network
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Explore Worldwide Cities
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Switch your primary dashboard focal point between major international hubs or search any destination globally using OpenStreetMap geocoding.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 shrink-0">
            <span className="text-2xl">{currentCity.flag}</span>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Current Active</div>
              <div className="text-sm font-bold text-slate-900">{currentCity.name}, {currentCity.country}</div>
            </div>
          </div>
        </div>

        {/* Search Bar Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleLiveSearch(e.target.value)}
            placeholder="Search any city worldwide (e.g. Pune, Tokyo, Berlin, Austin, Kyoto)..."
            className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition"
          />
          {isSearchingLive && (
            <span className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin absolute right-4 top-1/2 -translate-y-1/2" />
          )}
        </div>

        {/* Region Filter Pills */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {regions.map((reg) => (
            <button
              key={reg.id}
              onClick={() => setSelectedRegion(reg.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition whitespace-nowrap cursor-pointer ${
                selectedRegion === reg.id
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {reg.label}
            </button>
          ))}
        </div>
      </section>

      {/* Live Nominatim Geocoding Results if searching custom */}
      {liveResults.length > 0 && (
        <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-teal-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OpenStreetMap Global Search Results ({liveResults.length})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {liveResults.map((item) => (
              <button
                key={item.place_id}
                onClick={() => handleSelectNominatimResult(item)}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/20 text-left transition flex items-center justify-between group cursor-pointer"
              >
                <div className="min-w-0 pr-2">
                  <div className="text-sm font-bold text-slate-900 group-hover:text-teal-700 truncate">
                    {item.display_name.split(',')[0]}
                  </div>
                  <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {item.display_name}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 shrink-0 transition" />
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Curated Verified Cities Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            Verified Smart City Profiles ({filteredCurated.length})
          </h2>
          <span className="text-xs text-slate-500">
            Full OpenStreetMap POIs & Official Safety Portals
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCurated.map((c) => {
            const isCurrent = currentCity.id === c.id;
            return (
              <div
                key={c.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-teal-50/50 border-teal-300 ring-2 ring-teal-600/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-3xl">{c.flag}</span>
                    {isCurrent ? (
                      <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Active Dashboard City
                      </span>
                    ) : (
                      <span className="text-xs font-mono text-slate-400">
                        {c.countryCode}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">
                    {c.name}
                  </h3>
                  <div className="text-xs font-semibold text-teal-700 mb-2">
                    {c.country}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed">
                    {c.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 mb-4 pt-2 border-t border-slate-100">
                    <div>🕒 {c.timezone}</div>
                    <div>💰 {c.currency}</div>
                    <div>🗣️ {c.language.split(',')[0]}</div>
                    <div>📍 {c.lat.toFixed(2)}°, {c.lon.toFixed(2)}°</div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectCity(c);
                    onNavigateToDashboard();
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    isCurrent
                      ? 'bg-teal-600 text-white hover:bg-teal-700'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <span>{isCurrent ? 'Open Dashboard' : 'Select This City'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
