// Service Worker - Background script
const API_URL = 'http://localhost:3000/api/analyze';

console.log('[Veritas] Service Worker started');

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log('[Veritas] Tab updated:', tab.url, 'status:', changeInfo.status);
  if (changeInfo.status === 'complete' && tab.url && isValidUrl(tab.url)) {
    console.log('[Veritas] Starting scan for:', tab.url);
    scanUrl(tab.url, tabId);
  }
});

// Listen for tab activation
chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log('[Veritas] Tab activated:', activeInfo.tabId);
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab && tab.url && isValidUrl(tab.url)) {
      console.log('[Veritas] Starting scan for activated tab:', tab.url);
      scanUrl(tab.url, activeInfo.tabId);
    }
  });
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[Veritas] Message received:', request.action, 'from:', sender.url);
  if (request.action === 'scanUrl') {
    scanUrl(request.url, sender.tab.id);
  }
  if (request.action === 'getResult') {
    chrome.storage.local.get(['scanResults'], (result) => {
      console.log('[Veritas] Sending result:', result.scanResults);
      sendResponse(result.scanResults || {});
    });
    return true; // Keep channel open for async response
  }
});

async function scanUrl(url, tabId) {
  try {
    // Don't scan extension URLs, chrome URLs, etc.
    if (url.startsWith('chrome://') || url.startsWith('about:') || url.startsWith('extension://')) {
      return;
    }

    console.log('[Veritas] Scanning URL:', url);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: url })
    });

    console.log('[Veritas] API Response Status:', response.status);

    if (!response.ok) throw new Error('API error: ' + response.status);
    const data = await response.json();

    console.log('[Veritas] API Data:', data);

    // Map API response to extension format
    const result = {
      url: url,
      risk: data.riskScore || 0,
      verdict: data.verdict === 'low' ? 'Low Risk' : data.verdict === 'medium' ? 'Medium Risk' : 'High Risk',
      verdictEmoji: data.verdictEmoji || '?',
      confidence: 'High',
      analysis: {
        features: data.features || {},
        explanations: data.explanations || [],
        databaseMatch: data.databaseMatch
      },
      timestamp: new Date().toISOString()
    };

    console.log('[Veritas] Result stored:', result);

    chrome.storage.local.set({ scanResults: result });

    // Update icon badge based on risk level
    updateBadge(result.verdict, tabId);

  } catch (error) {
    console.error('[Veritas] Scan error:', error);
    chrome.storage.local.set({
      scanResults: {
        url: url,
        error: 'Scan failed: ' + error.message,
        timestamp: new Date().toISOString()
      }
    });
  }
}

function updateBadge(verdict, tabId) {
  let badgeText = '';
  let badgeColor = '';

  if (verdict === 'High Risk') {
    badgeText = '⚠️';
    badgeColor = '#e74c3c';
  } else if (verdict === 'Medium Risk') {
    badgeText = '?';
    badgeColor = '#f39c12';
  } else {
    badgeText = '✓';
    badgeColor = '#2ecc71';
  }

  chrome.action.setBadgeText({ text: badgeText, tabId: tabId });
  chrome.action.setBadgeBackgroundColor({ color: badgeColor, tabId: tabId });
}

function isValidUrl(url) {
  try {
    const urlObj = new URL(url);
    // Skip certain protocols
    return !['chrome', 'about', 'extension', 'data', 'blob'].includes(urlObj.protocol.split(':')[0]);
  } catch {
    return false;
  }
}
