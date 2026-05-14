'use client';

import { useState, useEffect } from 'react';
import { Loader, ChevronRight } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { Program } from '@/lib/db';

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
      setPrograms(data);
    } catch (error) {
      console.error('Failed to load programs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (selectedProgram) {
    return (
      <div className="max-w-6xl mx-auto w-full p-4 sm:p-6">
        <button
          onClick={() => setSelectedProgram(null)}
          className="mb-6 text-primary hover:text-secondary transition"
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
            <div className="card">
              <div className="text-sm text-light opacity-70">Duration</div>
              <div className="text-2xl font-bold text-primary">
                {selectedProgram.duration_weeks} weeks
              </div>
            </div>
            <div className="card">
              <div className="text-sm text-light opacity-70">Difficulty</div>
              <div className="text-2xl font-bold text-secondary capitalize">
                {selectedProgram.difficulty}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-light">Exercises</h2>
            {selectedProgram.exercises && selectedProgram.exercises.length > 0 ? (
              <div className="space-y-3">
                {selectedProgram.exercises.map((exercise, idx) => (
                  <div key={idx} className="card">
                    <h3 className="font-semibold text-light mb-2">
                      {exercise.name}
                    </h3>
                    <div className="text-sm text-light opacity-60">
                      {exercise.sets && `${exercise.sets} sets`}
                      {exercise.reps && ` × ${exercise.reps} reps`}
                      {exercise.duration && ` × ${exercise.duration}s`}
                    </div>
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
                  <span>{program.duration_weeks} weeks</span>
                  <span className="capitalize">{program.difficulty}</span>
                </div>
              </div>
              <ChevronRight className="text-primary group-hover:translate-x-1 transition" />
            </button>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12 text-light opacity-60">
          No programs available. Check back soon!
        </div>
      )}
    </div>
  );
}
