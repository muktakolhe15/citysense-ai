import React from 'react';
import { ActiveTab, City } from '../types.ts';
import {
  LayoutDashboard,
  Globe,
  Compass,
  CloudSun,
  ShieldCheck,
  AlertTriangle,
  Scale,
  Sparkles,
  Settings,
  X,
  MapPin,
  Activity,
  Layers
} from 'lucide-react';

interface DashboardSidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  currentCity: City;
  isOpen: boolean;
  onClose: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeTab,
  onTabChange,
  currentCity,
  isOpen,
  onClose
}) => {
  const navItems: {
    id: ActiveTab;
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'cities',
      label: 'Explore Cities',
      icon: <Globe className="w-4 h-4" />
    },
    {
      id: 'map',
      label: 'Interactive Map',
      icon: <Compass className="w-4 h-4" />
    },
    {
      id: 'weather',
      label: 'Weather',
      icon: <CloudSun className="w-4 h-4" />
    },
    {
      id: 'safety',
      label: 'Safety & Security',
      icon: <ShieldCheck className="w-4 h-4" />
    },
    {
      id: 'reports',
      label: 'Citizen Reports',
      icon: <AlertTriangle className="w-4 h-4" />
    },
    {
      id: 'compare',
      label: 'Compare Places',
      icon: <Scale className="w-4 h-4" />
    },
    {
      id: 'guide',
      label: 'AI City Assistant',
      icon: <Sparkles className="w-4 h-4" />,
      badge: 'Gemini'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />
    }
  ];

  const handleNavClick = (tabId: ActiveTab) => {
    onTabChange(tabId);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-bold text-slate-900 tracking-tight leading-none flex items-center gap-1">
                <span>CitySense</span>
                <span className="text-teal-600">-AI</span>
              </div>
              <p className="text-[10px] font-semibold text-slate-400 mt-0.5 tracking-wider uppercase">
                Smart City Explorer
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 lg:hidden cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current City Mini Bar */}
        <div className="p-3 mx-3 my-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xl shrink-0">{currentCity.flag}</span>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate">
                {currentCity.name}
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                {currentCity.country}
              </div>
            </div>
          </div>
          <button
            onClick={() => handleNavClick('cities')}
            className="text-[11px] font-semibold text-teal-700 hover:text-teal-800 shrink-0 cursor-pointer"
            title="Switch city"
          >
            Change
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              activeTab === item.id ||
              (item.id === 'dashboard' && activeTab === 'overview');

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 font-bold border border-teal-200/60 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={
                      isActive ? 'text-teal-700' : 'text-slate-400'
                    }
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold bg-teal-100 text-teal-700">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Info & Telemetry Status */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/60">
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Open Data
            </span>
            <span className="text-[10px] font-mono text-slate-400">v1.2 SaaS</span>
          </div>
          <div className="text-[10px] text-slate-400 leading-tight">
            OpenStreetMap • Open-Meteo • Verified Civil Feeds
          </div>
        </div>
      </aside>
    </>
  );
};
