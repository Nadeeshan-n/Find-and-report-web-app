import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, MapPin, PhoneCall, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white/40 backdrop-blur-xl border-t border-white/60 text-slate-600 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-indigo-950">Campus<span className="text-indigo-600">Find</span></span>
            </div>
            <p className="text-sm text-slate-500 max-w-md leading-relaxed">
              The official centralized lost-and-found hub connecting students, faculty, and campus staff. Reconnecting students with their essentials quickly and securely.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Privacy Guarded: Student contact details and phone numbers are never shown publicly.</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wider mb-3">Quick Navigation</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link to="/browse" className="hover:text-indigo-900 transition-colors">Browse All Items</Link>
              </li>
              <li>
                <Link to="/report?type=lost" className="hover:text-indigo-900 transition-colors">Report a Lost Item</Link>
              </li>
              <li>
                <Link to="/report?type=found" className="hover:text-indigo-900 transition-colors">Report a Found Item</Link>
              </li>
              <li>
                <Link to="/my-reports" className="hover:text-indigo-900 transition-colors">My Session Reports</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-indigo-900 transition-colors">Campus Staff Console</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Campus Safety Dispatch */}
          <div>
            <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wider mb-3">Campus Dispatch</h3>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>Central Lost Property Office: Student Union Rm 102</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Dispatch: (555) 019-2834</span>
              </div>
              <div className="pt-2 text-[11px] text-slate-400">
                Hours: Mon–Fri, 8:00 AM – 7:00 PM
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/50 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© 2026 CampusFind. University Lost & Found MVP. All data stored in local in-memory session.</p>
          <div className="flex items-center gap-1">
            <span>Built for campus safety & integrity</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
