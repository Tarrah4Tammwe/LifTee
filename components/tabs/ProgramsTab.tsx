'use client';

import { useState, useEffect } from 'react';
import { Loader, ChevronRight } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  duration?: string;
  notes?: string;
}

interface Workout {
  day: string;
  name?: string;
  exercises: Exercise[];
}

interface Program {
  id: string;
  name: string;
  description: string;
  duration_weeks?: number;
  difficulty?: string;
  exercises?: Exercise[];
  workouts?: Workout[];
  created_at: string;
}

export default function ProgramsTab() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    setLoading(true);
    try {
      const data = await apiClient.getPrograms();
      
      // Ensure we have an array
      const programsArray = Array.isArray(data) ? data : [];
      
      // Transform data to match our schema
      const transformed = programsArray.map((p: any) => ({
        id: p.id,
        name: p.name || 'Untitled Program',
        description: p.description || 'No description',
        duration_weeks: p.duration_weeks || 8,
        difficulty: p.difficulty || 'intermediate',
        exercises: p.exercises || p.workouts || [],
        created_at: p.created_at || new Date().toISOString(),
      }));
      
      setPrograms(transformed);
      console.log('✅ Loaded programs:', transformed.length);
    } catch (error) {
      console.error('❌ Failed to load programs:', error);
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  if (selectedProgram) {
    const workouts = selectedProgram.workouts || selectedProgram.exercises || [];
    
    return (
      <div className="max-w-6xl mx-auto w-full p-4 sm:p-6">
        <button
          onClick={() => setSelectedProgram(null)}
          className="mb-6 text-primary hover:text-secondary transition flex items-center gap-1"
        >
          ← Back
        </button>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-light mb-2">
              {selectedProgram.name}
            </h1>
            <p className="text-light opacity-70">{selectedProgram.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {selectedProgram.duration_weeks && (
              <div className="card">
                <div className="text-sm text-light opacity-70">Duration</div>
                <div className="text-2xl font-bold text-primary">
                  {selectedProgram.duration_weeks} weeks
                </div>
              </div>
            )}
            {selectedProgram.difficulty && (
              <div className="card">
                <div className="text-sm text-light opacity-70">Difficulty</div>
                <div className="text-2xl font-bold text-secondary capitalize">
                  {selectedProgram.difficulty}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-light">
              {Array.isArray(selectedProgram.workouts) ? 'Workouts' : 'Exercises'}
            </h2>
            {workouts && workouts.length > 0 ? (
              <div className="space-y-3">
                {workouts.map((item: any, idx: number) => (
                  <div key={idx} className="card p-4">
                    {/* If it's a workout with day property */}
                    {item.day && (
                      <>
                        <h3 className="font-semibold text-light mb-3">
                          {item.name ? `${item.day} - ${item.name}` : item.day}
                        </h3>
                        <div className="space-y-2">
                          {item.exercises?.map((exercise: any, exIdx: number) => (
                            <div
                              key={exIdx}
                              className="text-sm text-light opacity-80 border-l-2 border-primary pl-3"
                            >
                              <div className="font-medium">{exercise.name}</div>
                              <div className="opacity-70 text-xs">
                                {exercise.sets && `${exercise.sets} sets`}
                                {exercise.reps && ` × ${exercise.reps} reps`}
                                {exercise.duration && ` × ${exercise.duration}`}
                                {exercise.weight && ` - ${exercise.weight}`}
                              </div>
                              {exercise.notes && (
                                <div className="opacity-60 text-xs italic mt-1">
                                  {exercise.notes}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    {/* If it's just an exercise */}
                    {!item.day && (
                      <>
                        <h3 className="font-semibold text-light mb-2">
                          {item.name}
                        </h3>
                        <div className="text-sm text-light opacity-60">
                          {item.sets && `${item.sets} sets`}
                          {item.reps && ` × ${item.reps} reps`}
                          {item.duration && ` × ${item.duration}`}
                          {item.weight && ` - ${item.weight}`}
                        </div>
                        {item.notes && (
                          <div className="text-xs text-light opacity-50 italic mt-2">
                            {item.notes}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="card text-center py-8 text-light opacity-60">
                No exercises in this program
              </div>
            )}
          </div>

          <button className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-light font-semibold rounded-lg hover:opacity-90 transition">
            Start Program
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto w-full p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-light mb-6">Training Programs</h1>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin text-primary" size={32} />
        </div>
      ) : programs.length > 0 ? (
        <div className="space-y-3">
          {programs.map((program) => (
            <button
              key={program.id}
              onClick={() => setSelectedProgram(program)}
              className="w-full card flex items-center justify-between p-4 group hover:border-primary transition"
            >
              <div className="text-left flex-1">
                <h3 className="font-semibold text-light group-hover:text-primary transition">
                  {program.name}
                </h3>
                <p className="text-sm text-light opacity-60 line-clamp-1">
                  {program.description}
                </p>
                <div className="flex gap-4 mt-2 text-xs text-light opacity-50">
                  {program.duration_weeks && (
                    <span>{program.duration_weeks} weeks</span>
                  )}
                  {program.difficulty && (
                    <span className="capitalize">{program.difficulty}</span>
                  )}
                </div>
              </div>
              <ChevronRight className="text-primary group-hover:translate-x-1 transition" />
            </button>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12 text-light opacity-60">
          <p className="mb-4">No programs available yet.</p>
          <p className="text-sm">Check back soon or contact support!</p>
        </div>
      )}
    </div>
  );
}
