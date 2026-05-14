'use client';

import { useEffect, useState } from 'react';
import {
  Home,
  Dumbbell,
  Apple,
  TrendingUp,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import TodayTab from '@/components/tabs/TodayTab';
import ProgramsTab from '@/components/tabs/ProgramsTab';
import FoodTab from '@/components/tabs/FoodTab';
import AnalyticsTab from '@/components/tabs/AnalyticsTab';
import SettingsTab from '@/components/tabs/SettingsTab';
import { apiClient } from '@/lib/api';

type Tab = 'today' | 'programs' | 'food' | 'analytics' | 'settings';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const [isOnline, setIsOnline] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    // Check online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);

    // Restore user from storage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Sync pending changes when online
    if (isOnline) {
      apiClient.syncPendingChanges().catch(console.error);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOnline]);

  const handleLogout = () => {
    apiClient.logout();
    setUser(null);
    setShowMenu(false);
    window.location.href = '/login';
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'today', label: 'Today', icon: <Home size={24} /> },
    { id: 'programs', label: 'Programs', icon: <Dumbbell size={24} /> },
    { id: 'food', label: 'Food', icon: <Apple size={24} /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp size={24} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={24} /> },
  ];

  return (
    <main className="flex flex-col h-screen bg-dark">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-secondary p-4 shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-light rounded-lg flex items-center justify-center font-bold text-dark">
              LT
            </div>
            <h1 className="text-xl font-bold text-light hidden sm:block">LifTee</h1>
          </div>

          <div className="flex items-center gap-4">
            {!isOnline && (
              <div className="text-sm bg-yellow-500 bg-opacity-20 px-3 py-1 rounded-lg text-yellow-200">
                📡 Offline Mode
              </div>
            )}

            {user && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-light">
                <span>{user.email}</span>
              </div>
            )}

            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition"
            >
              {showMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {showMenu && (
          <div className="mt-4 sm:hidden bg-black bg-opacity-50 rounded-lg p-2">
            {user && (
              <div className="px-3 py-2 text-sm text-light border-b border-white border-opacity-10 mb-2">
                {user.email}
              </div>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-light hover:bg-white hover:bg-opacity-10 rounded transition text-left"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        )}
      </header>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto pb-24 sm:pb-0">
        {activeTab === 'today' && <TodayTab />}
        {activeTab === 'programs' && <ProgramsTab />}
        {activeTab === 'food' && <FoodTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>

      {/* Navigation Bar */}
      <nav className="fixed sm:static bottom-0 left-0 right-0 bg-gradient-to-t from-black to-dark border-t border-white border-opacity-10 sm:border-t-0">
        <div className="flex justify-around max-w-6xl mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setShowMenu(false);
              }}
              className={`flex-1 py-3 px-2 flex flex-col items-center gap-1 transition ${
                activeTab === tab.id
                  ? 'text-primary'
                  : 'text-light hover:text-primary'
              }`}
            >
              {tab.icon}
              <span className="text-xs hidden sm:block">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </main>
  );
}
