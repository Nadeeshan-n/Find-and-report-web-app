import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RotateCcw, SlidersHorizontal, MapPin, Tag } from 'lucide-react';
import { useReports } from '../context/ReportContext';
import { LOCATIONS, CATEGORIES } from '../mockData';
import { ItemCard } from '../components/ItemCard';
import { ItemCategory, ItemType, ReportStatus } from '../types';
import { normalizeItemTypeFilter } from '../utils/reportType';

export const Browse: React.FC = () => {
  const { reports } = useReports();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL param defaults
  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';
  const typeParam = normalizeItemTypeFilter(searchParams.get('type'), 'all');

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedType, setSelectedType] = useState<ItemType | 'all'>(typeParam);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Sync state if URL search params change
  useEffect(() => {
    if (queryParam) setSearchQuery(queryParam);
    if (categoryParam) setSelectedCategory(categoryParam);
    setSelectedType(normalizeItemTypeFilter(searchParams.get('type'), 'all'));
  }, [queryParam, categoryParam, searchParams]);

  const filteredReports = useMemo(() => {
    return reports
      .filter((report) => {
        // Search query filter (title, description, location, brand, color, id)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = report.title.toLowerCase().includes(q);
          const matchDesc = report.description.toLowerCase().includes(q);
          const matchLoc = report.location.toLowerCase().includes(q);
          const matchBrand = report.brand?.toLowerCase().includes(q) || false;
          const matchColor = report.color?.toLowerCase().includes(q) || false;
          const matchId = report.id.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchLoc && !matchBrand && !matchColor && !matchId) {
            return false;
          }
        }

        // Type filter
        if (selectedType !== 'all' && report.type !== selectedType) {
          return false;
        }

        // Category filter
        if (selectedCategory && selectedCategory !== 'all' && report.category !== selectedCategory) {
          return false;
        }

        // Location filter
        if (selectedLocation && selectedLocation !== 'all' && report.location !== selectedLocation) {
          return false;
        }

        // Status filter
        if (selectedStatus && selectedStatus !== 'all' && report.status !== selectedStatus) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.date).getTime();
        const timeB = new Date(b.date).getTime();
        return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
      });
  }, [reports, searchQuery, selectedType, selectedCategory, selectedLocation, selectedStatus, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedCategory('all');
    setSelectedLocation('all');
    setSelectedStatus('all');
    setSortBy('newest');
    setSearchParams({});
  };

  const isFiltered = 
    searchQuery.trim() !== '' || 
    selectedType !== 'all' || 
    (selectedCategory && selectedCategory !== 'all') || 
    selectedLocation !== 'all' || 
    selectedStatus !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-950 tracking-tight">
          Browse Lost & Found Directory
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Search all active lost and found items across university buildings, desks, and lawns.
        </p>
      </div>

      {/* Search & Filter Controls Card (Frosted Glass) */}
      <div className="bg-white/50 backdrop-blur-lg border border-white/40 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        {/* Search row */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="browse-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, keywords, location, brand, color, or ID..."
              className="w-full pl-10 pr-4 py-3 text-sm rounded-2xl bg-white/70 backdrop-blur-md border border-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder-slate-400 shadow-2xs"
            />
          </div>

          {/* Type Toggle */}
          <div className="flex items-center gap-1 p-1 bg-white/60 backdrop-blur-md rounded-2xl border border-white/50 self-stretch sm:self-auto shrink-0 shadow-2xs">
            <button
              id="type-filter-all"
              type="button"
              onClick={() => setSelectedType('all')}
              className={`flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                selectedType === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-indigo-950'
              }`}
            >
              All Items
            </button>
            <button
              id="type-filter-lost"
              type="button"
              onClick={() => setSelectedType('lost')}
              className={`flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                selectedType === 'lost'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-orange-700'
              }`}
            >
              Lost
            </button>
            <button
              id="type-filter-found"
              type="button"
              onClick={() => setSelectedType('found')}
              className={`flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                selectedType === 'found'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              Found
            </button>
          </div>
        </div>

        {/* Dropdown Filters row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-white/40">
          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Category</label>
            <select
              id="category-filter-select"
              value={selectedCategory || 'all'}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-white/70 backdrop-blur-md border border-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Location Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Campus Location</label>
            <select
              id="location-filter-select"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-white/70 backdrop-blur-md border border-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            >
              <option value="all">All Locations</option>
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
            <select
              id="status-filter-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-white/70 backdrop-blur-md border border-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="possible_match">Possible Match</option>
              <option value="contacted">Contacted</option>
              <option value="returned">Returned / Reunited</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Sort By</label>
            <select
              id="sort-filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              className="w-full px-3 py-2 text-xs rounded-xl bg-white/70 backdrop-blur-md border border-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Meta Bar: Results count + Reset button */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="text-slate-800">{filteredReports.length}</strong> of {reports.length} items
          </span>
          {isFiltered && (
            <span className="text-indigo-600 font-semibold">(Filtered)</span>
          )}
        </div>

        {isFiltered && (
          <button
            id="reset-filters-btn"
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-indigo-900 font-medium px-2.5 py-1 rounded-full bg-white/60 hover:bg-white border border-white/50 transition-colors shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset all filters
          </button>
        )}
      </div>

      {/* Items Grid */}
      {filteredReports.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <ItemCard key={report.id} report={report} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white/50 backdrop-blur-lg rounded-3xl border border-white/50 p-8 space-y-4 shadow-sm">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-white/80 text-slate-400 flex items-center justify-center border border-white/60 shadow-2xs">
            <Search className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-indigo-950">No matching items found</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1">
              Try adjusting your search keywords, clearing location filters, or switching between lost and found categories.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-5 py-2 text-xs font-semibold rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
