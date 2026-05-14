import Dexie, { Table } from 'dexie';

export interface Program {
  id: string;
  name: string;
  description: string;
  duration_weeks: number;
  difficulty: string;
  exercises: any[];
  created_at: string;
}

export interface Food {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  created_at: string;
}

export interface Workout {
  id?: number;
  workoutId: string;
  programId: string;
  date: string;
  exercises: any[];
  completed: boolean;
  syncedAt?: string;
}

export interface DailyLog {
  id?: number;
  date: string;
  foods: any[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  syncedAt?: string;
}

export class LifTeeDB extends Dexie {
  programs!: Table<Program>;
  foods!: Table<Food>;
  workouts!: Table<Workout>;
  dailyLogs!: Table<DailyLog>;

  constructor() {
    super('LifTeeDB');
    this.version(1).stores({
      programs: 'id',
      foods: 'id',
      workouts: '++id, date, programId',
      dailyLogs: '++id, date',
    });
  }
}

export const db = new LifTeeDB();
