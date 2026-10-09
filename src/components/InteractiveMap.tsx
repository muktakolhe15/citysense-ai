import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { PlacePOI, City, CitizenReport, RouteOption } from '../types.ts';
import { DEFAULT_CITIES } from '../data/cityData.ts';
import { searchGeocode } from '../services/api.ts';
import {
  Layers,
  MapPin,
  Compass,
  Sparkles,
  ExternalLink,
  AlertTriangle,
  Search,
  Plus,
  Minus,
  Check,
  X,
  Navigation
} from 'lucide-react';

interface InteractiveMapProps {
  city: City;
  places: PlacePOI[];
  selectedPlace: PlacePOI | null;
  onSelectPlace: (place: PlacePOI | null) => void;
  onAskAiAboutPlace: (place: PlacePOI) => void;
  citizenReports?: CitizenReport[];
  activeRoute?: RouteOption | null;
  onSelectCity?: (city: City) => void;
  availableCities?: City[];
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; label: string; iconEmoji: string }> = {
  attraction: { bg: '#8b5cf6', text: '#f3e8ff', border: '#7c3aed', label: 'Attraction', iconEmoji: '⭐' },
  historic: { bg: '#f59e0b', text: '#fef3c7', border: '#d97706', label: 'Historic', iconEmoji: '🏛️' },
  restaurant: { bg: '#ea580c', text: '#ffedd5', border: '#c2410c', label: 'Dining', iconEmoji: '🍽️' },
  hotel: { bg: '#6366f1', text: '#e0e7ff', border: '#4f46e5', label: 'Hotel', iconEmoji: '🏨' },
  hospital: { bg: '#ef4444', text: '#fee2e2', border: '#dc2626', label: 'Hospital', iconEmoji: '🏥' },
  police: { bg: '#2563eb', text: '#dbeafe', border: '#1d4ed8', label: 'Police', iconEmoji: '🛡️' },
  transit: { bg: '#06b6d4', text: '#cffafe', border: '#0891b2', label: 'Transit', iconEmoji: '🚆' },
  pharmacy: { bg: '#10b981', text: '#d1fae5', border: '#059669', label: 'Pharmacy', iconEmoji: '💊' }
};

// 100% Free Public OpenStreetMap Tile Providers (Zero API Key Required)
const TILE_PROVIDERS: Record<string, { name: string; url: string; attribution: string; subdomains?: string; maxZoom: number }> = {
  standard: {
    name: 'OpenStreetMap Standard',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    maxZoom: 19
  },
  humanitarian: {
    name: 'OSM Humanitarian (High Contrast)',
    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors, Tiles courtesy of <a href="https://www.hotosm.org/" target="_blank">Humanitarian OSM</a>',
    subdomains: 'abc',
    maxZoom: 19
  },
  cyclosm: {
    name: 'CyclOSM (Pedestrian & Cycling)',
    url: 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors, <a href="https://cyclosm.org" target="_blank">CyclOSM</a>',
    subdomains: 'abc',
    maxZoom: 18
  }
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  city,
  places,
  selectedPlace,
  onSelectPlace,
  onAskAiAboutPlace,
  citizenReports = [],
  activeRoute = null,
  onSelectCity,
  availableCities = DEFAULT_CITIES
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const cityMarkerRef = useRef<L.Marker | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const reportsLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const markersMapRef = useRef<Map<string, L.Marker>>(new Map());

  // Component UI states
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showCitizenReports, setShowCitizenReports] = useState<boolean>(true);
  const [activeTileStyle, setActiveTileStyle] = useState<string>('standard');
  const [showLayerMenu, setShowLayerMenu] = useState<boolean>(false);
  const [mapReady, setMapReady] = useState(false);

  // In-map City Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle in-map city search
  const handleSearchChange = async (value: string) => {
    setSearchQuery(value);
    const query = value.trim().toLowerCase();

    if (query.length < 1) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    setShowSearchDropdown(true);

    // 1. Instant match against curated available cities
    const localMatches = availableCities
      .filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.country.toLowerCase().includes(query) ||
        c.tagline.toLowerCase().includes(query)
      )
      .map(c => ({
        type: 'curated',
        city: c,
        name: c.name,
        country: c.country,
        flag: c.flag
      }));

    setSearchResults(localMatches);

    // 2. If user types 2+ characters, optionally query live OpenStreetMap Nominatim for any world city
    if (query.length >= 2) {
      setIsSearching(true);
      try {
        const nominatimResults = await searchGeocode(query);
        const externalMatches = (nominatimResults || [])
          .filter(item => {
            const itemName = (item.name || item.display_name.split(',')[0]).toLowerCase();
            return !localMatches.some(lm => lm.name.toLowerCase() === itemName);
          })
          .slice(0, 5)
          .map(item => ({
            type: 'nominatim',
            raw: item,
            name: item.name || item.address?.city || item.address?.town || item.display_name.split(',')[0],
            country: item.address?.country || 'Worldwide',
            flag: '📍',
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            display_name: item.display_name
          }));

        setSearchResults([...localMatches, ...externalMatches]);
      } catch (err) {
        console.warn('In-map geocode search issue:', err);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleSelectSearchResult = (result: any) => {
    setShowSearchDropdown(false);
    setSearchQuery('');

    if (result.type === 'curated') {
      if (onSelectCity) {
        onSelectCity(result.city);
      } else if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([result.city.lat, result.city.lon], result.city.zoom || 13, { duration: 1.2 });
      }
    } else {
      // Dynamic OSM City
      const newCity: City = {
        id: `custom-${result.raw.place_id || Date.now()}`,
        name: result.name,
        country: result.country,
        countryCode: result.raw?.address?.country_code?.toUpperCase() || 'GL',
        lat: result.lat,
        lon: result.lon,
        zoom: 13,
        timezone: 'auto',
        currency: 'Local',
        language: 'Local',
        flag: '📍',
        tagline: result.display_name,
        description: `Discovered via OpenStreetMap Nominatim: ${result.display_name}`
      };

      if (onSelectCity) {
        onSelectCity(newCity);
      } else if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([newCity.lat, newCity.lon], 13, { duration: 1.2 });
      }
    }
  };

  // 1. Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Create map instance centered on current city
    const map = L.map(mapContainerRef.current, {
      center: [city.lat, city.lon],
      zoom: city.zoom || 13,
      zoomControl: false,
      attributionControl: true
    });

    // Add standard OpenStreetMap public tile layer (No API key needed)
    const provider = TILE_PROVIDERS.standard;
    const tileLayer = L.tileLayer(provider.url, {
      attribution: provider.attribution,
      maxZoom: provider.maxZoom,
      subdomains: provider.subdomains || 'abc'
    }).addTo(map);

    tileLayerRef.current = tileLayer;

    // Custom Layer Groups for markers
    const markersGroup = L.layerGroup().addTo(map);
    const reportsGroup = L.layerGroup().addTo(map);

    markersLayerRef.current = markersGroup;
    reportsLayerRef.current = reportsGroup;
    mapInstanceRef.current = map;
    setMapReady(true);

    // Ensure Leaflet calculates viewport geometry properly
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    // Resize observer to ensure full responsiveness
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
      markersLayerRef.current = null;
      reportsLayerRef.current = null;
      routeLayerRef.current = null;
      cityMarkerRef.current = null;
    };
  }, []);

  // 2. Change Tile Layer provider dynamically when activeTileStyle changes
  const switchTileLayer = useCallback((styleKey: string) => {
    if (!mapInstanceRef.current) return;
    const provider = TILE_PROVIDERS[styleKey];
    if (!provider) return;

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const newTileLayer = L.tileLayer(provider.url, {
      attribution: provider.attribution,
      maxZoom: provider.maxZoom,
      subdomains: provider.subdomains || 'abc'
    }).addTo(mapInstanceRef.current);

    // Bring tile layer to back so markers stay on top
    newTileLayer.bringToBack();
    tileLayerRef.current = newTileLayer;
    setActiveTileStyle(styleKey);
    setShowLayerMenu(false);
  }, []);

  // 3. Center and update City Center Marker when city changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;
    map.flyTo([city.lat, city.lon], city.zoom || 13, {
      duration: 1.2
    });

    // Invalidate size to guarantee sharp tiles
    setTimeout(() => {
      map.invalidateSize();
    }, 300);

    // Remove previous city center marker if exists
    if (cityMarkerRef.current) {
      cityMarkerRef.current.remove();
      cityMarkerRef.current = null;
    }

    // Create glowing City Center Pin
    const cityCenterHtml = `
      <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
        <div style="
          position: absolute;
          width: 44px;
          height: 44px;
          background-color: rgba(99, 102, 241, 0.35);
          border-radius: 50%;
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
        <div style="
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          border: 3px solid #ffffff;
          box-shadow: 0 4px 18px rgba(79, 70, 229, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          cursor: pointer;
        " class="hover:scale-110 transition-transform">
          ${city.flag}
        </div>
      </div>
    `;

    const cityIcon = L.divIcon({
      html: cityCenterHtml,
      className: 'citysense-center-marker',
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      popupAnchor: [0, -22]
    });

    const cityMarker = L.marker([city.lat, city.lon], { icon: cityIcon, zIndexOffset: 1000 });

    const cityPopupHtml = `
      <div style="min-width: 250px; font-family: system-ui, sans-serif; color: #0f172a;" class="p-1.5">
        <div style="display: flex; items: center; gap: 8px; margin-bottom: 8px;">
          <span style="font-size: 26px; line-height: 1;">${city.flag}</span>
          <div>
            <h3 style="font-size: 16px; font-weight: 800; margin: 0; color: #0f172a; line-height: 1.2;">
              ${city.name}
            </h3>
            <span style="font-size: 11px; color: #6366f1; font-weight: 700;">
              ${city.country} • City Center Hub
            </span>
          </div>
        </div>
        <p style="font-size: 12px; color: #334155; margin: 0 0 8px 0; line-height: 1.4;">
          ${city.tagline}
        </p>
        <div style="font-size: 10px; font-family: monospace; color: #475569; background: #f8fafc; border: 1px solid #e2e8f0; padding: 4px 8px; border-radius: 6px; margin-bottom: 8px;">
          📍 ${city.lat.toFixed(4)}°N, ${city.lon.toFixed(4)}°E
        </div>
        <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; border-top: 1px solid #e2e8f0; padding-top: 6px;">
          <span style="color: #64748b; font-weight: 600;">Places: <strong>${places.length}</strong></span>
          <span style="color: #059669; font-weight: 700;">OpenStreetMap Verified</span>
        </div>
      </div>
    `;

    cityMarker.bindPopup(cityPopupHtml, { maxWidth: 300 });
    cityMarker.addTo(map);
    cityMarkerRef.current = cityMarker;
  }, [city, places.length]);

  // 4. Update POI markers when places or category filter changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    markersMapRef.current.clear();

    const filtered = activeCategory === 'all'
      ? places
      : places.filter(p => p.category === activeCategory);

    filtered.forEach((place) => {
      const config = CATEGORY_COLORS[place.category] || CATEGORY_COLORS.attraction;

      const iconHtml = `
        <div style="
          background-color: ${config.bg};
          border: 2px solid #ffffff;
          box-shadow: 0 4px 14px rgba(0,0,0,0.45);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          cursor: pointer;
        " class="hover:scale-110 transition-transform">
          ${config.iconEmoji}
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'citysense-custom-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18]
      });

      const marker = L.marker([place.lat, place.lon], { icon: customIcon });

      const popupHtml = `
        <div style="min-width: 250px; font-family: system-ui, sans-serif; color: #0f172a;" class="p-1">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; background: ${config.bg}22; color: ${config.bg}; padding: 2px 8px; border-radius: 9999px;">
              ${config.iconEmoji} ${config.label}
            </span>
            <span style="font-size: 11px; color: #64748b;">${city.name}</span>
          </div>
          <h4 style="font-size: 15px; font-weight: 700; margin: 0 0 4px 0; color: #0f172a; line-height: 1.3;">
            ${place.name}
          </h4>
          <p style="font-size: 12px; color: #475569; margin: 0 0 6px 0; line-height: 1.4;">
            ${place.description || ''}
          </p>
          ${place.affordability ? `<div style="font-size: 11px; color: #059669; font-weight: 600; margin-bottom: 4px;">💰 ${place.affordability}</div>` : ''}
          ${place.cleanlinessRating ? `<div style="font-size: 10px; color: #0891b2; margin-bottom: 4px;">✨ ${place.cleanlinessRating}</div>` : ''}
          <div style="font-size: 11px; color: #64748b; margin-bottom: 8px; border-top: 1px solid #e2e8f0; padding-top: 6px;">
            📍 ${place.address}
          </div>
          <div style="display: flex; gap: 6px; margin-top: 8px;">
            <a href="https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lon}" target="_blank" rel="noopener noreferrer"
               style="flex: 1; text-align: center; background: #0f172a; color: #ffffff; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; gap: 4px;">
              Directions ↗
            </a>
            <button id="ask-ai-btn-${place.id}"
                    style="flex: 1; background: #6366f1; color: #ffffff; padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: 600; border: none; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 4px;">
              Ask AI ✨
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 320 });

      marker.on('popupopen', () => {
        onSelectPlace(place);
        const btn = document.getElementById(`ask-ai-btn-${place.id}`);
        if (btn) {
          btn.onclick = (e) => {
            e.stopPropagation();
            onAskAiAboutPlace(place);
          };
        }
      });

      marker.addTo(markersLayerRef.current!);
      markersMapRef.current.set(place.id, marker);
    });
  }, [places, activeCategory, city]);

  // 5. Update citizen reports overlay
  useEffect(() => {
    if (!mapInstanceRef.current || !reportsLayerRef.current) return;

    reportsLayerRef.current.clearLayers();

    if (!showCitizenReports) return;

    const cityReps = citizenReports.filter(r => r.cityId === city.id);

    cityReps.forEach(rep => {
      const repColor = rep.category === 'pothole' ? '#ef4444' : rep.category === 'garbage' ? '#10b981' : rep.category === 'safety' ? '#6366f1' : '#f59e0b';
      const repIcon = rep.category === 'pothole' ? '⚠️' : rep.category === 'garbage' ? '🗑️' : rep.category === 'safety' ? '💡' : '🚗';

      const iconHtml = `
        <div style="
          background-color: ${repColor};
          border: 2px solid #ffffff;
          box-shadow: 0 4px 10px rgba(0,0,0,0.5);
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          cursor: pointer;
        ">
          ${repIcon}
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'citysense-report-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -16]
      });

      const marker = L.marker([rep.lat, rep.lon], { icon: customIcon });

      const popupHtml = `
        <div style="min-width: 220px; font-family: system-ui, sans-serif; color: #0f172a;" class="p-1">
          <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: ${repColor}; margin-bottom: 4px;">
            Citizen Report: ${rep.category.toUpperCase()}
          </div>
          <h4 style="font-size: 13px; font-weight: 700; margin: 0 0 4px 0; color: #0f172a;">
            ${rep.title}
          </h4>
          <p style="font-size: 11px; color: #475569; margin: 0 0 6px 0;">
            ${rep.description}
          </p>
          <div style="font-size: 10px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 4px;">
            Status: <strong>${rep.status.replace('_', ' ')}</strong> • Upvotes: ${rep.upvotes}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 280 });
      marker.addTo(reportsLayerRef.current!);
    });
  }, [citizenReports, showCitizenReports, city.id]);

  // 6. Handle active route polyline rendering
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (routeLayerRef.current) {
      mapInstanceRef.current.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    if (activeRoute && activeRoute.coordinates.length > 0) {
      const color = activeRoute.type === 'safer' ? '#10b981' : '#6366f1';
      const polyline = L.polyline(activeRoute.coordinates, {
        color,
        weight: 6,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(mapInstanceRef.current);

      routeLayerRef.current = polyline;
      mapInstanceRef.current.fitBounds(polyline.getBounds(), { padding: [50, 50] });
    }
  }, [activeRoute]);

  // 7. Handle selectedPlace changes
  useEffect(() => {
    if (!selectedPlace || !mapInstanceRef.current) return;

    const marker = markersMapRef.current.get(selectedPlace.id);
    if (marker) {
      mapInstanceRef.current.setView([selectedPlace.lat, selectedPlace.lon], 15, { animate: true });
      marker.openPopup();
    }
  }, [selectedPlace]);

  // Zoom control handlers
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const handleResetCenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([city.lat, city.lon], city.zoom || 13, { duration: 0.8 });
      if (cityMarkerRef.current) {
        cityMarkerRef.current.openPopup();
      }
    }
  };

  const categories = [
    { key: 'all', label: 'All', count: places.length, icon: '🌐' },
    { key: 'attraction', label: 'Attractions', count: places.filter(p => p.category === 'attraction').length, icon: '⭐' },
    { key: 'historic', label: 'Historic', count: places.filter(p => p.category === 'historic').length, icon: '🏛️' },
    { key: 'restaurant', label: 'Dining', count: places.filter(p => p.category === 'restaurant').length, icon: '🍽️' },
    { key: 'hotel', label: 'Hotels', count: places.filter(p => p.category === 'hotel').length, icon: '🏨' },
    { key: 'hospital', label: 'Hospitals', count: places.filter(p => p.category === 'hospital').length, icon: '🏥' },
    { key: 'police', label: 'Police', count: places.filter(p => p.category === 'police').length, icon: '🛡️' }
  ];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xs flex flex-col">
      {/* Top Filter & Search Controls Bar */}
      <div className="p-3 sm:p-4 bg-slate-50/95 backdrop-blur-md border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 z-20">
        {/* City Info & Live Search Box */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-700">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>{city.flag}</span>
                <span>{city.name} Map</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-500 font-mono">
                  {city.lat.toFixed(3)}, {city.lon.toFixed(3)}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">OpenStreetMap Public Tiles & Verified POIs</p>
            </div>
          </div>

          {/* Integrated City Search Box */}
          <div ref={searchContainerRef} className="relative flex-1 sm:w-64 lg:w-72">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => {
                  if (searchQuery.trim().length > 0) setShowSearchDropdown(true);
                }}
                placeholder="Search city (Pune, Delhi, Tokyo...)"
                className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition shadow-2xs"
              />
              {isSearching ? (
                <span className="w-3 h-3 border-2 border-teal-600 border-t-transparent rounded-full animate-spin absolute right-2.5 top-1/2 -translate-y-1/2" />
              ) : searchQuery ? (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setShowSearchDropdown(false);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : null}
            </div>

            {/* Search Suggestions Dropdown */}
            {showSearchDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 max-h-64 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="p-1 space-y-0.5">
                    {searchResults.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectSearchResult(item)}
                        className="w-full px-3 py-2 rounded-xl text-left hover:bg-slate-50 text-xs flex items-center justify-between group transition cursor-pointer"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-sm shrink-0">{item.flag}</span>
                          <div className="truncate">
                            <span className="font-semibold text-slate-900 group-hover:text-teal-700">
                              {item.name}
                            </span>
                            <span className="text-slate-400 ml-1.5 text-[11px]">
                              ({item.country})
                            </span>
                          </div>
                        </div>
                        {item.type === 'curated' ? (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200/50 shrink-0 font-semibold">
                            Verified
                          </span>
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                            OSM
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 text-center text-xs text-slate-400">
                    No matching cities found. Try typing another city name.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Category Pills & Overlay Toggles */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeCategory === cat.key
                  ? 'bg-teal-600 text-white shadow-xs font-bold'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeCategory === cat.key ? 'bg-teal-800 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}

          {/* Toggle Citizen Reports Overlay */}
          <button
            onClick={() => setShowCitizenReports(!showCitizenReports)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer border ${
              showCitizenReports
                ? 'bg-amber-50 text-amber-900 border-amber-300 font-bold'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title="Toggle citizen road & safety hazard markers"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Reports ({citizenReports.filter(r => r.cityId === city.id).length})</span>
          </button>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative w-full h-[520px] sm:h-[600px]">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Active Route Overlay Badge if active */}
        {activeRoute && (
          <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-emerald-300 shadow-lg flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>Active Route: {activeRoute.name}</span>
              </div>
              <div className="text-[11px] text-emerald-700 font-mono font-semibold">
                {(activeRoute.distanceMeters / 1000).toFixed(2)} km • ~{activeRoute.durationMinutes} mins
              </div>
            </div>
          </div>
        )}

        {/* Floating Working Zoom & View Controls (Top-Right) */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          {/* Zoom In Button */}
          <button
            onClick={handleZoomIn}
            className="w-9 h-9 rounded-xl bg-white/95 hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-md flex items-center justify-center transition cursor-pointer hover:border-teal-400"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Zoom Out Button */}
          <button
            onClick={handleZoomOut}
            className="w-9 h-9 rounded-xl bg-white/95 hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-md flex items-center justify-center transition cursor-pointer hover:border-teal-400"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>

          {/* Reset Center Button */}
          <button
            onClick={handleResetCenter}
            className="px-3 py-2 rounded-xl bg-white/95 hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-md text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer hover:border-teal-400"
            title="Recenter map to city center"
          >
            <Compass className="w-4 h-4 text-teal-600" />
            <span className="hidden sm:inline">Center</span>
          </button>

          {/* Layer Style Switcher Button */}
          <div className="relative">
            <button
              onClick={() => setShowLayerMenu(!showLayerMenu)}
              className="w-9 h-9 sm:w-auto sm:px-3 sm:py-2 rounded-xl bg-white/95 hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-md text-xs font-semibold flex items-center justify-center sm:gap-1.5 transition cursor-pointer hover:border-teal-400"
              title="Change OpenStreetMap Tile Style"
            >
              <Layers className="w-4 h-4 text-teal-700" />
              <span className="hidden sm:inline">Layers</span>
            </button>

            {/* Tile Layer Selector Menu */}
            {showLayerMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-30 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                  Public OSM Tiles
                </div>
                {Object.entries(TILE_PROVIDERS).map(([key, prov]) => (
                  <button
                    key={key}
                    onClick={() => switchTileLayer(key)}
                    className={`w-full px-2.5 py-1.5 rounded-xl text-left text-xs flex items-center justify-between transition cursor-pointer ${
                      activeTileStyle === key
                        ? 'bg-teal-50 text-teal-800 font-bold border border-teal-200'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{prov.name}</span>
                    {activeTileStyle === key && <Check className="w-3.5 h-3.5 text-teal-700 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Legend indicator */}
        <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-slate-200 text-[11px] text-slate-700 shadow-md hidden sm:flex items-center gap-3">
          <span className="font-bold text-slate-900 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block"></span>
            {city.name} Center
          </span>
          <span className="text-slate-300">|</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span> Landmark</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Historic</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block"></span> Food</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span> Hotel</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span> Hospital</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span> Police</span>
          {showCitizenReports && (
            <span className="flex items-center gap-1 text-amber-700 font-medium"><span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block"></span> Reports</span>
          )}
        </div>
      </div>
    </div>
  );
};
