import { City, WeatherData, AirQualityData, PlacePOI, OfficialSafetyInfo, CitizenReport, RouteOption } from '../types.ts';

// Weather code interpreter according to WMO standard
export function interpretWeatherCode(code: number): { label: string; icon: string; bgGradient: string } {
  switch (code) {
    case 0:
      return { label: 'Clear Sky', icon: '☀️', bgGradient: 'from-amber-500/20 to-orange-500/10' };
    case 1:
      return { label: 'Mainly Clear', icon: '🌤️', bgGradient: 'from-sky-500/20 to-amber-500/10' };
    case 2:
      return { label: 'Partly Cloudy', icon: '⛅', bgGradient: 'from-blue-500/20 to-slate-500/10' };
    case 3:
      return { label: 'Overcast', icon: '☁️', bgGradient: 'from-slate-600/30 to-slate-800/20' };
    case 45:
    case 48:
      return { label: 'Foggy & Rime', icon: '🌫️', bgGradient: 'from-slate-500/30 to-zinc-700/20' };
    case 51:
    case 53:
    case 55:
      return { label: 'Drizzle', icon: '🌦️', bgGradient: 'from-cyan-500/20 to-blue-600/10' };
    case 61:
    case 63:
    case 65:
      return { label: 'Rain', icon: '🌧️', bgGradient: 'from-blue-600/30 to-indigo-700/20' };
    case 71:
    case 73:
    case 75:
      return { label: 'Snow Fall', icon: '❄️', bgGradient: 'from-cyan-400/20 to-blue-200/10' };
    case 77:
      return { label: 'Snow Grains', icon: '🌨️', bgGradient: 'from-cyan-400/20 to-slate-600/10' };
    case 80:
    case 81:
    case 82:
      return { label: 'Heavy Showers', icon: '🌧️', bgGradient: 'from-blue-700/30 to-slate-800/30' };
    case 85:
    case 86:
      return { label: 'Snow Showers', icon: '🌨️', bgGradient: 'from-blue-400/20 to-indigo-900/20' };
    case 95:
    case 96:
    case 99:
      return { label: 'Thunderstorm', icon: '⛈️', bgGradient: 'from-purple-600/30 to-amber-600/20' };
    default:
      return { label: 'Fair', icon: '🌤️', bgGradient: 'from-sky-500/20 to-blue-500/10' };
  }
}

export function interpretAqi(aqi?: number): { label: string; color: string; badgeClass: string } {
  if (aqi === undefined || aqi === null) {
    return { label: 'Unavailable', color: 'text-slate-400', badgeClass: 'bg-slate-800 text-slate-300 border-slate-700' };
  }
  if (aqi <= 20) {
    return { label: 'Excellent', color: 'text-emerald-400', badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
  }
  if (aqi <= 40) {
    return { label: 'Good', color: 'text-teal-400', badgeClass: 'bg-teal-500/10 text-teal-400 border-teal-500/30' };
  }
  if (aqi <= 60) {
    return { label: 'Moderate', color: 'text-amber-400', badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
  }
  if (aqi <= 80) {
    return { label: 'Poor', color: 'text-orange-400', badgeClass: 'bg-orange-500/10 text-orange-400 border-orange-500/30' };
  }
  return { label: 'Very Poor', color: 'text-rose-400', badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30' };
}

// Fetch live weather data from server proxy
export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Weather service returned ${res.status}`);
  }
  return res.json();
}

// Fetch air quality data from server proxy
export async function fetchAirQuality(lat: number, lon: number): Promise<AirQualityData> {
  const res = await fetch(`/api/air-quality?lat=${lat}&lon=${lon}`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Air quality service returned ${res.status}`);
  }
  return res.json();
}

// Fetch real places from server
export async function fetchPlaces(cityId: string, lat: number, lon: number, category: string = 'all'): Promise<{ source: string; count: number; places: PlacePOI[] }> {
  const res = await fetch(`/api/places?cityId=${encodeURIComponent(cityId)}&lat=${lat}&lon=${lon}&category=${encodeURIComponent(category)}`);
  if (!res.ok) {
    throw new Error(`Failed to load places (${res.status})`);
  }
  return res.json();
}

// Fetch official public safety data
export async function fetchSafety(cityId: string): Promise<OfficialSafetyInfo> {
  const res = await fetch(`/api/safety?cityId=${encodeURIComponent(cityId)}`);
  if (!res.ok) {
    throw new Error(`Failed to load safety data (${res.status})`);
  }
  return res.json();
}

// Geocode search via Nominatim
export async function searchGeocode(query: string): Promise<any[]> {
  if (!query.trim()) return [];
  const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
  if (!res.ok) {
    throw new Error('Geocoding search failed');
  }
  return res.json();
}

// Ask Gemini AI Guide
export async function askCityGuide(
  cityName: string,
  countryName: string,
  prompt: string,
  conversationHistory: { role: string; text: string }[] = []
): Promise<{ text: string; model: string; timestamp: string }> {
  const res = await fetch('/api/guide', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cityName,
      countryName,
      prompt,
      conversationHistory
    })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `AI guide request failed with status ${res.status}`);
  }

  return res.json();
}

// Fetch config & real data sources
export async function fetchAppConfig(): Promise<{ geminiConfigured: boolean; appVersion: string; dataSources: any[] }> {
  const res = await fetch('/api/config');
  if (!res.ok) {
    throw new Error('Failed to load application config');
  }
  return res.json();
}

// Fetch citizen reports
export async function fetchReports(cityId?: string, category?: string): Promise<{ count: number; reports: CitizenReport[] }> {
  let url = '/api/reports?';
  if (cityId) url += `cityId=${encodeURIComponent(cityId)}&`;
  if (category && category !== 'all') url += `category=${encodeURIComponent(category)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to load citizen reports');
  }
  return res.json();
}

// Submit a new citizen report
export async function submitReport(reportData: Partial<CitizenReport>): Promise<CitizenReport> {
  const res = await fetch('/api/reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reportData)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to submit report');
  }
  return res.json();
}

// Upvote an existing report
export async function upvoteReport(reportId: string): Promise<{ success: boolean; upvotes: number }> {
  const res = await fetch(`/api/reports/${encodeURIComponent(reportId)}/upvote`, {
    method: 'POST'
  });
  if (!res.ok) {
    throw new Error('Failed to upvote report');
  }
  return res.json();
}

// Fetch real safer-route navigation comparison
export async function fetchRoutes(
  startLat: number,
  startLon: number,
  endLat: number,
  endLon: number,
  cityId: string
): Promise<{ source: string; disclaimer: string; routes: RouteOption[] }> {
  const res = await fetch(
    `/api/routes?startLat=${startLat}&startLon=${startLon}&endLat=${endLat}&endLon=${endLon}&cityId=${encodeURIComponent(cityId)}`
  );
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to compute walking route');
  }
  return res.json();
}
