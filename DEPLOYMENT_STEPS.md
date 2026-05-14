# LifTee Deployment Steps

## Overview

Your LifTee app has been fixed and updated. Follow these steps to get it fully deployed and working.

## Prerequisites

- Node.js 16+ installed
- Git and GitHub access
- Supabase account (whpdxibnajuvikbspzjg)
- Vercel account
- GitHub token (already have this)

## Step 1: Backend Database Seeding

### 1.1 Clone and Setup Backend

```bash
cd ~/your-workspace
git clone https://github.com/Tarrah4Tammwe/LifTee-Backend.git
cd LifTee-Backend
```

### 1.2 Install Dependencies

```bash
npm install
```

### 1.3 Create Environment File

Get your Service Role Key from: https://app.supabase.com/project/whpdxibnajuvikbspzjg/settings/api

```bash
cat > .env << 'EOF'
SUPABASE_URL=https://whpdxibnajuvikbspzjg.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
STRIPE_SECRET_KEY=sk_test_xxxxx
JWT_SECRET=your-jwt-secret-key
ALLOWED_ORIGINS=https://liftee-XXXXX.vercel.app,http://localhost:3000
