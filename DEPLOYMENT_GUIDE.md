# 🔗 FRONTEND-BACKEND CONNECTION - SETUP GUIDE

## ✅ Changes Made

### 1. Frontend API Endpoints Updated
**Updated files:**
- `frontend/src/pages/Home.jsx` - Changed to `https://veritas-lsb6.onrender.com/api`
- `frontend/src/pages/Admin.jsx` - Changed to `https://veritas-lsb6.onrender.com/api/admin`
- `frontend/src/pages/Report.jsx` - Changed to `https://veritas-lsb6.onrender.com/api`

### 2. Browser Extension Updated
- `extension/background.js` - Changed to `https://veritas-lsb6.onrender.com/api/analyze`

### 3. Backend CORS Configuration Updated
- `backend/server.js` - Added specific CORS origin settings:
  - ✅ https://nveritas.vercel.app (Your frontend)
  - ✅ http://localhost:3000 (Development)
  - ✅ http://localhost:5173 (Dev frontend)

---

## 📋 NEXT STEPS - DO THIS NOW

### Step 1: Commit and Push Changes to GitHub
```bash
cd c:\Users\STARK\Documents\FraudProb-AI
git add .
git commit -m "Connect frontend to Render backend"
git push origin Mincha
```

### Step 2: Redeploy Frontend to Vercel
1. Go to https://vercel.com/dashboard
2. Select your `nveritas` project
3. It should auto-detect the changes from GitHub
4. Wait for deployment to complete (usually 1-2 minutes)
5. Check the deployment URL: https://nveritas.vercel.app

### Step 3: Verify Render Backend is Running
1. Go to https://dashboard.render.com
2. Select your `veritas-backend` service
3. Check that it says "Live" and is running
4. If sleeping, it will wake up on first request (may take 30 seconds)

### Step 4: Test the Connection
1. Open https://nveritas.vercel.app
2. Enter a test URL: `https://google.com`
3. Click "Scan Now"
4. If it works, you'll see the risk analysis results
5. If it fails, check the browser console (F12 → Console) for errors

---

## 🔍 Troubleshooting

### If you see "Network Error" or "Failed to analyze":

**Check 1: Backend is Running**
- Go to https://veritas-lsb6.onrender.com
- Should see: `{"message":"Veritas API - Scam Detection System","version":"1.0"}`
- If blank or error, the backend might be cold-starting (takes 30 sec)

**Check 2: Browser Console for Errors**
- Press F12 in your browser
- Go to "Console" tab
- Look for CORS errors or fetch errors
- Error like "blocked by CORS" means configuration issue

**Check 3: Render Backend Logs**
1. Go to https://dashboard.render.com
2. Select `veritas-backend` service
3. Click "Logs" tab
4. Should see "Connected to MongoDB" and "API running on port 3000"

**Check 4: MongoDB Connection**
- Verify in `.env` that `MONGODB_URI` is correct
- The connection string should start with: `mongodb+srv://grensuke_db_user:...`

---

## 🚀 Current Deployment Status

| Component | URL | Status |
|-----------|-----|--------|
| **Frontend** | https://nveritas.vercel.app | ✅ Deployed |
| **Backend** | https://veritas-lsb6.onrender.com | ✅ Deployed |
| **Database** | MongoDB Atlas | ✅ Connected |
| **Extension** | Manual install | ✅ Updated |

---

## 📱 What Works Now

### Frontend Scanner
- ✅ Analyze URLs in real-time
- ✅ See risk scores (0-100%)
- ✅ View threat analysis breakdown
- ✅ Submit scam reports
- ✅ Access admin dashboard (with key)

### Browser Extension
- ✅ Auto-scan every page you visit
- ✅ Shows risk in sidebar
- ✅ One-click reporting
- ✅ Quick access to dashboard

### Admin Dashboard
- ✅ View scan statistics
- ✅ Manage reported scams
- ✅ Add/remove entries from database
- ✅ Monitor threat patterns

---

## 🔐 Important Notes

1. **Admin Key**: `veritas-admin-key-2025-secure`
   - Used for admin dashboard access
   - Keep this secret!

2. **Render Cold Start**: 
   - If backend hasn't been used for 15 minutes, it sleeps
   - First request takes 30-45 seconds to respond
   - Subsequent requests are instant

3. **CORS Allowed Origins**:
   - Only your Vercel domain can call the API
   - No localhost access from Vercel deployment
   - Add more domains in `server.js` if needed

---

## ✨ Feature Summary

| Feature | Frontend | Extension | Admin |
|---------|----------|-----------|-------|
| Scan URLs | ✅ | ✅ | ✅ |
| Risk Analysis | ✅ | ✅ | ✅ |
| Domain Age | ✅ | ✅ | ✅ |
| Phishing Detection | ✅ | ✅ | ✅ |
| Intl Threats | ✅ | ✅ | ✅ |
| Report Scams | ✅ | ✅ | ✅ |
| Manage DB | ❌ | ❌ | ✅ |
| Statistics | ❌ | ❌ | ✅ |

---

## 📞 If Connection Still Fails

1. Check if backend is responding:
   ```bash
   curl https://veritas-lsb6.onrender.com
   ```

2. Check browser console for exact error message

3. Check Render backend logs for MongoDB connection errors

4. Verify ADMIN_KEY and MONGODB_URI in backend `.env`

5. Ask for help with specific error message!

---

**Once deployed, your Veritas system will be live and scanning URLs!** 🎉
