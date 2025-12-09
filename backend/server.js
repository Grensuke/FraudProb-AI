const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// ============================================
// DATABASE MODELS
// ============================================

// Report Schema
const reportSchema = new mongoose.Schema({
  url: { type: String, required: true },
  message: String,
  userEmail: { type: String, required: true },
  reportedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  category: { type: String, enum: ['phishing', 'malware', 'fake-bank', 'job-scam', 'payment-fraud', 'other'], default: 'other' }
});

// Scam Database Schema
const scamSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  domain: String,
  category: String,
  severity: { type: String, enum: ['critical', 'high', 'medium'], default: 'high' },
  reason: String,
  addedDate: { type: Date, default: Date.now },
  source: { type: String, default: 'community' } // community, cert-in, rbi
});

// Scan Log Schema (for analytics)
const scanLogSchema = new mongoose.Schema({
  url: String,
  riskScore: Number,
  verdict: String,
  timestamp: { type: Date, default: Date.now }
});

const Report = mongoose.model('Report', reportSchema);
const ScamDatabase = mongoose.model('ScamDatabase', scamSchema);
const ScanLog = mongoose.model('ScanLog', scanLogSchema);

// ============================================
// ML MODEL - URL FEATURE EXTRACTION
// ============================================

function extractURLFeatures(url) {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    const pathname = urlObj.pathname;
    
    // Feature 1: URL Length (shorter = suspicious in some cases, very long = suspicious)
    const urlLength = url.length;
    const lengthScore = (urlLength < 12 || urlLength > 100) ? 0.15 : 0;

    // Feature 2: HTTPS presence
    const hasHTTPS = url.startsWith('https');
    const httpsScore = !hasHTTPS ? 0.2 : 0;

    // Feature 3: Suspicious keywords
    const suspiciousKeywords = ['verify', 'confirm', 'urgent', 'update', 'click', 'act-now', 'limited-time', 'free', 'claim', 'validate', 'authenticate'];
    const keywordMatch = suspiciousKeywords.filter(kw => url.toLowerCase().includes(kw)).length;
    const keywordScore = Math.min(keywordMatch * 0.12, 0.5);

    // Feature 4: Special characters & obfuscation
    const specialCharCount = (url.match(/[!@#$%^&*()-_=+\[\]{};:'",.<>?\/\\]/g) || []).length;
    const specialCharScore = Math.min(specialCharCount * 0.05, 0.3);

    // Feature 5: Homograph attack detection (xn-- = unicode/IDN domains)
    const isHomograph = domain.includes('xn--');
    const homographScore = isHomograph ? 0.25 : 0;

    // Feature 6: Multiple redirects or suspicious redirects
    const hasRedirect = url.includes('bit.ly') || url.includes('tinyurl') || url.includes('short.url');
    const redirectScore = hasRedirect ? 0.15 : 0;

    // Feature 7: Numeric IP instead of domain name
    const isIPAddress = /^\d+\.\d+\.\d+\.\d+/.test(domain);
    const ipScore = isIPAddress ? 0.3 : 0;

    // Feature 8: Domain age simulation (in real scenario, check WHOIS data)
    const newDomainScore = domain.split('.').some(part => part.length < 3) ? 0.1 : 0;

    // Aggregate features
    const baseScore = lengthScore + httpsScore + keywordScore + specialCharScore + 
                      homographScore + redirectScore + ipScore + newDomainScore;

    return {
      urlLength,
      hasHTTPS,
      keywordMatches: keywordMatch,
      specialCharCount,
      isHomograph,
      hasRedirect,
      isIPAddress,
      baseScore: Math.min(baseScore, 1)
    };
  } catch (error) {
    return { error: 'Invalid URL format', baseScore: 0.3 };
  }
}

// ============================================
// RISK SCORING ALGORITHM
// ============================================

async function calculateRiskScore(url) {
  try {
    // Check if URL exists in scam database
    const scamMatch = await ScamDatabase.findOne({ url: url });
    
    if (scamMatch) {
      return {
        riskScore: 95,
        verdict: 'high',
        verdictEmoji: '🔴',
        explanations: [`Known scam in database: ${scamMatch.reason}`],
        databaseMatch: scamMatch
      };
    }

    // Extract features and get ML score
    const features = extractURLFeatures(url);
    
    if (features.error) {
      return {
        riskScore: 30,
        verdict: 'low',
        verdictEmoji: '🟢',
        explanations: ['Invalid URL format']
      };
    }

    // Simple logistic regression-style scoring
    let mlScore = features.baseScore;
    
    // Domain-level checks
    try {
      const domainParts = new URL(url).hostname.split('.');
      if (domainParts.length > 4) mlScore += 0.1; // Subdomain chains
    } catch (e) {}

    mlScore = Math.min(mlScore, 1);

    // Convert to 0-100 scale
    const riskScore = Math.round(mlScore * 100);

    // Determine verdict
    let verdict = 'low';
    let verdictEmoji = '🟢';
    
    if (riskScore >= 70) {
      verdict = 'high';
      verdictEmoji = '🔴';
    } else if (riskScore >= 40) {
      verdict = 'medium';
      verdictEmoji = '🟡';
    }

    // Build explanations
    const explanations = [];
    if (!features.hasHTTPS) explanations.push('Missing HTTPS security');
    if (features.keywordMatches > 0) explanations.push(`Contains ${features.keywordMatches} suspicious keyword(s): ${features.keywordMatches > 0 ? '"' + ['verify', 'confirm', 'urgent', 'click'].filter(k => url.toLowerCase().includes(k)).join('", "') + '"' : ''}`);
    if (features.isHomograph) explanations.push('Potential homograph attack detected');
    if (features.hasRedirect) explanations.push('Uses URL shortener service');
    if (features.isIPAddress) explanations.push('Uses IP address instead of domain');
    if (features.urlLength > 100) explanations.push('Unusually long URL');
    if (explanations.length === 0) explanations.push('URL appears safe based on analysis');

    return {
      riskScore,
      verdict,
      verdictEmoji,
      explanations,
      databaseMatch: null,
      features
    };
  } catch (error) {
    console.error('Error calculating risk:', error);
    return {
      riskScore: 50,
      verdict: 'medium',
      verdictEmoji: '🟡',
      explanations: ['Analysis encountered an issue, please try again']
    };
  }
}

// ============================================
// API ROUTES
// ============================================

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Veritas API - Scam Detection System', version: '1.0' });
});

// Main analysis endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { url, message } = req.body;
    
    if (!url && !message) {
      return res.status(400).json({ error: 'URL or message required' });
    }

    const textToAnalyze = url || message;
    const result = await calculateRiskScore(textToAnalyze);

    // Log the scan
    await ScanLog.create({
      url: textToAnalyze,
      riskScore: result.riskScore,
      verdict: result.verdict
    });

    res.json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Report endpoint
app.post('/api/report', async (req, res) => {
  try {
    const { url, message, userEmail, category } = req.body;

    if (!url || !userEmail) {
      return res.status(400).json({ error: 'URL and email required' });
    }

    const report = await Report.create({
      url,
      message,
      userEmail,
      category: category || 'other'
    });

    res.status(201).json({ message: 'Report submitted successfully', reportId: report._id });
  } catch (error) {
    console.error('Report error:', error);
    res.status(500).json({ error: 'Failed to submit report' });
  }
});

// Admin: Get all reports
app.get('/api/admin/reports', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const reports = await Report.find().sort({ reportedAt: -1 }).limit(100);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Admin: Verify and add report to scam database
app.post('/api/admin/add-scam', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { url, reason, category, severity } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL required' });
    }

    try {
      const domain = new URL(url).hostname;
      const scam = await ScamDatabase.create({
        url,
        domain,
        reason: reason || 'Added by admin',
        category: category || 'other',
        severity: severity || 'high',
        source: 'admin'
      });

      // Update report status if it exists
      await Report.updateMany({ url }, { status: 'verified' });

      res.status(201).json({ message: 'Scam entry added', scamId: scam._id });
    } catch (e) {
      if (e.code === 11000) {
        return res.status(400).json({ error: 'URL already in database' });
      }
      throw e;
    }
  } catch (error) {
    console.error('Admin error:', error);
    res.status(500).json({ error: 'Failed to add scam entry' });
  }
});

// Admin: Get scam database
app.get('/api/admin/scams', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const scams = await ScamDatabase.find().sort({ addedDate: -1 }).limit(200);
    res.json(scams);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch scam database' });
  }
});

// Admin: Delete scam entry
app.delete('/api/admin/scams/:id', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await ScamDatabase.findByIdAndDelete(req.params.id);
    res.json({ message: 'Scam entry deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete entry' });
  }
});

// Admin: Get scan statistics
app.get('/api/admin/stats', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const totalScans = await ScanLog.countDocuments();
    const totalReports = await Report.countDocuments();
    const totalScams = await ScamDatabase.countDocuments();
    const highRiskScans = await ScanLog.countDocuments({ verdict: 'high' });

    res.json({
      totalScans,
      totalReports,
      totalScams,
      highRiskScans,
      recentScans: await ScanLog.find().sort({ timestamp: -1 }).limit(10)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ============================================
// DATABASE CONNECTION & SERVER START
// ============================================

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/veritas')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`🚀 Veritas API running on http://localhost:${PORT}`);
  console.log(`📊 Admin key required: ${process.env.ADMIN_KEY ? 'Set' : 'Not set'}`);
});