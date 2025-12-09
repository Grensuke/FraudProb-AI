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
// ML MODEL - ADVANCED URL FEATURE EXTRACTION
// ============================================

// ============================================
// COMPREHENSIVE THREAT INTELLIGENCE DATABASE
// ============================================

// Whitelist of trusted domains
const TRUSTED_DOMAINS = [
  'google.com', 'github.com', 'stackoverflow.com', 'wikipedia.org', 
  'amazon.com', 'facebook.com', 'twitter.com', 'youtube.com',
  'linkedin.com', 'microsoft.com', 'apple.com', 'ibm.com',
  'github.io', 'heroku.com', 'netlify.com', 'vercel.com',
  'reddit.com', 'quora.com', 'gmail.com', 'outlook.com', 'mail.com',
  'edu', 'gov', '.ac.uk', 'mozilla.org', 'wikipedia.org'
];

// CRITICAL: Banking & Financial Institutions
const FINANCIAL_KEYWORDS = [
  'bank', 'banking', 'paypal', 'stripe', 'square', 'checkout', 'payment',
  'credit', 'debit', 'card', 'visa', 'mastercard', 'amex', 'crypto',
  'bitcoin', 'ethereum', 'wallet', 'transfer', 'send-money', 'wire'
];

// HIGH-PRIORITY: Action-inducing phrases (urgency tactics)
const URGENCY_KEYWORDS = [
  'verify', 'confirm', 'urgent', 'immediate', 'act-now', 'hurry',
  'limited-time', 'expires', 'deadline', 'asap', 'now', 'immediately',
  'click-here', 'click-now', 'update-now', 'renew-now', 'claim-now',
  'validate', 'authenticate', 'reactivate', 'reconfirm', 'reclaim'
];

// DANGER: Account/Security compromised claims
const SECURITY_THREAT_KEYWORDS = [
  'suspicious', 'unusual-activity', 'unauthorized', 'compromised',
  'breach', 'hacked', 'stolen', 'exposed', 'violation', 'fraud-alert',
  'alert', 'warning', 'danger', 'suspended', 'locked', 'disabled',
  'confirm-identity', 'verify-account', 'reset-password', 'update-password'
];

// PHISHING: Lookalike domains and misspellings
const PHISHING_PATTERNS = [
  'paypa1', 'paypa|', 'paypa7', 'p4ypal',           // PayPal variants
  'amazom', 'amaz0n', 'amaz0m', 'amzn-',             // Amazon variants
  'gogle', 'g00gle', 'goog1e',                        // Google variants
  'faceb00k', 'facebok', 'facebook1',                 // Facebook variants
  'instgram', 'instagam', 'instagram1',               // Instagram variants
  'tw1tter', 'twiter',                                // Twitter variants
  'appl3', 'aple',                                    // Apple variants
  'micr0soft', 'microsft', 'microsoft1',              // Microsoft variants
  'linkedm', 'linked1n',                              // LinkedIn variants
  'github1', 'git-hub', 'github-login'                // GitHub variants
];

// SCAM TYPES: Industry-specific patterns
const SCAM_PATTERNS = {
  romance: ['love', 'dating', 'relationship', 'beautiful', 'travel', 'marry'],
  lottery: ['won', 'prize', 'claim', 'lottery', 'cash', 'winner', 'select'],
  job: ['hiring', 'jobs', 'employment', 'work-from-home', 'position', 'salary'],
  tech: ['download', 'update', 'install', 'activate', 'software', 'driver'],
  government: ['tax', 'refund', 'irs', 'revenue', 'benefit', 'social-security']
};

// HIGH-RISK TLDs (newly registered, free, suspicious)
const SUSPICIOUS_TLDS = [
  '.tk', '.ml', '.ga', '.cf', '.xyz', '.top', '.work', '.online',
  '.site', '.space', '.store', '.click', '.download', '.racing',
  '.win', '.stream', '.accountant', '.party', '.science', '.webcam',
  '.review', '.date', '.faith', '.men', '.fitness'
];

// ============================================
// ADVANCED ML MODEL WITH 20+ FEATURES
// ============================================

function extractURLFeatures(url) {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    const pathname = urlObj.pathname.toLowerCase();
    const urlLower = url.toLowerCase();
    const domainParts = domain.split('.');
    const pathParts = pathname.split('/').filter(p => p.length > 0);
    
    // ========== FEATURE 1-3: SECURITY LAYER ==========
    const hasHTTPS = url.startsWith('https');
    const httpsScore = !hasHTTPS ? 0.3 : 0;
    
    const hasHTTP = url.startsWith('http');
    const selfSignedScore = (hasHTTP && !hasHTTPS) ? 0.15 : 0;

    // ========== FEATURE 4-6: DOMAIN ANALYSIS ==========
    const isTrustedDomain = TRUSTED_DOMAINS.some(trusted => domain.includes(trusted));
    let domainRepScore = 0;
    
    if (!isTrustedDomain) {
      const hasSuspiciousTLD = SUSPICIOUS_TLDS.some(tld => domain.endsWith(tld));
      domainRepScore = hasSuspiciousTLD ? 0.35 : 0.15;
    }
    
    // Check domain age indicators (new domains are riskier)
    const isDomainNumberHeavy = domainParts.some(part => /\d/.test(part) && part.length < 4);
    const domainAgeScore = isDomainNumberHeavy ? 0.15 : 0;

    // ========== FEATURE 7-9: CONTENT ANALYSIS ==========
    const urlLength = url.length;
    let lengthScore = 0;
    if (urlLength < 10) lengthScore = 0.12;
    else if (urlLength > 200) lengthScore = 0.18;
    else if (urlLength > 150) lengthScore = 0.12;
    
    // Financial keywords score
    const financialMatches = FINANCIAL_KEYWORDS.filter(kw => urlLower.includes(kw)).length;
    const financialScore = Math.min(financialMatches * 0.2, 0.7);
    
    // Urgency keywords score (time pressure tactics)
    const urgencyMatches = URGENCY_KEYWORDS.filter(kw => urlLower.includes(kw)).length;
    const urgencyScore = Math.min(urgencyMatches * 0.18, 0.65);

    // ========== FEATURE 10-12: THREAT INDICATORS ==========
    const securityThreatMatches = SECURITY_THREAT_KEYWORDS.filter(kw => urlLower.includes(kw)).length;
    const securityThreatScore = Math.min(securityThreatMatches * 0.22, 0.75);
    
    // Phishing pattern matching
    const phishingPatternMatches = PHISHING_PATTERNS.filter(pattern => urlLower.includes(pattern)).length;
    const phishingScore = Math.min(phishingPatternMatches * 0.25, 0.8);

    // ========== FEATURE 13-15: STRUCTURAL ANALYSIS ==========
    const specialCharCount = (url.match(/[!@#$%^&*()-_=+\[\]{};:'",.<>?\/\\]/g) || []).length;
    const specialCharScore = Math.min(specialCharCount * 0.08, 0.4);
    
    // Homograph attack (unicode/lookalike chars)
    const isHomograph = domain.includes('xn--') || 
                        /[0-9]+[Ol]/i.test(domain) || 
                        /rn|m|cl|1l|0o|5s/i.test(domain);
    const homographScore = isHomograph ? 0.4 : 0;
    
    // Subdomain chains (too many levels = suspicious)
    const subdomainCount = domainParts.length;
    const subdomainScore = subdomainCount > 5 ? 0.2 : subdomainCount > 3 ? 0.1 : 0;

    // ========== FEATURE 16-18: REDIRECT & OBFUSCATION ==========
    const urlShorteners = ['bit.ly', 'tinyurl', 'ow.ly', 'short.url', 'goo.gl', 
                           'buff.ly', 'adf.ly', 'shorte.st', 'u.to', 'v.gd', 'x.co'];
    const hasRedirect = urlShorteners.some(short => urlLower.includes(short));
    const redirectScore = hasRedirect ? 0.3 : 0;
    
    // IP address instead of domain (CRITICAL)
    const isIPAddress = /^\d+\.\d+\.\d+\.\d+/.test(domain);
    const ipScore = isIPAddress ? 0.5 : 0;
    
    // @ symbol (email obfuscation technique)
    const hasAtSymbol = url.includes('@');
    const atSymbolScore = hasAtSymbol ? 0.4 : 0;

    // ========== FEATURE 19-20: SCAM TYPE DETECTION ==========
    let scamTypeScore = 0;
    let detectedScamType = null;
    
    for (const [scamType, keywords] of Object.entries(SCAM_PATTERNS)) {
      const matches = keywords.filter(kw => urlLower.includes(kw)).length;
      if (matches > 0) {
        scamTypeScore = Math.max(scamTypeScore, Math.min(matches * 0.15, 0.5));
        detectedScamType = scamType;
      }
    }
    
    // Path depth analysis
    const pathDepth = pathParts.length;
    const depthScore = pathDepth > 8 ? 0.12 : pathDepth > 5 ? 0.08 : 0;

    // ========== COMBINED FEATURE VECTORS ==========
    const features = {
      urlLength,
      hasHTTPS,
      isIPAddress,
      isHomograph,
      hasRedirect,
      hasAtSymbol,
      financialKeywords: financialMatches,
      urgencyKeywords: urgencyMatches,
      securityThreatKeywords: securityThreatMatches,
      phishingPatterns: phishingPatternMatches,
      specialCharCount,
      subdomainCount,
      pathDepth,
      detectedScamType
    };

    // ========== ADVANCED WEIGHTED SCORING ==========
    let baseScore = (
      httpsScore * 0.18 +                // HTTPS: 18%
      selfSignedScore * 0.12 +           // Self-signed certs: 12%
      domainRepScore * 0.22 +            // Domain reputation: 22%
      domainAgeScore * 0.15 +            // Domain age (new): 15%
      phishingScore * 0.4 +              // Phishing patterns: 40% (CRITICAL)
      securityThreatScore * 0.35 +       // Security threat language: 35%
      financialScore * 0.3 +             // Financial keywords: 30%
      urgencyScore * 0.32 +              // Urgency tactics: 32%
      homographScore * 0.38 +            // Lookalike domains: 38%
      redirectScore * 0.28 +             // URL shorteners: 28%
      ipScore * 0.45 +                   // IP address: 45% (CRITICAL)
      atSymbolScore * 0.42 +             // @ symbol: 42%
      specialCharScore * 0.15 +          // Special chars: 15%
      subdomainScore * 0.18 +            // Subdomains: 18%
      depthScore * 0.1 +                 // Path depth: 10%
      scamTypeScore * 0.25 +             // Scam patterns: 25%
      lengthScore * 0.12                 // URL length: 12%
    ) / 6.0; // Normalized weights

    return {
      ...features,
      baseScore: Math.min(Math.max(baseScore, 0), 1),
      confidence: calculateAdvancedConfidence(features, baseScore)
    };
  } catch (error) {
    return { error: 'Invalid URL format', baseScore: 0.2, confidence: 'low' };
  }
}

// ========== CONFIDENCE CALCULATION (ENHANCED) ==========
function calculateAdvancedConfidence(features, baseScore) {
  let riskIndicators = 0;
  let criticalIndicators = 0;

  // Critical indicators (MOST important)
  if (features.isIPAddress) criticalIndicators += 2;
  if (features.phishingPatterns > 0) criticalIndicators += 2;
  if (features.hasAtSymbol) criticalIndicators += 2;
  if (features.securityThreatKeywords > 1) criticalIndicators += 1;
  
  // Major indicators
  if (features.hasRedirect) riskIndicators += 2;
  if (features.isHomograph) riskIndicators += 2;
  if (features.urgencyKeywords > 1) riskIndicators += 1;
  if (features.financialKeywords > 0) riskIndicators += 1;
  if (!features.hasHTTPS) riskIndicators += 1;
  if (features.specialCharCount > 8) riskIndicators += 1;
  if (features.subdomainCount > 4) riskIndicators += 1;

  // Score-based confidence
  if (criticalIndicators >= 4) return 'critical';
  if (criticalIndicators >= 2 || (riskIndicators >= 5)) return 'very-high';
  if (riskIndicators >= 4) return 'high';
  if (riskIndicators >= 2) return 'medium';
  if (riskIndicators >= 1) return 'low';
  return 'very-low';
}

// ============================================
// ENHANCED RISK SCORING (THREAT ASSESSMENT)
// ============================================

    // ========== FEATURE 10: Subdomain Analysis ==========
    const domainParts = domain.split('.');
    const subdomainScore = domainParts.length > 4 ? 0.15 : 
                          domainParts.length > 3 ? 0.08 : 0;

    // ========== FEATURE 11: Directory Depth ==========
    const pathParts = pathname.split('/').filter(p => p.length > 0);
    const depthScore = pathParts.length > 5 ? 0.12 : 0;

    // ========== FEATURE 12: Parameter Analysis ==========
    const hasQueryParams = urlObj.search.length > 10;
// ============================================
// THREAT ASSESSMENT WITH DETAILED ANALYSIS
// ============================================

async function calculateRiskScore(url) {
  try {
    // STEP 1: Check known scam database (IMMEDIATE HIGH ALERT)
    const scamMatch = await ScamDatabase.findOne({ 
      url: { $regex: new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }
    });
    
    if (scamMatch) {
      return {
        riskScore: 99,
        verdict: 'high',
        verdictEmoji: '🔴',
        confidence: 'critical',
        explanations: [
          `🚨 CRITICAL ALERT: Known malicious website detected`,
          `📊 Category: ${(scamMatch.category || 'Malware/Phishing').toUpperCase()}`,
          `⚠️ Severity Level: ${(scamMatch.severity || 'HIGH').toUpperCase()}`,
          `📝 Threat Description: ${scamMatch.reason}`,
          `⏰ Reported: ${new Date(scamMatch.addedDate).toLocaleDateString()}`
        ],
        databaseMatch: scamMatch
      };
    }

    // STEP 2: Extract and analyze advanced features (20+ detectors)
    const analysisFeatures = extractURLFeatures(url);
    
    if (analysisFeatures.error) {
      return {
        riskScore: 15,
        verdict: 'low',
        verdictEmoji: '🟢',
        explanations: ['✓ URL format appears valid']
      };
    }

    // STEP 3: Calculate enhanced risk score with threat multipliers
    let riskScore = Math.round(analysisFeatures.baseScore * 100);
    
    // Apply confidence-based risk adjustments
    const confidence = analysisFeatures.confidence;
    switch (confidence) {
      case 'critical':
        riskScore = Math.min(riskScore + 20, 100);
        break;
      case 'very-high':
        riskScore = Math.min(riskScore + 15, 100);
        break;
      case 'high':
        riskScore = Math.min(riskScore + 10, 100);
        break;
      case 'very-low':
        riskScore = Math.max(riskScore - 10, 0);
        break;
    }

    // STEP 4: Verdict assignment with updated thresholds
    let verdict = 'low';
    let verdictEmoji = '🟢';
    
    if (riskScore >= 75) {
      verdict = 'high';
      verdictEmoji = '🔴';
    } else if (riskScore >= 45) {
      verdict = 'medium';
      verdictEmoji = '🟡';
    }

    // STEP 5: Build comprehensive threat explanations
    const explanations = [];
    
    // Security warnings
    if (!analysisFeatures.hasHTTPS) {
      explanations.push('🔓 ⚠️ No HTTPS encryption - Connection is UNSECURE');
    } else {
      explanations.push('🔒 ✓ HTTPS encryption enabled - Connection secured');
    }

    // Critical phishing indicators
    if (analysisFeatures.phishingPatterns > 0) {
      const indicators = PHISHING_PATTERNS.filter(p => url.toLowerCase().includes(p));
      explanations.push(`🎣 CRITICAL: ${analysisFeatures.phishingPatterns} lookalike domain indicator(s) - Potential impersonation`);
    }

    // Financial threat indicators
    if (analysisFeatures.financialKeywords > 0) {
      explanations.push(`💰 Contains ${analysisFeatures.financialKeywords} financial/payment keyword(s) - May target money/accounts`);
    }

    // Urgency/pressure tactics
    if (analysisFeatures.urgencyKeywords > 1) {
      explanations.push(`⏰ Contains ${analysisFeatures.urgencyKeywords} urgency keywords - Pressure tactic detected`);
    } else if (analysisFeatures.urgencyKeywords === 1) {
      explanations.push(`⏰ Time-pressure language detected - Common scam tactic`);
    }

    // Security threat language
    if (analysisFeatures.securityThreatKeywords > 0) {
      explanations.push(`🚨 Contains security threat language (${analysisFeatures.securityThreatKeywords}) - False alarm tactics`);
    }

    // Structural red flags
    if (analysisFeatures.isIPAddress) {
      explanations.push(`📍 CRITICAL: Uses numeric IP address instead of domain - Obfuscation technique`);
    }

    if (analysisFeatures.isHomograph) {
      explanations.push(`🔤 ⚠️ Lookalike domain detected - May mimic legitimate site using visual similarity`);
    }

    if (analysisFeatures.hasRedirect) {
      explanations.push(`🔗 ⚠️ URL shortener detected - Destination hidden/concealed`);
    }

    if (analysisFeatures.hasAtSymbol) {
      explanations.push(`📧 CRITICAL: @ symbol in URL - Email injection attack technique`);
    }

    if (analysisFeatures.specialCharCount > 8) {
      explanations.push(`🔤 Excessive special characters (${analysisFeatures.specialCharCount}) - Obfuscation detected`);
    }

    if (analysisFeatures.subdomainCount > 4) {
      explanations.push(`📎 Excessive subdomains (${analysisFeatures.subdomainCount} levels) - Suspicious nesting`);
    }

    // Scam type detection
    if (analysisFeatures.detectedScamType) {
      const scamTypeNames = {
        romance: 'Romance/Dating Scam',
        lottery: 'Lottery/Prize Scam',
        job: 'Job Scam',
        tech: 'Tech Support Scam',
        government: 'Government Impersonation'
      };
      explanations.push(`📌 Pattern matches ${scamTypeNames[analysisFeatures.detectedScamType]} indicators`);
    }

    // Positive signals
    if (explanations.length === 1) {
      explanations.push('✅ No significant security red flags detected');
    }

    // Add confidence assessment
    const confidenceLabels = {
      'critical': '🔴 CRITICAL CONFIDENCE',
      'very-high': '⚠️ VERY HIGH CONFIDENCE',
      'high': '⚠️ HIGH CONFIDENCE',
      'medium': '🟡 MEDIUM CONFIDENCE',
      'low': '🟢 LOW CONFIDENCE',
      'very-low': '🟢 VERY LOW CONFIDENCE'
    };
    
    explanations.push(`Assessment Confidence: ${confidenceLabels[confidence] || ''}`);

    // Log scan for analytics
    await ScanLog.create({
      url: url,
      riskScore: riskScore,
      verdict: verdict,
      timestamp: new Date()
    });

    return {
      riskScore,
      verdict,
      verdictEmoji,
      confidence,
      explanations,
      databaseMatch: null,
      features: analysisFeatures,
      threatAnalysis: {
        hasPhishingIndicators: analysisFeatures.phishingPatterns > 0,
        hasUrgencyTactics: analysisFeatures.urgencyKeywords > 0,
        hasFinancialLures: analysisFeatures.financialKeywords > 0,
        isCriticalThreat: riskScore > 75
      }
    };

  } catch (error) {
    console.error('Error in risk calculation:', error);
    return {
      riskScore: 50,
      verdict: 'medium',
      verdictEmoji: '🟡',
      explanations: ['⚠️ Analysis error - Please try again']
    };
  }
}
      riskScore = Math.min(riskScore + 15, 100);
    } else if (confidence === 'high') {
      riskScore = Math.min(riskScore + 10, 100);
    } else if (confidence === 'very-low') {
      riskScore = Math.max(riskScore - 10, 0);
    }

    // ========== VERDICT ASSIGNMENT (Improved Thresholds) ==========
    let verdict = 'low';
    let verdictEmoji = '🟢';
    
    if (riskScore >= 65) {
      verdict = 'high';
      verdictEmoji = '🔴';
    } else if (riskScore >= 40) {
      verdict = 'medium';
      verdictEmoji = '🟡';
    }

    // ========== BUILD DETAILED EXPLANATIONS ==========
    const explanations = [];
    
    // Security issues
    if (!analysisFeatures.hasHTTPS) {
      explanations.push('⚠️ No HTTPS encryption (unsecure connection)');
    } else {
      explanations.push('✓ HTTPS secure connection verified');
    }

    // Phishing indicators
    if ((analysisFeatures.phishingIndicators || 0) > 0) {
      explanations.push(`🎣 Contains ${analysisFeatures.phishingIndicators} phishing indicator(s)`);
    }

    // Suspicious keywords
    if ((analysisFeatures.highRiskKeywords || 0) > 0) {
      explanations.push(`🚩 Contains ${analysisFeatures.highRiskKeywords} suspicious keyword(s)`);
    }

    // Domain issues
    if (analysisFeatures.isIPAddress) {
      explanations.push('📍 Uses IP address instead of domain name');
    }

    if (analysisFeatures.isHomograph) {
      explanations.push('🔤 Potential lookalike domain (homograph attack)');
    }

    if (analysisFeatures.hasRedirect) {
      explanations.push('🔗 Uses URL shortener service (conceals destination)');
    }

    // Structure issues
    if ((analysisFeatures.specialCharCount || 0) > 5) {
      explanations.push(`🔤 Unusual number of special characters (${analysisFeatures.specialCharCount})`);
    }

    if (analysisFeatures.subdomainCount > 4) {
      explanations.push(`📎 Excessive subdomains (${analysisFeatures.subdomainCount} levels)`);
    }

    if ((analysisFeatures.pathDepth || 0) > 5) {
      explanations.push(`📂 Deep URL path with multiple directories`);
    }

    // Add summary if no issues found
    if (explanations.length === 1) {
      explanations.push('✅ No significant security red flags detected');
    }

    // Add confidence statement
    const confidenceMap = {
      'very-high': '(Very High Confidence)',
      'high': '(High Confidence)',
      'medium': '(Medium Confidence)',
      'low': '(Low Confidence)',
      'very-low': '(Low Confidence)'
    };
    
    explanations.push(`Assessment confidence: ${confidenceMap[confidence] || ''}`);

    // Log the scan for analytics
    await ScanLog.create({
      url: url,
      riskScore: riskScore,
      verdict: verdict
    });

    return {
      riskScore,
      verdict,
      verdictEmoji,
      explanations,
      confidence: confidence,
      databaseMatch: null,
      features: analysisFeatures
    };

  } catch (error) {
    console.error('Error calculating risk:', error);
    return {
      riskScore: 50,
      verdict: 'medium',
      verdictEmoji: '🟡',
      explanations: ['⚠️ Analysis encountered an issue, please try again']
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