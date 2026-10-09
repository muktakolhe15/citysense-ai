import React, { useState } from 'react';
import { CitizenReport, City } from '../types.ts';
import { submitReport, upvoteReport } from '../services/api.ts';
import {
  AlertTriangle,
  Trash2,
  Car,
  ShieldAlert,
  ThumbsUp,
  Plus,
  CheckCircle2,
  Clock,
  MapPin,
  X,
  Filter,
  Send,
  Sparkles,
  Info,
  Calendar,
  Building
} from 'lucide-react';

interface CitizenReportsSectionProps {
  city: City;
  reports: CitizenReport[];
  onReportsUpdated: (newReport: CitizenReport) => void;
  onUpvoteUpdated: (reportId: string) => void;
}

const CATEGORY_CONFIG: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  traffic: { label: 'Traffic & Transit', icon: Car, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  garbage: { label: 'Waste & Sanitation', icon: Trash2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
  pothole: { label: 'Road & Potholes', icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' },
  safety: { label: 'Safety & Streetlighting', icon: ShieldAlert, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/30' }
};

const STATUS_CONFIG: Record<string, { label: string; badge: string; icon: any }> = {
  verified: { label: 'Verified by City Agency', badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40', icon: CheckCircle2 },
  under_review: { label: 'Under Municipal Review', badge: 'bg-amber-500/15 text-amber-300 border-amber-500/40', icon: Clock },
  resolved: { label: 'Work Resolved & Cleared', badge: 'bg-blue-500/15 text-blue-300 border-blue-500/40', icon: CheckCircle2 }
};

export const CitizenReportsSection: React.FC<CitizenReportsSectionProps> = ({
  city,
  reports,
  onReportsUpdated,
  onUpvoteUpdated
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(new Set());

  // Form states
  const [formCategory, setFormCategory] = useState<'traffic' | 'garbage' | 'pothole' | 'safety'>('traffic');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formReporter, setFormReporter] = useState('');
  const [formSeverity, setFormSeverity] = useState<'low' | 'moderate' | 'high'>('moderate');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const cityReports = reports.filter(r => r.cityId === city.id);

  const filteredReports = cityReports.filter(r => {
    const matchesCat = selectedCategory === 'all' || r.category === selectedCategory;
    const matchesStat = selectedStatus === 'all' || r.status === selectedStatus;
    return matchesCat && matchesStat;
  });

  const handleUpvote = async (reportId: string) => {
    if (upvotedIds.has(reportId)) return;
    setUpvotedIds(prev => new Set(prev).add(reportId));
    onUpvoteUpdated(reportId);
    try {
      await upvoteReport(reportId);
    } catch (err) {
      console.warn('Upvote error:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDescription.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await submitReport({
        cityId: city.id,
        category: formCategory,
        title: formTitle,
        description: formDescription,
        address: formAddress || `${city.name} Central Area`,
        lat: city.lat,
        lon: city.lon,
        reportedBy: formReporter || 'Local Resident',
        severity: formSeverity
      });

      onReportsUpdated(created);
      setSubmitSuccess(true);
      setTimeout(() => {
        setIsSubmitModalOpen(false);
        setSubmitSuccess(false);
        setFormTitle('');
        setFormDescription('');
        setFormAddress('');
        setFormReporter('');
      }, 1500);
    } catch (err) {
      console.error('Submit report failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const counts = {
    all: cityReports.length,
    traffic: cityReports.filter(r => r.category === 'traffic').length,
    garbage: cityReports.filter(r => r.category === 'garbage').length,
    pothole: cityReports.filter(r => r.category === 'pothole').length,
    safety: cityReports.filter(r => r.category === 'safety').length
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {city.name} Citizen Field Reports
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
              Civic Infrastructure
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Real community-submitted and municipally verified alerts for traffic bottlenecks, waste overflow, road defects, and neighborhood safety concerns.
          </p>
        </div>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-lg shadow-amber-600/25 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Report an Issue in {city.name}</span>
        </button>
      </div>

      {/* Filter Chips Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Reports ({counts.all})
          </button>
          <button
            onClick={() => setSelectedCategory('traffic')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'traffic'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Car className="w-3.5 h-3.5 text-amber-400" />
            <span>Traffic ({counts.traffic})</span>
          </button>
          <button
            onClick={() => setSelectedCategory('garbage')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'garbage'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Garbage ({counts.garbage})</span>
          </button>
          <button
            onClick={() => setSelectedCategory('pothole')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'pothole'
                ? 'bg-rose-600 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>Potholes ({counts.pothole})</span>
          </button>
          <button
            onClick={() => setSelectedCategory('safety')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'safety'
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
            <span>Safety ({counts.safety})</span>
          </button>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Verification Statuses</option>
            <option value="verified">Verified by City Agency</option>
            <option value="under_review">Under Municipal Review</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Reports Feed Grid */}
      {filteredReports.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center">
          <Info className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No reports match your filters</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            No citizen reports matching this category and status have been filed in {city.name}.
          </p>
          <button
            onClick={() => { setSelectedCategory('all'); setSelectedStatus('all'); }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReports.map((report) => {
            const cat = CATEGORY_CONFIG[report.category] || CATEGORY_CONFIG.traffic;
            const stat = STATUS_CONFIG[report.status] || STATUS_CONFIG.under_review;
            const Icon = cat.icon;
            const StatusIcon = stat.icon;
            const hasUpvoted = upvotedIds.has(report.id);
            const dateObj = new Date(report.timestamp);

            return (
              <div
                key={report.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Category & Status Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${cat.bg} ${cat.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                      <span>{cat.label}</span>
                    </span>

                    <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${stat.badge}`}>
                      <StatusIcon className="w-3 h-3" />
                      <span>{stat.label}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-white mb-1.5 leading-snug">
                    {report.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {report.description}
                  </p>

                  {/* Official Action Note if available */}
                  {report.officialActionNote && (
                    <div className="mb-4 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2.5">
                      <Building className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-indigo-300 block mb-0.5 font-semibold">Municipal Dispatch Update:</strong>
                        <span>{report.officialActionNote}</span>
                      </div>
                    </div>
                  )}

                  {/* Meta: Location & Submitter */}
                  <div className="space-y-1.5 text-[11px] text-slate-400 border-t border-slate-800/80 pt-3 mb-4">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-slate-300 truncate">{report.address}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">By {report.reportedBy}</span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Controls: Upvote Button */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    report.severity === 'high' ? 'bg-rose-500/20 text-rose-300' : report.severity === 'low' ? 'bg-slate-800 text-slate-400' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {report.severity} Severity
                  </span>

                  <button
                    onClick={() => handleUpvote(report.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                      hasUpvoted
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${hasUpvoted ? 'text-amber-400 fill-amber-400' : ''}`} />
                    <span>Upvote ({report.upvotes})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Submission Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">File Citizen Report: {city.name}</h3>
                  <p className="text-xs text-slate-400">Reports are reviewed by municipal services</p>
                </div>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            {submitSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white">Report Successfully Filed!</h4>
                <p className="text-xs text-slate-300">
                  Your issue has been logged into the civic registry with status <strong>Under Municipal Review</strong>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                {/* Category Selection */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Issue Category *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'traffic', label: 'Traffic & Transit', icon: Car },
                      { key: 'garbage', label: 'Garbage & Waste', icon: Trash2 },
                      { key: 'pothole', label: 'Pothole / Road', icon: AlertTriangle },
                      { key: 'safety', label: 'Safety Concern', icon: ShieldAlert }
                    ].map(item => (
                      <button
                        type="button"
                        key={item.key}
                        onClick={() => setFormCategory(item.key as any)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
                          formCategory === item.key
                            ? 'bg-amber-600/20 border-amber-500 text-amber-200'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        <item.icon className="w-3.5 h-3.5" />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Summary Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Deep pothole causing bicycle swerves..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Detailed Observations *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Describe specific location, lane, hazard intensity, and landmarks..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                {/* Address & Severity */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Street / Location
                    </label>
                    <input
                      type="text"
                      value={formAddress}
                      onChange={(e) => setFormAddress(e.target.value)}
                      placeholder="e.g. 5th Ave near corner..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Hazard Severity
                    </label>
                    <select
                      value={formSeverity}
                      onChange={(e) => setFormSeverity(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="low">Low (Nuisance)</option>
                      <option value="moderate">Moderate (Obstruction)</option>
                      <option value="high">High (Urgent Risk)</option>
                    </select>
                  </div>
                </div>

                {/* Submitter Name */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Your Name or Handle (Optional)
                  </label>
                  <input
                    type="text"
                    value={formReporter}
                    onChange={(e) => setFormReporter(e.target.value)}
                    placeholder="e.g. Maria G. (Resident)"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !formTitle.trim() || !formDescription.trim()}
                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 text-xs text-white font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-600/30"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Filing...' : 'Submit to Registry'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
