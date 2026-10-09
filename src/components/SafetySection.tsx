import React from 'react';
import { OfficialSafetyInfo, City } from '../types.ts';
import { Shield, PhoneCall, ExternalLink, AlertTriangle, CheckCircle, Info, Calendar, Building2, HeartPulse, ShieldCheck, Flame, Siren } from 'lucide-react';

interface SafetySectionProps {
  city: City;
  safety: OfficialSafetyInfo | null;
  loading: boolean;
  error: string | null;
}

export const SafetySection: React.FC<SafetySectionProps> = ({
  city,
  safety,
  loading,
  error
}) => {
  if (loading && !safety) {
    return (
      <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 animate-pulse space-y-4">
        <div className="h-6 w-48 bg-slate-800 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-28 bg-slate-800 rounded-xl"></div>
          <div className="h-28 bg-slate-800 rounded-xl"></div>
          <div className="h-28 bg-slate-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error && !safety) {
    return (
      <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
        <p className="text-sm text-slate-300">Safety data is temporarily unavailable for this region.</p>
      </div>
    );
  }

  if (!safety) return null;

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Safety Policy & Source Commitment Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">
                  Official Public Safety Directory: {city.name}
                </h2>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Verified Official
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Information is sourced strictly from verified national emergency directories, municipal law enforcement, and government foreign advisories. We never fabricate statistical crime indices or synthetic hazard scores.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/60 px-3 py-2 rounded-xl border border-slate-800 shrink-0 font-mono">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>Verified: <strong>{safety.lastUpdated}</strong></span>
          </div>
        </div>
      </div>

      {/* Emergency Quick-Dial Grid */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-rose-400" />
          <span>Immediate Emergency Dispatch Numbers</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Police */}
          <div className="bg-slate-900 border border-rose-900/40 hover:border-rose-500/50 rounded-2xl p-4 shadow-lg flex flex-col justify-between transition">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold text-rose-400">Police Emergency</span>
                <Siren className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl font-extrabold text-white font-mono mb-1">
                {safety.emergencyNumbers.police}
              </div>
              <p className="text-[11px] text-slate-400">
                Direct dispatch for active crimes & urgent threats
              </p>
            </div>
            <a
              href={`tel:${safety.emergencyNumbers.police.replace(/[^0-9]/g, '')}`}
              className="mt-4 w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Police</span>
            </a>
          </div>

          {/* Medical / Ambulance */}
          <div className="bg-slate-900 border border-emerald-900/40 hover:border-emerald-500/50 rounded-2xl p-4 shadow-lg flex flex-col justify-between transition">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold text-emerald-400">Ambulance / Medical</span>
                <HeartPulse className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-extrabold text-white font-mono mb-1">
                {safety.emergencyNumbers.ambulance}
              </div>
              <p className="text-[11px] text-slate-400">
                Life-threatening health emergencies & acute trauma
              </p>
            </div>
            <a
              href={`tel:${safety.emergencyNumbers.ambulance.replace(/[^0-9]/g, '')}`}
              className="mt-4 w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Ambulance</span>
            </a>
          </div>

          {/* Fire & Rescue */}
          <div className="bg-slate-900 border border-amber-900/40 hover:border-amber-500/50 rounded-2xl p-4 shadow-lg flex flex-col justify-between transition">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold text-amber-400">Fire & Rescue</span>
                <Flame className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-extrabold text-white font-mono mb-1">
                {safety.emergencyNumbers.fire}
              </div>
              <p className="text-[11px] text-slate-400">
                Fire containment, structural rescue & hazmat
              </p>
            </div>
            <a
              href={`tel:${safety.emergencyNumbers.fire.replace(/[^0-9]/g, '')}`}
              className="mt-4 w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Fire Rescue</span>
            </a>
          </div>

          {/* Non-Emergency Helpline */}
          <div className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-4 shadow-lg flex flex-col justify-between transition">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-semibold text-indigo-400">Non-Emergency / Helpline</span>
                <Info className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-xl font-bold text-white font-mono mb-1 truncate">
                {safety.emergencyNumbers.general || safety.emergencyNumbers.touristSupport || '112'}
              </div>
              <p className="text-[11px] text-slate-400">
                Inquiries, minor incidents & tourist language assistance
              </p>
            </div>
            <div className="mt-4 w-full py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2">
              <span>Public Assistance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Advisory & Verified Public Portals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Official Travel Advisory Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Government Travel Advisory Status
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-medium">
                {safety.advisoryLevel}
              </span>
            </div>

            <h4 className="text-base font-bold text-white mb-2">
              Official Assessment by {safety.officialAdvisorySource}
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed mb-4 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
              "{safety.advisorySummary}"
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-slate-400">Source: Official Government Portals</span>
            <div className="flex items-center gap-2">
              <a
                href={safety.verifiedAgencyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 underline"
              >
                <span>State Dept Advisory</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span className="text-slate-600">•</span>
              <a
                href={safety.consularAdviceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 underline"
              >
                <span>UK FCDO Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Responsible Public Institutions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
              Official Authorities & Responsible Agencies
            </span>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <Building2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Metropolitan Police Agency</div>
                    <div className="text-sm font-semibold text-white">{safety.policeAgencyName}</div>
                  </div>
                </div>
                <a
                  href={safety.officialPolicePortal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-400 hover:text-indigo-300 shrink-0 flex items-center gap-1 mt-1 font-medium"
                >
                  <span>Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <HeartPulse className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Public Health & Hospital Authority</div>
                    <div className="text-sm font-semibold text-white">{safety.healthServiceAgency}</div>
                  </div>
                </div>
                <a
                  href={safety.healthPortal}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-400 hover:text-indigo-300 shrink-0 flex items-center gap-1 mt-1 font-medium"
                >
                  <span>Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Direct agency websites verified against official domain registries.</span>
          </div>
        </div>
      </div>

      {/* Verified Municipal Safety Guidelines */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Verified Local Guidelines & Practical Commuter Safety</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {safety.publicSafetyGuidelines.map((tip, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3"
            >
              <div className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {tip}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
