import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  PlusCircle, 
  CheckCircle, 
  MapPin, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Trash2, 
  Sparkles,
  ExternalLink,
  Tag
} from 'lucide-react';
import { useReports } from '../context/ReportContext';
import { Report, ReportStatus, ItemType } from '../types';

export const MyReports: React.FC = () => {
  const { reports, myReportIds, updateReportStatus, deleteReport } = useReports();
  const [activeTab, setActiveTab] = useState<'all' | 'lost' | 'found' | 'active' | 'resolved'>('all');

  // Filter reports that belong to user's current session
  const userReports = useMemo(() => {
    return reports.filter(r => myReportIds.includes(r.id));
  }, [reports, myReportIds]);

  const filteredUserReports = useMemo(() => {
    return userReports.filter((report) => {
      if (activeTab === 'all') return true;
      if (activeTab === 'lost') return report.type === 'lost';
      if (activeTab === 'found') return report.type === 'found';
      if (activeTab === 'active') return report.status === 'active' || report.status === 'possible_match' || report.status === 'contacted';
      if (activeTab === 'resolved') return report.status === 'returned' || report.status === 'closed';
      return true;
    });
  }, [userReports, activeTab]);

  const counts = useMemo(() => {
    return {
      all: userReports.length,
      lost: userReports.filter(r => r.type === 'lost').length,
      found: userReports.filter(r => r.type === 'found').length,
      active: userReports.filter(r => r.status === 'active' || r.status === 'possible_match' || r.status === 'contacted').length,
      resolved: userReports.filter(r => r.status === 'returned' || r.status === 'closed').length
    };
  }, [userReports]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-950 tracking-tight">
            My Session Reports
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage reports logged during your current session, track possible matches, and update return status.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/report?type=lost"
            id="my-reports-new-lost-btn"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-2xl text-orange-950 bg-orange-100/90 border border-orange-200/80 hover:bg-orange-200/80 transition-all shadow-2xs"
          >
            <PlusCircle className="w-3.5 h-3.5 text-orange-600" />
            Report Lost
          </Link>
          <Link
            to="/report?type=found"
            id="my-reports-new-found-btn"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-2xl text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-300/40"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Report Found
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1.5 bg-white/50 backdrop-blur-md rounded-2xl border border-white/50 overflow-x-auto shadow-2xs">
        <button
          id="tab-all"
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'all'
              ? 'bg-white text-indigo-950 shadow-xs'
              : 'text-slate-600 hover:text-indigo-950'
          }`}
        >
          All Reports ({counts.all})
        </button>
        <button
          id="tab-lost"
          type="button"
          onClick={() => setActiveTab('lost')}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'lost'
              ? 'bg-white text-orange-700 shadow-xs'
              : 'text-slate-600 hover:text-orange-700'
          }`}
        >
          Lost Items ({counts.lost})
        </button>
        <button
          id="tab-found"
          type="button"
          onClick={() => setActiveTab('found')}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'found'
              ? 'bg-white text-emerald-700 shadow-xs'
              : 'text-slate-600 hover:text-emerald-700'
          }`}
        >
          Found Items ({counts.found})
        </button>
        <button
          id="tab-active"
          type="button"
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'active'
              ? 'bg-white text-amber-700 shadow-xs'
              : 'text-slate-600 hover:text-amber-700'
          }`}
        >
          Active ({counts.active})
        </button>
        <button
          id="tab-resolved"
          type="button"
          onClick={() => setActiveTab('resolved')}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'resolved'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-indigo-700'
          }`}
        >
          Resolved / Returned ({counts.resolved})
        </button>
      </div>

      {/* Reports List */}
      {filteredUserReports.length > 0 ? (
        <div className="space-y-3.5">
          {filteredUserReports.map((report) => {
            const isLost = report.type === 'lost';
            return (
              <div
                key={report.id}
                id={`my-report-row-${report.id}`}
                className="bg-white/50 backdrop-blur-md rounded-3xl border border-white/50 p-4 sm:p-5 shadow-sm hover:bg-white/65 hover:border-white/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left side: thumbnail + info */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {report.imageUrl ? (
                    <img
                      src={report.imageUrl}
                      alt={report.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-white/60 shrink-0 shadow-2xs"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/60 border border-white/50 flex items-center justify-center text-slate-400 shrink-0">
                      <Tag className="w-6 h-6 opacity-40" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full ${
                          isLost ? 'bg-orange-100 text-orange-950 border border-orange-200/60' : 'bg-emerald-100 text-emerald-950 border border-emerald-200/60'
                        }`}
                      >
                        {report.type}
                      </span>
                      <span className="text-xs font-mono text-slate-400">{report.id}</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/70 border border-white/50 text-slate-600 font-medium">
                        {report.category}
                      </span>
                      {report.status === 'returned' && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 font-semibold border border-emerald-200/60">
                          Returned
                        </span>
                      )}
                      {report.status === 'possible_match' && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100/80 text-amber-800 font-semibold border border-amber-200/60 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Possible Match
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-indigo-950 truncate">
                      {report.title}
                    </h3>

                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{report.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{report.date}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side: quick status & actions */}
                <div className="flex flex-wrap items-center gap-2 self-end md:self-center shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/40 w-full md:w-auto justify-end">
                  <select
                    value={report.status}
                    onChange={(e) => updateReportStatus(report.id, e.target.value as ReportStatus)}
                    className="text-xs font-medium px-3 py-2 rounded-2xl border border-white/60 bg-white/70 backdrop-blur-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                  >
                    <option value="active">Status: Active</option>
                    <option value="possible_match">Status: Match Found</option>
                    <option value="contacted">Status: Contacted</option>
                    <option value="returned">Status: Returned</option>
                    <option value="closed">Status: Closed</option>
                  </select>

                  <Link
                    to={`/item/${report.id}`}
                    id={`my-report-view-btn-${report.id}`}
                    className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold rounded-2xl bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 transition-colors border border-indigo-100/60"
                  >
                    View
                    <ArrowRight className="w-3 h-3" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Withdraw report ${report.id} (${report.title})?`)) {
                        deleteReport(report.id);
                      }
                    }}
                    title="Delete report"
                    className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50/60 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white/40 backdrop-blur-md rounded-3xl border border-dashed border-white/60 p-8 space-y-4 shadow-sm">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-white/70 text-slate-400 flex items-center justify-center border border-white/60">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-indigo-950">No reports in this tab</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1">
              You don't have any items registered under <strong>{activeTab}</strong>. Reports submitted during this session will show here.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              to="/report?type=lost"
              className="px-4 py-2.5 text-xs font-bold rounded-2xl bg-orange-600 text-white hover:bg-orange-700 shadow-sm shadow-orange-300/40 transition-colors"
            >
              Report Lost Item
            </Link>
            <Link
              to="/report?type=found"
              className="px-4 py-2.5 text-xs font-bold rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-300/40 transition-colors"
            >
              Report Found Item
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
