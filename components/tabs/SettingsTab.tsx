'use client';

import { useState } from 'react';
import { LogOut, Save, AlertCircle } from 'lucide-react';
import { apiClient } from '@/lib/api';

export default function SettingsTab() {
  const [user, setUser] = useState<any>(
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('user') || '{}')
      : {}
  );
  const [preferences, setPreferences] = useState({
    dailyCalorieTarget: 2500,
    dailyProteinTarget: 150,
    dailyCarbTarget: 300,
    dailyFatTarget: 70,
    notificationsEnabled: true,
    darkMode: true,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogout = () => {
    apiClient.logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    try {
      localStorage.setItem('preferences', JSON.stringify(preferences));
      setMessage('✓ Preferences saved successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('✗ Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-light mb-6">Settings</h1>

      <div className="space-y-6 max-w-2xl">
        {/* User Info */}
        <div className="card">
          <h2 className="text-lg font-bold text-light mb-4">Account</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-light opacity-70">Email</label>
              <p className="text-light mt-1">{user?.email || 'Not logged in'}</p>
            </div>
            <div>
              <label className="text-sm text-light opacity-70">
                Account Status
              </label>
              <p className="text-light mt-1 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                Active
              </p>
            </div>
          </div>
        </div>

        {/* Nutrition Targets */}
        <div className="card">
          <h2 className="text-lg font-bold text-light mb-4">Daily Targets</h2>
          <div className="space-y-4">
            {[
              {
                label: 'Calorie Target',
                key: 'dailyCalorieTarget',
                unit: 'kcal',
              },
              {
                label: 'Protein Target',
                key: 'dailyProteinTarget',
                unit: 'g',
              },
              { label: 'Carbs Target', key: 'dailyCarbTarget', unit: 'g' },
              { label: 'Fat Target', key: 'dailyFatTarget', unit: 'g' },
            ].map((target) => (
              <div key={target.key}>
                <label className="text-sm text-light opacity-70">
                  {target.label}
                </label>
                <div className="flex gap-2 mt-2">
                  <input
                    type="number"
                    value={
                      (preferences[target.key as keyof typeof preferences] as number) || 0
                    }
                    onChange={(e) =>
                      setPreferences({
                        ...preferences,
                        [target.key]: parseInt(e.target.value),
                      })
                    }
                    className="flex-1 px-3 py-2 bg-dark border border-white border-opacity-10 rounded-lg text-light"
                  />
                  <span className="text-light opacity-70 py-2">{target.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="card">
          <h2 className="text-lg font-bold text-light mb-4">Preferences</h2>
          <div className="space-y-4">
            {[
              {
                label: 'Enable Notifications',
                key: 'notificationsEnabled',
                type: 'toggle',
              },
              {
                label: 'Dark Mode',
                key: 'darkMode',
                type: 'toggle',
                description: 'Always enabled on this app',
                disabled: true,
              },
            ].map((pref) => (
              <div
                key={pref.key}
                className="flex items-center justify-between p-3 rounded-lg bg-dark"
              >
                <div>
                  <label className="text-light font-medium">{pref.label}</label>
                  {pref.description && (
                    <p className="text-xs text-light opacity-50 mt-1">
                      {pref.description}
                    </p>
                  )}
                </div>
                <button
                  disabled={pref.disabled}
                  onClick={() =>
                    !pref.disabled &&
                    setPreferences({
                      ...preferences,
                      [pref.key]: !preferences[
                        pref.key as keyof typeof preferences
                      ],
                    })
                  }
                  className={`w-12 h-7 rounded-full transition ${
                    preferences[pref.key as keyof typeof preferences]
                      ? 'bg-primary'
                      : 'bg-dark border border-white border-opacity-10'
                  } ${pref.disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  <div
                    className={`w-6 h-6 bg-light rounded-full transition ${
                      preferences[pref.key as keyof typeof preferences]
                        ? 'translate-x-5'
                        : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* About */}
        <div className="card">
          <h2 className="text-lg font-bold text-light mb-4">About</h2>
          <div className="space-y-3 text-sm text-light opacity-70">
            <p>
              <strong>LifTee v1.0.0</strong>
            </p>
            <p>Your personal fitness & nutrition companion</p>
            <p>Built with Next.js, PWA, and offline-first technology</p>
          </div>
        </div>

        {/* Save and Logout */}
        <div className="space-y-3">
          {message && (
            <div
              className={`p-3 rounded-lg flex items-center gap-2 ${
                message.includes('✓')
                  ? 'bg-green-500 bg-opacity-20 text-green-200'
                  : 'bg-red-500 bg-opacity-20 text-red-200'
              }`}
            >
              <AlertCircle size={18} />
              {message}
            </div>
          )}

          <button
            onClick={handleSavePreferences}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-secondary text-light font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 bg-red-500 bg-opacity-20 text-red-200 font-semibold rounded-lg hover:bg-opacity-30 transition"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
