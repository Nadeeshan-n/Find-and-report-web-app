import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Search, 
  Trash2, 
  RotateCcw, 
  ExternalLink, 
  Filter, 
  CheckCircle2, 
  AlertTriangle,
  ArrowUpDown
} from 'lucide-react';
import { useReports } from '../context/ReportContext';
import { ReportStatus, ItemType } from '../types';

export const Admin: React.FC = () => {
  const { reports, updateReportStatus, deleteReport, resetToDefault, stats } = useReports();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<ItemType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return reports.filter(r => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const match = 
          r.title.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.reporterName.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (filterType !== 'all' && r.type !== filterType) return false;
      if (filterStatus !== 'all' && r.status !== filterStatus) return false;
      return true;
    });
  }, [reports, search, filterType, filterStatus]);

  const handleStatusChange = (id: string, newStatus: ReportStatus) => {
    updateReportStatus(id, newStatus);
    showNotice(`Updated report ${id} status to "${newStatus}"`);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to permanently delete record ${id} ("${title}")?`)) {
      deleteReport(id);
      showNotice(`Record ${id} removed`);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all campus reports and messages back to original 10 sample reports?')) {
      resetToDefault();
      showNotice('Database reset to original 10 sample reports');
    }
  };

  const showNotice = (text: string) => {
    setActionNotice(text);
    setTimeout(() => setActionNotice(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 border border-white/60 text-indigo-950 text-xs font-semibold mb-1 shadow-2xs">
            <Shield className="w-3.5 h-3.5 text-indigo-600" />
            Campus Safety & Staff Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-950 tracking-tight">
            Centralized Records Management
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Admin console for campus lost property desks to review, reassign status, or archive records.
          </p>
        </div>

        <button
          id="admin-reset-data-btn"
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-2xl bg-white/70 hover:bg-white text-slate-700 border border-white/60 shadow-2xs transition-all self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset to Seed Sample Reports
        </button>
      </div>

      {/* Action toast */}
      {actionNotice && (
        <div className="p-3.5 bg-indigo-50/80 backdrop-blur-md border border-indigo-200/80 text-indigo-900 text-xs font-semibold rounded-2xl flex items-center justify-between animate-in fade-in duration-150 shadow-sm">
          <span>{actionNotice}</span>
          <button onClick={() => setActionNotice(null)} className="text-indigo-500 hover:text-indigo-700">✕</button>
        </div>
      )}

      {/* Stats Quick Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-sm">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Reports</span>
          <div className="text-2xl font-extrabold text-indigo-950 mt-1">{stats.total}</div>
        </div>
        <div className="bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-sm">
          <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider">Lost</span>
          <div className="text-2xl font-extrabold text-orange-700 mt-1">{stats.lost}</div>
        </div>
        <div className="bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-sm">
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Found</span>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">{stats.found}</div>
        </div>
        <div className="bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-sm">
          <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Returned</span>
          <div className="text-2xl font-extrabold text-indigo-700 mt-1">{stats.returned}</div>
        </div>
        <div className="bg-white/50 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-sm">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Active</span>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">{stats.active}</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/50 backdrop-blur-md rounded-2xl border border-white/50 p-4 flex flex-col sm:flex-row items-center gap-3 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="admin-search-input"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search records by ID, title, location, or reporter..."
            className="w-full pl-10 pr-3 py-2 text-xs rounded-2xl border border-white/60 bg-white/70 backdrop-blur-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as ItemType | 'all')}
            className="flex-1 sm:flex-none px-3.5 py-2 text-xs rounded-2xl border border-white/60 bg-white/70 backdrop-blur-xs text-slate-800"
          >
            <option value="all">All Types</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="flex-1 sm:flex-none px-3.5 py-2 text-xs rounded-2xl border border-white/60 bg-white/70 backdrop-blur-xs text-slate-800"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="possible_match">Possible Match</option>
            <option value="contacted">Contacted</option>
            <option value="returned">Returned</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/50 backdrop-blur-md rounded-3xl border border-white/50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/60 border-b border-white/50 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3.5">ID / Type</th>
                <th className="px-4 py-3.5">Title & Category</th>
                <th className="px-4 py-3.5">Campus Location</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5">Reporter</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {filtered.map((report) => (
                <tr key={report.id} className="hover:bg-white/40 transition-colors">
                  {/* ID / Type */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-mono font-bold text-slate-800">{report.id}</div>
                    <span
                      className={`inline-block mt-0.5 text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                        report.type === 'lost' ? 'bg-orange-100 text-orange-950 border border-orange-200/60' : 'bg-emerald-100 text-emerald-950 border border-emerald-200/60'
                      }`}
                    >
                      {report.type}
                    </span>
                  </td>

                  {/* Title & Category */}
                  <td className="px-4 py-3">
                    <div className="font-semibold text-indigo-950 line-clamp-1 max-w-xs">{report.title}</div>
                    <div className="text-slate-400 text-[11px]">{report.category}</div>
                  </td>

                  {/* Campus Location */}
                  <td className="px-4 py-3 text-slate-600 max-w-xs truncate">
                    {report.location}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                    {report.date}
                  </td>

                  {/* Reporter */}
                  <td className="px-4 py-3 text-slate-700 whitespace-nowrap font-medium">
                    {report.reporterName}
                  </td>

                  {/* Status Dropdown */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <select
                      value={report.status}
                      onChange={(e) => handleStatusChange(report.id, e.target.value as ReportStatus)}
                      className="px-2.5 py-1 text-xs rounded-xl border border-white/60 bg-white/80 font-medium text-slate-700 focus:ring-1 focus:ring-indigo-500 shadow-2xs"
                    >
                      <option value="active">Active</option>
                      <option value="possible_match">Possible Match</option>
                      <option value="contacted">Contacted</option>
                      <option value="returned">Returned</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/item/${report.id}`}
                        title="View report"
                        className="p-1.5 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-white/60 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(report.id, report.title)}
                        title="Delete report"
                        className="p-1.5 rounded-xl text-slate-400 hover:text-orange-600 hover:bg-orange-50/60 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    No records found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
