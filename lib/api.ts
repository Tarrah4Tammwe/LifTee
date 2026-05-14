import axios from 'axios';
import { db, Program, Food } from './db';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token if available
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiClient = {
  // Programs
  async getPrograms(): Promise<Program[]> {
    try {
      const response = await api.get('/api/programs');
      const programs = response.data.data || response.data;

      // Cache in IndexedDB
      for (const program of programs) {
        await db.programs.put(program);
      }

      return programs;
    } catch (error) {
      console.warn('Failed to fetch programs, using cache:', error);
      return await db.programs.toArray();
    }
  },

  async getProgramById(id: string): Promise<Program | undefined> {
    try {
      const response = await api.get(`/api/programs/${id}`);
      const program = response.data.data || response.data;
      await db.programs.put(program);
      return program;
    } catch (error) {
      console.warn('Failed to fetch program, using cache:', error);
      return await db.programs.get(id);
    }
  },

  // Foods
  async getFoods(): Promise<Food[]> {
    try {
      const response = await api.get('/api/foods');
      const foods = response.data.data || response.data;

      // Cache in IndexedDB
      for (const food of foods) {
        await db.foods.put(food);
      }

      return foods;
    } catch (error) {
      console.warn('Failed to fetch foods, using cache:', error);
      return await db.foods.toArray();
    }
  },

  async searchFoods(query: string): Promise<Food[]> {
    try {
      const response = await api.get('/api/foods/search', {
        params: { q: query },
      });
      return response.data.data || response.data;
    } catch (error) {
      console.warn('Search failed, searching local cache:', error);
      const allFoods = await db.foods.toArray();
      const lowerQuery = query.toLowerCase();
      return allFoods.filter(
        (f) =>
          f.name.toLowerCase().includes(lowerQuery) ||
          f.category.toLowerCase().includes(lowerQuery)
      );
    }
  },

  // Workouts
  async logWorkout(workoutData: any) {
    try {
      const response = await api.post('/api/workouts', workoutData);
      return response.data;
    } catch (error) {
      console.warn('Workout sync failed, storing locally:', error);
      // Store locally for sync when online
      await db.workouts.add({
        ...workoutData,
        syncedAt: undefined,
      });
      return { error: 'Offline - will sync when online' };
    }
  },

  // Nutrition Logs
  async logNutrition(logData: any) {
    try {
      const response = await api.post('/api/nutrition', logData);
      return response.data;
    } catch (error) {
      console.warn('Nutrition log failed, storing locally:', error);
      await db.dailyLogs.add({
        ...logData,
        syncedAt: undefined,
      });
      return { error: 'Offline - will sync when online' };
    }
  },

  // Auth
  async login(email: string, password: string) {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, user } = response.data.data || response.data;
      if (token) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  async getUser() {
    try {
      const response = await api.get('/api/auth/me');
      return response.data.data || response.data;
    } catch (error) {
      throw error;
    }
  },

  // Sync pending changes
  async syncPendingChanges() {
    // TODO: Implement proper sync with backend
    // For now, skip syncing
    return;
  },
};
