# LifTee Frontend - Next.js PWA

A production-ready, offline-first Progressive Web App built with Next.js for fitness and nutrition tracking.

## Features

✅ **Offline-First Architecture** - Works completely offline using IndexedDB  
✅ **5-Tab Interface** - Today, Programs, Food, Analytics, Settings  
✅ **API Integration** - Seamlessly connects to LifTee backend  
✅ **PWA Support** - Installable on mobile and desktop  
✅ **Real-time Sync** - Automatic sync when connection restored  
✅ **Responsive Design** - Works on all devices (mobile-first)  
✅ **Dark Theme** - Eye-friendly interface with purple gradients  

## Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Tarrah4Tammwe/LifTee.git
cd LifTee

# Install dependencies
pnpm install
# or
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://lifteet-backend.vercel.app

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51TX3p2RsC9XN4Dwhp2z2CR9aUJbqHlGwL2LnbR8srq77iIWxIKRHLlmPTwiEKEmXoDe3p8oNTbUvApnmgNApujfM00fNACJNVD

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://whpdxibnajuvikbspzjg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndocGR4aWJuYWp1dmlrYnNwempnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODA0MjAsImV4cCI6MjA5NDM1NjQyMH0.FLhH-ZUuP8uLKOrqNUNoQvoCDXJIfLPBQnPkF3i27Pg
```

### Development

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
pnpm build
pnpm start
# or
npm run build
npm start
```

## Deployment to Vercel

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Build: Complete Next.js frontend with offline support"
git push origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure project:
   - Framework: **Next.js**
   - Root Directory: `.` (or leave as default)
5. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL` = `https://lifteet-backend.vercel.app`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = (from .env.local)
   - `NEXT_PUBLIC_SUPABASE_URL` = (from .env.local)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (from .env.local)
6. Click "Deploy"

### Step 3: Verify Deployment

After deployment completes:

```bash
# Your app is live at: https://liftee-frontend.vercel.app
# (or your custom domain if configured)

# Test PWA functionality
# 1. Open the app on mobile
# 2. Install via "Add to Home Screen"
# 3. Go offline and verify app still works
```

## Architecture

### Frontend Stack
- **Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **Database**: IndexedDB (via Dexie)
- **API Client**: Axios
- **UI Components**: Lucide React Icons

### Offline Strategy
- **IndexedDB** stores programs, foods, workouts, and logs
- **Service Worker** implements network-first for API, cache-first for assets
- **Automatic Sync** when device comes back online
- **Background Sync API** for reliable data transmission

### Directory Structure
```
LifTee/
├── app/
│   ├── layout.tsx           # Root layout with PWA setup
│   ├── page.tsx             # Main app with tab navigation
│   └── globals.css          # Global styles
├── components/
│   └── tabs/
│       ├── TodayTab.tsx     # Daily tracking
│       ├── ProgramsTab.tsx  # Browse programs
│       ├── FoodTab.tsx      # Food database
│       ├── AnalyticsTab.tsx # Statistics
│       └── SettingsTab.tsx  # Settings & profile
├── lib/
│   ├── db.ts                # IndexedDB schema (Dexie)
│   └── api.ts               # API client with offline support
├── public/
│   ├── manifest.json        # PWA manifest
│   ├── service-worker.js    # Service worker
│   ├── icon192.png          # PWA icon
│   └── icon512.png          # PWA icon
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── .env.local               # Environment variables
```

## Features Guide

### 1. Today Tab
- Daily stats (calories, macros)
- Log workouts
- Track food intake
- See progress toward goals

### 2. Programs Tab
- Browse all available programs
- View program details
- See exercises and sets
- Start a new program

### 3. Food Tab
- Search food database
- Filter by category
- View nutrition facts
- Log meals with auto-calculated macros

### 4. Analytics Tab
- Workout history
- Calorie trends
- Streak tracking
- Progress charts (extensible)

### 5. Settings Tab
- Account management
- Daily nutrition targets
- Preferences & notifications
- About & version info

## API Endpoints Used

- `GET /api/programs` - Fetch all programs
- `GET /api/programs/:id` - Get program details
- `GET /api/foods` - Fetch food database
- `GET /api/foods/search?q=query` - Search foods
- `POST /api/workouts` - Log workout
- `POST /api/nutrition` - Log nutrition
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

## Offline Functionality

The app works completely offline:

1. **Data Caching**: All programs and foods are cached in IndexedDB
2. **Local Logging**: Workouts and meals are stored locally
3. **Auto-Sync**: When online, pending data syncs automatically
4. **Service Worker**: Network requests fall back to cache
5. **Status Indicator**: "Offline Mode" badge shows when disconnected

## Contributing

Pull requests welcome! Please ensure:
- Code follows existing style
- All features are tested
- Environment variables are documented
- Commit messages are clear

## License

MIT License - see LICENSE file for details

## Support

For issues or questions:
1. Check [Backend Repo](https://github.com/Tarrah4Tammwe/LifTee-Backend)
2. Open an issue on GitHub
3. Review API documentation

## Troubleshooting

### App won't build locally
```bash
# Clear cache and reinstall
rm -rf node_modules .next
pnpm install
pnpm build
```

### API calls failing in production
- Check `.env` variables on Vercel
- Verify backend is running
- Check CORS settings on backend

### Service worker not registering
- Open DevTools → Application → Service Workers
- Check browser console for errors
- Clear browser cache and reload

### PWA not installable
- Ensure manifest.json is valid
- HTTPS is required (automatic on Vercel)
- Check iOS Safari requirements

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [PWA Guide](https://web.dev/progressive-web-apps/)
- [Dexie Documentation](https://dexie.org)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

Built with ❤️ by the LifTee team
