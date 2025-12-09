// Content script - Runs on every page
console.log('Veritas - Scam Detection Extension loaded');

// Listen for messages from background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'injectSidebar') {
    injectSidebar(request.result);
  }
});

// Inject sidebar on page load
window.addEventListener('load', () => {
  injectSidebar();
});

function injectSidebar(result = null) {
  // Check if sidebar already exists
  if (document.getElementById('veritas-sidebar')) {
    return;
  }

  // Create sidebar container
  const sidebar = document.createElement('div');
  sidebar.id = 'veritas-sidebar';
  sidebar.innerHTML = `
    <div class="veritas-sidebar-container">
      <div class="veritas-sidebar-header">
        <div class="veritas-sidebar-title">
          <span class="veritas-logo">🛡️</span>
          <span>Veritas</span>
        </div>
        <button class="veritas-close-btn">✕</button>
      </div>
      <div class="veritas-sidebar-content">
        <div class="veritas-loading">
          <div class="veritas-spinner"></div>
          <p>Scanning website...</p>
        </div>
        <div class="veritas-result" style="display: none;"></div>
      </div>
    </div>
  `;

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    #veritas-sidebar {
      position: fixed;
      right: 0;
      top: 0;
      width: 360px;
      height: 100vh;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
      border-left: 2px solid #646cff;
      z-index: 999999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      box-shadow: -4px 0 20px rgba(100, 108, 255, 0.2);
      animation: slideInRight 0.3s ease-out;
    }

    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .veritas-sidebar-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      color: #fff;
    }

    .veritas-sidebar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      background: linear-gradient(135deg, #646cff 0%, #2563eb 100%);
    }

    .veritas-sidebar-title {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.25rem;
      font-weight: 700;
    }

    .veritas-logo {
      font-size: 1.75rem;
      display: block;
    }

    .veritas-close-btn {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .veritas-close-btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .veritas-sidebar-content {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
    }

    .veritas-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      min-height: 150px;
      color: #999;
    }

    .veritas-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(100, 108, 255, 0.2);
      border-top: 3px solid #646cff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .veritas-result {
      animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .veritas-verdict {
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .veritas-verdict.safe {
      background: linear-gradient(135deg, rgba(46, 204, 113, 0.1), rgba(46, 204, 113, 0.05));
      border: 1px solid rgba(46, 204, 113, 0.3);
    }

    .veritas-verdict.warning {
      background: linear-gradient(135deg, rgba(243, 156, 18, 0.1), rgba(243, 156, 18, 0.05));
      border: 1px solid rgba(243, 156, 18, 0.3);
    }

    .veritas-verdict.danger {
      background: linear-gradient(135deg, rgba(231, 76, 60, 0.1), rgba(231, 76, 60, 0.05));
      border: 1px solid rgba(231, 76, 60, 0.3);
    }

    .veritas-verdict-icon {
      font-size: 3rem;
      margin-bottom: 0.75rem;
    }

    .veritas-verdict-text {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .veritas-verdict-score {
      font-size: 0.875rem;
      color: #aaa;
    }

    .veritas-verdict.safe .veritas-verdict-text {
      color: #2ecc71;
    }

    .veritas-verdict.warning .veritas-verdict-text {
      color: #f39c12;
    }

    .veritas-verdict.danger .veritas-verdict-text {
      color: #e74c3c;
    }

    .veritas-section {
      margin-bottom: 1.5rem;
    }

    .veritas-section-title {
      font-size: 0.875rem;
      font-weight: 700;
      text-transform: uppercase;
      color: #646cff;
      margin-bottom: 0.75rem;
      letter-spacing: 0.5px;
    }

    .veritas-section-content {
      background: rgba(100, 108, 255, 0.05);
      border-left: 2px solid #646cff;
      padding: 1rem;
      border-radius: 4px;
      font-size: 0.875rem;
      line-height: 1.6;
    }

    .veritas-feature-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .veritas-feature-item:last-child {
      border-bottom: none;
    }

    .veritas-feature-label {
      color: #aaa;
    }

    .veritas-feature-value {
      color: #fff;
      font-weight: 500;
    }

    .veritas-url-display {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(100, 108, 255, 0.2);
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      word-break: break-all;
      font-family: 'Monaco', 'Courier New', monospace;
      font-size: 0.75rem;
      color: #aaa;
    }

    .veritas-error {
      background: linear-gradient(135deg, rgba(231, 76, 60, 0.1), rgba(231, 76, 60, 0.05));
      border: 1px solid rgba(231, 76, 60, 0.3);
      padding: 1rem;
      border-radius: 4px;
      color: #e74c3c;
      text-align: center;
    }

    @media (max-width: 600px) {
      #veritas-sidebar {
        width: 100%;
      }
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(sidebar);

  // Close button
  sidebar.querySelector('.veritas-close-btn').addEventListener('click', () => {
    sidebar.remove();
  });

  // Get current scan result
  chrome.runtime.sendMessage({ action: 'getResult' }, (response) => {
    console.log('[Veritas] Got result from storage:', response);
    if (response && response.url) {
      displayResult(response);
    } else {
      // If no result yet, wait a bit and try again
      setTimeout(() => {
        chrome.runtime.sendMessage({ action: 'getResult' }, (response2) => {
          console.log('[Veritas] Retry - Got result from storage:', response2);
          if (response2 && response2.url) {
            displayResult(response2);
          }
        });
      }, 1000);
    }
  });
}

function displayResult(result) {
  const sidebar = document.getElementById('veritas-sidebar');
  if (!sidebar) {
    console.error('[Veritas] Sidebar not found');
    return;
  }

  console.log('[Veritas] Displaying result:', result);

  const loading = sidebar.querySelector('.veritas-loading');
  const resultDiv = sidebar.querySelector('.veritas-result');

  // Determine verdict class
  let verdictClass = 'safe';
  let verdictIcon = '✓';
  if (result.verdict === 'High Risk') {
    verdictClass = 'danger';
    verdictIcon = '⚠️';
  } else if (result.verdict === 'Medium Risk') {
    verdictClass = 'warning';
    verdictIcon = '⚡';
  }

  let analysisHTML = '';
  if (result.analysis) {
    let explanationsHTML = '';
    if (result.analysis.explanations && result.analysis.explanations.length > 0) {
      explanationsHTML = `
        <div class="veritas-section">
          <div class="veritas-section-title">Analysis Summary</div>
          <div class="veritas-section-content">
            ${result.analysis.explanations
              .map(exp => `<div style="margin-bottom: 0.5rem;">• ${exp}</div>`)
              .join('')}
          </div>
        </div>
      `;
    }

    let featuresHTML = '';
    if (result.analysis.features && Object.keys(result.analysis.features).length > 0) {
      featuresHTML = `
        <div class="veritas-section">
          <div class="veritas-section-title">URL Features</div>
          <div class="veritas-section-content">
            ${Object.entries(result.analysis.features)
              .map(([key, value]) => `
                <div class="veritas-feature-item">
                  <span class="veritas-feature-label">${formatLabel(key)}</span>
                  <span class="veritas-feature-value">${value === true ? '✓' : value === false ? '✕' : value}</span>
                </div>
              `)
              .join('')}
          </div>
        </div>
      `;
    }

    analysisHTML = explanationsHTML + featuresHTML;
  }

  let errorHTML = '';
  if (result.error) {
    errorHTML = `
      <div class="veritas-error">
        <strong>Scan Error:</strong> ${result.error}
      </div>
    `;
  }

  resultDiv.innerHTML = `
    <div class="veritas-url-display">${result.url}</div>
    <div class="veritas-verdict ${verdictClass}">
      <div class="veritas-verdict-icon">${verdictIcon}</div>
      <div class="veritas-verdict-text">${result.verdict || 'Scanning...'}</div>
      <div class="veritas-verdict-score">Risk Score: ${result.risk || 0}%</div>
    </div>
    ${analysisHTML}
    ${errorHTML}
    <div class="veritas-section">
      <div class="veritas-section-title">About Veritas</div>
      <div class="veritas-section-content">
        Veritas uses advanced AI to detect phishing, scams, and malicious websites in real-time. Always verify suspicious sites before entering personal information.
      </div>
    </div>
  `;

  loading.style.display = 'none';
  resultDiv.style.display = 'block';
}

function formatLabel(key) {
  return key
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
