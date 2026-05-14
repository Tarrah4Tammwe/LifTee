'use client';

import { useState, useEffect } from 'react';
import { Calendar, Plus, Check } from 'lucide-react';
import { db } from '@/lib/db';

export default function TodayTab() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [todayStats, setTodayStats] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    workoutsCompleted: 0,
  });
  const [todayWorkouts, setTodayWorkouts] = useState<any[]>([]);

  useEffect(() => {
    loadTodayData();
  }, [date]);

  const loadTodayData = async () => {
    const dailyLog = await db.dailyLogs.where('date').equals(date).first();
    const workouts = await db.workouts.where('date').equals(date).toArray();

    setTodayStats({
      calories: dailyLog?.calories || 0,
      protein: dailyLog?.protein || 0,
      carbs: dailyLog?.carbs || 0,
      fat: dailyLog?.fat || 0,
      workoutsCompleted: workouts.filter((w) => w.completed).length,
    });

    setTodayWorkouts(workouts);
  };

  const toggleWorkoutComplete = async (id: number | undefined) => {
    if (id !== undefined) {
      const workout = await db.workouts.get(id);
      if (workout) {
        await db.workouts.update(id, { completed: !workout.completed });
        loadTodayData();
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full p-4 sm:p-6">
      <div className="space-y-6">
        {/* Date selector */}
        <div className="flex items-center gap-2">
          <Calendar size={20} className="text-primary" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 bg-dark border border-white border-opacity-10 rounded-lg text-light"
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: 'Calories',
              value: todayStats.calories,
              unit: 'kcal',
              target: 2500,
            },
            {
              label: 'Protein',
              value: todayStats.protein,
              unit: 'g',
              target: 150,
            },
            { label: 'Carbs', value: todayStats.carbs, unit: 'g', target: 300 },
            { label: 'Fat', value: todayStats.fat, unit: 'g', target: 70 },
          ].map((stat) => (
            <div key={stat.label} className="card text-center">
              <div className="text-sm text-light opacity-70">{stat.label}</div>
              <div className="text-2xl font-bold text-primary my-2">
                {stat.value}
              </div>
              <div className="w-full bg-dark rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min((stat.value / stat.target) * 100, 100)}%`,
                  }}
                />
              </div>
              <div className="text-xs text-light opacity-50 mt-1">
                / {stat.target} {stat.unit}
              </div>
            </div>
          ))}
        </div>

        {/* Workouts Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-light">Workouts</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-secondary rounded-lg text-light transition">
              <Plus size={18} /> Add Workout
            </button>
          </div>

          {todayWorkouts.length > 0 ? (
            <div className="space-y-3">
              {todayWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  className="card flex items-center justify-between p-4"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-light">
                      {workout.exercises?.[0]?.name || 'Workout'}
                    </h3>
                    <p className="text-sm text-light opacity-60">
                      {workout.exercises?.length || 0} exercises
                    </p>
                  </div>
                  <button
                    onClick={() => toggleWorkoutComplete(workout.id)}
                    className={`p-2 rounded-lg transition ${
                      workout.completed
                        ? 'bg-green-500 text-light'
                        : 'bg-dark border border-white border-opacity-10 text-light hover:border-primary'
                    }`}
                  >
                    <Check size={20} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-8 text-light opacity-60">
              No workouts logged yet. Add one to get started!
            </div>
          )}
        </div>

        {/* Food Log Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-light">Food Log</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-accent hover:opacity-90 rounded-lg text-light transition">
              <Plus size={18} /> Add Food
            </button>
          </div>

          <div className="card text-center py-8 text-light opacity-60">
            No foods logged yet. Add meals to track your nutrition!
          </div>
        </div>
      </div>
    </div>
  );
}
