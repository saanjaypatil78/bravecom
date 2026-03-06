# Free Daily Sync Setup

## Option 1: GitHub Actions (Recommended - Free Forever)

The workflow is already set up at `.github/workflows/daily-sync.yml`

1. Push your code to GitHub
2. Go to your repo → Actions tab
3. The workflow runs automatically daily at 6:00 AM UTC
4. You can also trigger manually from Actions → "Daily Product Sync" → "Run workflow"

## Option 2: cron-job.org (Free Alternative)

1. Go to https://cron-job.org
2. Create free account
3. Create new job:
   - URL: `https://your-app.vercel.app/api/sync-products`
   - Schedule: Daily at your preferred time
4. Note: You'll need to create an API endpoint for this

## Option 3: Vercel Cron Jobs (Free)

1. Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/sync-products",
      "schedule": "0 6 * * *"
    }
  ]
}
```

2. Deploy to Vercel - automatically runs daily

---

## How It Works

1. **Add products to `data/products.json`**
   - Or let `auto_research_engine.js` find trending products

2. **Daily sync runs automatically**:
   - Reads products from `data/products.json`
   - Syncs to `app/api/mall/products/route.ts`
   - Commits changes automatically (GitHub Actions)

3. **Next build/deploy** includes updated products

## Manual Sync (if needed)

```bash
cd sunray_system
node scripts/sync-products.js
```
