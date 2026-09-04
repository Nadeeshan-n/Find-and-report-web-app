import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  Tag, 
  User, 
  ShieldCheck, 
  MessageSquare, 
  Sparkles, 
  CheckCircle, 
  Share2, 
  AlertCircle,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { useReports } from '../context/ReportContext';
import { findMatchesForReport } from '../mockData';
import { MatchCard } from '../components/MatchCard';
import { ContactModal } from '../components/ContactModal';
import { ReportMatchModal } from '../components/ReportMatchModal';
import { ReportStatus, Report } from '../types';

export const ItemDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { reports, getReportById, updateReportStatus } = useReports();

  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMatchOpen, setIsMatchOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Report | undefined>(undefined);
  const [copySuccess, setCopySuccess] = useState(false);

  const report = getReportById(id || '');

  // Calculate matches dynamically using the mock AI matching engine
  const matches = useMemo(() => {
    if (!report) return [];
    // Only show matches above 50% as specified in brief
    return findMatchesForReport(report, reports).filter(m => m.score >= 50);
  }, [report, reports]);

  if (!report) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-full bg-stone-100 text-stone-500 flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-stone-900">Report Not Found</h2>
        <p className="text-sm text-stone-500">
          The requested report ID <code>{id}</code> does not exist or has been removed from the session.
        </p>
        <Link
          to="/browse"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Link>
      </div>
    );
  }

  const isLost = report.type === 'lost';

  const handleMarkReturned = () => {
    const newStatus = report.status === 'returned' ? 'active' : 'returned';
    updateReportStatus(report.id, newStatus);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const statusConfig = {
    active: { label: 'Active Listing', bg: 'bg-emerald-50/90', text: 'text-emerald-700', border: 'border-emerald-200/60' },
    possible_match: { label: 'Possible Match Identified', bg: 'bg-amber-50/90', text: 'text-amber-800', border: 'border-amber-200/60' },
    contacted: { label: 'In Handoff Contact', bg: 'bg-indigo-50/90', text: 'text-indigo-700', border: 'border-indigo-200/60' },
    returned: { label: 'Returned to Owner', bg: 'bg-white/80', text: 'text-slate-700', border: 'border-white/60' },
    closed: { label: 'Report Closed', bg: 'bg-white/80', text: 'text-slate-500', border: 'border-white/60' },
  }[report.status];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          to="/browse"
          id="back-to-browse-link"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Browse Directory
        </Link>

        <div className="flex items-center gap-2">
          <button
            id="share-report-btn"
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full bg-white/60 hover:bg-white text-slate-700 border border-white/50 backdrop-blur-xs transition-colors shadow-2xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            {copySuccess ? 'Link Copied!' : 'Share'}
          </button>

          {/* Quick status selector */}
          <select
            id="report-status-updater"
            value={report.status}
            onChange={(e) => updateReportStatus(report.id, e.target.value as ReportStatus)}
            className="text-xs px-3 py-1.5 font-medium rounded-full border border-white/50 bg-white/70 text-slate-700 backdrop-blur-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
            title="Update Status"
          >
            <option value="active">Active</option>
            <option value="possible_match">Possible Match</option>
            <option value="contacted">Contacted</option>
            <option value="returned">Returned</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Main Report Card with Frosted Glass styling */}
      <div className="bg-white/50 backdrop-blur-lg border border-white/40 rounded-3xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Image / Visual display */}
          <div className="relative bg-slate-200/50 min-h-[300px] sm:min-h-[400px] flex items-center justify-center overflow-hidden">
            {report.imageUrl ? (
              <img
                src={report.imageUrl}
                alt={report.title}
                className="w-full h-full object-cover max-h-[450px]"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="text-center p-8 text-slate-400">
                <Tag className="w-16 h-16 mx-auto mb-2 opacity-40 text-indigo-400" />
                <p className="text-sm font-medium text-slate-600">No photo provided for this report</p>
                <p className="text-xs text-slate-400 mt-1">{report.category}</p>
              </div>
            )}

            {/* Badges on Image */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span
                className={`px-3 py-0.5 text-[10px] uppercase font-bold tracking-widest rounded-full shadow-2xs text-white ${
                  isLost ? 'bg-orange-600' : 'bg-emerald-600'
                }`}
              >
                {report.type} Item
              </span>
              <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-white/85 text-slate-700 backdrop-blur-xs border border-white/60 shadow-2xs">
                {report.category}
              </span>
            </div>
          </div>

          {/* Right: Info & Actions */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="font-mono text-slate-500 font-semibold">{report.id}</span>
                <span>Logged {new Date(report.createdAt).toLocaleDateString()}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-950 tracking-tight leading-snug">
                {report.title}
              </h1>

              {/* Status pill */}
              <div className="mt-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border shadow-2xs backdrop-blur-xs ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                  {report.status === 'returned' && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                  {report.status === 'possible_match' && <Sparkles className="w-3.5 h-3.5 text-amber-600" />}
                  Status: {statusConfig.label}
                </span>
              </div>

              {/* Description */}
              <div className="mt-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Description</h3>
                <p className="text-sm text-slate-700 leading-relaxed bg-white/60 backdrop-blur-xs p-3.5 rounded-2xl border border-white/60">
                  {report.description}
                </p>
              </div>

              {/* Metadata Grid */}
              <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-white/60 backdrop-blur-xs rounded-2xl border border-white/50 shadow-2xs">
                  <span className="text-slate-400 block font-medium">Campus Location</span>
                  <div className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="truncate">{report.location}</span>
                  </div>
                </div>

                <div className="p-3.5 bg-white/60 backdrop-blur-xs rounded-2xl border border-white/50 shadow-2xs">
                  <span className="text-slate-400 block font-medium">Date & Time</span>
                  <div className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>{report.date} {report.time && `at ${report.time}`}</span>
                  </div>
                </div>

                <div className="p-3.5 bg-white/60 backdrop-blur-xs rounded-2xl border border-white/50 shadow-2xs">
                  <span className="text-slate-400 block font-medium">Color & Brand</span>
                  <div className="font-semibold text-slate-800 mt-0.5">
                    {report.color || 'Not specified'} {report.brand ? `• ${report.brand}` : ''}
                  </div>
                </div>

                <div className="p-3.5 bg-white/60 backdrop-blur-xs rounded-2xl border border-white/50 shadow-2xs">
                  <span className="text-slate-400 block font-medium">Reported By</span>
                  <div className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{report.reporterName}</span>
                  </div>
                </div>
              </div>

              {/* Safety notice */}
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-600 bg-white/60 backdrop-blur-xs p-3 rounded-2xl border border-white/50 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Student privacy protected: Use the secure in-app messaging below to coordinate.</span>
              </div>
            </div>

            {/* Core Action Buttons */}
            <div className="pt-4 border-t border-white/50 flex flex-col sm:flex-row gap-2.5">
              <button
                id="contact-reporter-btn"
                type="button"
                onClick={() => setIsContactOpen(true)}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm shadow-indigo-300/40 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                Contact Reporter
              </button>

              <button
                id="report-possible-match-btn"
                type="button"
                onClick={() => {
                  setSelectedCandidate(undefined);
                  setIsMatchOpen(true);
                }}
                className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-orange-100/90 hover:bg-orange-200 text-orange-950 border border-orange-200/80 font-semibold text-sm transition-all shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-orange-600" />
                Report Match
              </button>

              <button
                id="mark-returned-btn"
                type="button"
                onClick={handleMarkReturned}
                className={`py-3 px-4 rounded-2xl font-semibold text-sm transition-all border ${
                  report.status === 'returned'
                    ? 'bg-white/80 text-slate-800 border-white/80'
                    : 'bg-white/60 hover:bg-white/90 text-slate-700 border-white/50 shadow-2xs'
                }`}
              >
                {report.status === 'returned' ? 'Reopen Report' : 'Mark Returned'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Matches Section (Deterministic Algorithm >= 50%) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-indigo-950">
                Potential AI Matches ({matches.length})
              </h2>
              <p className="text-xs text-slate-500">
                Automated similarity detection for opposite reports (Category: +40, Location: +25, Keywords: +25, Date: +10)
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/70 text-indigo-700 border border-white/60 backdrop-blur-xs shadow-2xs">
            Threshold: ≥ 50%
          </span>
        </div>

        {matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                currentReportId={report.id}
                onSelectCandidate={(cand) => {
                  setSelectedCandidate(cand);
                  setIsMatchOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white/50 backdrop-blur-lg rounded-3xl border border-white/40 p-6 text-center space-y-2 shadow-sm">
            <div className="w-10 h-10 mx-auto rounded-full bg-white/80 text-slate-400 flex items-center justify-center border border-white/50">
              <Sparkles className="w-5 h-5 opacity-60 text-indigo-500" />
            </div>
            <h4 className="text-sm font-bold text-indigo-950">No High-Confidence Matches Yet</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No opposite {isLost ? 'found' : 'lost'} listings currently meet the 50% match criteria. The system continually evaluates incoming reports against this listing.
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <ContactModal
        report={report}
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      <ReportMatchModal
        currentReport={report}
        candidateReport={selectedCandidate}
        isOpen={isMatchOpen}
        onClose={() => setIsMatchOpen(false)}
      />
    </div>
  );
};
