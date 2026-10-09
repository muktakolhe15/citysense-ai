import React, { useState } from 'react';
import { WeatherData, AirQualityData, City } from '../types.ts';
import { interpretWeatherCode, interpretAqi } from '../services/api.ts';
import {
  Cloud,
  Droplets,
  Wind,
  Sun,
  AlertCircle,
  RefreshCw,
  Compass,
  ShieldCheck,
  Thermometer,
  Eye,
  TrendingUp,
  Calendar,
  Sunrise,
  Sunset,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Sparkles,
  BarChart3
} from 'lucide-react';

interface WeatherCardProps {
  city: City;
  weather: WeatherData | null;
  airQuality: AirQualityData | null;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  city,
  weather,
  airQuality,
  loading,
  error,
  onRetry
}) => {
  const [useFahrenheit, setUseFahrenheit] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'trends'>('cards');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  const formatTemp = (celsius?: number) => {
    if (celsius === undefined || celsius === null) return '--';
    if (useFahrenheit) {
      const f = (celsius * 9) / 5 + 32;
      return `${Math.round(f)}°F`;
    }
    return `${Math.round(celsius)}°C`;
  };

  const formatTempNumber = (celsius?: number) => {
    if (celsius === undefined || celsius === null) return 0;
    if (useFahrenheit) {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return Math.round(celsius);
  };

  if (loading && !weather) {
    return (
      <div className="w-full rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-xl animate-pulse space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-6 w-44 bg-slate-800 rounded"></div>
            <div className="h-4 w-56 bg-slate-800/60 rounded"></div>
          </div>
          <div className="h-10 w-28 bg-slate-800 rounded-2xl"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-slate-800/50 rounded-2xl"></div>
          ))}
        </div>
        <div className="h-48 bg-slate-800/40 rounded-2xl"></div>
      </div>
    );
  }

  if (error && !weather) {
    return (
      <div className="w-full rounded-3xl bg-rose-950/30 border border-rose-900/50 p-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-rose-200 mb-1">Live Weather Currently Unavailable</h3>
            <p className="text-sm text-rose-300/80 mb-3 leading-relaxed">
              {error || 'Unable to connect to the Open-Meteo meteorological API at this moment.'}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={onRetry}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Connection
              </button>
              <span className="text-xs text-rose-400/70">
                Verified real-time endpoint: api.open-meteo.com
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!weather || !weather.current) {
    return null;
  }

  const current = weather.current;
  const weatherInfo = interpretWeatherCode(current.weather_code);
  const aqiVal = airQuality?.current?.european_aqi;
  const aqiInfo = interpretAqi(aqiVal);

  // 5-day daily forecast slices
  const dailyData = weather.daily || { time: [] };
  const numDays = Math.min(5, dailyData.time?.length || 0);
  const forecastDays = Array.from({ length: numDays }, (_, i) => ({
    index: i,
    dateStr: dailyData.time[i],
    date: new Date(dailyData.time[i]),
    code: dailyData.weather_code?.[i] ?? 0,
    maxTemp: dailyData.temperature_2m_max?.[i],
    minTemp: dailyData.temperature_2m_min?.[i],
    appMaxTemp: dailyData.apparent_temperature_max?.[i],
    appMinTemp: dailyData.apparent_temperature_min?.[i],
    rainProb: dailyData.precipitation_probability_max?.[i] ?? 0,
    rainSum: dailyData.precipitation_sum?.[i] ?? 0,
    windMax: dailyData.wind_speed_10m_max?.[i] ?? 0,
    uvIndex: dailyData.uv_index_max?.[i] ?? 0,
    sunrise: dailyData.sunrise?.[i],
    sunset: dailyData.sunset?.[i]
  }));

  // Calculate 5-day extremes for normalized range bars and trend highlights
  const maxTemps = forecastDays.map(d => d.maxTemp ?? -99).filter(t => t > -99);
  const minTemps = forecastDays.map(d => d.minTemp ?? 99).filter(t => t < 99);
  const overallHighest = maxTemps.length > 0 ? Math.max(...maxTemps) : 30;
  const overallLowest = minTemps.length > 0 ? Math.min(...minTemps) : 10;
  const tempSpan = Math.max(1, overallHighest - overallLowest);

  // Find warmest day, coolest day, and wettest day for trend summary
  const warmestDay = forecastDays.reduce((prev, curr) => ((curr.maxTemp ?? -99) > (prev.maxTemp ?? -99) ? curr : prev), forecastDays[0]);
  const coolestDay = forecastDays.reduce((prev, curr) => ((curr.minTemp ?? 99) < (prev.minTemp ?? 99) ? curr : prev), forecastDays[0]);
  const wettestDay = forecastDays.reduce((prev, curr) => (curr.rainProb > prev.rainProb ? curr : prev), forecastDays[0]);

  // Selected day data for detailed inspection
  const selectedDay = forecastDays[selectedDayIndex] || forecastDays[0];
  const selectedDayWeather = selectedDay ? interpretWeatherCode(selectedDay.code) : weatherInfo;

  return (
    <div className={`w-full rounded-3xl bg-gradient-to-br ${weatherInfo.bgGradient} bg-slate-900 border border-slate-800 p-5 sm:p-7 shadow-2xl relative overflow-hidden transition-all space-y-6`}>
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{weatherInfo.icon}</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {city.name} Weather & 5-Day Trends
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
              Open-Meteo Real Data
            </span>
          </div>
          <p className="text-xs text-slate-300">
            {weatherInfo.label} • {current.is_day ? 'Daytime' : 'Night'} in {city.timezone}
          </p>
        </div>

        {/* Controls: Unit toggle & Refresh */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-2xl bg-slate-800/90 p-1 border border-slate-700/80 text-xs">
            <button
              onClick={() => setUseFahrenheit(false)}
              className={`px-3 py-1 rounded-xl font-medium transition cursor-pointer ${
                !useFahrenheit ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              °C
            </button>
            <button
              onClick={() => setUseFahrenheit(true)}
              className={`px-3 py-1 rounded-xl font-medium transition cursor-pointer ${
                useFahrenheit ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              °F
            </button>
          </div>

          <button
            onClick={onRetry}
            className="p-2.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-300 hover:text-white border border-slate-700/80 transition cursor-pointer"
            title="Refresh weather data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Current Conditions Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 relative z-10">
        {/* Main Current Temp Hero */}
        <div className="md:col-span-5 flex items-center justify-between sm:justify-start gap-6 bg-slate-950/70 backdrop-blur-md rounded-2xl p-5 border border-slate-800/90">
          <div>
            <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-mono">
              {formatTemp(current.temperature_2m)}
            </div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-indigo-400" />
              <span>Feels like <strong>{formatTemp(current.apparent_temperature)}</strong></span>
            </div>
          </div>
          <div className="text-right sm:text-left border-l border-slate-800 pl-5">
            <div className="text-[11px] uppercase font-semibold text-slate-400 tracking-wider">Condition</div>
            <div className="text-sm font-semibold text-slate-200 mt-0.5">{weatherInfo.label}</div>
            <div className="text-xs text-slate-400 mt-1">
              Rain: {current.precipitation} mm
            </div>
          </div>
        </div>

        {/* 4 Essential Atmospheric Metrics */}
        <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-950/60 backdrop-blur-sm rounded-2xl p-3.5 border border-slate-800/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Humidity</span>
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-xl font-bold text-white font-mono mt-1">
              {current.relative_humidity_2m}%
            </div>
            <div className="text-[10px] text-slate-400">
              {current.relative_humidity_2m > 70 ? 'Humid' : current.relative_humidity_2m < 30 ? 'Dry' : 'Moderate'}
            </div>
          </div>

          <div className="bg-slate-950/60 backdrop-blur-sm rounded-2xl p-3.5 border border-slate-800/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Wind Speed</span>
              <Wind className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="text-xl font-bold text-white font-mono mt-1">
              {Math.round(current.wind_speed_10m)} <span className="text-xs font-normal text-slate-400">km/h</span>
            </div>
            <div className="text-[10px] text-slate-400">
              Heading {current.wind_direction_10m}°
            </div>
          </div>

          <div className="bg-slate-950/60 backdrop-blur-sm rounded-2xl p-3.5 border border-slate-800/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Max UV</span>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-bold text-white font-mono mt-1">
              {forecastDays[0]?.uvIndex !== undefined ? forecastDays[0].uvIndex.toFixed(1) : '--'}
            </div>
            <div className="text-[10px] text-slate-400">
              {forecastDays[0]?.uvIndex > 6 ? 'High (SPF req.)' : 'Moderate'}
            </div>
          </div>

          <div className="bg-slate-950/60 backdrop-blur-sm rounded-2xl p-3.5 border border-slate-800/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Air Quality</span>
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-white font-mono mt-1 flex items-center gap-1.5">
              <span>{aqiVal !== undefined ? aqiVal : '--'}</span>
              <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${aqiInfo.badgeClass}`}>
                {aqiInfo.label}
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              {airQuality?.current?.pm2_5 ? `PM2.5: ${airQuality.current.pm2_5.toFixed(1)} µg/m³` : 'Standard'}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          5-DAY WEATHER FORECAST & TRENDS SECTION
      ========================================================================= */}
      <div className="relative z-10 pt-4 border-t border-slate-800/80 space-y-4">
        {/* Section Header with View Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <h3 className="text-base font-bold text-white">
                5-Day Weather Forecast & Meteorological Trends
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-semibold font-mono">
                Open-Meteo Daily API
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparative temperature swings, precipitation probability & wind patterns across 5 days
            </p>
          </div>

          {/* View Mode Toggle: Cards vs Trend Curves */}
          <div className="flex items-center bg-slate-950/80 rounded-xl p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'cards'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>5-Day Cards</span>
            </button>
            <button
              onClick={() => setViewMode('trends')}
              className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'trends'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Trend Curves</span>
            </button>
          </div>
        </div>

        {/* 5-Day Trend Insights Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Warmest Peak</div>
              <div className="text-xs font-bold text-white truncate">
                {warmestDay.date.toLocaleDateString('en-US', { weekday: 'short' })}: <strong className="text-amber-400 font-mono">{formatTemp(warmestDay.maxTemp)}</strong>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
              <ArrowDownRight className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Coolest Dip</div>
              <div className="text-xs font-bold text-white truncate">
                {coolestDay.date.toLocaleDateString('en-US', { weekday: 'short' })}: <strong className="text-cyan-400 font-mono">{formatTemp(coolestDay.minTemp)}</strong>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <Droplets className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Highest Rain Probability</div>
              <div className="text-xs font-bold text-white truncate">
                {wettestDay.date.toLocaleDateString('en-US', { weekday: 'short' })}: <strong className="text-blue-400 font-mono">{wettestDay.rainProb}%</strong>
                {wettestDay.rainSum > 0 && ` (${wettestDay.rainSum} mm)`}
              </div>
            </div>
          </div>
        </div>

        {/* VIEW 1: 5-Day Cards with Interactive Selection */}
        {viewMode === 'cards' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            {forecastDays.map((day) => {
              const dayName = day.index === 0 ? 'Today' : day.index === 1 ? 'Tomorrow' : day.date.toLocaleDateString('en-US', { weekday: 'short' });
              const dateFormatted = day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              const dayWeather = interpretWeatherCode(day.code);
              const isSelected = selectedDayIndex === day.index;

              // Normalized bar calculation
              const barLeftPercent = Math.max(0, Math.min(100, (((day.minTemp ?? overallLowest) - overallLowest) / tempSpan) * 100));
              const barWidthPercent = Math.max(12, Math.min(100, (((day.maxTemp ?? overallHighest) - (day.minTemp ?? overallLowest)) / tempSpan) * 100));

              return (
                <button
                  key={day.dateStr}
                  onClick={() => setSelectedDayIndex(day.index)}
                  className={`p-4 rounded-2xl text-left transition flex flex-col justify-between cursor-pointer border ${
                    isSelected
                      ? 'bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/15 ring-1 ring-indigo-500'
                      : 'bg-slate-950/70 hover:bg-slate-900/90 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div>
                    {/* Date & Day Header */}
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-bold ${isSelected ? 'text-indigo-400' : 'text-slate-200'}`}>
                        {dayName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {dateFormatted}
                      </span>
                    </div>

                    {/* Weather Icon & Label */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl" title={dayWeather.label}>{dayWeather.icon}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-100 truncate">
                          {dayWeather.label}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          UV: {day.uvIndex.toFixed(0)}
                        </div>
                      </div>
                    </div>

                    {/* Temperature High / Low */}
                    <div className="flex items-baseline justify-between mb-2">
                      <div className="text-lg font-extrabold text-white font-mono">
                        {formatTemp(day.maxTemp)}
                      </div>
                      <div className="text-xs font-mono text-slate-400">
                        Low: {formatTemp(day.minTemp)}
                      </div>
                    </div>

                    {/* Visual High/Low Relative Range Bar */}
                    <div className="w-full bg-slate-900 rounded-full h-1.5 mb-3 overflow-hidden relative border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 via-amber-400 to-orange-500 rounded-full"
                        style={{
                          marginLeft: `${barLeftPercent}%`,
                          width: `${barWidthPercent}%`
                        }}
                      />
                    </div>
                  </div>

                  {/* Micro stats footer: Rain prob & Wind */}
                  <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px]">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="flex items-center gap-1 text-cyan-400">
                        <Droplets className="w-3 h-3" />
                        <span>Rain Chance</span>
                      </span>
                      <span className="font-mono font-semibold">{day.rainProb}%</span>
                    </div>

                    {day.windMax > 0 && (
                      <div className="flex items-center justify-between text-slate-400 text-[10px]">
                        <span className="flex items-center gap-1">
                          <Wind className="w-3 h-3 text-sky-400" />
                          <span>Max Wind</span>
                        </span>
                        <span>{Math.round(day.windMax)} km/h</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* VIEW 2: Visual Trend Curves & Sparkline Graph */}
        {viewMode === 'trends' && (
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">
                5-Day Temperature Curve (°{useFahrenheit ? 'F' : 'C'}) & Precipitation Probability (%)
              </span>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Daily High</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Night Low</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Rain Chance</span>
              </div>
            </div>

            {/* SVG Visual Trend Graph */}
            <div className="w-full h-44 relative bg-slate-900/50 rounded-xl p-3 border border-slate-800/80 flex flex-col justify-between">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120" preserveAspectRatio="none">
                {/* Gridlines */}
                <line x1="0" y1="20" x2="500" y2="20" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />

                {/* Generate points for highs and lows */}
                {(() => {
                  const pointsHigh = forecastDays.map((d, i) => {
                    const x = 50 + i * 100;
                    const val = d.maxTemp ?? overallHighest;
                    const y = 95 - (((val - overallLowest) / tempSpan) * 75);
                    return { x, y, val };
                  });

                  const pointsLow = forecastDays.map((d, i) => {
                    const x = 50 + i * 100;
                    const val = d.minTemp ?? overallLowest;
                    const y = 95 - (((val - overallLowest) / tempSpan) * 75);
                    return { x, y, val };
                  });

                  const dHigh = pointsHigh.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                  const dLow = pointsLow.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

                  return (
                    <>
                      {/* Highs Trend Line */}
                      <path d={dHigh} fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
                      {/* Lows Trend Line */}
                      <path d={dLow} fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />

                      {/* Data Dots & Value Labels */}
                      {pointsHigh.map((p, i) => (
                        <g key={`high-${i}`} className="cursor-pointer" onClick={() => setSelectedDayIndex(i)}>
                          <circle cx={p.x} cy={p.y} r={selectedDayIndex === i ? 6 : 4} fill="#fbbf24" stroke="#0f172a" strokeWidth="2" />
                          <text x={p.x} y={p.y - 10} textAnchor="middle" fill="#fef08a" fontSize="10" fontWeight="bold">
                            {formatTempNumber(p.val)}°
                          </text>
                        </g>
                      ))}

                      {pointsLow.map((p, i) => (
                        <g key={`low-${i}`} className="cursor-pointer" onClick={() => setSelectedDayIndex(i)}>
                          <circle cx={p.x} cy={p.y} r={selectedDayIndex === i ? 6 : 4} fill="#38bdf8" stroke="#0f172a" strokeWidth="2" />
                          <text x={p.x} y={p.y + 16} textAnchor="middle" fill="#bae6fd" fontSize="10">
                            {formatTempNumber(p.val)}°
                          </text>
                        </g>
                      ))}
                    </>
                  );
                })()}
              </svg>

              {/* Day Labels at bottom */}
              <div className="grid grid-cols-5 text-center text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                {forecastDays.map((d, i) => (
                  <button
                    key={d.dateStr}
                    onClick={() => setSelectedDayIndex(i)}
                    className={`font-medium transition hover:text-white cursor-pointer ${
                      selectedDayIndex === i ? 'text-indigo-400 font-bold' : ''
                    }`}
                  >
                    {i === 0 ? 'Today' : d.date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </button>
                ))}
              </div>
            </div>

            {/* Precipitation probability side-by-side bars */}
            <div className="pt-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                5-Day Precipitation Probability Horizon (%)
              </div>
              <div className="grid grid-cols-5 gap-2">
                {forecastDays.map((d, i) => (
                  <div key={d.dateStr} className="space-y-1 text-center">
                    <div className="h-14 bg-slate-900 rounded-lg p-1 flex flex-col justify-end border border-slate-800">
                      <div
                        className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded transition-all duration-500"
                        style={{ height: `${Math.max(8, d.rainProb)}%` }}
                      />
                    </div>
                    <div className="text-xs font-mono font-semibold text-cyan-400">{d.rainProb}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Selected Day In-Depth Focus Panel */}
        {selectedDay && (
          <div className="bg-slate-950/70 border border-indigo-500/30 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fadeIn">
            <div className="flex items-start gap-4">
              <span className="text-3xl shrink-0">{selectedDayWeather.icon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">
                    {selectedDayIndex === 0 ? 'Today' : selectedDay.date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} Focus
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-medium">
                    {selectedDayWeather.label}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                  High of <strong>{formatTemp(selectedDay.maxTemp)}</strong>, nighttime low of <strong>{formatTemp(selectedDay.minTemp)}</strong>.
                  Rain probability is <strong>{selectedDay.rainProb}%</strong>{selectedDay.rainSum > 0 ? ` with approx ${selectedDay.rainSum} mm precipitation` : ''}.
                  Wind speeds up to <strong>{Math.round(selectedDay.windMax)} km/h</strong>.
                </p>
              </div>
            </div>

            {/* Sun cycles */}
            {(selectedDay.sunrise || selectedDay.sunset) && (
              <div className="flex items-center gap-4 text-xs text-slate-300 bg-slate-900/90 px-4 py-2.5 rounded-xl border border-slate-800 shrink-0 font-mono">
                {selectedDay.sunrise && (
                  <div className="flex items-center gap-1.5">
                    <Sunrise className="w-3.5 h-3.5 text-amber-400" />
                    <span>Rise: {new Date(selectedDay.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                )}
                {selectedDay.sunset && (
                  <div className="flex items-center gap-1.5">
                    <Sunset className="w-3.5 h-3.5 text-orange-400" />
                    <span>Set: {new Date(selectedDay.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Attribution footer */}
      <div className="pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 relative z-10">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Verified Real-Time Meteorological Data: Open-Meteo Global Forecasting API (No synthetic data)</span>
        </span>
        <a
          href="https://open-meteo.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 hover:text-indigo-300 underline font-medium"
        >
          open-meteo.com
        </a>
      </div>
    </div>
  );
};
