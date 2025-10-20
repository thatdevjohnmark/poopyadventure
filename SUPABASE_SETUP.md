# Supabase Setup Guide for Poop Tracker

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in:
   - **Name**: Poop Tracker
   - **Database Password**: (create a strong password)
   - **Region**: Choose closest to you
5. Wait for project to be created (~2 minutes)

## Step 2: Get Your Credentials

1. In your Supabase project dashboard, click **Settings** (gear icon)
2. Click **API** in the sidebar
3. Copy these values:
   - **Project URL**: `https://rhxuivbxxwaccbaltqbr.supabase.co`
   - **anon/public key**: Copy the `anon public` key

## Step 3: Run Database Setup

1. In Supabase dashboard, click **SQL Editor** in sidebar
2. Click **New query**
3. Copy and paste the entire contents of `supabase-setup.sql`
4. Click **Run** or press `Ctrl+Enter`
5. You should see "Success. No rows returned"

## Step 4: Configure Your App

1. Open `supabase-config.js`
2. Replace `YOUR_SUPABASE_ANON_KEY_HERE` with your actual anon key from Step 2
3. The URL is already set to: `https://rhxuivbxxwaccbaltqbr.supabase.co`

## Step 5: Update HTML Files

Add these script tags to the `<head>` section of your HTML files (before the closing `</head>` tag):

```html
<!-- Supabase Client -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="supabase-config.js"></script>
```

### Files to update:
- ✅ `mobile-index.html`
- ✅ `reports.html`
- ✅ Any other HTML pages

## Step 6: Enable Authentication (Optional)

If you want users to sign in:

1. In Supabase dashboard, click **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates if needed
4. You can also enable **Google**, **GitHub**, etc.

For anonymous usage (current setup):
- The app uses Row Level Security (RLS)
- Each device will have its own data
- No sign-in required

## Step 7: Test the Connection

1. Open your app in a browser
2. Try adding a new poop entry
3. Go to Supabase dashboard → **Table Editor** → `poop_entries`
4. You should see your entry appear!

## Step 8: Migrate Existing Data

If you have data in localStorage:

1. Open browser console (F12)
2. Run: `await PoopDB.syncLocalToSupabase()`
3. Check Supabase table to confirm data was synced

## Database Schema

```
poop_entries
├── id (TEXT, PRIMARY KEY)
├── user_id (UUID, references auth.users)
├── timestamp (TIMESTAMPTZ)
├── duration (INTEGER)
├── bristol (TEXT, 1-7)
├── color (TEXT)
├── volume (TEXT)
├── shape (TEXT, nullable)
├── smell (TEXT, nullable)
├── pain (INTEGER, 0-10)
├── has_blood (BOOLEAN)
├── has_mucus (BOOLEAN)
├── symptoms (JSONB array)
├── notes (TEXT, nullable)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)
```

## Security Features

✅ **Row Level Security (RLS)** enabled
✅ Users can only access their own data
✅ API keys are client-safe (anon key)
✅ Server-side validation on all inputs
✅ Automatic timestamps

## Troubleshooting

### Error: "relation 'poop_entries' does not exist"
- Run the SQL setup script again in Supabase SQL Editor

### Error: "new row violates row-level security policy"
- Make sure RLS policies are created (Step 3)
- Check that authentication is working

### Data not appearing
- Check browser console for errors
- Verify API credentials are correct
- Check Supabase logs: Dashboard → Logs

### Connection refused
- Verify your Supabase project URL
- Check if project is paused (free tier pauses after inactivity)

## Free Tier Limits

Supabase free tier includes:
- ✅ 500MB database
- ✅ Unlimited API requests
- ✅ 50,000 monthly active users
- ✅ 2GB bandwidth
- ⚠️ Pauses after 1 week of inactivity

Perfect for personal use! 🚀

## Backup & Export

To backup your data:

```javascript
// In browser console
const backup = await PoopDB.backupToLocal();
console.log('Backed up ${backup.count} entries');
```

To export as JSON:
1. Go to Supabase → Table Editor → poop_entries
2. Click **Export** → **CSV** or copy table data

## Next Steps

Once Supabase is working:
- [ ] Add user authentication
- [ ] Enable sync across devices
- [ ] Add data sharing features
- [ ] Create backup/restore in Settings page
