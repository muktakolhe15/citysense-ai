import React from 'react';
import { X, ShieldCheck, Key, Database, Globe, Cloud, Sparkles, ExternalLink, Lock } from 'lucide-react';

interface ApiSourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  geminiConfigured: boolean;
}

export const ApiSourcesModal: React.FC<ApiSourcesModalProps> = ({
  isOpen,
  onClose,
  geminiConfigured
}) => {
  if (!isOpen) return null;

  const dataSources = [
    {
      name: 'Google Gemini 3.8 Flash',
      category: 'AI City Guide & Natural Intelligence',
      status: geminiConfigured ? 'Connected (Server-Side)' : 'Pending Secret Injection',
      keyRequired: true,
      keyEnv: 'GEMINI_API_KEY',
      details: 'Executed strictly via server-side Node.js proxy with @google/genai SDK. Zero client token exposure. User secrets handled securely via Google AI Studio.',
      url: 'https://ai.google.dev',
      badgeClass: geminiConfigured ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
    },
    {
      name: 'Open-Meteo Weather & Air Quality API',
      category: 'Live Atmospheric & Meteorological Data',
      status: 'Active (No Key Required)',
      keyRequired: false,
      details: 'High-resolution global weather models providing live temperatures, humidity, wind velocity, UV index, and air particulate telemetry (PM2.5, PM10).',
      url: 'https://open-meteo.com',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    },
    {
      name: 'OpenStreetMap (OSM) & Overpass API',
      category: 'POIs, Essential Services & Mapping Data',
      status: 'Active (Public Open Data)',
      keyRequired: false,
      details: 'Community-maintained geospatial database providing verified coordinates for attractions, hospitals, emergency departments, police stations, transit hubs, and pharmacies.',
      url: 'https://www.openstreetmap.org',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    },
    {
      name: 'OSM Nominatim Geocoding API',
      category: 'Dynamic City & Address Search',
      status: 'Active (Public Open Data)',
      keyRequired: false,
      details: 'Converts natural language user searches into real geographic coordinates and administrative boundaries with strict rate-limit protection.',
      url: 'https://nominatim.org',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    },
    {
      name: 'Official National Emergency Registries & Consular Portals',
      category: 'Public Safety & Emergency Directives',
      status: 'Verified October 2026',
      keyRequired: false,
      details: 'Direct verified emergency telephone dispatches (911, 112, 999, 110, 119) and official foreign travel advisories (U.S. Dept of State, UK FCDO, Municipal Police). No synthetic crime scores.',
      url: 'https://travel.state.gov',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Data Architecture & API Key Documentation</h3>
              <p className="text-xs text-slate-500">Strictly real data sources & zero synthetic mock statistics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Security Notice */}
          <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200/60 flex items-start gap-3">
            <Lock className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900 block mb-1 font-semibold">Zero-Client-Secret Architecture:</strong>
              All AI requests route through our secure Express server entrypoint (<code className="text-teal-800 font-mono font-semibold">server.ts</code>). API keys are accessed solely via server environment variables (<code className="text-teal-800 font-mono font-semibold">process.env.GEMINI_API_KEY</code>) and are never embedded in client bundles or browser localStorage.
            </div>
          </div>

          {/* Sources List */}
          <div className="space-y-3">
            {dataSources.map((source, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{source.name}</span>
                    <span className="text-[10px] text-slate-500">• {source.category}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${source.badgeClass}`}>
                    {source.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {source.details}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] pt-2 border-t border-slate-200/80 text-slate-500">
                  <span className="flex items-center gap-1.5 font-mono">
                    <Key className="w-3.5 h-3.5 text-teal-700" />
                    <span>Key Required: {source.keyRequired ? <strong className="text-amber-800">{source.keyEnv}</strong> : 'None (Open Service)'}</span>
                  </span>

                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-700 hover:text-teal-800 flex items-center gap-1 font-semibold"
                  >
                    <span>Official Documentation</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>CitySense-AI Smart City Explorer</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold transition cursor-pointer"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
