export default function About() {
  return (
    <div className="container-md">
      <div className="hero">
        <h1>ℹ️ About Veritas</h1>
        <p>Learn more about our mission and how we protect you</p>
      </div>

      <div className="section">
        <div className="card">
          <h2>🎯 Our Mission</h2>
          <p>
            Veritas is an AI-powered scam detection system designed to identify suspicious URLs and scam messages in real time. We believe that online safety should be simple, fast, and accessible to everyone.
          </p>
          <p>
            Our goal is to provide lightweight, fast, explainable protection for everyday internet users who struggle to identify online scams — such as phishing links, fake bank pages, job scams, payment fraud attempts, and malicious short URLs.
          </p>
        </div>
      </div>

      <div className="section">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>How Veritas Works</h2>
        <div className="grid grid-2">
          <div className="card">
            <h3>🔍 Smart Detection</h3>
            <p>Our machine learning models analyze URL features including:</p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
              <li>HTTPS encryption status</li>
              <li>Domain age and reputation</li>
              <li>Suspicious keywords</li>
              <li>URL length and structure</li>
              <li>Homograph attack patterns</li>
              <li>IP address usage</li>
            </ul>
          </div>

          <div className="card">
            <h3>🔐 Database Lookup</h3>
            <p>We cross-reference against:</p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
              <li>CERT-IN India advisories</li>
              <li>RBI fraud alerts</li>
              <li>Community-reported scams</li>
              <li>Verified malicious URLs</li>
              <li>Phishing databases</li>
              <li>Real-time threat feeds</li>
            </ul>
          </div>

          <div className="card">
            <h3>⚡ Instant Results</h3>
            <p>Get instant feedback with:</p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
              <li>Risk score (0-100%)</li>
              <li>Color-coded verdict</li>
              <li>Detailed explanations</li>
              <li>Technical analysis</li>
              <li>Recommended actions</li>
            </ul>
          </div>

          <div className="card">
            <h3>👥 Community Power</h3>
            <p>We grow with our users:</p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
              <li>User-submitted reports</li>
              <li>Crowd-sourced verification</li>
              <li>Real-time threat sharing</li>
              <li>Pattern analysis</li>
              <li>Continuous improvement</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.08), rgba(230, 124, 115, 0.08))' }}>
          <h2>⚠️ Important Disclaimer</h2>
          <p>
            <strong>Veritas is NOT 100% accurate.</strong> Our system uses artificial intelligence and pattern analysis to estimate scam risk based on features and known threats. However, both false positives (incorrectly flagging safe URLs as dangerous) and false negatives (missing actual scams) can occur.
          </p>

          <p style={{ marginTop: '1rem' }}>
            <strong>Why?</strong> Scammers continuously evolve their techniques, new domains are registered daily, and no system can catch everything. Always use your judgment and verify suspicious claims independently.
          </p>

          <p style={{ marginTop: '1rem' }}>
            <strong>For Serious Cases:</strong> If you encounter financial fraud, data theft, or criminal activity, please report to official authorities:
          </p>

          <div style={{ marginTop: '1rem', padding: '1rem', background: 'white', borderRadius: '8px' }}>
            <p><strong>🚨 India Cybercell:</strong> <a href="tel:1930">1930 (toll-free)</a> | <a href="https://www.cybercrime.gov.in" target="_blank" rel="noopener noreferrer">www.cybercrime.gov.in</a></p>
            <p><strong>🏦 RBI Grievance:</strong> <a href="https://www.rbi.org.in" target="_blank" rel="noopener noreferrer">www.rbi.org.in</a> | Email: <a href="mailto:fraud@rbi.org.in">fraud@rbi.org.in</a></p>
            <p><strong>🔐 CERT-IN:</strong> <a href="https://www.cert-in.org.in" target="_blank" rel="noopener noreferrer">www.cert-in.org.in</a></p>
            <p><strong>👮 Local Police:</strong> File a report at your nearest cybercell / police station</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Core Features</h2>
        <div className="grid grid-3">
          <div className="card">
            <h3>🧠 AI/ML Scoring</h3>
            <p>Lightweight, explainable machine learning models trained on thousands of scam vs legitimate URL patterns. Outputs probability scores in seconds.</p>
          </div>

          <div className="card">
            <h3>📊 Rule-Based Checks</h3>
            <p>Security patterns including HTTPS status, domain age, URL structure, keyword detection, and obfuscation analysis.</p>
          </div>

          <div className="card">
            <h3>🗄️ Database Lookup</h3>
            <p>Fast domain and URL matching against government (CERT-IN, RBI) and community-maintained scam databases.</p>
          </div>

          <div className="card">
            <h3>🎨 Color-Coded Verdicts</h3>
            <p>Simple visual indicators: 🔴 High Risk, 🟡 Medium Risk, 🟢 Low Risk with detailed explanations.</p>
          </div>

          <div className="card">
            <h3>💬 User Reporting</h3>
            <p>Report suspicious links and help us grow our database. Verified reports are added to protect the community.</p>
          </div>

          <div className="card">
            <h3>⚙️ Admin Dashboard</h3>
            <p>Manage reported scams, verify entries, update the database, and view system statistics in real-time.</p>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="card">
          <h2>🔒 Privacy & Security</h2>
          <p>
            Your privacy is our priority. Veritas respects user confidentiality and operates transparently.
          </p>
          <h4 style={{ marginTop: '1.5rem' }}>Data Handling:</h4>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li>URLs are analyzed but <strong>not stored</strong> without explicit consent</li>
            <li>Email addresses are used only for report verification</li>
            <li>Personal data is <strong>never shared</strong> with third parties</li>
            <li>Analytics data is aggregated and anonymized</li>
            <li>No tracking cookies or user profiling</li>
          </ul>
        </div>
      </div>

      <div className="section">
        <div className="card">
          <h2>🤝 Get Involved</h2>
          <p>Help us improve Veritas and protect the community:</p>
          <ul style={{ paddingLeft: '1.5rem', marginTop: '1rem' }}>
            <li><strong>Report Scams:</strong> Use our Report page to submit suspicious URLs</li>
            <li><strong>Give Feedback:</strong> Tell us about false positives or missed detections</li>
            <li><strong>Contribute:</strong> Share your expertise or resources</li>
            <li><strong>Spread the Word:</strong> Help others stay safe online</li>
          </ul>
        </div>
      </div>

      <div className="section">
        <div className="alert alert-info">
          <h3 style={{ marginTop: 0 }}>📞 Contact & Support</h3>
          <p><strong>Email:</strong> <a href="mailto:support@veritas.dev">support@veritas.dev</a></p>
          <p><strong>GitHub:</strong> <a href="https://github.com" target="_blank" rel="noopener noreferrer">github.com/veritas</a></p>
          <p><strong>Report an Issue:</strong> Open an issue on GitHub or email us directly</p>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '2rem 0', borderTop: '1px solid #e0e0e0', marginTop: '3rem' }}>
        <p style={{ color: '#999', fontSize: '0.9rem' }}>
          Built with ❤️ for your safety • Veritas © 2025
        </p>
        <p style={{ color: '#ccc', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          Made at Hackathon 2025
        </p>
      </div>
    </div>
  );
}
