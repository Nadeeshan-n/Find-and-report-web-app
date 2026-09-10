import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  PlusCircle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  MapPin, 
  Calendar, 
  Tag, 
  ShieldCheck, 
  AlertCircle,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { useReports } from '../context/ReportContext';
import { LOCATIONS, CATEGORIES, findMatchesForReport, MATCH_SCORE_THRESHOLD } from '../mockData';
import { ItemCategory, ItemType, Report, Match } from '../types';
import { MatchCard } from '../components/MatchCard';
import { isItemType, normalizeItemType } from '../utils/reportType';

export const ReportForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { reports, addReport } = useReports();

  const initialType = normalizeItemType(searchParams.get('type'), 'lost');

  const [itemType, setItemType] = useState<ItemType>(initialType);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Electronics');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<string>(LOCATIONS[0]);
  const [date, setDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState<string>('12:00');
  const [color, setColor] = useState('');
  const [brand, setBrand] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Submission success state
  const [createdReport, setCreatedReport] = useState<Report | null>(null);
  const [instantMatches, setInstantMatches] = useState<Match[]>([]);

  useEffect(() => {
    const typeFromUrl = normalizeItemType(searchParams.get('type'), 'lost');
    setItemType(typeFromUrl);
  }, [searchParams]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Title is required (e.g. "TI-84 Calculator")';
    if (!reporterName.trim()) newErrors.reporterName = 'Reporter name is required for campus verification';
    if (!description.trim()) newErrors.description = 'Please provide a detailed description';
    if (description.trim().length < 10) newErrors.description = 'Description must be at least 10 characters';
    if (!location) newErrors.location = 'Please select a campus location';
    if (!date) newErrors.date = 'Please specify the date';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const safeItemType: ItemType = isItemType(itemType) ? itemType : 'lost';

    setIsSubmitting(true);

    const newReport = addReport({
      type: safeItemType,
      title: title.trim(),
      category,
      description: description.trim(),
      location,
      date,
      time: time || undefined,
      color: color.trim() || undefined,
      brand: brand.trim() || undefined,
      reporterName: reporterName.trim(),
      imageUrl: imageUrl.trim() || undefined
    });

    // Run rule-based matching immediately on all current reports
    const matches = findMatchesForReport(newReport, reports).filter(m => m.score >= MATCH_SCORE_THRESHOLD);

    setCreatedReport(newReport);
    setInstantMatches(matches);
    setIsSubmitting(false);
  };

  const handleResetForm = () => {
    setCreatedReport(null);
    setInstantMatches([]);
    setTitle('');
    setDescription('');
    setColor('');
    setBrand('');
    setReporterName('');
    setImageUrl('');
    setErrors({});
  };

  // Sample quick image presets for students
  const samplePresets = [
    { label: 'Backpack', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80' },
    { label: 'Earbuds', url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80' },
    { label: 'Keys', url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=80' },
    { label: 'Bottle', url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80' },
    { label: 'Card/Wallet', url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80' }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Type switcher */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-indigo-950 tracking-tight">
          {itemType === 'lost' ? 'Report a Lost Item' : 'Report a Found Item'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {itemType === 'lost'
            ? 'Submit missing student property to trigger instant similarity matching with turned-in items.'
            : 'Catalog an item discovered on campus so its rightful owner can claim it safely.'}
        </p>
      </div>

      {/* Success View after submission */}
      {createdReport ? (
        <div className="space-y-6">
          <div 
            id="report-success-banner"
            className="bg-white/60 backdrop-blur-lg border border-emerald-200/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100/90 text-emerald-800 text-xs font-bold mb-1 border border-emerald-200/60">
                  Report Logged Successfully
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {createdReport.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Your reference ID is <strong className="font-mono text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-md">{createdReport.id}</strong>.
                  This item is now cataloged in the campus directory.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/60 flex flex-wrap gap-3">
              <Link
                to={`/item/${createdReport.id}`}
                id="view-my-report-btn"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm shadow-indigo-300/40 transition-all"
              >
                View My Report Details
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/my-reports"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-white/70 border border-white/60 text-slate-700 hover:bg-white text-xs font-semibold transition-all shadow-2xs"
              >
                Go to My Reports
              </Link>
              <button
                type="button"
                onClick={handleResetForm}
                className="px-5 py-2.5 rounded-2xl text-slate-600 hover:text-indigo-950 text-xs font-medium transition-colors"
              >
                Submit Another Report
              </button>
            </div>
          </div>

          {/* Instant AI Matching view for lost items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-indigo-950">
                    Instant Match Suggestions ({instantMatches.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Calculated automatically against cataloged opposite listings (threshold ≥ {MATCH_SCORE_THRESHOLD}%)
                  </p>
                </div>
              </div>
            </div>

            {instantMatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {instantMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    currentReportId={createdReport.id}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white/50 backdrop-blur-lg rounded-3xl border border-white/40 p-6 text-center space-y-2 shadow-sm">
                <p className="text-xs text-slate-500">
                  No immediate items matched above the {MATCH_SCORE_THRESHOLD}% similarity threshold. As new reports are submitted by campus desks, matching notifications will show on your report details page.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* The Shared Form with Frosted Glass styling */
        <form onSubmit={handleSubmit} className="bg-white/50 backdrop-blur-lg border border-white/40 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Item Type Switcher */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Report Type <span className="text-orange-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                id="toggle-type-lost"
                onClick={() => setItemType('lost')}
                className={`py-3 px-4 rounded-2xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  itemType === 'lost'
                    ? 'bg-orange-100/90 border-orange-300 text-orange-950 ring-2 ring-orange-200/50 shadow-2xs'
                    : 'bg-white/60 border-white/50 text-slate-600 hover:bg-white/80'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${itemType === 'lost' ? 'bg-orange-600' : 'bg-slate-300'}`} />
                I Lost an Item
              </button>
              <button
                type="button"
                id="toggle-type-found"
                onClick={() => setItemType('found')}
                className={`py-3 px-4 rounded-2xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  itemType === 'found'
                    ? 'bg-emerald-100/90 border-emerald-300 text-emerald-950 ring-2 ring-emerald-200/50 shadow-2xs'
                    : 'bg-white/60 border-white/50 text-slate-600 hover:bg-white/80'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${itemType === 'found' ? 'bg-emerald-600' : 'bg-slate-300'}`} />
                I Found an Item
              </button>
            </div>
          </div>

          {/* Title & Reporter Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Item Title <span className="text-orange-500">*</span>
              </label>
              <input
                id="report-title-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. TI-84 Plus CE Graphing Calculator"
                className={`w-full px-4 py-3 text-sm rounded-2xl bg-white/70 backdrop-blur-md border ${
                  errors.title ? 'border-orange-400 focus:ring-orange-500' : 'border-white/60 focus:ring-indigo-500'
                } focus:outline-none focus:ring-2 text-slate-800 placeholder-slate-400 shadow-2xs`}
              />
              {errors.title && <p className="text-xs text-orange-600 mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Reporter Display Name <span className="text-orange-500">*</span>
              </label>
              <input
                id="report-reporter-input"
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="e.g. Maya Lin (Student) or Security Desk"
                className={`w-full px-4 py-3 text-sm rounded-2xl bg-white/70 backdrop-blur-md border ${
                  errors.reporterName ? 'border-orange-400 focus:ring-orange-500' : 'border-white/60 focus:ring-indigo-500'
                } focus:outline-none focus:ring-2 text-slate-800 placeholder-slate-400 shadow-2xs`}
              />
              {errors.reporterName && <p className="text-xs text-orange-600 mt-1">{errors.reporterName}</p>}
            </div>
          </div>

          {/* Category & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Category <span className="text-orange-500">*</span>
              </label>
              <select
                id="report-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full px-4 py-3 text-sm rounded-2xl bg-white/70 backdrop-blur-md border border-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 shadow-2xs"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Campus Location <span className="text-orange-500">*</span>
              </label>
              <select
                id="report-location-select"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-2xl bg-white/70 backdrop-blur-md border border-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 shadow-2xs"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Date {itemType === 'lost' ? 'Lost' : 'Found'} <span className="text-orange-500">*</span>
              </label>
              <input
                id="report-date-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-2xl bg-white/70 backdrop-blur-md border border-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Approximate Time (Optional)
              </label>
              <input
                id="report-time-input"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-2xl bg-white/70 backdrop-blur-md border border-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 shadow-2xs"
              />
            </div>
          </div>

          {/* Color & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Color (Optional)
              </label>
              <input
                id="report-color-input"
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Navy Blue, Matte Black"
                className="w-full px-4 py-3 text-sm rounded-2xl bg-white/70 backdrop-blur-md border border-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder-slate-400 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Brand / Manufacturer (Optional)
              </label>
              <input
                id="report-brand-input"
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Apple, Samsung, Herschel, Hydro Flask"
                className="w-full px-4 py-3 text-sm rounded-2xl bg-white/70 backdrop-blur-md border border-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder-slate-400 shadow-2xs"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Item Description & Distinguishing Marks <span className="text-orange-500">*</span>
            </label>
            <textarea
              id="report-description-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe unique stickers, scratches, case styles, contents, or circumstances where it was misplaced..."
              className={`w-full px-4 py-3 text-sm rounded-2xl bg-white/70 backdrop-blur-md border ${
                errors.description ? 'border-orange-400 focus:ring-orange-500' : 'border-white/60 focus:ring-indigo-500'
              } focus:outline-none focus:ring-2 text-slate-800 placeholder-slate-400 shadow-2xs`}
            />
            {errors.description && <p className="text-xs text-orange-600 mt-1">{errors.description}</p>}
          </div>

          {/* Image URL & Sample Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Image URL (Optional)
            </label>
            <div className="flex items-center gap-2">
              <input
                id="report-image-input"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-4 py-3 text-sm rounded-2xl bg-white/70 backdrop-blur-md border border-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder-slate-400 shadow-2xs"
              />
            </div>

            {/* Quick Presets for fast testing */}
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-slate-400">Quick Photo Presets:</span>
              {samplePresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setImageUrl(preset.url)}
                  className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-white/70 hover:bg-white text-slate-600 border border-white/50 transition-colors shadow-2xs"
                >
                  +{preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy reminder */}
          <div className="p-3.5 bg-white/60 backdrop-blur-xs border border-white/60 rounded-2xl flex items-center gap-2.5 text-xs text-slate-600 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Your phone and email are never shown publicly. Only your display name ({reporterName || 'your name'}) is visible.
            </span>
          </div>

          {/* Submit button */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-indigo-950 transition-colors"
            >
              Cancel
            </button>
            <button
              id="submit-report-btn"
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 rounded-2xl font-semibold text-sm text-white shadow-sm transition-all flex items-center gap-2 ${
                itemType === 'lost'
                  ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-300/40'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-300/40'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              {itemType === 'lost' ? 'Submit Lost Report' : 'Submit Found Report'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
