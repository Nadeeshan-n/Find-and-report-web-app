import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, ArrowRight, Tag, CheckCircle, Sparkles } from 'lucide-react';
import { Report } from '../types';

interface ItemCardProps {
  report: Report;
}

export const ItemCard: React.FC<ItemCardProps> = ({ report }) => {
  const isLost = report.type === 'lost';

  const statusConfig = {
    active: { label: 'Active', bg: 'bg-emerald-50/90', text: 'text-emerald-700', border: 'border-emerald-200/60' },
    possible_match: { label: 'Possible Match', bg: 'bg-amber-50/90', text: 'text-amber-700', border: 'border-amber-200/60' },
    contacted: { label: 'Contacted', bg: 'bg-indigo-50/90', text: 'text-indigo-700', border: 'border-indigo-200/60' },
    returned: { label: 'Returned', bg: 'bg-white/80', text: 'text-slate-600', border: 'border-white/60' },
    closed: { label: 'Closed', bg: 'bg-white/80', text: 'text-slate-500', border: 'border-white/60' },
  }[report.status];

  return (
    <div 
      id={`item-card-${report.id}`}
      className="group bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 overflow-hidden shadow-xs hover:shadow-md hover:bg-white/80 transition-all duration-200 flex flex-col"
    >
      {/* Thumbnail area */}
      <div className="relative h-48 w-full bg-slate-200/50 overflow-hidden">
        {report.imageUrl ? (
          <img
            src={report.imageUrl}
            alt={report.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // fallback if remote image fails
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100/60 text-slate-400">
            <Tag className="w-8 h-8 mb-1 opacity-50 text-indigo-400" />
            <span className="text-xs font-medium">{report.category}</span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          <span
            className={`px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-widest rounded-full shadow-2xs border ${
              isLost
                ? 'text-orange-600 bg-orange-100/95 border-orange-200/60'
                : 'text-emerald-600 bg-emerald-100/95 border-emerald-200/60'
            }`}
          >
            {report.type}
          </span>
          <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-white/85 text-slate-700 border border-white/70 shadow-2xs backdrop-blur-xs">
            {report.category}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border shadow-2xs backdrop-blur-xs ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span className="font-mono text-slate-500 font-medium">{report.id}</span>
            <span>By {report.reporterName}</span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {report.title}
          </h3>

          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {report.description}
          </p>

          {/* Details list */}
          <div className="mt-4 pt-3 border-t border-white/50 space-y-1.5 text-xs text-slate-600">
            <div className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
              <span className="truncate">{report.location}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{report.date}</span>
              </div>
              {report.time && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{report.time}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-4 pt-3 border-t border-white/50 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {report.color && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/80 border border-white/60 text-slate-600 font-medium shadow-2xs">
                {report.color}
              </span>
            )}
            {report.brand && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/80 border border-white/60 text-slate-600 font-medium shadow-2xs">
                {report.brand}
              </span>
            )}
          </div>

          <Link
            to={`/item/${report.id}`}
            id={`view-item-btn-${report.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 group-hover:translate-x-0.5 transition-all"
          >
            Details
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
