'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/db';

export default function AnalyticsTab() {
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalCalories: 0,
    averageCalories: 0,
    streakDays: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const allWorkouts = await db.workouts.toArray();
    const allLogs = await db.dailyLogs.toArray();

    const totalWorkouts = allWorkouts.filter((w) => w.completed).length;
    const totalCalories = allLogs.reduce((sum, log) => sum + log.calories, 0);
    const averageCalories =
      allLogs.length > 0 ? Math.round(totalCalories / allLogs.length) : 0;

    // Simple streak calculation
    const today = new Date();
    let streak = 0;
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const hasLog = allLogs.some((log) => log.date === dateStr);
      if (hasLog) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    setStats({
      totalWorkouts,
      totalCalories,
      averageCalories,
      streakDays: streak,
    });
  };

  return (
    <div className="max-w-6xl mx-auto w-full p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-light mb-6">Analytics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Workouts Completed',
            value: stats.totalWorkouts,
            icon: '🏋️',
          },
          {
            label: 'Total Calories Logged',
            value: stats.totalCalories.toLocaleString(),
            icon: '🔥',
          },
          {
            label: 'Avg Daily Calories',
            value: stats.averageCalories,
            icon: '📊',
          },
          {
            label: 'Current Streak',
            value: stats.streakDays,
            unit: 'days',
            icon: '🔥',
          },
        ].map((stat, idx) => (
          <div key={idx} className="card text-center">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-sm text-light opacity-70">{stat.label}</div>
            <div className="text-3xl font-bold text-primary my-2">
              {stat.value}
            </div>
            {stat.unit && (
              <div className="text-xs text-light opacity-50">{stat.unit}</div>
            )}
          </div>
        ))}
      </div>

      {/* Charts placeholder */}
      <div className="space-y-6">
        <div className="card">
          <h2 className="text-xl font-bold text-light mb-4">Weekly Overview</h2>
          <div className="h-64 flex items-center justify-center text-light opacity-50">
            <p>Chart data visualization coming soon...</p>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-light mb-4">
            Nutrition Trends
          </h2>
          <div className="h-64 flex items-center justify-center text-light opacity-50">
            <p>Chart data visualization coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
