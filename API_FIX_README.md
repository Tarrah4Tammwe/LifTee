# API Client & Component Fixes

This document describes the fixes applied to make LifTee fully functional.

## What Was Fixed

### 1. API Client (`lib/api.ts`)

**Issues:**
- API responses weren't being parsed correctly
- Silent failures when API calls failed
- No fallback to offline cache
- Missing error logging for debugging

**Fixes:**
- ✅ Proper response parsing for both wrapped and direct responses
- ✅ Comprehensive error logging with [API] and [DB] prefixes
- ✅ Fallback to IndexedDB cache when API fails
- ✅ Health check endpoint
- ✅ Auto-transformation of API data to match component schemas
- ✅ Better offline support with sync queue

### 2. Programs Tab (`components/tabs/ProgramsTab.tsx`)

**Issues:**
- Components couldn't handle the API response format
- No error handling during data loading
- Missing handling for both "exercises" and "workouts" formats

**Fixes:**
- ✅ Proper async data loading with error handling
- ✅ Support for both "exercises" and "workouts" endpoints
- ✅ Loading state while fetching data
- ✅ Empty state messages when no data available
- ✅ Detailed program view with navigation
- ✅ Display of program duration, difficulty, and exercises

### 3. Food Tab (`components/tabs/FoodTab.tsx`)

**Issues:**
- Foods weren't loading with categories
- No search/filter functionality
- Missing nutrition info display

**Fixes:**
- ✅ Proper food loading with category support
- ✅ Search and category filtering
- ✅ Full nutrition display (calories, protein, carbs, fat)
- ✅ Food selection with running nutrition totals
- ✅ Proper error handling
- ✅ Offline cache support

## Testing the Fixes

### Local Development

```bash
# Start dev server
npm run dev

# Open http://localhost:3000
# Check DevTools → Console for [API] log messages
# Test:
# 1. Programs tab loads programs ✓
# 2. Food tab loads foods ✓
# 3. Categories display correctly ✓
# 4. DevTools → Network → Offline → Refresh (offline caching works)
```

### Browser Console Tests

```javascript
// Test 1: Check API is working
fetch('https://lifteet-backend.vercel.app/api/health')
  .then(r => r.json())
  .then(console.log)
// Expected: {status: 'OK', timestamp: '...', version: '1.0.0'}

// Test 2: Check programs endpoint
fetch('https://lifteet-backend.vercel.app/api/programs')
  .then(r => r.json())
  .then(d => console.log('Programs:', d.length, d))
// Expected: Array of 4 programs

// Test 3: Check foods endpoint
fetch('https://lifteet-backend.vercel.app/api/foods')
  .then(r => r.json())
  .then(d => console.log('Foods:', d.length, d))
// Expected: Array of 16 foods with categories
```

## Console Logging

The updated code includes helpful logging:

```
[API] Fetching programs...
[API] Got 4 programs from API
[API] Cached 4 programs to IndexedDB
[API] Fetching foods...
[API] Got 16 foods from API
[API] Cached 16 foods to IndexedDB
```

If something goes wrong:

```
[API] Error: Failed to fetch programs, using cache
[DB] Retrieved 4 programs from IndexedDB cache
```

## Key Features

### Offline Support
- Programs and foods are cached in IndexedDB
- When API is unavailable, cached data is used automatically
- Sync queue stores pending updates for when connection returns

### Error Handling
- All API calls have try-catch blocks
- Errors are logged with context
- Fallback to cache on failure
- User sees helpful messages instead of silent failures

### Data Transformation
- API responses are automatically transformed to component schema
- Handles both array and wrapped response formats
- Ensures all required fields exist (with sensible defaults)

### Food Categories
- Supports "Protein", "Carbs", "Vegetables", "Fruits", "Grains", "Dairy", "Nuts", "Oils", etc.
- Foods can be filtered by category
- Category display in food list

## Deployment

The fixes are automatically deployed when you push to main:

```bash
git add .
git commit -m "fix: API and component updates"
git push origin main
# Vercel will automatically build and deploy
```

Monitor deployment at: https://vercel.com/dashboard

## Troubleshooting

### Programs still not loading

1. Check seed data: Is database populated?
   ```bash
   # Backend repo
   node scripts/seed-data.js
   ```

2. Check API is running: 
   ```javascript
   // Browser console
   fetch('https://lifteet-backend.vercel.app/api/health')
     .then(r => r.json())
     .then(console.log)
   ```

3. Check browser cache:
   - DevTools → Application → Clear cache
   - Refresh page

### Food categories not showing

1. Verify seed data includes categories:
   ```sql
   -- Supabase SQL Editor
   SELECT name, category FROM foods LIMIT 5;
   ```

2. Check FoodTab component is updated to use new category field

3. Clear browser cache and refresh

### "Offline Mode" always showing

1. Check DevTools → Network tab
2. Look for "Offline" checkbox - make sure it's unchecked
3. Clear browser cache
4. Restart npm dev server

### API errors in console

1. Check console for [API] error messages
2. Copy the full error message
3. Check Supabase is working: https://status.supabase.com
4. Check NEXT_PUBLIC_API_URL environment variable is correct

## Files Changed

- `lib/api.ts` - Completely rewritten with error handling
- `components/tabs/ProgramsTab.tsx` - Updated data loading logic
- `components/tabs/FoodTab.tsx` - Updated data loading and categories

## Next Steps

After verification:

1. Test all tabs load data correctly
2. Test offline mode works
3. Test mobile installation (PWA)
4. Deploy to production
5. Monitor error logs

Questions? Check the API response in DevTools Network tab for details.

