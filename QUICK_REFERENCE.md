# 🛡️ Veritas - Quick Reference Card

## 🚀 Start Veritas in 2 Minutes

### Terminal 1: Backend
```bash
cd backend
npm install
npm run dev
```
**Output:** `Veritas API running on http://localhost:3000`

### Terminal 2: Frontend
```bash
cd frontend
npm install
npm run dev
```
**Output:** `Local: http://localhost:5173/`

### Open Browser
```
http://localhost:5173 🎉
```

---

## 📍 Pages

| Page | URL | Purpose |
|------|-----|---------|
| 🏠 Home | `/` | Scan URLs for scams (90% of traffic) |
| 🚨 Report | `/report` | Submit scam reports |
| ⚙️ Admin | `/admin` | Manage database (password protected) |
| ℹ️ About | `/about` | Info & disclaimers |

---

## 🧪 Quick Test Cases

**Safe URL:**
- Input: `https://google.com`
- Expected: 🟢 Low Risk

**Suspicious URL:**
- Input: `https://verify-urgent-click-now.bit.ly/paypal`
- Expected: 🔴 High Risk

**Admin Password:** 
```
my-super-secret-admin-key-12345
```
(Change in `backend/.env` before production!)

---

## 🔌 API Examples

**Analyze URL:**
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

**Submit Report:**
```bash
curl -X POST http://localhost:3000/api/report \
  -H "Content-Type: application/json" \
  -d '{
    "url":"https://scam.com",
    "message":"This is a phishing site",
    "userEmail":"user@example.com",
    "category":"phishing"
  }'
```

**Get Admin Stats:**
```bash
curl http://localhost:3000/api/admin/stats \
  -H "x-admin-key: my-super-secret-admin-key-12345"
```

---

## 🎨 Design Colors

```
Primary:       #646cff (Blue)
Secondary:     #2563eb (Dark Blue)
Success:       #2ecc71 (Green)
Warning:       #f39c12 (Yellow)
Danger:        #e74c3c (Red)
Background:    #f5f5f5 (Light Gray)
Dark:          #0a0a0a (Dark)
```

---

## 📂 Key Files

### Backend
- `server.js` - API + ML model (complete)
- `package.json` - Dependencies

### Frontend
- `App.jsx` - Main app with routing
- `pages/Home.jsx` - Scanner
- `pages/Report.jsx` - Reports
- `pages/Admin.jsx` - Admin dashboard
- `pages/About.jsx` - About page
- `App.css` - All styles

---

## ⚙️ Configuration

**Create `backend/.env`:**
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/veritas
ADMIN_KEY=my-super-secret-admin-key-12345
NODE_ENV=development
```

---

## 🔐 Security Checklist

- [ ] Change `ADMIN_KEY` before production
- [ ] Use MongoDB Atlas for production
- [ ] Enable HTTPS
- [ ] Set `NODE_ENV=production`
- [ ] Add rate limiting
- [ ] Validate all inputs

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Cannot connect to MongoDB | Check `mongod` is running or update URI |
| "Cannot find module" | Run `npm install` in that directory |
| Port 3000 in use | `lsof -i :3000` and kill process |
| CORS error | Make sure backend is running on 3000 |
| Admin login fails | Check `.env` ADMIN_KEY matches password |

---

## 📊 ML Features

The system analyzes:
1. ✅ URL Length
2. ✅ HTTPS Status
3. ✅ Suspicious Keywords
4. ✅ Special Characters
5. ✅ Homograph Attacks
6. ✅ URL Shorteners
7. ✅ IP Address Usage
8. ✅ Domain Structure

---

## 🎯 Verdict Rules

```
Risk Score     Verdict    Emoji
0-39%          Low Risk   🟢
40-69%         Medium Risk 🟡
70-100%        High Risk  🔴
DB Match       High Risk  🔴 (95%)
```

---

## 📝 Response Format

```json
{
  "riskScore": 45,
  "verdict": "medium",
  "verdictEmoji": "🟡",
  "explanations": [
    "Missing HTTPS security",
    "Contains suspicious keyword: verify"
  ],
  "databaseMatch": null,
  "features": {
    "urlLength": 67,
    "hasHTTPS": false,
    "keywordMatches": 1,
    "isHomograph": false,
    "hasRedirect": false,
    "isIPAddress": false
  }
}
```

---

## 🚀 Deployment

**Frontend:** Vercel / Netlify (deploy `dist` folder)
**Backend:** Railway / Heroku

Update frontend API URL in components:
```javascript
const API_URL = 'https://your-backend.com/api';
```

---

## 📞 Emergency Contacts

For users who find real scams:
- 🚨 **Cybercell:** 1930 (toll-free)
- 🏦 **RBI:** fraud@rbi.org.in
- 🔐 **CERT-IN:** www.cert-in.org.in
- 👮 **Local Police:** Cybercell

---

## ✨ Features Included

✅ AI-powered scam detection
✅ 4 pages (Home, Report, Admin, About)
✅ Real-time URL analysis
✅ User reporting system
✅ Admin dashboard
✅ Color-coded verdicts
✅ Technical analysis details
✅ Responsive design
✅ Modern UI with animations
✅ Complete documentation

---

## 🎓 Made for Hackathons

This is a production-ready MVP that can:
- Be deployed in minutes
- Handle real users
- Scale with more features
- Impress judges
- Win awards

---

**Ready to save the world from scams? 🛡️**

`npm run dev` and go! 🚀
