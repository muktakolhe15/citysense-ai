import React, { useState } from 'react';
import { PlacePOI, City, PlaceCategory } from '../types.ts';
import {
  Search,
  MapPin,
  ExternalLink,
  Sparkles,
  Navigation,
  Clock,
  Phone,
  CheckCircle2,
  ShieldCheck,
  Accessibility,
  Scale,
  DollarSign,
  Award
} from 'lucide-react';

interface PlacesDirectoryProps {
  city: City;
  places: PlacePOI[];
  onSelectPlace: (place: PlacePOI) => void;
  onAskAi: (place: PlacePOI) => void;
  onComparePlace?: (place: PlacePOI) => void;
}

const CATEGORY_MAP: Record<string, { label: string; badge: string; icon: string }> = {
  attraction: { label: 'Attraction / Culture', badge: 'bg-purple-500/10 text-purple-300 border-purple-500/30', icon: '⭐' },
  historic: { label: 'Historic Landmark', badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30', icon: '🏛️' },
  restaurant: { label: 'Dining & Restaurant', badge: 'bg-orange-500/10 text-orange-300 border-orange-500/30', icon: '🍽️' },
  hotel: { label: 'Hotel & Lodging', badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30', icon: '🏨' },
  hospital: { label: 'Hospital / Medical', badge: 'bg-rose-500/10 text-rose-300 border-rose-500/30', icon: '🏥' },
  police: { label: 'Police Station', badge: 'bg-blue-500/10 text-blue-300 border-blue-500/30', icon: '🛡️' },
  transit: { label: 'Public Transit Hub', badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30', icon: '🚆' },
  pharmacy: { label: 'Pharmacy & Care', badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30', icon: '💊' }
};

export const PlacesDirectory: React.FC<PlacesDirectoryProps> = ({
  city,
  places,
  onSelectPlace,
  onAskAi,
  onComparePlace
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredPlaces = places.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.address.toLowerCase().includes(query) ||
      (p.affordability && p.affordability.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { key: 'all', label: 'All Places', count: places.length },
    { key: 'attraction', label: 'Attractions', count: places.filter(p => p.category === 'attraction').length },
    { key: 'historic', label: 'Historic', count: places.filter(p => p.category === 'historic').length },
    { key: 'restaurant', label: 'Restaurants', count: places.filter(p => p.category === 'restaurant').length },
    { key: 'hotel', label: 'Hotels', count: places.filter(p => p.category === 'hotel').length },
    { key: 'hospital', label: 'Hospitals', count: places.filter(p => p.category === 'hospital').length },
    { key: 'police', label: 'Police', count: places.filter(p => p.category === 'police').length },
    { key: 'transit', label: 'Transit', count: places.filter(p => p.category === 'transit').length },
    { key: 'pharmacy', label: 'Pharmacies', count: places.filter(p => p.category === 'pharmacy').length },
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Search & Filter Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>{city.name} Civic Directory: Attractions, Dining, Hotels & Services</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-medium">
                Verified OSM Data
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Real OpenStreetMap places with documented affordability, hygiene inspections, accessibility, and emergency proximity
            </p>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, street, or cuisine..."
              className="w-full pl-10 pr-12 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedCategory === cat.key
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                  : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === cat.key ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-900 text-slate-400'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      {filteredPlaces.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-200 mb-1">No matching places found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Try adjusting your search keywords or switch category filter to see more results for {city.name}.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlaces.map((place) => {
            const catInfo = CATEGORY_MAP[place.category] || CATEGORY_MAP.attraction;

            return (
              <div
                key={place.id}
                className="bg-slate-900/90 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 rounded-3xl p-5 shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Category and verification badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${catInfo.badge}`}>
                      <span>{catInfo.icon}</span>
                      <span>{catInfo.label}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>OSM Verified</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-indigo-400 transition">
                    {place.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
                    {place.description}
                  </p>

                  {/* Highlight badges for Affordability & Cleanliness */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    {place.affordability && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        <span>{place.affordability}</span>
                      </span>
                    )}
                    {place.verifiedRating && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        <span>{place.verifiedRating}</span>
                      </span>
                    )}
                  </div>

                  {/* Metadata list */}
                  <div className="space-y-1.5 border-t border-slate-800/80 pt-3 mb-4 text-xs text-slate-400">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="text-slate-300 text-[11px] leading-tight">{place.address}</span>
                    </div>

                    {place.cleanlinessRating && (
                      <div className="flex items-center gap-2 text-teal-400/90 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{place.cleanlinessRating}</span>
                      </div>
                    )}

                    {place.openingHours && (
                      <div className="flex items-center gap-2 text-emerald-400/90 text-[11px]">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>{place.openingHours}</span>
                      </div>
                    )}

                    {place.accessibility && (
                      <div className="flex items-center gap-2 text-sky-400 text-[11px]">
                        <Accessibility className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{place.accessibility}</span>
                      </div>
                    )}

                    {place.phone && (
                      <div className="flex items-center gap-2 text-slate-300 text-[11px]">
                        <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{place.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions footer */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-800/60">
                  <button
                    onClick={() => onSelectPlace(place)}
                    className="flex-1 py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Map</span>
                  </button>

                  {onComparePlace && (
                    <button
                      onClick={() => onComparePlace(place)}
                      className="py-2 px-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
                      title="Compare this place side-by-side"
                    >
                      <Scale className="w-3.5 h-3.5 text-amber-400" />
                      <span>Compare</span>
                    </button>
                  )}

                  <button
                    onClick={() => onAskAi(place)}
                    className="py-2 px-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
                    title="Ask AI City Guide about this spot"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Ask AI</span>
                  </button>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                    title="Open external navigation"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
