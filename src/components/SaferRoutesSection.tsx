import React, { useState, useEffect } from 'react';
import { City, PlacePOI, RouteOption } from '../types.ts';
import { fetchRoutes } from '../services/api.ts';
import {
  Compass,
  Navigation,
  ShieldCheck,
  AlertTriangle,
  Clock,
  MapPin,
  ArrowRight,
  Shield,
  Lightbulb,
  Building2,
  HeartPulse,
  Info,
  Layers,
  Sparkles,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface SaferRoutesSectionProps {
  city: City;
  places: PlacePOI[];
  onDisplayRouteOnMap?: (route: RouteOption) => void;
}

export const SaferRoutesSection: React.FC<SaferRoutesSectionProps> = ({
  city,
  places,
  onDisplayRouteOnMap
}) => {
  // Origin and destination selectors from real places
  const [originId, setOriginId] = useState<string>(places[0]?.id || '');
  const [destId, setDestId] = useState<string>(places[1]?.id || '');
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-safer');

  // Sync origin and dest when places or city changes
  useEffect(() => {
    if (places.length >= 2) {
      setOriginId(places[0].id);
      setDestId(places[1].id);
    }
  }, [city.id, places]);

  // Compute routes whenever origin and dest change
  useEffect(() => {
    if (originId && destId && originId !== destId) {
      calculateRoutes();
    }
  }, [originId, destId]);

  const calculateRoutes = async () => {
    const originPlace = places.find(p => p.id === originId);
    const destPlace = places.find(p => p.id === destId);

    if (!originPlace || !destPlace) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchRoutes(
        originPlace.lat,
        originPlace.lon,
        destPlace.lat,
        destPlace.lon,
        city.id
      );
      setRoutes(data.routes || []);
      if (data.routes && data.routes.length > 0) {
        setSelectedRouteId('route-safer');
      }
    } catch (err: any) {
      console.error('Route calculation error:', err);
      setError(err.message || 'Routing service is temporarily congested.');
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  const originPlace = places.find(p => p.id === originId);
  const destPlace = places.find(p => p.id === destId);

  return (
    <div className="w-full flex flex-col gap-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Navigation className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Safer-Route Navigation Explorer: {city.name}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold font-mono">
              OSM OSRM Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Real pedestrian routing grounded in OpenStreetMap street topology, active municipal streetlighting corridors, and proximity to 24/7 police posts and emergency medical facilities.
          </p>
        </div>

        {/* Refresh route button */}
        <button
          onClick={calculateRoutes}
          disabled={loading || originId === destId}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white disabled:text-slate-500 text-xs font-semibold flex items-center gap-2 transition cursor-pointer shadow-md shadow-indigo-600/25 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Recalculate Corridor</span>
        </button>
      </div>

      {/* Origin / Destination Selector Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Origin Picker */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span>Starting Origin Location</span>
            </label>
            <select
              value={originId}
              onChange={(e) => setOriginId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {places.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.category})
                </option>
              ))}
            </select>
            {originPlace && (
              <span className="text-[10px] text-slate-400 block mt-1 truncate">
                📍 {originPlace.address}
              </span>
            )}
          </div>

          {/* Destination Picker */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>Target Destination</span>
            </label>
            <select
              value={destId}
              onChange={(e) => setDestId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {places.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.category})
                </option>
              ))}
            </select>
            {destPlace && (
              <span className="text-[10px] text-slate-400 block mt-1 truncate">
                🎯 {destPlace.address}
              </span>
            )}
          </div>
        </div>

        {originId === destId && (
          <div className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Please select two distinct locations to calculate navigation routes.</span>
          </div>
        )}
      </div>

      {/* Scientific Truthfulness Guarantee Banner */}
      <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-200">Non-Speculative Route Analysis:</strong> Distance and base routing are retrieved in real-time from the OpenStreetMap OSRM pedestrian routing network. The "Safer Corridor" comparison evaluates physical arterial avenues, municipal streetlighting coverage, and proximity to active police Koban/stations and hospitals. We never invent crime rates.
        </p>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center animate-pulse space-y-3">
          <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
          <h3 className="text-base font-bold text-white">Analyzing OpenStreetMap Street Network...</h3>
          <p className="text-xs text-slate-400">Computing real pedestrian path and cross-referencing emergency service coverage.</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="bg-rose-950/30 border border-rose-900/50 rounded-3xl p-6 text-center space-y-2">
          <AlertTriangle className="w-6 h-6 text-rose-400 mx-auto" />
          <h3 className="text-sm font-bold text-rose-200">Route Analysis Unavailable</h3>
          <p className="text-xs text-rose-300/80 max-w-md mx-auto">{error}</p>
        </div>
      )}

      {/* Route Comparison Cards */}
      {!loading && routes.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {routes.map((r) => {
            const isSafer = r.type === 'safer';
            const isSelected = selectedRouteId === r.id;

            return (
              <div
                key={r.id}
                onClick={() => setSelectedRouteId(r.id)}
                className={`rounded-3xl p-6 border transition-all cursor-pointer flex flex-col justify-between shadow-xl ${
                  isSelected
                    ? isSafer
                      ? 'bg-slate-900 border-emerald-500 shadow-emerald-500/10 ring-1 ring-emerald-500'
                      : 'bg-slate-900 border-indigo-500 shadow-indigo-500/10 ring-1 ring-indigo-500'
                    : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Top Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                      isSafer
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                        : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/40'
                    }`}>
                      {isSafer ? <ShieldCheck className="w-3.5 h-3.5" /> : <Navigation className="w-3.5 h-3.5" />}
                      <span>{r.name}</span>
                    </span>

                    {isSelected && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Selected Option
                      </span>
                    )}
                  </div>

                  {/* Summary Description */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-5">
                    {r.description}
                  </p>

                  {/* Distance & Time Metrics Hero */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="bg-slate-950/70 rounded-2xl p-3.5 border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        Walking Distance
                      </div>
                      <div className="text-xl font-extrabold text-white font-mono mt-0.5">
                        {(r.distanceMeters / 1000).toFixed(2)} <span className="text-xs font-normal text-slate-400">km</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {r.distanceMeters} meters
                      </div>
                    </div>

                    <div className="bg-slate-950/70 rounded-2xl p-3.5 border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        Estimated Walking Time
                      </div>
                      <div className="text-xl font-extrabold text-white font-mono mt-0.5">
                        ~{r.durationMinutes} <span className="text-xs font-normal text-slate-400">mins</span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Standard pedestrian pace
                      </div>
                    </div>
                  </div>

                  {/* Safety Features Comparison Breakdown */}
                  <div className="space-y-2.5 text-xs text-slate-300 mb-5">
                    {/* Lighting */}
                    <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5">
                      <Lightbulb className={`w-4 h-4 shrink-0 mt-0.5 ${isSafer ? 'text-amber-400' : 'text-slate-400'}`} />
                      <div>
                        <strong className="text-white block text-[11px] mb-0.5">Streetlighting Quality</strong>
                        <span className="text-[11px] text-slate-300">{r.lightingCoverage}</span>
                      </div>
                    </div>

                    {/* Emergency Facility Coverage */}
                    <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5">
                      <Building2 className={`w-4 h-4 shrink-0 mt-0.5 ${isSafer ? 'text-emerald-400' : 'text-indigo-400'}`} />
                      <div>
                        <strong className="text-white block text-[11px] mb-0.5">Emergency Post Coverage Along Path</strong>
                        <span className="text-[11px] text-slate-300">
                          {r.nearbyPolice.length > 0 && `Police: ${r.nearbyPolice.join(', ')} • `}
                          {r.nearbyHospitals.length > 0 && `Hospital: ${r.nearbyHospitals.join(', ')}`}
                          {r.nearbyPolice.length === 0 && r.nearbyHospitals.length === 0 && 'Standard municipal patrol area'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Safety Guidelines List */}
                  <div className="bg-slate-950/40 rounded-2xl p-3.5 border border-slate-800/60 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Practical Guidelines:
                    </span>
                    <ul className="space-y-1.5 text-[11px] text-slate-400 list-disc ml-4">
                      {r.safetyNotes.map((note, idx) => (
                        <li key={idx} className="leading-relaxed">{note}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&origin=${originPlace?.lat},${originPlace?.lon}&destination=${destPlace?.lat},${destPlace?.lon}&travelmode=walking`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 underline"
                  >
                    <span>External Google Directions</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  {onDisplayRouteOnMap && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDisplayRouteOnMap(r);
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Compass className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Display Route on Map</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
