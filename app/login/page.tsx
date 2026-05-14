'use client';

import { useState } from 'react';
import { LogIn, AlertCircle } from 'lucide-react';
import { apiClient } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.login(email, password);
      
      if (response.data?.token || response.token) {
        // Successfully logged in
        window.location.href = '/';
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-dark via-dark to-purple-900 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-light">LT</span>
          </div>
          <h1 className="text-3xl font-bold text-light mb-2">LifTee</h1>
          <p className="text-light opacity-70">
            Your Personal Fitness & Nutrition Companion
          </p>
        </div>

        {/* Login Card */}
        <div className="card p-6 space-y-6">
          <h2 className="text-2xl font-bold text-light text-center">Sign In</h2>

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-500 bg-opacity-20 rounded-lg text-red-200 border border-red-500 border-opacity-30">
              <AlertCircle size={20} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-light mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@liftee.app"
                className="w-full px-4 py-3 bg-dark border border-white border-opacity-10 rounded-lg text-light placeholder:text-light placeholder:opacity-50 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-light mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-dark border border-white border-opacity-10 rounded-lg text-light placeholder:text-light placeholder:opacity-50 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-light font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="border-t border-white border-opacity-10 pt-6 space-y-3">
            <p className="text-xs text-light opacity-60 text-center">Demo Credentials</p>
            <div className="text-xs text-light opacity-70 space-y-1 bg-dark p-3 rounded-lg">
              <p>
                <strong>Email:</strong> admin@liftee.app
              </p>
              <p>
                <strong>Password:</strong> LifTee@Admin2024!
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-light opacity-50 text-sm mt-8">
          Offline-first fitness and nutrition tracking
        </p>
      </div>
    </main>
  );
}
