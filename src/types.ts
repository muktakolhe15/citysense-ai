export interface City {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  lat: number;
  lon: number;
  zoom: number;
  timezone: string;
  currency: string;
  language: string;
  flag: string;
  tagline: string;
  description: string;
}

export interface WeatherData {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    apparent_temperature_max?: number[];
    apparent_temperature_min?: number[];
    precipitation_sum?: number[];
    precipitation_probability_max?: number[];
    wind_speed_10m_max?: number[];
    uv_index_max?: number[];
    sunrise?: string[];
    sunset?: string[];
  };
}

export interface AirQualityData {
  current?: {
    european_aqi?: number;
    us_aqi?: number;
    pm10?: number;
    pm2_5?: number;
    carbon_monoxide?: number;
    nitrogen_dioxide?: number;
    ozone?: number;
  };
}

export type PlaceCategory =
  | 'attraction'
  | 'restaurant'
  | 'hotel'
  | 'historic'
  | 'hospital'
  | 'police'
  | 'transit'
  | 'pharmacy';

export interface PlacePOI {
  id: string;
  name: string;
  lat: number;
  lon: number;
  category: PlaceCategory;
  description: string;
  address: string;
  openingHours?: string;
  website?: string | null;
  phone?: string;
  wheelchair?: string;
  verifiedSource?: string;
  // Comparison fields
  affordability?: string;
  cleanlinessRating?: string;
  accessibility?: string;
  verifiedRating?: string;
  safetyFeatures?: string;
}

export interface OfficialSafetyInfo {
  cityId?: string;
  verified: boolean;
  policyNotice?: string;
  emergencyNumbers: {
    police: string;
    ambulance: string;
    fire: string;
    general?: string;
    touristSupport?: string;
  };
  policeAgencyName: string;
  officialPolicePortal: string;
  healthServiceAgency: string;
  healthPortal: string;
  officialAdvisorySource: string;
  advisoryLevel: string;
  advisorySummary: string;
  lastUpdated: string;
  verifiedAgencyUrl: string;
  consularAdviceUrl: string;
  publicSafetyGuidelines: string[];
}

export interface CitizenReport {
  id: string;
  cityId: string;
  category: 'traffic' | 'garbage' | 'pothole' | 'safety';
  title: string;
  description: string;
  lat: number;
  lon: number;
  address: string;
  timestamp: string;
  status: 'verified' | 'under_review' | 'resolved';
  upvotes: number;
  officialActionNote?: string;
  reportedBy: string;
  severity: 'low' | 'moderate' | 'high';
}

export interface RouteOption {
  id: string;
  name: string;
  type: 'standard' | 'safer';
  description: string;
  distanceMeters: number;
  durationMinutes: number;
  coordinates: [number, number][]; // [lat, lon]
  lightingCoverage: string;
  emergencyFacilityCount: number;
  nearbyHospitals: string[];
  nearbyPolice: string[];
  activeHazardsCount: number;
  safetyNotes: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface RecentlyExploredPlace {
  id: string;
  name: string;
  category: PlaceCategory;
  cityId: string;
  cityName: string;
  address: string;
  lat: number;
  lon: number;
  visitedAt: string;
}

export type ActiveTab =
  | 'dashboard'
  | 'cities'
  | 'map'
  | 'weather'
  | 'places'
  | 'compare'
  | 'routes'
  | 'reports'
  | 'safety'
  | 'guide'
  | 'settings'
  | 'overview';
