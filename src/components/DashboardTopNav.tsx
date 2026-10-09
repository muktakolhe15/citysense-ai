import React, { useState, useRef, useEffect } from 'react';
import { City, PlacePOI, CitizenReport } from '../types.ts';
import {
  Search,
  MapPin,
  Bell,
  Menu,
  ChevronDown,
  Layers,
  Sparkles,
  AlertTriangle,
  CloudSun,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';

interface DashboardTopNavProps {
  currentCity: City;
  availableCities: City[];
  places: PlacePOI[];
  citizenReports: CitizenReport[];
  onSelectCity: (city: City) => void;
  onSelectPlace: (place: PlacePOI) => void;
  onOpenCitySelector: () => void;
  onOpenApiSources: () => void;
  onToggleSidebar: () => void;
  geminiConfigured: boolean;
}

export const DashboardTopNav: React.FC<DashboardTopNavProps> = ({
  currentCity,
  availableCities,
  places,
  citizenReports,
  onSelectCity,
  onSelectPlace,
  onOpenCitySelector,
  onOpenApiSources,
  onToggleSidebar,
  geminiConfigured
}) => {
  const [globalSearch, setGlobalSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [readNotifications, setReadNotifications] = useState<string[]>([]);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filter cities & places for global search
  const query = globalSearch.trim().toLowerCase();
  const matchedCities = query
    ? availableCities.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.country.toLowerCase().includes(query)
      ).slice(0, 4)
    : [];

  const matchedPlaces = query
    ? places
        .filter(
          (p) =>
            p.name.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query) ||
            p.address.toLowerCase().includes(query)
        )
        .slice(0, 5)
    : [];

  // Notifications feed derived from real data
  const notifications = [
    {
      id: `notif-weather-${currentCity.id}`,
      type: 'weather',
      title: `Live Weather Sync: ${currentCity.name}`,
      message: `Open-Meteo updated hourly atmospheric conditions for ${currentCity.name}, ${currentCity.country}.`,
      time: 'Just now',
      unread: !readNotifications.includes(`notif-weather-${currentCity.id}`)
    },
    ...(citizenReports.slice(0, 3).map((r) => ({
      id: `notif-rep-${r.id}`,
      type: 'report',
      title: `Community Hazard: ${r.category.toUpperCase()}`,
      message: `${r.title} (${r.status.replace('_', ' ')})`,
      time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unread: !readNotifications.includes(`notif-rep-${r.id}`)
    })))
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    setReadNotifications(notifications.map((n) => n.id));
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
      {/* Left: Mobile Sidebar Toggle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div ref={searchRef} className="relative w-full">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => {
                if (globalSearch.trim().length > 0) setIsSearchOpen(true);
              }}
              placeholder="Search cities and places..."
              className="w-full pl-10 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 transition"
            />
            {globalSearch && (
              <button
                onClick={() => {
                  setGlobalSearch('');
                  setIsSearchOpen(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {isSearchOpen && (query.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 max-h-80 overflow-y-auto">
              {matchedCities.length === 0 && matchedPlaces.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">
                  No matching cities or locations found.
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {/* Cities */}
                  {matchedCities.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                        Cities
                      </div>
                      {matchedCities.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            onSelectCity(c);
                            setIsSearchOpen(false);
                            setGlobalSearch('');
                          }}
                          className="w-full px-3 py-2 rounded-xl text-left hover:bg-slate-50 text-xs flex items-center justify-between group transition cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{c.flag}</span>
                            <span className="font-semibold text-slate-900 group-hover:text-teal-700">
                              {c.name}
                            </span>
                            <span className="text-slate-400 text-[11px]">
                              {c.country}
                            </span>
                          </div>
                          <span className="text-[10px] text-teal-700 font-semibold">
                            Select →
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Places */}
                  {matchedPlaces.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                        Locations in {currentCity.name}
                      </div>
                      {matchedPlaces.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            onSelectPlace(p);
                            setIsSearchOpen(false);
                            setGlobalSearch('');
                          }}
                          className="w-full px-3 py-2 rounded-xl text-left hover:bg-slate-50 text-xs flex items-center justify-between group transition cursor-pointer"
                        >
                          <div className="min-w-0 pr-2">
                            <div className="font-semibold text-slate-900 group-hover:text-teal-700 truncate">
                              {p.name}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate">
                              {p.category} • {p.address}
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            View ↗
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: Location Selector Pill, Notifications, API Sources */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Selected City Selector Button */}
        <button
          onClick={onOpenCitySelector}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 transition cursor-pointer"
          title="Click to select another city"
        >
          <span className="text-base">{currentCity.flag}</span>
          <span className="font-bold text-slate-900 hidden sm:inline">
            {currentCity.name}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {/* Notifications Icon with Dropdown */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition relative cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-600 ring-2 ring-white" />
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-88 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50">
              <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 text-xs transition ${
                      n.unread ? 'bg-teal-50/40' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="font-bold text-slate-900">{n.title}</span>
                      <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* API Sources Docs trigger */}
        <button
          onClick={onOpenApiSources}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition cursor-pointer"
          title="Inspect real data feeds & server architecture"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>APIs</span>
        </button>
      </div>
    </header>
  );
};
