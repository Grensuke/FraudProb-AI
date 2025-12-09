# Veritas - Complete Setup & Deployment Guide

## ✅ Project Initialization Complete!

Your Veritas AI scam detection system is now fully implemented with all 4 pages and complete backend functionality.

---

## 🚀 Getting Started (Step-by-Step)

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Configure Environment

**Create `.env` in backend directory:**
```bash
cd backend
cp .env.example .env
```

**Edit `backend/.env` and update:**
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/veritas
ADMIN_KEY=my-super-secret-admin-key-12345
NODE_ENV=development
```

> ⚠️ **Important**: Change `ADMIN_KEY` to a strong random string for production!

### Step 3: Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Make sure MongoDB is installed and running
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get connection string
5. Update `MONGODB_URI` in `.env`

### Step 4: Start the Backend

```bash
cd backend
npm run dev
```

Expected output:
```
✅ Connected to MongoDB
🚀 Veritas API running on http://localhost:3000
📊 Admin key required: Set
```

### Step 5: Start the Frontend (New Terminal)

```bash
cd frontend
npm install
npm run dev
```

Expected output:
```
  VITE v7.2.4  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Step 6: Open in Browser

```
http://localhost:5173
```

You should see the Veritas home page! 🎉

---

## 🧪 Testing the System

### Test Case 1: Analyze a Safe URL
1. Go to Home page
2. Paste: `https://google.com`
3. Click "🔍 Scan Now"
4. Should see: 🟢 Low Risk (Safe)

### Test Case 2: Analyze a Suspicious URL
1. Paste: `https://verify-urgent-click-now.bit.ly/paypal-confirm`
2. Click "Scan Now"
3. Should see: 🔴 High Risk with reasons

### Test Case 3: Report a Scam
1. Go to "Report Scam" page
2. Fill in:
   - URL: `https://example-scam.com`
   - Description: `This is a phishing page`
   - Category: `Phishing`
   - Email: `your-email@example.com`
3. Click "Submit Report"
4. Should see: ✅ Success message

### Test Case 4: Admin Dashboard
1. Go to "Admin" page
2. Password: `my-super-secret-admin-key-12345` (from .env)
3. Click "🔓 Login"
4. Should see:
   - Statistics (total scans, reports, etc.)
   - Reported links table
   - Scam database management

---

## 📁 What Was Created

### Backend Files
- ✅ `server.js` - Complete Express API with ML model
  - Mongoose schemas (Reports, ScamDatabase, ScanLogs)
  - URL feature extraction (6+ features)
  - Risk scoring algorithm (0-100%)
  - Database lookup
  - All API endpoints
  
- ✅ `package.json` - Dependencies updated with cors

- ✅ `.env.example` - Environment template

### Frontend Files
- ✅ `src/pages/Home.jsx` - Main scanner page
- ✅ `src/pages/Report.jsx` - Report submission page
- ✅ `src/pages/Admin.jsx` - Admin dashboard
- ✅ `src/pages/About.jsx` - About & disclaimer
- ✅ `src/components/Navigation.jsx` - Top navigation bar
- ✅ `src/components/Navigation.css` - Nav styling
- ✅ `src/components/Footer.jsx` - Footer with modal
- ✅ `src/components/Footer.css` - Footer styling
- ✅ `src/components/ResultCard.jsx` - Result display
- ✅ `src/App.jsx` - Main app with routing
- ✅ `src/App.css` - All component styles
- ✅ `src/index.css` - Global styles
- ✅ `frontend/README.md` - Frontend documentation
- ✅ `index.html` - Updated with Veritas branding

### Configuration
- ✅ Updated `frontend/package.json` with react-router-dom
- ✅ Updated main README with complete documentation

---

## 🎨 Design Features Implemented

### Color Scheme
- Primary Blue: `#646cff`
- Secondary Blue: `#2563eb`
- Success Green: `#2ecc71`
- Warning Yellow: `#f39c12`
- Danger Red: `#e74c3c`

### Components
- ✅ Modern navigation with gradient brand
- ✅ Color-coded risk badges (Red/Yellow/Green)
- ✅ Smooth animations and transitions
- ✅ Responsive grid layouts
- ✅ Filter tags and buttons
- ✅ Admin dashboard with tabs
- ✅ Modal windows (About section)
- ✅ Alert notifications
- ✅ Loading spinners

### Responsive Design
- Mobile-first approach
- Tablet optimized
- Desktop optimized
- Touch-friendly buttons

---

## 🔌 API Endpoints Summary

### Public Endpoints

**POST /api/analyze**
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

**POST /api/report**
```bash
curl -X POST http://localhost:3000/api/report \
  -H "Content-Type: application/json" \
  -d '{
    "url":"https://scam.com",
    "message":"Description",
    "userEmail":"user@example.com",
    "category":"phishing"
  }'
```

### Admin Endpoints (Requires `x-admin-key` header)

```bash
# Get statistics
curl http://localhost:3000/api/admin/stats \
  -H "x-admin-key: my-super-secret-admin-key-12345"

# Get all reports
curl http://localhost:3000/api/admin/reports \
  -H "x-admin-key: my-super-secret-admin-key-12345"

# Get scam database
curl http://localhost:3000/api/admin/scams \
  -H "x-admin-key: my-super-secret-admin-key-12345"

# Add scam entry
curl -X POST http://localhost:3000/api/admin/add-scam \
  -H "Content-Type: application/json" \
  -H "x-admin-key: my-super-secret-admin-key-12345" \
  -d '{"url":"https://scam.com","reason":"Phishing","severity":"high"}'

# Delete scam entry
curl -X DELETE http://localhost:3000/api/admin/scams/[ID] \
  -H "x-admin-key: my-super-secret-admin-key-12345"
```

---

## 🚀 Deployment Guide

### Frontend Deployment (Vercel / Netlify)

**Vercel:**
```bash
npm install -g vercel
cd frontend
vercel
```

**Netlify:**
1. Connect GitHub repo to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`

### Backend Deployment (Railway / Heroku)

**Railway:**
1. Connect GitHub repo to Railway
2. Set environment variables in Railway dashboard
3. Redeploy on push

**Heroku:**
```bash
heroku login
heroku create veritas-api
heroku config:set MONGODB_URI=your_atlas_uri
heroku config:set ADMIN_KEY=your_secure_key
git push heroku main
```

### Update Frontend API URL

In `frontend/src/pages/*.jsx`, update:
```javascript
const API_URL = 'https://your-deployed-backend.com/api';
```

---

## 🔐 Security Checklist

- [ ] Change `ADMIN_KEY` to strong random string
- [ ] Use HTTPS in production
- [ ] Set `NODE_ENV=production` in backend
- [ ] Enable CORS for your frontend domain only
- [ ] Use MongoDB Atlas with network access restrictions
- [ ] Rate limit API endpoints
- [ ] Validate all user inputs
- [ ] Use environment variables for secrets
- [ ] Enable database backups
- [ ] Monitor error logs

---

## 🐛 Troubleshooting

### "Cannot find module 'cors'"
```bash
cd backend
npm install cors
```

### "MongoDB connection refused"
```bash
# Check if MongoDB is running
mongod

# Or update MONGODB_URI to MongoDB Atlas
```

### "CORS error in frontend"
- Make sure backend is running on localhost:3000
- Check `index.html` has correct API calls
- Update API_URL in page components

### "Admin key not working"
- Make sure `.env` file exists and has ADMIN_KEY set
- Restart backend server
- Check if password matches exactly (case-sensitive)

---

## 📚 Next Steps

### To Enhance Veritas:

1. **Add more ML features**
   - WHOIS data (domain age)
   - SSL certificate analysis
   - DNS records checking
   - Redirect chain analysis

2. **Improve database**
   - Add CERT-IN/RBI real feeds
   - Implement URL blocking
   - Add threat intelligence APIs

3. **User features**
   - User accounts & login
   - Scan history
   - Bookmarks
   - Email alerts

4. **Admin features**
   - User management
   - Detailed analytics
   - Bulk import/export
   - API key management

5. **Scaling**
   - Add caching (Redis)
   - Implement rate limiting
   - Add job queue (Bull/BullMQ)
   - Database indexing

6. **Extensions**
   - Chrome/Firefox extension
   - Mobile app (React Native)
   - API for third-party integration

---

## 📞 Support

If you encounter issues:

1. Check the logs in both terminal windows
2. Review this guide's troubleshooting section
3. Check MongoDB connection
4. Verify all npm packages are installed
5. Make sure ports 3000 and 5173 are available

---

## 🎉 You're All Set!

Your Veritas scam detection system is ready to protect users from online fraud. 

**Remember:**
- 🔴 Red = High Risk (Likely Scam)
- 🟡 Yellow = Medium Risk (Suspicious)
- 🟢 Green = Low Risk (Safe)

**For serious cases, users should contact:**
- 🚨 Cybercell: 1930
- 🏦 RBI: fraud@rbi.org.in
- 🔐 CERT-IN: www.cert-in.org.in

---

**Built with ❤️ for online safety • Veritas © 2025**
