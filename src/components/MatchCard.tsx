import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Match, Report } from '../types';

interface MatchCardProps {
  match: Match;
  currentReportId: string;
  onSelectCandidate?: (candidate: Report) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, currentReportId, onSelectCandidate }) => {
  const candidate = match.matchedReport;
  if (!candidate) return null;

  const getScoreColor = (score: number) => {
    if (score >= 75) return { bg: 'bg-emerald-600', text: 'text-emerald-700', lightBg: 'bg-emerald-50', border: 'border-emerald-200' };
    if (score >= 60) return { bg: 'bg-blue-600', text: 'text-blue-700', lightBg: 'bg-blue-50', border: 'border-blue-200' };
    return { bg: 'bg-amber-600', text: 'text-amber-700', lightBg: 'bg-amber-50', border: 'border-amber-200' };
  };

  const colors = getScoreColor(match.score);

  return (
    <div 
      id={`match-card-${match.id}`}
      className="bg-white/50 backdrop-blur-md rounded-3xl border border-white/50 p-4 sm:p-5 shadow-sm hover:bg-white/65 hover:border-white/80 transition-all relative overflow-hidden"
    >
      {/* Top Banner with Score */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-2xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-3 py-0.5 text-xs font-bold rounded-full ${colors.lightBg} ${colors.text} border ${colors.border}`}>
                {match.score}% Match Confidence
              </span>
              <span className={`text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full ${candidate.type === 'lost' ? 'bg-orange-100 text-orange-950 border border-orange-200/60' : 'bg-emerald-100 text-emerald-950 border border-emerald-200/60'}`}>
                {candidate.type}
              </span>
            </div>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-400">ID: {candidate.id}</span>
      </div>

      {/* Item summary */}
      <div className="flex gap-4 items-start">
        {candidate.imageUrl && (
          <img
            src={candidate.imageUrl}
            alt={candidate.title}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-white/60 shrink-0 shadow-2xs"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-bold text-indigo-950 truncate">
            {candidate.title}
          </h4>
          <p className="text-xs text-slate-600 line-clamp-2 mt-1">
            {candidate.description}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate">{candidate.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{candidate.date}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Algorithm reason breakdown */}
      <div className="mt-3.5 pt-3 border-t border-white/40">
        <div className="text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
          <span>AI Match Criteria:</span>
        </div>
        <p className="text-xs text-slate-700 bg-white/60 p-2.5 rounded-2xl border border-white/60 leading-relaxed font-mono text-[11px]">
          {match.reason}
        </p>
      </div>

      {/* Action links */}
      <div className="mt-3 pt-2 flex items-center justify-between">
        <span className="text-xs text-slate-400">Reported by {candidate.reporterName}</span>
        <div className="flex items-center gap-2">
          {onSelectCandidate && (
            <button
              type="button"
              onClick={() => onSelectCandidate(candidate)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-2xl bg-white/70 hover:bg-white text-slate-700 border border-white/60 transition-colors shadow-2xs"
            >
              Verify Match
            </button>
          )}
          <Link
            to={`/item/${candidate.id}`}
            id={`inspect-match-btn-${candidate.id}`}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-300/40 transition-colors"
          >
            Inspect Report
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
