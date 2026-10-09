import React from 'react';
import { Compass, ShieldCheck, Heart, ExternalLink, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Compass className="w-4 h-4 text-teal-600" />
              <span>CitySense-AI: Smart City Explorer</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed max-w-md">
              A civic discovery dashboard built for the smart city hackathon. Grounded exclusively in authentic real-world APIs, OpenStreetMap geographic databases, live meteorological feeds, and official public safety portals.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-teal-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero fabricated statistics • 100% verified official services</span>
            </div>
          </div>

          {/* Real Data Pipelines */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-800 mb-2">
              Data Integrations
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal-700 flex items-center gap-1 transition">
                  <span>Open-Meteo Weather & AQI</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://www.openstreetmap.org" target="_blank" rel="noopener noreferrer" className="hover:text-teal-700 flex items-center gap-1 transition">
                  <span>OpenStreetMap & Overpass POIs</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://nominatim.org" target="_blank" rel="noopener noreferrer" className="hover:text-teal-700 flex items-center gap-1 transition">
                  <span>Nominatim Geocoding</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://ai.google.dev" target="_blank" rel="noopener noreferrer" className="hover:text-teal-700 flex items-center gap-1 transition">
                  <span>Gemini 3.8 Flash (Server-Side)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Official Safety Authorities */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-800 mb-2">
              Safety Portals
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <a href="https://travel.state.gov" target="_blank" rel="noopener noreferrer" className="hover:text-teal-700 flex items-center gap-1 transition">
                  <span>U.S. Dept of State Advisories</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://www.gov.uk/foreign-travel-advice" target="_blank" rel="noopener noreferrer" className="hover:text-teal-700 flex items-center gap-1 transition">
                  <span>UK FCDO Travel Guidance</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://www.interpol.int" target="_blank" rel="noopener noreferrer" className="hover:text-teal-700 flex items-center gap-1 transition">
                  <span>Interpol & National Police</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://www.who.int" target="_blank" rel="noopener noreferrer" className="hover:text-teal-700 flex items-center gap-1 transition">
                  <span>WHO Global Health Emergency</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div>
            Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-600">OpenStreetMap contributors</a>
          </div>
          <div>
            CitySense-AI Smart City Explorer
          </div>
        </div>
      </div>
    </footer>
  );
};
