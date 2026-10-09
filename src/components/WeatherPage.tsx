import React, { useState } from 'react';
import { City, WeatherData, AirQualityData } from '../types.ts';
import { WeatherCard } from './WeatherCard.tsx';
import {
  CloudSun,
  Wind,
  Droplets,
  Sun,
  ShieldCheck,
  RefreshCw,
  Compass,
  ArrowRight
} from 'lucide-react';

interface WeatherPageProps {
  city: City;
  weather: WeatherData | null;
  airQuality: AirQualityData | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onNavigateToCitySelect: () => void;
}

export const WeatherPage: React.FC<WeatherPageProps> = ({
  city,
  weather,
  airQuality,
  loading,
  error,
  onRetry,
  onNavigateToCitySelect
}) => {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <CloudSun className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Atmospheric & Environmental Telemetry
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Live Weather & Air Quality: {city.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Real-time meteorological forecast sourced from Open-Meteo global weather models. Zero synthetic statistics.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onRetry}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
            title="Refresh weather data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={onNavigateToCitySelect}
            className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Switch City</span>
          </button>
        </div>
      </section>

      {/* Main Meteorological Card */}
      <WeatherCard
        city={city}
        weather={weather}
        airQuality={airQuality}
        loading={loading}
        error={error}
        onRetry={onRetry}
      />
    </div>
  );
};
