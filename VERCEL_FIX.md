# Fixing 404 Error on Vercel

## Problem
Getting 404 errors when accessing your site on Vercel.

## Solution

### Option 1: Files are in a subfolder (pumpselector/)
If your files are inside a `pumpselector` folder in your repository:

1. **Move files to root** (Recommended):
   - Move all files from `pumpselector/` to the root of your repository
   - Your structure should be:
     ```
     /
     ├── index.html
     ├── login.html
     ├── selection.html
     ├── assets/
     ├── scripts/
     └── vercel.json
     ```

2. **OR Configure Vercel to use subfolder**:
   - In Vercel dashboard → Project Settings → General
   - Set "Root Directory" to `pumpselector`
   - This tells Vercel where your files are

### Option 2: Verify File Structure
Make sure `index.html` is in the root directory (or the directory you set as root in Vercel).

### Option 3: Check Vercel Deployment Settings

1. Go to Vercel Dashboard
2. Select your project: "Pump-SmartSelector"
3. Go to Settings → General
4. Check:
   - **Root Directory**: Should be empty (for root) or `pumpselector` (if files are in subfolder)
   - **Build Command**: Leave empty (static site)
   - **Output Directory**: Leave empty or set to `.`

### Option 4: Redeploy After Changes

After making changes:
1. Commit and push to GitHub
2. Vercel will auto-deploy
3. Wait for deployment to complete
4. Check the deployment logs for errors

### Quick Test

After deployment, test these URLs:
- `https://pump-smart-selector.vercel.app/` → Should show index.html
- `https://pump-smart-selector.vercel.app/index.html` → Should show index.html
- `https://pump-smart-selector.vercel.app/login.html` → Should show login page

### If Still Getting 404:

1. **Check Vercel Deployment Logs**:
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on the latest deployment
   - Check "Build Logs" for errors

2. **Verify Files Are Deployed**:
   - In Vercel Dashboard → Your Project → Settings → General
   - Check "Source" to see which files Vercel sees

3. **Check File Names**:
   - Make sure `index.html` exists (not `Index.html` or `INDEX.html`)
   - File names are case-sensitive

4. **Clear Cache**:
   - Try accessing in incognito/private mode
   - Or add `?v=1` to URL: `https://pump-smart-selector.vercel.app/?v=1`

### Common Issues:

- **Files in subfolder**: Set Root Directory in Vercel settings
- **Wrong branch**: Make sure you're deploying from the correct branch (usually `main`)
- **Build errors**: Check deployment logs for build failures
- **Missing vercel.json**: The vercel.json file should be in root (or in your root directory setting)

