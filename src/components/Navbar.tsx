import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, 
  PlusCircle, 
  Menu, 
  X, 
  Sparkles, 
  Compass, 
  FileText, 
  Shield, 
  Layers
} from 'lucide-react';
import { useReports } from '../context/ReportContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { myReportIds } = useReports();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Browse Items', path: '/browse' },
    { name: 'My Reports', path: '/my-reports', badge: myReportIds.length },
    { name: 'Admin', path: '/admin' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/40 backdrop-blur-md border-b border-white/30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            id="brand-logo"
            className="flex items-center gap-2.5 group"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-indigo-200 group-hover:bg-indigo-700 transition-colors">
              C
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-indigo-950">Campus<span className="text-indigo-600">Find</span></span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-white/60 text-indigo-800 border border-white/60 shadow-2xs backdrop-blur-xs">
                Univ Lost & Found
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                id={`nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                  isActive(link.path)
                    ? 'text-indigo-900 font-semibold bg-white/60 shadow-xs border border-white/60'
                    : 'text-slate-600 hover:text-indigo-900 hover:bg-white/40'
                }`}
              >
                {link.name}
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-600 text-white">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Primary Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            <Link
              to="/report?type=lost"
              id="nav-report-lost-btn"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold text-orange-700 bg-orange-100/80 hover:bg-orange-200/80 border border-orange-200/60 shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-orange-600" />
              Report Lost
            </Link>
            <Link
              to="/report?type=found"
              id="nav-report-found-btn"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-300/40 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Report Item
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              to="/report?type=lost"
              className="px-2.5 py-1 text-xs font-semibold text-orange-700 bg-orange-100/90 rounded-full border border-orange-200"
            >
              Lost
            </Link>
            <Link
              to="/report?type=found"
              className="px-2.5 py-1 text-xs font-semibold text-white bg-indigo-600 rounded-full"
            >
              Report
            </Link>
            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-indigo-950 hover:bg-white/50 focus:outline-none transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/30 bg-white/70 backdrop-blur-xl px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-base font-medium transition-colors ${
                isActive(link.path)
                  ? 'bg-white/80 text-indigo-900 font-semibold border border-white/60 shadow-xs'
                  : 'text-slate-700 hover:bg-white/40'
              }`}
            >
              <span>{link.name}</span>
              {link.badge !== undefined && link.badge > 0 && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-600 text-white">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
          <div className="pt-3 border-t border-white/40 grid grid-cols-2 gap-2">
            <Link
              to="/report?type=lost"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-full text-sm font-semibold text-orange-700 bg-orange-100/90 border border-orange-200 shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              Report Lost
            </Link>
            <Link
              to="/report?type=found"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-full text-sm font-semibold text-white bg-indigo-600 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Report Item
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
