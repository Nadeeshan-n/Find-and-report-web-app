import React, { useState } from 'react';
import { X, Sparkles, CheckCircle, AlertTriangle } from 'lucide-react';
import { Report } from '../types';
import { useReports } from '../context/ReportContext';

interface ReportMatchModalProps {
  currentReport: Report;
  isOpen: boolean;
  onClose: () => void;
  candidateReport?: Report;
}

export const ReportMatchModal: React.FC<ReportMatchModalProps> = ({
  currentReport,
  isOpen,
  onClose,
  candidateReport
}) => {
  const { reports, updateReportStatus } = useReports();
  const [selectedId, setSelectedId] = useState<string>(candidateReport ? candidateReport.id : '');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  // Filter possible opposite items
  const oppositeReports = reports.filter(r => r.type !== currentReport.type && r.id !== currentReport.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) return;

    // Update both items to 'possible_match'
    updateReportStatus(currentReport.id, 'possible_match');
    updateReportStatus(selectedId, 'possible_match');
    setSubmitted(true);
  };

  const handleDone = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
      <div 
        id="report-match-modal"
        className="bg-white/80 backdrop-blur-xl w-full max-w-md rounded-3xl shadow-2xl border border-white/60 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="px-6 py-4 border-b border-white/40 bg-white/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-indigo-950 text-base">Report Possible Match</h3>
          </div>
          <button
            id="close-match-modal-btn"
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-indigo-950 hover:bg-white/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-indigo-950">Match Flagged Successfully</h4>
              <p className="text-sm text-slate-600 mt-1">
                Both reports have been updated to <strong>"Possible Match"</strong> status. The reporters can now compare item details and coordinate handoff.
              </p>
            </div>
            <button
              type="button"
              id="match-success-done-btn"
              onClick={handleDone}
              className="w-full py-3 px-4 rounded-2xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 shadow-sm shadow-indigo-300/40 transition-all"
            >
              Close & View Updated Status
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Found a listing that matches <strong>{currentReport.title}</strong>? Linking them flags both entries so both parties can coordinate return verification.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Select Opposite Report ({currentReport.type === 'lost' ? 'Found' : 'Lost'} items)
              </label>
              <select
                id="select-matching-report"
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-sm rounded-2xl bg-white/80 border border-white/70 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-800"
              >
                <option value="">-- Choose matching report --</option>
                {oppositeReports.map((r) => (
                  <option key={r.id} value={r.id}>
                    [{r.id}] {r.title} ({r.location})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Notes for Reporters (Optional)
              </label>
              <textarea
                id="match-notes-input"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="e.g., Description and location match closely..."
                className="w-full px-4 py-2.5 text-sm rounded-2xl bg-white/80 border border-white/70 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-800 placeholder-slate-400"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-950 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="submit-match-btn"
                disabled={!selectedId}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-2xl shadow-sm shadow-indigo-300/40 transition-all"
              >
                Confirm Possible Match
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
