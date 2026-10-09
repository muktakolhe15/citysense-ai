import React, { useState } from 'react';
import { City, ActiveTab } from '../types.ts';
import {
  MapPin,
  Globe,
  Compass,
  Shield,
  Sparkles,
  Building2,
  ChevronDown,
  KeyRound,
  Menu,
  X,
  Sun,
  Scale,
  Navigation,
  ShieldAlert
} from 'lucide-react';

interface NavbarProps {
  currentCity: City;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenCitySelector: () => void;
  onOpenApiSources: () => void;
  geminiConfigured: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCity,
  activeTab,
  onTabChange,
  onOpenCitySelector,
  onOpenApiSources,
  geminiConfigured
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs: { key: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <Sun className="w-4 h-4" /> },
    { key: 'map', label: 'Map', icon: <Compass className="w-4 h-4" /> },
    { key: 'places', label: 'Places', icon: <Building2 className="w-4 h-4" /> },
    { key: 'compare', label: 'Compare', icon: <Scale className="w-4 h-4" /> },
    { key: 'routes', label: 'Safer Routes', icon: <Navigation className="w-4 h-4" /> },
    { key: 'reports', label: 'Citizen Reports', icon: <ShieldAlert className="w-4 h-4" /> },
    { key: 'safety', label: 'Safety', icon: <Shield className="w-4 h-4" /> },
    { key: 'guide', label: 'AI Guide', icon: <Sparkles className="w-4 h-4" /> },
  ];

  const handleTabClick = (key: ActiveTab) => {
    onTabChange(key);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Brand Logo & Tag */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-white">
                  CitySense<span className="text-indigo-400 font-extrabold">-AI</span>
                </span>
                <span className="hidden xl:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  Smart City Explorer
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Real-Time Maps • Live Weather • Official Public Safety
              </p>
            </div>
          </div>

          {/* Center: Selected City Quick Trigger */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCitySelector}
              className="flex items-center gap-2.5 px-3 sm:px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 shadow-md transition-all cursor-pointer group"
              title="Click to search or choose another city"
            >
              <span className="text-xl shrink-0 group-hover:scale-110 transition">{currentCity.flag}</span>
              <div className="text-left">
                <div className="text-xs sm:text-sm font-bold text-white group-hover:text-indigo-300 transition leading-tight flex items-center gap-1.5">
                  <span>{currentCity.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-300 transition" />
                </div>
                <div className="text-[10px] text-slate-400 truncate max-w-[100px] sm:max-w-[140px]">
                  {currentCity.country}
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1 rounded-2xl border border-slate-800">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => handleTabClick(tab.key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Tools: API Architecture & Mobile Menu */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenApiSources}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 font-medium flex items-center gap-1.5 transition cursor-pointer"
              title="View data sources & API documentation"
            >
              <KeyRound className="w-4 h-4 text-indigo-400" />
              <span className="hidden md:inline">API Sources</span>
              {geminiConfigured ? (
                <span className="w-2 h-2 rounded-full bg-emerald-400" title="Gemini server key configured" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-amber-400" title="Key info" />
              )}
            </button>

            {/* Mobile menu trigger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 lg:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 px-2 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 animate-fadeIn pb-4">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => handleTabClick(tab.key)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-300 border border-slate-800'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
