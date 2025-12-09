# 🛡️ Veritas - AI-Powered Scam Detection System

Veritas is a lightweight, AI-powered scam detection platform designed to identify suspicious URLs and scam messages in real time. Users can paste any link or message, and the system predicts the probability that it is fraudulent, checks if it exists in a known scam database, and gives a clear, color-coded verdict with detailed explanations.

**Built for hackathons, designed for safety.**

---

## 🎯 What Veritas Does

Veritas combines multiple detection techniques to identify scams:

- **🧠 AI/ML Scoring**: Machine learning models trained on URL patterns
- **🔍 Rule-Based Checks**: HTTPS, domain age, keywords, URL structure, homograph attacks
- **🗄️ Database Lookup**: CERT-IN, RBI, and community-curated scam lists
- **🎨 Color-Coded Verdicts**: 🔴 High Risk | 🟡 Medium Risk | 🟢 Low Risk
- **👥 Community Reports**: User-submitted scam reports help improve detection
- **⚙️ Admin Dashboard**: Manage database, verify reports, view statistics

---

## 📋 Core Features

### 1️⃣ Home + Link Scanner (Main Page)
Everything happens here. Paste a URL or message and get instant analysis with:
- Risk probability score (0-100%)
- Color-coded verdict with emoji
- Detailed explanation of detected risks
- Technical analysis (HTTPS, keywords, domain age, etc.)
- Examples to try

### 2️⃣ Report Link Page
Users can report new scams they discover:
- Simple form (URL, description, email, category)
- Report goes to admin for verification
- Helps grow the scam database

### 3️⃣ Admin Dashboard (Protected)
Only accessible with admin key:
- View pending user reports
- Add verified scams to database
- Delete false entries
- View scan statistics and trends

### 4️⃣ About / Info Page
Information about the project:
- How Veritas works
- Why it's useful
- Important disclaimer (not 100% accurate!)
- Contact and links to official authorities (Cybercell, RBI, CERT-IN)

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ and **npm**
- **MongoDB** running locally or MongoDB Atlas connection string
- Basic understanding of React and Express

### Installation

1. **Clone and install dependencies:**
```bash
cd backend
npm install

cd ../frontend
npm install
```

2. **Set up environment variables:**
```bash
# In backend/ directory, create .env file:
cp .env.example .env

# Edit .env and set:
PORT=3000
MONGODB_URI=mongodb://localhost:27017/veritas
ADMIN_KEY=your-secure-admin-key-here
NODE_ENV=development
```

3. **Start MongoDB** (if running locally):
```bash
mongod
```

4. **Start Backend Server:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:3000
```

5. **Start Frontend** (in another terminal):
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

6. **Access Veritas:**
```
Open http://localhost:5173 in your browser
```

---

## 🏗️ Project Structure

```
FraudProb-AI/
├── backend/
│   ├── server.js              # Express API with ML model
│   ├── package.json
│   ├── .env.example
│   └── node_modules/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx       # Main scanner page
│   │   │   ├── Report.jsx     # User reporting page
│   │   │   ├── Admin.jsx      # Admin dashboard
│   │   │   └── About.jsx      # Info & disclaimer
│   │   ├── components/
│   │   │   ├── Navigation.jsx # Top navigation
│   │   │   ├── Footer.jsx     # Footer with modal
│   │   │   └── ResultCard.jsx # Result display
│   │   ├── App.jsx            # Main app with routing
│   │   ├── App.css            # Component styles
│   │   ├── index.css          # Global styles
│   │   └── main.jsx           # React entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── node_modules/
│
└── README.md
```

---

## 🔌 API Endpoints

### Public Endpoints

**POST /api/analyze**
Analyze a URL for scam risk
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

Response:
```json
{
  "riskScore": 25,
  "verdict": "low",
  "verdictEmoji": "🟢",
  "explanations": ["URL appears safe based on analysis"],
  "databaseMatch": null,
  "features": { ... }
}
```

**POST /api/report**
Submit a scam report
```bash
curl -X POST http://localhost:3000/api/report \
  -H "Content-Type: application/json" \
  -d '{
    "url":"https://scam-site.com",
    "message":"This is definitely a phishing site",
    "userEmail":"user@example.com",
    "category":"phishing"
  }'
```

### Admin Endpoints (Requires x-admin-key header)

**GET /api/admin/reports**
Get all user reports

**GET /api/admin/scams**
Get scam database entries

**POST /api/admin/add-scam**
Add entry to scam database

**DELETE /api/admin/scams/:id**
Remove scam database entry

**GET /api/admin/stats**
Get system statistics

---

## 🎨 Design Features

The UI is inspired by modern SaaS products with:
- **Blue gradient theme**: #646cff → #2563eb
- **Clean cards**: Minimal shadows, rounded corners
- **Color-coded alerts**: Red, yellow, green badges
- **Responsive design**: Works on mobile, tablet, desktop
- **Smooth animations**: Fade-in results, hover effects
- **Accessibility**: Proper contrast, readable fonts

---

## 🔐 Important Disclaimer

⚠️ **Veritas is NOT 100% accurate.** Our system uses AI and pattern analysis to estimate scam risk, but false positives and false negatives can occur.

**For serious cases involving fraud, contact:**
- 🚨 **Cybercell India**: 1930 (toll-free) | cybercrime.gov.in
- 🏦 **RBI Grievance**: rbi.org.in | fraud@rbi.org.in
- 🔐 **CERT-IN**: cert-in.org.in
- 👮 **Local Police**: File report at nearest cybercell

---

## 🛠️ Technology Stack

### Backend
- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **Node.js** - JavaScript runtime
- **CORS** - Cross-origin handling

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool
- **React Router** - Client-side routing
- **CSS3** - Modern styling

### Database
- **MongoDB** - NoSQL database
- Collections: Reports, ScamDatabase, ScanLogs

---

## 🚀 Deployment

### Frontend (Vercel / Netlify)
```bash
cd frontend
npm run build
# Deploy the 'dist' folder
```

### Backend (Heroku / Railway)
```bash
cd backend
# Ensure MongoDB Atlas URI is in .env
git push heroku main
```

---

## 🤝 Contributing

We welcome contributions! Areas to improve:
- Better ML models for scam detection
- More data sources (HTTPS certificate analysis, whois data)
- Rate limiting and API authentication
- Mobile app version
- Browser extension
- Internationalization

---

## 🔒 Security Notes

1. **Change admin key** in production to a strong random string
2. **Use HTTPS** when deploying
3. **Rotate sensitive keys** regularly
4. **Monitor MongoDB** for suspicious access
5. **Rate limit API** to prevent abuse
6. **Validate all inputs** on backend

---

## 📊 Features Roadmap

- [ ] Browser extension
- [ ] Mobile app
- [ ] API rate limiting
- [ ] User authentication
- [ ] Advanced analytics
- [ ] Email notifications
- [ ] Dark mode toggle
- [ ] Multiple language support
- [ ] Whois data integration
- [ ] Machine learning model improvements

---

## 📜 License

MIT License - Feel free to use for learning and hackathons!

---

## 🙏 Credits

Built at **Hackathon 2025** with the goal of making the internet safer for everyone.

**Special thanks to:**
- CERT-IN India
- Reserve Bank of India (RBI)
- India Cybercrime Helpline
- The community for reporting scams

---

## 📞 Support & Contact

- **Email**: support@veritas.dev
- **GitHub**: github.com/veritas
- **Issues**: Open an issue on GitHub
- **Feedback**: We'd love to hear from you!

---

**Stay safe. Verify carefully. Report scams. Build Veritas stronger.** 🛡️
