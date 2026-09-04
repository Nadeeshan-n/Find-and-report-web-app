import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  PlusCircle, 
  ArrowRight, 
  Package, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Laptop, 
  CreditCard, 
  Wallet, 
  Key, 
  Briefcase, 
  BookOpen, 
  Shirt, 
  HelpCircle,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { useReports } from '../context/ReportContext';
import { CATEGORIES } from '../mockData';
import { ItemCard } from '../components/ItemCard';
import { ItemCategory } from '../types';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { reports, stats } = useReports();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentFilter, setRecentFilter] = useState<'all' | 'lost' | 'found'>('all');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/browse');
    }
  };

  const getCategoryIcon = (id: ItemCategory) => {
    switch (id) {
      case 'Electronics': return <Laptop className="w-6 h-6 text-blue-600" />;
      case 'ID Cards': return <CreditCard className="w-6 h-6 text-emerald-600" />;
      case 'Wallets': return <Wallet className="w-6 h-6 text-amber-600" />;
      case 'Keys': return <Key className="w-6 h-6 text-yellow-600" />;
      case 'Bags': return <Briefcase className="w-6 h-6 text-indigo-600" />;
      case 'Books': return <BookOpen className="w-6 h-6 text-cyan-600" />;
      case 'Clothing': return <Shirt className="w-6 h-6 text-purple-600" />;
      default: return <Package className="w-6 h-6 text-stone-600" />;
    }
  };

  const recentReports = reports
    .filter(r => recentFilter === 'all' ? true : r.type === recentFilter)
    .slice(0, 6);

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section with Frosted Glass Panel */}
      <section className="relative pt-6 sm:pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 sm:p-10 lg:p-12 bg-white/50 backdrop-blur-lg border border-white/40 rounded-3xl shadow-sm relative overflow-hidden">
            {/* Ambient light glow inside hero */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none -z-0" />

            <div className="max-w-3xl mx-auto text-center relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/70 backdrop-blur-md text-indigo-900 text-xs font-semibold mb-6 border border-white/60 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Official University Lost & Found Registry</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-indigo-950 tracking-tight leading-tight">
                Lost it? Found it. <br />
                <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">CampusFind.</span>
              </h1>

              <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                The unified lost and found system for state university students and staff. Report missing belongings, browse turned-in items, and use smart AI matching to recover essentials quickly.
              </p>

              {/* Frosted Search Bar */}
              <form 
                onSubmit={handleSearchSubmit}
                className="mt-8 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-2 bg-white/60 backdrop-blur-md p-2 rounded-2xl border border-white/50 shadow-sm"
              >
                <div className="relative flex-1 w-full flex items-center">
                  <Search className="w-5 h-5 text-slate-400 absolute left-3.5" />
                  <input
                    id="hero-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by keywords, item brand, library, hall..."
                    className="w-full pl-11 pr-4 py-3 text-sm text-slate-800 bg-transparent rounded-xl focus:outline-none placeholder:text-slate-400"
                  />
                </div>
                <button
                  id="hero-search-btn"
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shrink-0 shadow-sm shadow-indigo-300/40"
                >
                  Search
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Quick Action buttons */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/report?type=lost"
                  id="hero-report-lost-cta"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-orange-700 bg-orange-100/90 hover:bg-orange-200/90 border border-orange-200/80 shadow-xs transition-colors"
                >
                  <PlusCircle className="w-4 h-4 text-orange-600" />
                  Report Lost Item
                </Link>
                <Link
                  to="/report?type=found"
                  id="hero-report-found-cta"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-300/40 transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  Report Found Item
                </Link>
                <Link
                  to="/browse"
                  id="hero-browse-all-cta"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-slate-700 bg-white/60 hover:bg-white/80 border border-white/50 backdrop-blur-xs transition-colors shadow-2xs"
                >
                  Browse All ({stats.total})
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Frosted Stat Tiles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div id="stat-reported" className="p-5 bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Items Reported</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-100/80 text-indigo-700 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-bold text-indigo-950">{stats.total}</div>
            <p className="mt-1 text-xs text-slate-500">Cumulative logged records</p>
          </div>

          <div id="stat-found" className="p-5 bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Items Found</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100/80 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-bold text-emerald-600">{stats.found}</div>
            <p className="mt-1 text-xs text-slate-500">Turned in & cataloged</p>
          </div>

          <div id="stat-returned" className="p-5 bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Returned to Owner</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-100/80 text-indigo-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-bold text-indigo-900">{stats.returned}</div>
            <p className="mt-1 text-xs text-slate-500">Successfully reunited</p>
          </div>

          <div id="stat-active" className="p-5 bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Search</span>
              <div className="w-8 h-8 rounded-lg bg-orange-100/80 text-orange-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-bold text-orange-600">{stats.active}</div>
            <p className="mt-1 text-xs text-slate-500">Currently awaiting match</p>
          </div>
        </div>
      </section>

      {/* 8 Category Cards with Frosted Glass look */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-indigo-950">Explore by Category</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Quickly narrow down lost and found reports by item category</p>
          </div>
          <Link
            to="/browse"
            className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => {
            const count = reports.filter(r => r.category === cat.id).length;
            return (
              <button
                key={cat.id}
                id={`cat-card-${cat.id.toLowerCase().replace(/\s+/g, '-')}`}
                type="button"
                onClick={() => navigate(`/browse?category=${encodeURIComponent(cat.id)}`)}
                className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/50 hover:bg-white/80 hover:border-white/80 hover:shadow-md transition-all duration-150 flex flex-col items-center text-center group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-white/70 group-hover:bg-indigo-50 flex items-center justify-center mb-2.5 transition-colors border border-white/40">
                  {getCategoryIcon(cat.id)}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors line-clamp-1">
                  {cat.label}
                </span>
                <span className="text-[11px] text-slate-400 mt-1 font-medium">
                  {count} {count === 1 ? 'item' : 'items'}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Recent Items Grid & Filter Pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-indigo-950">Recent Campus Reports</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Recently reported lost belongings and items turned in to campus desks</p>
          </div>

          {/* Frosted Toggle filter pills */}
          <div className="flex items-center gap-1.5 p-1 bg-white/50 backdrop-blur-md rounded-2xl border border-white/40 self-start sm:self-auto shadow-2xs">
            <button
              id="recent-filter-all"
              type="button"
              onClick={() => setRecentFilter('all')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                recentFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-indigo-900'
              }`}
            >
              All Items ({reports.length})
            </button>
            <button
              id="recent-filter-lost"
              type="button"
              onClick={() => setRecentFilter('lost')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                recentFilter === 'lost'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-orange-700'
              }`}
            >
              Lost ({stats.lost})
            </button>
            <button
              id="recent-filter-found"
              type="button"
              onClick={() => setRecentFilter('found')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                recentFilter === 'found'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              Found ({stats.found})
            </button>
          </div>
        </div>

        {recentReports.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentReports.map((report) => (
              <ItemCard key={report.id} report={report} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white/50 backdrop-blur-md rounded-3xl border border-white/50">
            <p className="text-slate-500 text-sm">No recent items match the selected filter.</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/browse"
            id="home-view-all-bottom-btn"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/70 hover:bg-white text-indigo-950 text-sm font-semibold transition-all border border-white/60 shadow-xs hover:shadow-md"
          >
            Explore Complete Directory
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Smart AI Matching & How CampusFind Works with Frosted Glass styling */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Smart AI Matching Banner (matching theme's indigo-900 highlight card) */}
          <div className="lg:col-span-4 p-8 bg-indigo-900 text-white rounded-3xl flex flex-col justify-between gap-4 relative overflow-hidden shadow-lg shadow-indigo-950/20">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 right-10 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl pointer-events-none" />

            <div className="space-y-3 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-indigo-200 text-xs font-semibold backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5" />
                Algorithmic Matching
              </div>
              <h3 className="text-2xl font-bold tracking-tight">Smart AI Matching</h3>
              <p className="text-sm text-indigo-100/80 leading-relaxed">
                Our algorithm automatically scans new reports for potential matches across location, time, category, and descriptive keyword tokens.
              </p>
            </div>

            <div className="relative z-10 pt-2">
              <Link
                to="/browse"
                className="w-full inline-flex items-center justify-center py-2.5 px-4 bg-white text-indigo-900 hover:bg-indigo-50 rounded-xl font-bold text-sm transition-colors shadow-xs"
              >
                Scan Available Listings
              </Link>
            </div>
          </div>

          {/* How CampusFind Works Workflow */}
          <div className="lg:col-span-8 bg-white/50 backdrop-blur-lg border border-white/40 rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-sm flex flex-col justify-center">
            <div className="max-w-3xl">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-indigo-950">
                How CampusFind Reconnects You With Your Essentials
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                A safe, transparent, and campus-verified workflow for reclaiming lost items.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                <div className="space-y-2 p-4 bg-white/60 rounded-2xl border border-white/50 shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <h4 className="font-semibold text-sm text-slate-900">Report in 60 Seconds</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Log details such as campus location, brand, colors, or serial flags without exposing personal contact details.
                  </p>
                </div>

                <div className="space-y-2 p-4 bg-white/60 rounded-2xl border border-white/50 shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <h4 className="font-semibold text-sm text-slate-900">Smart Match Scoring</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Our algorithm automatically detects overlap across categories, buildings, keywords, and time windows.
                  </p>
                </div>

                <div className="space-y-2 p-4 bg-white/60 rounded-2xl border border-white/50 shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <h4 className="font-semibold text-sm text-slate-900">Safe Public Handoff</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Coordinate pickup securely via mock chat and pick up verified items at the Student Union or Library desk.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
