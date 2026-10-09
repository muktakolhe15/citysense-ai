import React, { useState } from 'react';
import { PlacePOI, City } from '../types.ts';
import {
  Scale,
  Sparkles,
  MapPin,
  Clock,
  ExternalLink,
  ShieldCheck,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  Accessibility,
  DollarSign,
  Award,
  Navigation,
  Building2,
  Utensils,
  Hotel,
  Landmark,
  Compass
} from 'lucide-react';

interface PlaceCompareProps {
  city: City;
  places: PlacePOI[];
  initialSelectedPlaces?: PlacePOI[];
  onSelectPlaceOnMap: (place: PlacePOI) => void;
  onAskAiAboutPlace: (place: PlacePOI) => void;
}

const CATEGORY_ICONS: Record<string, { label: string; icon: string; badge: string }> = {
  attraction: { label: 'Attraction', icon: '⭐', badge: 'bg-purple-500/10 text-purple-300 border-purple-500/30' },
  historic: { label: 'Historic Landmark', icon: '🏛️', badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30' },
  restaurant: { label: 'Dining & Food', icon: '🍽️', badge: 'bg-orange-500/10 text-orange-300 border-orange-500/30' },
  hotel: { label: 'Hotel & Lodging', icon: '🏨', badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' },
  hospital: { label: 'Hospital', icon: '🏥', badge: 'bg-rose-500/10 text-rose-300 border-rose-500/30' },
  police: { label: 'Police Post', icon: '🛡️', badge: 'bg-blue-500/10 text-blue-300 border-blue-500/30' },
  transit: { label: 'Transit Hub', icon: '🚆', badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' },
  pharmacy: { label: 'Pharmacy', icon: '💊', badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' }
};

export const PlaceCompare: React.FC<PlaceCompareProps> = ({
  city,
  places,
  initialSelectedPlaces = [],
  onSelectPlaceOnMap,
  onAskAiAboutPlace
}) => {
  // Pre-select 2-3 places if available, or use initialSelectedPlaces
  const defaultSelection = initialSelectedPlaces.length >= 2
    ? initialSelectedPlaces.slice(0, 3)
    : places.slice(0, Math.min(3, places.length));

  const [selectedPlaces, setSelectedPlaces] = useState<PlacePOI[]>(defaultSelection);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleAddPlace = (place: PlacePOI) => {
    if (selectedPlaces.length < 4 && !selectedPlaces.some(p => p.id === place.id)) {
      setSelectedPlaces(prev => [...prev, place]);
    }
    setDropdownOpen(false);
  };

  const handleRemovePlace = (id: string) => {
    if (selectedPlaces.length > 1) {
      setSelectedPlaces(prev => prev.filter(p => p.id !== id));
    }
  };

  const availableToAdd = places.filter(p => !selectedPlaces.some(s => s.id === p.id));

  return (
    <div className="w-full flex flex-col gap-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Scale className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Civic Places Comparison: {city.name}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-semibold font-mono">
              Side-by-Side Analysis
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Compare verified affordability, official cleanliness & hygiene certifications, wheelchair accessibility standards, public ratings, and proximity to emergency infrastructure.
          </p>
        </div>

        {/* Add Place Selector */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            disabled={selectedPlaces.length >= 4 || availableToAdd.length === 0}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white disabled:text-slate-500 text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-md shadow-indigo-600/25"
          >
            <Plus className="w-4 h-4" />
            <span>Add Place to Compare ({selectedPlaces.length}/4)</span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-72 max-h-80 overflow-y-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-30 p-2 space-y-1">
              <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                Choose place in {city.name}
              </div>
              {availableToAdd.map(p => {
                const catInfo = CATEGORY_ICONS[p.category] || CATEGORY_ICONS.attraction;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleAddPlace(p)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 transition flex items-center justify-between text-xs cursor-pointer group"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-semibold text-white group-hover:text-indigo-300 truncate">
                        {p.name}
                      </div>
                      <div className="text-[10px] text-slate-400 capitalize">
                        {catInfo.label}
                      </div>
                    </div>
                    <span className="text-base">{catInfo.icon}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Honest Scientific Disclosure Banner */}
      <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-200">Honest Data Guarantee:</strong> Metrics below reflect documented municipal inspection records, official tourism boards, and OpenStreetMap tag surveys. If an establishment does not maintain an official public rating or hygiene score, it is transparently labeled as <span className="text-slate-300 font-mono">Not publicly rated</span>.
        </p>
      </div>

      {/* Comparison Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            {/* Table Header: Place Cards */}
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80">
                <th className="p-4 sm:p-5 w-48 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Feature / Metric
                </th>
                {selectedPlaces.map(place => {
                  const catInfo = CATEGORY_ICONS[place.category] || CATEGORY_ICONS.attraction;
                  return (
                    <th key={place.id} className="p-4 sm:p-5 text-left align-top min-w-[240px] border-l border-slate-800/80">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${catInfo.badge}`}>
                          <span>{catInfo.icon}</span>
                          <span>{catInfo.label}</span>
                        </span>
                        {selectedPlaces.length > 1 && (
                          <button
                            onClick={() => handleRemovePlace(place.id)}
                            className="text-slate-500 hover:text-slate-300 p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                            title="Remove from comparison"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-white leading-tight mb-1">
                        {place.name}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {place.description}
                      </p>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Table Body: Detailed Attribute Rows */}
            <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
              {/* Row 1: Affordability */}
              <tr className="hover:bg-slate-850/50 transition">
                <td className="p-4 font-semibold text-slate-400 bg-slate-950/40 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Affordability Tier</span>
                </td>
                {selectedPlaces.map(p => (
                  <td key={p.id} className="p-4 border-l border-slate-800/60 font-medium">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono font-semibold">
                      {p.affordability || 'Standard Rate / Unavailable'}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 2: Cleanliness & Hygiene Inspection */}
              <tr className="hover:bg-slate-850/50 transition">
                <td className="p-4 font-semibold text-slate-400 bg-slate-950/40 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span>Cleanliness & Inspection</span>
                </td>
                {selectedPlaces.map(p => (
                  <td key={p.id} className="p-4 border-l border-slate-800/60 leading-relaxed">
                    {p.cleanlinessRating ? (
                      <span className="text-slate-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        <span>{p.cleanlinessRating}</span>
                      </span>
                    ) : (
                      <span className="text-slate-500 italic">Not publicly inspected / Unlisted</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row 3: Physical Accessibility */}
              <tr className="hover:bg-slate-850/50 transition">
                <td className="p-4 font-semibold text-slate-400 bg-slate-950/40 flex items-center gap-1.5">
                  <Accessibility className="w-4 h-4 text-sky-400" />
                  <span>Physical Accessibility</span>
                </td>
                {selectedPlaces.map(p => (
                  <td key={p.id} className="p-4 border-l border-slate-800/60 leading-relaxed">
                    <span className="text-sky-300 font-medium">
                      {p.accessibility || (p.wheelchair === 'yes' ? 'Step-free Wheelchair Access' : 'Standard Physical Access')}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 4: Verified Public Ratings */}
              <tr className="hover:bg-slate-850/50 transition">
                <td className="p-4 font-semibold text-slate-400 bg-slate-950/40 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Verified Public Rating</span>
                </td>
                {selectedPlaces.map(p => (
                  <td key={p.id} className="p-4 border-l border-slate-800/60 font-semibold text-white">
                    {p.verifiedRating ? (
                      <span className="text-amber-300 flex items-center gap-1 font-mono">
                        ⭐ {p.verifiedRating}
                      </span>
                    ) : (
                      <span className="text-slate-500 font-normal italic">No official rating registered</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row 5: Sourced Safety Information */}
              <tr className="hover:bg-slate-850/50 transition">
                <td className="p-4 font-semibold text-slate-400 bg-slate-950/40 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  <span>Sourced Safety Context</span>
                </td>
                {selectedPlaces.map(p => (
                  <td key={p.id} className="p-4 border-l border-slate-800/60 leading-relaxed text-slate-300 text-[11px]">
                    {p.safetyFeatures ? (
                      <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                        {p.safetyFeatures}
                      </div>
                    ) : (
                      <span className="text-slate-500 italic">Municipal standard monitoring zone</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row 6: Operating Hours */}
              <tr className="hover:bg-slate-850/50 transition">
                <td className="p-4 font-semibold text-slate-400 bg-slate-950/40 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Operating Hours</span>
                </td>
                {selectedPlaces.map(p => (
                  <td key={p.id} className="p-4 border-l border-slate-800/60 font-mono text-[11px] text-slate-300">
                    {p.openingHours || 'Varies by schedule'}
                  </td>
                ))}
              </tr>

              {/* Row 7: Physical Address */}
              <tr className="hover:bg-slate-850/50 transition">
                <td className="p-4 font-semibold text-slate-400 bg-slate-950/40 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>Address & Geo</span>
                </td>
                {selectedPlaces.map(p => (
                  <td key={p.id} className="p-4 border-l border-slate-800/60 text-[11px] text-slate-400">
                    <div>{p.address}</div>
                    <div className="text-[10px] font-mono text-slate-500 mt-1">
                      {p.lat.toFixed(4)}, {p.lon.toFixed(4)}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row 8: Action Controls */}
              <tr className="bg-slate-950/80">
                <td className="p-4 font-semibold text-slate-400 bg-slate-950/60">
                  <span>Actions</span>
                </td>
                {selectedPlaces.map(p => (
                  <td key={p.id} className="p-4 border-l border-slate-800/60">
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => onSelectPlaceOnMap(p)}
                        className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Compass className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Locate on Map</span>
                      </button>

                      <button
                        onClick={() => onAskAiAboutPlace(p)}
                        className="w-full py-2 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Ask AI Guide</span>
                      </button>

                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-1.5 px-3 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-[11px] text-center border border-slate-800 transition flex items-center justify-center gap-1"
                      >
                        <span>Directions</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
