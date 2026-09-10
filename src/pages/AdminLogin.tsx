import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (login(password)) {
        // Login successful, redirect to admin
        navigate('/admin', { replace: true });
      } else {
        setError('Invalid admin password. Please try again.');
        setPassword('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white/50 backdrop-blur-md rounded-3xl border border-white/50 p-8 shadow-sm">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 border border-indigo-200 mb-3">
              <LogIn className="w-6 h-6 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-indigo-950 mb-1">Admin Access</h1>
            <p className="text-sm text-slate-600">
              Enter your admin password to access the management console
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="admin-password" className="block text-sm font-semibold text-slate-700">
                Admin Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="Enter admin password"
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 pr-10 rounded-2xl border border-white/60 bg-white/70 backdrop-blur-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50/80 border border-red-200/80 rounded-2xl flex gap-2 text-sm text-red-900">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !password.trim()}
              className="w-full px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Authenticating...' : 'Login to Admin Console'}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-6 p-3 bg-blue-50/80 border border-blue-200/80 rounded-2xl text-xs text-blue-900 space-y-1">
            <div className="font-semibold">Demo Credentials:</div>
            <div>Password: <code className="font-mono bg-white/50 px-1.5 py-0.5 rounded">admin123</code></div>
            <div className="text-[11px] mt-2 text-blue-800">
              This is a demonstration password. In production, use proper OAuth/SSO authentication.
            </div>
          </div>

          {/* Back Link */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
