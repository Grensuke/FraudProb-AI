import { useState } from 'react';
import ResultCard from '../components/ResultCard';

const API_URL = 'https://veritas-lsb6.onrender.com/api';

export default function Home() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) {
      setError('Please enter a URL or message to analyze');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: input,
          message: input
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze URL');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'An error occurred. Make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const exampleUrls = [
    'https://secure-paypal-login.com/verify',
    'https://amazon.com',
    'https://bit.ly/abc123'
  ];

  const handleExample = (url) => {
    setInput(url);
  };

  return (
    <div className="container-md">
      <div className="hero">
        <div className="hero-logo-box">🛡️</div>
        <h1>Veritas</h1>
        <p>AI-Powered Scam & Fraud Link Detection</p>
        <p style={{ fontSize: '0.95rem', color: '#777', marginTop: '0.5rem' }}>
          Paste any link or message to check if it's a scam. Get instant, transparent results.
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleAnalyze}>
          <div className="form-group">
            <label htmlFor="urlInput">Enter URL or Message:</label>
            <textarea
              id="urlInput"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste a suspicious URL or message here... e.g., https://example.com or 'Click here to verify your account'"
              style={{ minHeight: '100px' }}
            />
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></span>
                  Analyzing...
                </>
              ) : (
                '🔍 Scan Now'
              )}
            </button>
            <button 
              type="button" 
              className="secondary"
              onClick={() => { setInput(''); setResult(null); setError(''); }}
            >
              Clear
            </button>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <p style={{ fontSize: '0.85rem', color: '#999', marginBottom: '0.75rem' }}>Try these examples:</p>
            <div className="filter-tags">
              {exampleUrls.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="filter-tag"
                  onClick={() => handleExample(url)}
                  title="Click to load example"
                >
                  {url.substring(0, 25)}...
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p style={{ marginTop: '1rem', color: '#666' }}>Analyzing your input...</p>
        </div>
      )}

      {result && <ResultCard result={result} />}

      <div className="section">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>How Veritas Works</h2>
        <div className="grid-how-it-works">
          <div className="card">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>1️⃣</div>
            <h3>Paste Your Link</h3>
            <p>Simply paste any URL or suspicious message into the input box above.</p>
          </div>
          <div className="card">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>2️⃣</div>
            <h3>AI Analysis</h3>
            <p>Our machine learning model analyzes 6+ security features in seconds.</p>
          </div>
          <div className="card card-center">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>3️⃣</div>
            <h3>Get Verdict</h3>
            <p>Receive a risk score (0-100%) with clear explanations of any threats.</p>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(100, 108, 255, 0.08), rgba(37, 99, 235, 0.08))' }}>
          <h3>⚡ What We Check</h3>
          <div className="grid grid-2" style={{ marginTop: '1rem' }}>
            <div>
              <h4 style={{ color: '#646cff', marginBottom: '0.5rem' }}>Security Features</h4>
              <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
                <li>HTTPS/SSL encryption</li>
                <li>Domain age & reputation</li>
                <li>IP address patterns</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#646cff', marginBottom: '0.5rem' }}>Pattern Detection</h4>
              <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
                <li>Suspicious keywords</li>
                <li>URL shorteners</li>
                <li>Homograph attacks</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#646cff', marginBottom: '0.5rem' }}>Database Lookup</h4>
              <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
                <li>Known scam URLs</li>
                <li>CERT-IN advisories</li>
                <li>RBI fraud alerts</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: '#646cff', marginBottom: '0.5rem' }}>Community Data</h4>
              <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
                <li>User reports</li>
                <li>Verified scams</li>
                <li>Trend analysis</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="alert alert-warning">
          <h4 style={{ marginTop: 0 }}>⚠️ Important Disclaimer</h4>
          <p>Veritas is <strong>not 100% accurate</strong>. Our AI-powered analysis estimates scam risk based on patterns and features, but false positives and false negatives can occur.</p>
          <p><strong>For serious cases:</strong> Report to <strong>Cybercell (1930)</strong>, <strong>RBI</strong>, or <strong>CERT-IN</strong> for official investigation.</p>
        </div>
      </div>
    </div>
  );
}
