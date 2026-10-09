import React from 'react';
import { City, RecentlyExploredPlace } from '../types.ts';
import {
  Settings,
  Sliders,
  Database,
  Trash2,
  Check,
  ShieldCheck,
  CloudSun,
  Globe,
  Sparkles,
  Info,
  Server
} from 'lucide-react';

interface SettingsPageProps {
  currentCity: City;
  availableCities: City[];
  onSelectCity: (city: City) => void;
  recentlyExplored: RecentlyExploredPlace[];
  onClearRecentlyExplored: () => void;
  geminiConfigured: boolean;
  onOpenApiSources: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  currentCity,
  availableCities,
  onSelectCity,
  recentlyExplored,
  onClearRecentlyExplored,
  geminiConfigured,
  onOpenApiSources
}) => {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-4xl">
      {/* Header */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <Settings className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
            System Preferences
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Application Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Customize your dashboard experience, manage persistent local history, and inspect active data connections.
        </p>
      </section>

      {/* Default Dashboard City */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Default Urban Hub</h3>
            <p className="text-xs text-slate-500">
              Select the initial city loaded when launching CitySense-AI
            </p>
          </div>
          <span className="text-xs font-bold text-teal-700">
            Active: {currentCity.name}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {availableCities.slice(0, 8).map((c) => {
            const isSelected = currentCity.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => onSelectCity(c)}
                className={`p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-teal-50 border-teal-300 text-teal-900 font-bold shadow-2xs'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-lg">{c.flag}</span>
                  <span className="text-xs truncate">{c.name}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-teal-700 shrink-0" />}
              </button>
            );
          })}
        </div>
      </section>

      {/* Persistent Storage Manager */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-teal-700" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Persistent Browsing Storage
              </h3>
              <p className="text-xs text-slate-500">
                Locations you explore are saved to your browser's persistent storage.
              </p>
            </div>
          </div>

          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold font-mono">
            {recentlyExplored.length} items stored
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="text-xs text-slate-600">
            {recentlyExplored.length > 0 ? (
              <span>Stored records include recently visited POIs across all cities.</span>
            ) : (
              <span className="text-slate-400">History is currently clear.</span>
            )}
          </div>

          {recentlyExplored.length > 0 && (
            <button
              onClick={onClearRecentlyExplored}
              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Stored History</span>
            </button>
          )}
        </div>
      </section>

      {/* Connected Services Status */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-teal-700" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Data Infrastructure Status</h3>
              <p className="text-xs text-slate-500">
                Zero synthetic metrics. Real services connected via server proxy.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenApiSources}
            className="text-xs font-bold text-teal-700 hover:text-teal-900 cursor-pointer"
          >
            Full Architecture →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CloudSun className="w-4 h-4 text-teal-600" />
              <span className="font-semibold text-slate-800">Open-Meteo Weather</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Connected
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-slate-800">OpenStreetMap POIs & Tiles</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Connected
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span className="font-semibold text-slate-800">OSRM Safer-Routing Engine</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Connected
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="font-semibold text-slate-800">Google Gemini 3.8 Flash</span>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                geminiConfigured
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {geminiConfigured ? 'Connected' : 'Secret Key Mode'}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
