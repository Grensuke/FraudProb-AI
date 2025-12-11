export default function ResultCard({ result }) {
  if (!result) return null;

  const verdictColors = {
    high: '#e74c3c',
    medium: '#f39c12',
    low: '#2ecc71'
  };

  return (
    <div className="result-card">
      <div className="risk-score-display">
        <div className="risk-score">
          <span className="risk-emoji">{result.verdictEmoji}</span>
          <div>
            <div style={{ fontSize: '0.6em' }}>Risk Score</div>
            <span>{result.riskScore}%</span>
          </div>
        </div>
        <div 
          className="risk-verdict" 
          style={{ color: verdictColors[result.verdict] }}
        >
          {result.verdict === 'high' && '🔴 HIGH RISK - Likely Scam'}
          {result.verdict === 'medium' && '🟡 MEDIUM RISK - Suspicious Patterns'}
          {result.verdict === 'low' && '🟢 LOW RISK - Appears Safe'}
        </div>
      </div>

      {result.databaseMatch && (
        <div className="alert alert-error">
          <strong>⚠️ Found in Scam Database!</strong>
          <p>Reason: {result.databaseMatch.reason}</p>
          <p>Category: {result.databaseMatch.category}</p>
          <p>Severity: {result.databaseMatch.severity}</p>
        </div>
      )}

      {result.threatAnalysis && (
        <div className="threat-analysis-section">
          <h4>🎯 Threat Analysis Summary</h4>
          <div className="threat-grid">
            {result.threatAnalysis.hasPhishingIndicators && (
              <div className="threat-item threat-critical">
                <span className="threat-label">🎣 Phishing:</span>
                <span>Lookalike patterns detected</span>
              </div>
            )}
            {result.features && result.features.isLookalikeDetected && (
              <div className="threat-item threat-critical" style={{ backgroundColor: '#c0392b', borderLeft: '4px solid #8b0000' }}>
                <span className="threat-label">🚨 LOOKALIKE DOMAIN:</span>
                <span>Impersonating {result.features.lookalikeBrand} ({Math.round(result.features.lookalikeSimilarity * 100)}% match)</span>
              </div>
            )}
            {result.features && result.features.hasConfusableChars && (
              <div className="threat-item threat-critical">
                <span className="threat-label">🔤 Homograph:</span>
                <span>Confusable characters detected</span>
              </div>
            )}
            {result.threatAnalysis.isRecentlyRegistered && (
              <div className="threat-item threat-critical">
                <span className="threat-label">📅 Domain Age:</span>
                <span>Recently registered</span>
              </div>
            )}
            {result.threatAnalysis.hasSuspiciousParams && (
              <div className="threat-item threat-high">
                <span className="threat-label">⚡ URL Params:</span>
                <span>Suspicious parameters</span>
              </div>
            )}
            {result.threatAnalysis.hasSuspiciousSubdomain && (
              <div className="threat-item threat-high">
                <span className="threat-label">📧 Subdomain:</span>
                <span>Suspicious subdomain</span>
              </div>
            )}
            {result.threatAnalysis.hasRedirectChain && (
              <div className="threat-item threat-high">
                <span className="threat-label">🔄 Redirects:</span>
                <span>Multiple redirects detected</span>
              </div>
            )}
            {result.threatAnalysis.isInternationalThreat && (
              <div className="threat-item threat-critical">
                <span className="threat-label">🌍 Threat DB:</span>
                <span>International threat match</span>
              </div>
            )}
            {result.threatAnalysis.hasUrgencyTactics && (
              <div className="threat-item threat-medium">
                <span className="threat-label">⏰ Urgency:</span>
                <span>Time-pressure tactics</span>
              </div>
            )}
            {result.threatAnalysis.hasFinancialLures && (
              <div className="threat-item threat-medium">
                <span className="threat-label">💰 Financial:</span>
                <span>Money/payment targeted</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="explanations">
        <strong>Analysis Details:</strong>
        {result.explanations && result.explanations.length > 0 ? (
          result.explanations.map((explanation, idx) => (
            <div key={idx} className="explanation-item">
              {explanation}
            </div>
          ))
        ) : (
          <div className="explanation-item">No specific risk factors detected</div>
        )}
      </div>

      {result.features && (
        <div className="features-section">
          <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>🔍 Technical Analysis & Lookalike Detection</h4>
          <div className="features-grid">
            {result.features.isLookalikeDetected && (
              <div className="feature-item" style={{ backgroundColor: '#ffe6e6', borderLeft: '4px solid #c0392b' }}>
                <span className="feature-label">🚨 LOOKALIKE DOMAIN:</span>
                <span style={{ color: '#c0392b', fontWeight: 'bold' }}>
                  Imitating {result.features.lookalikeBrand} ({Math.round(result.features.lookalikeSimilarity * 100)}% match)
                </span>
              </div>
            )}
            {result.features.hasConfusableChars && (
              <div className="feature-item" style={{ backgroundColor: '#ffe6e6', borderLeft: '4px solid #c0392b' }}>
                <span className="feature-label">🔤 Confusable Chars:</span>
                <span style={{ color: '#c0392b' }}>✗ Homograph characters detected</span>
              </div>
            )}
            <div className="feature-item">
              <span className="feature-label">HTTPS Enabled:</span>
              <span className={result.features.hasHTTPS ? 'feature-yes' : 'feature-no'}>
                {result.features.hasHTTPS ? '✓ Yes' : '✗ No'}
              </span>
            </div>
            <div className="feature-item">
              <span className="feature-label">Phishing Patterns:</span>
              <span>{result.features.phishingPatterns} detected</span>
            </div>
            <div className="feature-item">
              <span className="feature-label">Homograph Attack:</span>
              <span className={result.features.isHomograph ? 'feature-no' : 'feature-yes'}>
                {result.features.isHomograph ? '✗ Detected' : '✓ None'}
              </span>
            </div>
            <div className="feature-item">
              <span className="feature-label">URL Shortener:</span>
              <span className={result.features.hasRedirect ? 'feature-no' : 'feature-yes'}>
                {result.features.hasRedirect ? '✗ Detected' : '✓ None'}
              </span>
            </div>
            <div className="feature-item">
              <span className="feature-label">IP Address:</span>
              <span className={result.features.isIPAddress ? 'feature-no' : 'feature-yes'}>
                {result.features.isIPAddress ? '✗ IP Used' : '✓ Domain'}
              </span>
            </div>
            <div className="feature-item">
              <span className="feature-label">Recently Registered:</span>
              <span className={result.features.isRecentlyRegisteredIndicator ? 'feature-no' : 'feature-yes'}>
                {result.features.isRecentlyRegisteredIndicator ? '⚠️ Detected' : '✓ Normal'}
              </span>
            </div>
            <div className="feature-item">
              <span className="feature-label">Suspicious Subdomains:</span>
              <span className={result.features.hasSuspiciousSubdomain ? 'feature-no' : 'feature-yes'}>
                {result.features.hasSuspiciousSubdomain ? '⚠️ Detected' : '✓ None'}
              </span>
            </div>
            <div className="feature-item">
              <span className="feature-label">Redirect Chains:</span>
              <span className={result.features.hasRedirectChain ? 'feature-no' : 'feature-yes'}>
                {result.features.hasRedirectChain ? '⚠️ Detected' : '✓ None'}
              </span>
            </div>
            <div className="feature-item">
              <span className="feature-label">Suspicious Parameters:</span>
              <span className={result.features.hasSuspiciousParams ? 'feature-no' : 'feature-yes'}>
                {result.features.hasSuspiciousParams ? '⚠️ Detected' : '✓ None'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
