import axios from 'axios';
import { db, Program, Food, Workout, DailyLog } from './db';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

console.log('[API] Initializing with API_URL:', API_URL);

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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API] Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.error || error.message,
    });
    throw error;
  }
);

export const apiClient = {
  // ============================================================================
  // PROGRAMS
  // ============================================================================

  async getPrograms(): Promise<Program[]> {
    try {
      console.log('[API] Fetching programs...');
      const response = await api.get('/api/programs');
      
      // Handle different response formats
      const programs = Array.isArray(response.data) ? response.data : response.data.data || [];
      
      console.log('[API] Got', programs.length, 'programs from API');

      // Cache in IndexedDB
      if (programs.length > 0) {
        for (const program of programs) {
          // Transform program data to match our schema
          const transformedProgram: Program = {
            id: program.id,
            name: program.name,
            description: program.description || '',
            duration_weeks: program.duration_weeks || 8,
            difficulty: program.difficulty || 'intermediate',
            exercises: program.exercises || program.workouts || [],
            created_at: program.created_at || new Date().toISOString(),
          };
          await db.programs.put(transformedProgram);
        }
        console.log('[API] Cached', programs.length, 'programs to IndexedDB');
      }

      return programs.map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description || '',
        duration_weeks: p.duration_weeks || 8,
        difficulty: p.difficulty || 'intermediate',
        exercises: p.exercises || p.workouts || [],
        created_at: p.created_at || new Date().toISOString(),
      }));
    } catch (error) {
      console.warn('[API] Failed to fetch programs, using cache:', error);
      try {
        const cached = await db.programs.toArray();
        console.log('[API] Retrieved', cached.length, 'programs from IndexedDB cache');
        return cached;
      } catch (dbError) {
        console.error('[DB] Error reading from cache:', dbError);
        return [];
      }
    }
  },

  async getProgramById(id: string): Promise<Program | undefined> {
    try {
      console.log('[API] Fetching program:', id);
      const response = await api.get(`/api/programs/${id}`);
      const program = response.data.data || response.data;
      
      const transformedProgram: Program = {
        id: program.id,
        name: program.name,
        description: program.description || '',
        duration_weeks: program.duration_weeks || 8,
        difficulty: program.difficulty || 'intermediate',
        exercises: program.exercises || program.workouts || [],
        created_at: program.created_at || new Date().toISOString(),
      };
      
      await db.programs.put(transformedProgram);
      return transformedProgram;
    } catch (error) {
      console.warn('[API] Failed to fetch program, using cache:', error);
      try {
        return await db.programs.get(id);
      } catch (dbError) {
        console.error('[DB] Error reading from cache:', dbError);
        return undefined;
      }
    }
  },

  // ============================================================================
  // FOODS
  // ============================================================================

  async getFoods(): Promise<Food[]> {
    try {
      console.log('[API] Fetching foods...');
      const response = await api.get('/api/foods');
      
      // Handle different response formats
      const foods = Array.isArray(response.data) ? response.data : response.data.data || [];
      
      console.log('[API] Got', foods.length, 'foods from API');

      // Cache in IndexedDB
      if (foods.length > 0) {
        for (const food of foods) {
          const transformedFood: Food = {
            id: food.id,
            name: food.name,
            category: food.category || 'Uncategorized',
            calories: food.calories || 0,
            protein: food.protein || 0,
            carbs: food.carbs || 0,
            fat: food.fat || 0,
            created_at: food.created_at || new Date().toISOString(),
          };
          await db.foods.put(transformedFood);
        }
        console.log('[API] Cached', foods.length, 'foods to IndexedDB');
      }

      return foods.map((f: any) => ({
        id: f.id,
        name: f.name,
        category: f.category || 'Uncategorized',
        calories: f.calories || 0,
        protein: f.protein || 0,
        carbs: f.carbs || 0,
        fat: f.fat || 0,
        created_at: f.created_at || new Date().toISOString(),
      }));
    } catch (error) {
      console.warn('[API] Failed to fetch foods, using cache:', error);
      try {
        const cached = await db.foods.toArray();
        console.log('[API] Retrieved', cached.length, 'foods from IndexedDB cache');
        return cached;
      } catch (dbError) {
        console.error('[DB] Error reading from cache:', dbError);
        return [];
      }
    }
  },

  async searchFoods(query: string): Promise<Food[]> {
    try {
      console.log('[API] Searching foods:', query);
      const response = await api.get('/api/foods/search', {
        params: { q: query },
      });
      return response.data.data || response.data;
    } catch (error) {
      console.warn('[API] Search failed, searching local cache:', error);
      try {
        const allFoods = await db.foods.toArray();
        const lowerQuery = query.toLowerCase();
        const results = allFoods.filter(
          (f) =>
            f.name.toLowerCase().includes(lowerQuery) ||
            f.category.toLowerCase().includes(lowerQuery)
        );
        console.log('[API] Found', results.length, 'foods matching query locally');
        return results;
      } catch (dbError) {
        console.error('[DB] Error searching cache:', dbError);
        return [];
      }
    }
  },

  // ============================================================================
  // WORKOUTS
  // ============================================================================

  async logWorkout(workoutData: any) {
    try {
      console.log('[API] Logging workout...');
      const response = await api.post('/api/workouts', workoutData);
      console.log('[API] Workout logged successfully');
      return response.data;
    } catch (error) {
      console.warn('[API] Workout sync failed, storing locally:', error);
      try {
        // Store locally for sync when online
        await db.workouts.add({
          ...workoutData,
          syncedAt: undefined,
        });
        console.log('[DB] Workout stored in IndexedDB for offline sync');
        return { error: 'Offline - will sync when online' };
      } catch (dbError) {
        console.error('[DB] Error storing workout:', dbError);
        throw dbError;
      }
    }
  },

  // ============================================================================
  // NUTRITION LOGS
  // ============================================================================

  async logNutrition(logData: any) {
    try {
      console.log('[API] Logging nutrition...');
      const response = await api.post('/api/nutrition', logData);
      console.log('[API] Nutrition logged successfully');
      return response.data;
    } catch (error) {
      console.warn('[API] Nutrition log failed, storing locally:', error);
      try {
        await db.dailyLogs.add({
          ...logData,
          syncedAt: undefined,
        });
        console.log('[DB] Nutrition stored in IndexedDB for offline sync');
        return { error: 'Offline - will sync when online' };
      } catch (dbError) {
        console.error('[DB] Error storing nutrition:', dbError);
        throw dbError;
      }
    }
  },

  // ============================================================================
  // AUTHENTICATION
  // ============================================================================

  async login(email: string, password: string) {
    try {
      console.log('[API] Attempting login for:', email);
      const response = await api.post('/api/auth/login', { email, password });
      
      const token = response.data.data?.token || response.data.token;
      const user = response.data.data?.user || response.data.user;
      
      if (token && user) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        console.log('[API] Login successful for:', email);
      }
      
      return response.data;
    } catch (error) {
      console.error('[API] Login failed:', error);
      throw error;
    }
  },

  async logout() {
    console.log('[API] Logging out...');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  async getUser() {
    try {
      console.log('[API] Fetching current user...');
      const response = await api.get('/api/auth/me');
      return response.data.data || response.data;
    } catch (error) {
      console.error('[API] Failed to fetch user:', error);
      throw error;
    }
  },

  // ============================================================================
  // SYNC
  // ============================================================================

  async syncPendingChanges() {
    try {
      const workouts = await db.workouts.where('syncedAt').isUndefined().toArray();
      const logs = await db.dailyLogs.where('syncedAt').isUndefined().toArray();

      if (workouts.length === 0 && logs.length === 0) {
        console.log('[API] No pending changes to sync');
        return;
      }

      console.log('[API] Syncing pending changes:', {
        workouts: workouts.length,
        logs: logs.length,
      });

      // Sync workouts
      for (const workout of workouts) {
        try {
          await api.post('/api/workouts', workout);
          if (workout.id) {
            await db.workouts.update(workout.id, {
              syncedAt: new Date().toISOString(),
            });
          }
        } catch (error) {
          console.warn('[API] Failed to sync workout, will retry later');
        }
      }

      // Sync logs
      for (const log of logs) {
        try {
          await api.post('/api/nutrition', log);
          if (log.id) {
            await db.dailyLogs.update(log.id, {
              syncedAt: new Date().toISOString(),
            });
          }
        } catch (error) {
          console.warn('[API] Failed to sync nutrition log, will retry later');
        }
      }

      console.log('[API] Sync completed');
    } catch (error) {
      console.error('[API] Sync failed:', error);
    }
  },

  // ============================================================================
  // HEALTH CHECK
  // ============================================================================

  async healthCheck(): Promise<boolean> {
    try {
      console.log('[API] Health check...');
      const response = await api.get('/api/health');
      const isHealthy = response.status === 200;
      console.log('[API] Health check:', isHealthy ? '✅ OK' : '❌ Failed');
      return isHealthy;
    } catch (error) {
      console.warn('[API] Health check failed:', error);
      return false;
    }
  },
};
