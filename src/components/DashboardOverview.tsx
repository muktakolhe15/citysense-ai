import React, { useState } from 'react';
import {
  City,
  PlacePOI,
  WeatherData,
  AirQualityData,
  OfficialSafetyInfo,
  CitizenReport,
  RouteOption,
  RecentlyExploredPlace
} from '../types.ts';
import { InteractiveMap } from './InteractiveMap.tsx';
import { interpretWeatherCode, interpretAqi } from '../services/api.ts';
import {
  Search,
  MapPin,
  Compass,
  CloudSun,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Scale,
  PhoneCall,
  Clock,
  History,
  CheckCircle2,
  ThumbsUp,
  Building2,
  Flame,
  ChevronRight
} from 'lucide-react';

interface DashboardOverviewProps {
  currentCity: City;
  places: PlacePOI[];
  weather: WeatherData | null;
  airQuality: AirQualityData | null;
  safety: OfficialSafetyInfo | null;
  citizenReports: CitizenReport[];
  loadingWeather: boolean;
  weatherError: string | null;
  selectedPlace: PlacePOI | null;
  onSelectPlace: (place: PlacePOI | null) => void;
  onAskAiAboutPlace: (place: PlacePOI) => void;
  onComparePlace: (place: PlacePOI) => void;
  onNavigateToTab: (tab: any) => void;
  onSelectCity: (city: City) => void;
  availableCities: City[];
  recentlyExplored: RecentlyExploredPlace[];
  onAddRecentlyExplored: (place: PlacePOI) => void;
  onClearRecentlyExplored: () => void;
  activeRoute: RouteOption | null;
}

const QUICK_CATEGORIES = [
  { id: 'all', label: 'All Places', icon: '🌐' },
  { id: 'attraction', label: 'Attractions', icon: '⭐' },
  { id: 'restaurant', label: 'Food & Dining', icon: '🍽️' },
  { id: 'hotel', label: 'Hotels', icon: '🏨' },
  { id: 'historic', label: 'Heritage', icon: '🏛️' },
  { id: 'hospital', label: 'Hospitals', icon: '🏥' },
  { id: 'police', label: 'Police', icon: '🛡️' },
  { id: 'transit', label: 'Transport', icon: '🚆' }
];

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  currentCity,
  places,
  weather,
  airQuality,
  safety,
  citizenReports,
  loadingWeather,
  weatherError,
  selectedPlace,
  onSelectPlace,
  onAskAiAboutPlace,
  onComparePlace,
  onNavigateToTab,
  onSelectCity,
  availableCities,
  recentlyExplored,
  onAddRecentlyExplored,
  onClearRecentlyExplored,
  activeRoute
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const weatherInfo = weather
    ? interpretWeatherCode(weather.current.weather_code)
    : null;
  const aqiInfo = airQuality ? interpretAqi(airQuality.current?.us_aqi) : null;

  // Filter real places for the nearby grid
  const filteredPlaces = places.filter((p) => {
    const matchesCat =
      selectedCategory === 'all' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const handlePlaceCardClick = (place: PlacePOI) => {
    onSelectPlace(place);
    onAddRecentlyExplored(place);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* 1. Welcome Heading & Search Section */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{currentCity.flag}</span>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200/60">
                {currentCity.country}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {currentCity.lat.toFixed(3)}°N, {currentCity.lon.toFixed(3)}°E
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Explore your city smarter.
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              {currentCity.tagline}. Live urban intelligence, OpenStreetMap verified locations, real meteorological feeds, and official civic services.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigateToTab('cities')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-teal-700" />
              <span>Change City</span>
            </button>
            <button
              onClick={() => onNavigateToTab('guide')}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Guide</span>
            </button>
          </div>
        </div>

        {/* Search Bar: Where do you want to explore? */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Where do you want to explore in ${currentCity.name}? (e.g., museums, dining, hospitals, transit)`}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition"
          />
        </div>

        {/* Quick-Access Categories */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {QUICK_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Key Urban Metrics Row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Weather Metric */}
        <div
          onClick={() => onNavigateToTab('weather')}
          className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-teal-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold flex items-center gap-1.5">
              <CloudSun className="w-4 h-4 text-teal-600" />
              Live Weather
            </span>
            <span className="text-[10px] text-teal-700 group-hover:underline">View →</span>
          </div>
          {loadingWeather ? (
            <div className="h-8 w-20 bg-slate-100 rounded animate-pulse"></div>
          ) : weather ? (
            <div>
              <div className="text-2xl font-bold text-slate-900">
                {Math.round(weather.current.temperature_2m)}°C
              </div>
              <div className="text-xs text-slate-600 mt-0.5 truncate">
                {weatherInfo?.label || 'Fair'} • Feels {Math.round(weather.current.apparent_temperature)}°C
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400">Offline / unavailable</div>
          )}
        </div>

        {/* Air Quality / Telemetry */}
        <div
          onClick={() => onNavigateToTab('weather')}
          className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-teal-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Air Quality
            </span>
            <span className="text-[10px] text-teal-700 group-hover:underline">Index →</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {airQuality?.current?.us_aqi !== undefined ? `${airQuality.current.us_aqi} AQI` : 'Moderate'}
          </div>
          <div className="text-xs text-slate-600 mt-0.5 truncate">
            {aqiInfo?.label || 'Clean Air Standards'}
          </div>
        </div>

        {/* Verified Places Metric */}
        <div
          onClick={() => onNavigateToTab('places')}
          className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-teal-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-teal-600" />
              Verified POIs
            </span>
            <span className="text-[10px] text-teal-700 group-hover:underline">Directory →</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{places.length}</div>
          <div className="text-xs text-slate-600 mt-0.5">OpenStreetMap Datasets</div>
        </div>

        {/* Official Emergency Number */}
        <div
          onClick={() => onNavigateToTab('safety')}
          className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-teal-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Emergency Line
            </span>
            <span className="text-[10px] text-teal-700 group-hover:underline">Safety →</span>
          </div>
          <div className="text-2xl font-bold text-blue-700">
            {safety?.emergencyNumbers.police || '112'}
          </div>
          <div className="text-xs text-slate-600 mt-0.5 truncate">
            {safety?.advisoryLevel || 'Official Police & Medical Line'}
          </div>
        </div>
      </section>

      {/* 3. Large Interactive Map Preview */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-teal-600" />
              <span>Interactive Map: {currentCity.name}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Leaflet rendering powered by OpenStreetMap public tiles. Click any marker for location details.
            </p>
          </div>

          <button
            onClick={() => onNavigateToTab('map')}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Full Map Explorer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <InteractiveMap
          city={currentCity}
          places={places}
          selectedPlace={selectedPlace}
          onSelectPlace={onSelectPlace}
          onAskAiAboutPlace={onAskAiAboutPlace}
          citizenReports={citizenReports}
          activeRoute={activeRoute}
          onSelectCity={onSelectCity}
          availableCities={availableCities}
        />
      </section>

      {/* 4. Nearby Real Places Grid */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Nearby Places in {currentCity.name}
            </h2>
            <p className="text-xs text-slate-500">
              Showing {filteredPlaces.length} verified location{filteredPlaces.length === 1 ? '' : 's'} based on real OpenStreetMap records.
            </p>
          </div>

          <button
            onClick={() => onNavigateToTab('places')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {filteredPlaces.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            No locations matching your current query in {currentCity.name}. Try switching category filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredPlaces.slice(0, 6).map((place) => (
              <div
                key={place.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-teal-300 transition-all shadow-2xs flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200/50">
                      {place.category}
                    </span>
                    {place.affordability && (
                      <span className="text-[11px] font-semibold text-emerald-700">
                        {place.affordability}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition truncate">
                    {place.name}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                    {place.description}
                  </p>

                  <div className="text-[11px] text-slate-400 mt-2 line-clamp-1">
                    📍 {place.address}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-slate-200/80">
                  <button
                    onClick={() => handlePlaceCardClick(place)}
                    className="text-xs font-semibold text-teal-700 hover:text-teal-800 cursor-pointer flex items-center gap-1"
                  >
                    <span>View on Map</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onComparePlace(place)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition cursor-pointer"
                      title="Add to place comparison matrix"
                    >
                      <Scale className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onAskAiAboutPlace(place)}
                      className="p-1.5 rounded-lg text-teal-600 hover:text-teal-800 hover:bg-teal-50 transition cursor-pointer"
                      title="Ask AI City Guide"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition"
                      title="Get Directions"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Safety & Citizen Reports Side-by-Side Summary */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Official Public Safety Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Official Public Safety: {currentCity.name}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Verified national emergency & police directories
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateToTab('safety')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 cursor-pointer"
              >
                Details →
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 my-3">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-[10px] uppercase font-bold text-slate-400">Police</div>
                <div className="text-base font-extrabold text-slate-900 mt-0.5">
                  {safety?.emergencyNumbers.police || '112'}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-[10px] uppercase font-bold text-slate-400">Medical</div>
                <div className="text-base font-extrabold text-slate-900 mt-0.5">
                  {safety?.emergencyNumbers.ambulance || '112'}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-[10px] uppercase font-bold text-slate-400">Fire</div>
                <div className="text-base font-extrabold text-slate-900 mt-0.5">
                  {safety?.emergencyNumbers.fire || '112'}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {safety?.advisorySummary ||
                'Standard urban safety guidelines apply. Keep local emergency numbers saved on your mobile device.'}
            </p>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Agency: {safety?.policeAgencyName || 'Local Civil Police'}</span>
            <span className="font-semibold text-teal-700">Verified Direct Feeds</span>
          </div>
        </div>

        {/* Citizen Reports Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Citizen Field Reports ({citizenReports.filter(r => r.cityId === currentCity.id).length})
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Community-verified road & civic maintenance notices
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateToTab('reports')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 cursor-pointer"
              >
                File Report →
              </button>
            </div>

            {/* List of recent reports */}
            <div className="space-y-2 my-3">
              {citizenReports.filter(r => r.cityId === currentCity.id).slice(0, 2).map((rep) => (
                <div
                  key={rep.id}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-start justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                        {rep.category}
                      </span>
                      <span className="font-bold text-slate-900 truncate">
                        {rep.title}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      {rep.address}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                    ▲ {rep.upvotes}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Status: Stored user submissions</span>
            <button
              onClick={() => onNavigateToTab('reports')}
              className="text-teal-700 font-bold hover:underline cursor-pointer"
            >
              Browse all reports
            </button>
          </div>
        </div>
      </section>

      {/* 6. Recently Explored Places (Persistent Storage) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-teal-700" />
            <h3 className="text-sm font-bold text-slate-900">
              Recently Explored Locations ({recentlyExplored.length})
            </h3>
          </div>
          {recentlyExplored.length > 0 && (
            <button
              onClick={onClearRecentlyExplored}
              className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Clear history
            </button>
          )}
        </div>

        {recentlyExplored.length === 0 ? (
          <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
            No recently explored locations yet. Click any place above or on the map to save your browsing history.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {recentlyExplored.slice(0, 4).map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  const fullPlace = places.find((x) => x.id === p.id);
                  if (fullPlace) onSelectPlace(fullPlace);
                }}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-teal-300 transition text-xs cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-slate-900 truncate">{p.name}</span>
                    <span className="text-[10px] text-teal-700 font-semibold uppercase">{p.category}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">{p.cityName} • {p.address}</div>
                </div>
                <div className="text-[10px] text-slate-400 mt-2">
                  Visited: {new Date(p.visitedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
