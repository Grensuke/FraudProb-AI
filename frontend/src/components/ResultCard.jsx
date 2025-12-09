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
          <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Technical Analysis</h4>
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-label">HTTPS Enabled:</span>
              <span className={result.features.hasHTTPS ? 'feature-yes' : 'feature-no'}>
                {result.features.hasHTTPS ? '✓ Yes' : '✗ No'}
              </span>
            </div>
            <div className="feature-item">
              <span className="feature-label">URL Length:</span>
              <span>{result.features.urlLength} chars</span>
            </div>
            <div className="feature-item">
              <span className="feature-label">Suspicious Keywords:</span>
              <span>{result.features.keywordMatches}</span>
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
          </div>
        </div>
      )}
    </div>
  );
}
