# LifTee Frontend - Deployment Guide

## ⚡ Quick Start (5 minutes)

### Step 1: Download Files
All files are ready in `/mnt/user-data/outputs/`. Copy them to replace your existing repo.

### Step 2: Initialize Locally
```bash
cd LifTee
pnpm install
cp .env.example .env.local
# Edit .env.local with your credentials (already filled in)
pnpm dev
```

Test at http://localhost:3000 and verify:
- ✅ All 5 tabs load
- ✅ Can scroll and interact
- ✅ PWA manifest loads (DevTools → Application)
- ✅ Service worker registers (DevTools → Application → Service Workers)

### Step 3: Push to GitHub
```bash
git add .
git commit -m "build: Complete Next.js frontend with offline support"
git push origin main
```

### Step 4: Deploy to Vercel (30 seconds)

**Option A: Via GitHub (Recommended)**
1. Go to https://vercel.com
2. Click "New Project"
3. Select your LifTee GitHub repo
4. Vercel auto-detects Next.js
5. Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://lifteet-backend.vercel.app
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   NEXT_PUBLIC_SUPABASE_URL=https://whpdxibnajuvikbspzjg.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
6. Click "Deploy"

**Option B: Via Vercel CLI**
```bash
npm i -g vercel
vercel
# Follow prompts, select "GitHub" as source
```

### Step 5: Verify Live
- Your app is live at: `https://liftee-XXXXX.vercel.app`
- Or your custom domain if configured

## 🧪 Testing Your Deployment

### 1. Test API Connection
```javascript
// Open DevTools Console and run:
fetch('https://lifteet-backend.vercel.app/api/programs')
  .then(r => r.json())
  .then(console.log)
```

Expected: JSON array of programs from your backend

### 2. Test Offline Mode
1. Open DevTools → Network tab
2. Check "Offline" checkbox
3. Refresh page
4. App should still show cached data

### 3. Install as PWA
**Mobile (iOS)**
- Safari → Share → Add to Home Screen
- Tap the icon to open as native app

**Mobile (Android)**
- Chrome → Menu (⋮) → Install app
- Or "Add to Home Screen"

**Desktop**
- Chrome address bar → Install icon
- App window opens with app title

## 🔧 Configuration

### Backend Connection
All API calls go to `NEXT_PUBLIC_API_URL` from `.env.local`

Current: `https://lifteet-backend.vercel.app`

To change:
1. Edit `.env.local` → `NEXT_PUBLIC_API_URL`
2. `pnpm dev` to test
3. Redeploy to Vercel

### Stripe Integration
Keys in `.env.local` are test keys.

To switch to production:
1. Get production keys from Stripe Dashboard
2. Update `.env.local` on your machine
3. Update Vercel Environment Variables
4. Redeploy

### Supabase Connection
Frontend uses anonymous key (read-only safe).

Current settings:
- URL: `https://whpdxibnajuvikbspzjg.supabase.co`
- Anon Key: `eyJ...` (included in .env.local)

## 📊 Monitoring

### Vercel Dashboard
- https://vercel.com/dashboard
- See deployment status
- Check build logs
- Monitor performance

### Check Backend Connection
```bash
# Verify backend is running
curl https://lifteet-backend.vercel.app/api/programs

# Response should be 200 OK with program array
```

## 🆘 Troubleshooting

### Build Fails with "Module not found"
```bash
# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

### API returns 404
- Check backend is deployed
- Verify `NEXT_PUBLIC_API_URL` is correct in `.env`
- Ensure backend API routes exist

### Service Worker not registering
- Check browser console for errors
- Must be HTTPS (automatic on Vercel)
- Try clearing browser cache

### App shows "Offline" permanently
- Check browser DevTools Network tab
- Verify internet connection
- Check backend API is accessible

### PWA not installable
- Must be HTTPS (Vercel provides this)
- Manifest must be valid JSON
- Icons must be accessible
- Run Lighthouse audit

## 📱 Features to Verify

After deployment, test:
- [ ] Load page without internet
- [ ] Navigate between 5 tabs
- [ ] Programs load from backend API
- [ ] Foods load from backend API
- [ ] Can log workout (saves locally)
- [ ] Can log food (saves locally)
- [ ] Settings persist
- [ ] Install as PWA
- [ ] App works offline
- [ ] Data syncs when online again

## 🚀 Next Steps

1. **Add Authentication**
   - Login page at `/login`
   - Persist token in localStorage
   - Check auth on app load

2. **Implement Payment**
   - Stripe checkout on Settings
   - Create subscription plans
   - Track subscription status

3. **Enhanced Analytics**
   - Weekly/monthly charts
   - Goals tracking
   - Progress notifications

4. **Mobile Optimization**
   - Test on real devices
   - Adjust breakpoints if needed
   - Optimize touch targets

## 📞 Support

**If deployment fails:**
1. Check Vercel build logs
2. Run `pnpm build` locally to reproduce
3. Verify all env variables set
4. Clear Vercel cache: Project → Settings → Advanced → Clear Build Cache

**For API issues:**
1. Test backend directly: `curl <backend-url>/api/programs`
2. Check backend logs on Vercel
3. Verify CORS headers on backend

---

**You're deployed! 🎉**

Your LifTee frontend is now live and ready for users.
Backend at: https://lifteet-backend.vercel.app
Frontend at: https://liftee-XXXXX.vercel.app
