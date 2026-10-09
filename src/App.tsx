import React, { useState, useEffect } from 'react';
import {
  City,
  WeatherData,
  AirQualityData,
  PlacePOI,
  OfficialSafetyInfo,
  ActiveTab,
  CitizenReport,
  RouteOption,
  RecentlyExploredPlace
} from './types.ts';
import { DEFAULT_CITIES } from './data/cityData.ts';
import {
  fetchWeather,
  fetchAirQuality,
  fetchPlaces,
  fetchSafety,
  fetchAppConfig,
  fetchReports
} from './services/api.ts';
import { DashboardSidebar } from './components/DashboardSidebar.tsx';
import { DashboardTopNav } from './components/DashboardTopNav.tsx';
import { DashboardOverview } from './components/DashboardOverview.tsx';
import { ExploreCitiesPage } from './components/ExploreCitiesPage.tsx';
import { WeatherPage } from './components/WeatherPage.tsx';
import { SettingsPage } from './components/SettingsPage.tsx';
import { InteractiveMap } from './components/InteractiveMap.tsx';
import { PlacesDirectory } from './components/PlacesDirectory.tsx';
import { PlaceCompare } from './components/PlaceCompare.tsx';
import { SaferRoutesSection } from './components/SaferRoutesSection.tsx';
import { CitizenReportsSection } from './components/CitizenReportsSection.tsx';
import { SafetySection } from './components/SafetySection.tsx';
import { AiCityGuide } from './components/AiCityGuide.tsx';
import { CitySelectorModal } from './components/CitySelectorModal.tsx';
import { ApiSourcesModal } from './components/ApiSourcesModal.tsx';
import { Footer } from './components/Footer.tsx';
import { ArrowRight } from 'lucide-react';

export default function App() {
  const [currentCity, setCurrentCity] = useState<City>(DEFAULT_CITIES[0]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Data states
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [places, setPlaces] = useState<PlacePOI[]>([]);
  const [safety, setSafety] = useState<OfficialSafetyInfo | null>(null);
  const [citizenReports, setCitizenReports] = useState<CitizenReport[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlacePOI | null>(null);
  const [comparisonPlaces, setComparisonPlaces] = useState<PlacePOI[]>([]);
  const [activeRoute, setActiveRoute] = useState<RouteOption | null>(null);

  // Persistent recently explored places
  const [recentlyExplored, setRecentlyExplored] = useState<RecentlyExploredPlace[]>(() => {
    try {
      const saved = localStorage.getItem('citysense_recent_places');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Loading & error states
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [loadingSafety, setLoadingSafety] = useState(false);
  const [loadingReports, setLoadingReports] = useState(false);

  // Modals
  const [isCitySelectorOpen, setIsCitySelectorOpen] = useState(false);
  const [isApiSourcesOpen, setIsApiSourcesOpen] = useState(false);
  const [geminiConfigured, setGeminiConfigured] = useState(true);

  // AI Prompt forwarding
  const [initialAiPrompt, setInitialAiPrompt] = useState<string>('');

  // Initial app setup & check config
  useEffect(() => {
    fetchAppConfig()
      .then((cfg) => {
        setGeminiConfigured(cfg.geminiConfigured);
      })
      .catch((err) => {
        console.warn('Config fetch error:', err);
      });
  }, []);

  // Fetch real data whenever selected city changes
  useEffect(() => {
    loadCityData(currentCity);
  }, [currentCity]);

  const loadCityData = async (city: City) => {
    // 1. Weather & Air Quality
    setLoadingWeather(true);
    setWeatherError(null);
    try {
      const [weatherData, aqData] = await Promise.all([
        fetchWeather(city.lat, city.lon),
        fetchAirQuality(city.lat, city.lon).catch(() => null)
      ]);
      setWeather(weatherData);
      setAirQuality(aqData);
    } catch (err: any) {
      console.error('Weather error:', err);
      setWeatherError(err.message || 'Failed to load weather data');
      setWeather(null);
    } finally {
      setLoadingWeather(false);
    }

    // 2. Real POIs
    setLoadingPlaces(true);
    try {
      const placesData = await fetchPlaces(city.id, city.lat, city.lon);
      setPlaces(placesData.places || []);
      setComparisonPlaces(placesData.places?.slice(0, 3) || []);
    } catch (err: any) {
      console.error('Places error:', err);
      setPlaces([]);
    } finally {
      setLoadingPlaces(false);
    }

    // 3. Official Safety
    setLoadingSafety(true);
    try {
      const safetyData = await fetchSafety(city.id);
      setSafety(safetyData);
    } catch (err: any) {
      console.error('Safety error:', err);
      setSafety(null);
    } finally {
      setLoadingSafety(false);
    }

    // 4. Citizen Reports
    setLoadingReports(true);
    try {
      const reportsData = await fetchReports(city.id);
      setCitizenReports(reportsData.reports || []);
    } catch (err: any) {
      console.error('Reports error:', err);
      setCitizenReports([]);
    } finally {
      setLoadingReports(false);
    }

    // Clear active route on city change
    setActiveRoute(null);
  };

  const handleAddRecentlyExplored = (place: PlacePOI) => {
    setRecentlyExplored((prev) => {
      const filtered = prev.filter((p) => p.id !== place.id);
      const updated: RecentlyExploredPlace[] = [
        {
          id: place.id,
          name: place.name,
          category: place.category,
          cityId: currentCity.id,
          cityName: currentCity.name,
          address: place.address,
          lat: place.lat,
          lon: place.lon,
          visitedAt: new Date().toISOString()
        },
        ...filtered
      ].slice(0, 10);
      try {
        localStorage.setItem('citysense_recent_places', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
  };

  const handleClearRecentlyExplored = () => {
    setRecentlyExplored([]);
    try {
      localStorage.removeItem('citysense_recent_places');
    } catch (e) {
      console.warn(e);
    }
  };

  const handleAskAiAboutPlace = (place: PlacePOI) => {
    const prompt = `Tell me about ${place.name} in ${currentCity.name}: what are the highlights, visiting tips, food specialties, and practical etiquette?`;
    setInitialAiPrompt(prompt);
    setActiveTab('guide');
  };

  const handleComparePlace = (place: PlacePOI) => {
    setComparisonPlaces((prev) => {
      if (prev.some((p) => p.id === place.id)) return prev;
      return [place, ...prev].slice(0, 3);
    });
    setActiveTab('compare');
  };

  const handleDisplayRouteOnMap = (route: RouteOption) => {
    setActiveRoute(route);
    setActiveTab('map');
  };

  const handleReportAdded = (newReport: CitizenReport) => {
    setCitizenReports((prev) => [newReport, ...prev]);
  };

  const handleUpvoteUpdated = (reportId: string) => {
    setCitizenReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, upvotes: r.upvotes + 1 } : r))
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans">
      {/* 1. Left SaaS Sidebar */}
      <DashboardSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentCity={currentCity}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* 2. Main Application Flow */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
        {/* Top Header Navigation */}
        <DashboardTopNav
          currentCity={currentCity}
          availableCities={DEFAULT_CITIES}
          places={places}
          citizenReports={citizenReports}
          onSelectCity={setCurrentCity}
          onSelectPlace={(place) => {
            setSelectedPlace(place);
            handleAddRecentlyExplored(place);
            setActiveTab('map');
          }}
          onOpenCitySelector={() => setIsCitySelectorOpen(true)}
          onOpenApiSources={() => setIsApiSourcesOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          geminiConfigured={geminiConfigured}
        />

        {/* Dynamic Content Routing */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* TAB: DASHBOARD OVERVIEW */}
          {(activeTab === 'dashboard' || activeTab === 'overview') && (
            <DashboardOverview
              currentCity={currentCity}
              places={places}
              weather={weather}
              airQuality={airQuality}
              safety={safety}
              citizenReports={citizenReports}
              loadingWeather={loadingWeather}
              weatherError={weatherError}
              selectedPlace={selectedPlace}
              onSelectPlace={(place) => {
                setSelectedPlace(place);
                if (place) handleAddRecentlyExplored(place);
              }}
              onAskAiAboutPlace={handleAskAiAboutPlace}
              onComparePlace={handleComparePlace}
              onNavigateToTab={setActiveTab}
              onSelectCity={setCurrentCity}
              availableCities={DEFAULT_CITIES}
              recentlyExplored={recentlyExplored}
              onAddRecentlyExplored={handleAddRecentlyExplored}
              onClearRecentlyExplored={handleClearRecentlyExplored}
              activeRoute={activeRoute}
            />
          )}

          {/* TAB: EXPLORE CITIES */}
          {activeTab === 'cities' && (
            <ExploreCitiesPage
              currentCity={currentCity}
              availableCities={DEFAULT_CITIES}
              onSelectCity={setCurrentCity}
              onNavigateToDashboard={() => setActiveTab('dashboard')}
            />
          )}

          {/* TAB: INTERACTIVE MAP */}
          {activeTab === 'map' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {currentCity.name} Interactive Explorer
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pinpoint real locations with OpenStreetMap data, filter categories, inspect citizen hazards, or view walking routes.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('routes')}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition cursor-pointer"
                  >
                    Safer Routes
                  </button>
                  <button
                    onClick={() => setActiveTab('places')}
                    className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                  >
                    Places Directory
                  </button>
                </div>
              </div>

              <InteractiveMap
                city={currentCity}
                places={places}
                selectedPlace={selectedPlace}
                onSelectPlace={(place) => {
                  setSelectedPlace(place);
                  if (place) handleAddRecentlyExplored(place);
                }}
                onAskAiAboutPlace={handleAskAiAboutPlace}
                citizenReports={citizenReports}
                activeRoute={activeRoute}
                onSelectCity={setCurrentCity}
                availableCities={DEFAULT_CITIES}
              />

              {/* Quick Directory List Below Map */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-3">
                  Verified Location Markers ({places.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {places.map((place) => (
                    <button
                      key={place.id}
                      onClick={() => {
                        setSelectedPlace(place);
                        handleAddRecentlyExplored(place);
                      }}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-teal-400 hover:bg-teal-50/20 text-left transition flex items-center justify-between group cursor-pointer"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition truncate">
                          {place.name}
                        </div>
                        <div className="text-[10px] text-slate-500 capitalize truncate">
                          {place.category} • {place.address}
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700 shrink-0 transition" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: WEATHER */}
          {activeTab === 'weather' && (
            <WeatherPage
              city={currentCity}
              weather={weather}
              airQuality={airQuality}
              loading={loadingWeather}
              error={weatherError}
              onRetry={() => loadCityData(currentCity)}
              onNavigateToCitySelect={() => setActiveTab('cities')}
            />
          )}

          {/* TAB: PLACES DIRECTORY */}
          {activeTab === 'places' && (
            <div className="space-y-6 animate-fadeIn">
              <PlacesDirectory
                city={currentCity}
                places={places}
                onSelectPlace={(place) => {
                  setSelectedPlace(place);
                  handleAddRecentlyExplored(place);
                  setActiveTab('map');
                }}
                onAskAi={handleAskAiAboutPlace}
                onComparePlace={handleComparePlace}
              />
            </div>
          )}

          {/* TAB: COMPARE PLACES */}
          {activeTab === 'compare' && (
            <div className="space-y-6 animate-fadeIn">
              <PlaceCompare
                city={currentCity}
                places={places}
                initialSelectedPlaces={comparisonPlaces}
                onSelectPlaceOnMap={(place) => {
                  setSelectedPlace(place);
                  handleAddRecentlyExplored(place);
                  setActiveTab('map');
                }}
                onAskAiAboutPlace={handleAskAiAboutPlace}
              />
            </div>
          )}

          {/* TAB: SAFER ROUTES */}
          {activeTab === 'routes' && (
            <div className="space-y-6 animate-fadeIn">
              <SaferRoutesSection
                city={currentCity}
                places={places}
                onDisplayRouteOnMap={handleDisplayRouteOnMap}
              />
            </div>
          )}

          {/* TAB: CITIZEN REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-6 animate-fadeIn">
              <CitizenReportsSection
                city={currentCity}
                reports={citizenReports}
                onReportsUpdated={handleReportAdded}
                onUpvoteUpdated={handleUpvoteUpdated}
              />
            </div>
          )}

          {/* TAB: SAFETY & SECURITY */}
          {activeTab === 'safety' && (
            <div className="space-y-6 animate-fadeIn">
              <SafetySection
                city={currentCity}
                safety={safety}
                loading={loadingSafety}
                error={null}
              />
            </div>
          )}

          {/* TAB: AI CITY ASSISTANT */}
          {activeTab === 'guide' && (
            <div className="space-y-6 animate-fadeIn">
              <AiCityGuide
                city={currentCity}
                initialPrompt={initialAiPrompt}
                onClearInitialPrompt={() => setInitialAiPrompt('')}
              />
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
            <SettingsPage
              currentCity={currentCity}
              availableCities={DEFAULT_CITIES}
              onSelectCity={setCurrentCity}
              recentlyExplored={recentlyExplored}
              onClearRecentlyExplored={handleClearRecentlyExplored}
              geminiConfigured={geminiConfigured}
              onOpenApiSources={() => setIsApiSourcesOpen(true)}
            />
          )}
        </main>

        {/* Global SaaS Footer */}
        <Footer />
      </div>

      {/* Global Modals */}
      <CitySelectorModal
        isOpen={isCitySelectorOpen}
        onClose={() => setIsCitySelectorOpen(false)}
        selectedCity={currentCity}
        onSelectCity={setCurrentCity}
      />

      <ApiSourcesModal
        isOpen={isApiSourcesOpen}
        onClose={() => setIsApiSourcesOpen(false)}
        geminiConfigured={geminiConfigured}
      />
    </div>
  );
}
