import { useState } from 'react';
import './Footer.css';

export default function Footer() {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-section">
              <h4>Veritas</h4>
              <p>AI-powered scam detection system protecting you from online fraud.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/report">Report Scam</a></li>
                <li><a href="/admin">Admin</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Legal</h4>
              <ul>
                <li><button className="link-button" onClick={() => setShowAbout(true)}>About Us</button></li>
                <li><a href="#privacy">Privacy Policy</a></li>
                <li><a href="#disclaimer">Disclaimer</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>Email: <a href="mailto:support@veritas.dev">support@veritas.dev</a></p>
              <p><a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a></p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Veritas. All rights reserved. | Built with ❤️ for your safety</p>
          </div>
        </div>
      </footer>

      {showAbout && (
        <div className="modal-overlay" onClick={() => setShowAbout(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAbout(false)}>&times;</button>
            <h2>About Veritas</h2>
            <div className="modal-body">
              <h3>What is Veritas?</h3>
              <p>Veritas is an AI-powered scam detection system designed to identify suspicious URLs and scam messages in real time. Users can paste any link or message, and our system predicts the probability it is fraudulent, checks against known scam databases, and provides a clear verdict with explanations.</p>

              <h3>Why Trust Veritas?</h3>
              <ul>
                <li><strong>AI-Powered:</strong> Machine learning models trained on thousands of scam vs legitimate URLs</li>
                <li><strong>Multi-Layer Detection:</strong> Combines ML scoring, rule-based checks, and community databases</li>
                <li><strong>Transparent Results:</strong> Each verdict includes detailed explanations of the risks detected</li>
                <li><strong>Community Driven:</strong> User reports help continuously improve our scam database</li>
              </ul>

              <h3>Important Disclaimer</h3>
              <p className="disclaimer">
                ⚠️ <strong>Veritas is not 100% accurate.</strong> Our system uses AI and heuristics to estimate scam risk, but false positives and false negatives can occur. For serious cases involving financial fraud, data theft, or criminal activity, please contact:
              </p>
              <ul>
                <li><strong>India Cyber Crime Helpline:</strong> 1930 (toll-free)</li>
                <li><strong>Reserve Bank of India (RBI):</strong> www.rbi.org.in (fraud reporting)</li>
                <li><strong>CERT-IN:</strong> www.cert-in.org.in (security incidents)</li>
                <li><strong>Local Cybercell:</strong> Report to your nearest police station</li>
              </ul>

              <h3>How Veritas Works</h3>
              <ol>
                <li>User pastes a URL or message</li>
                <li>System extracts URL features (length, HTTPS, keywords, domain age, etc.)</li>
                <li>ML model assigns a probability score (0-100%)</li>
                <li>Database lookup checks against known scam URLs</li>
                <li>Risk score converted to Red/Yellow/Green verdict with explanations</li>
              </ol>

              <h3>Your Privacy</h3>
              <p>Veritas respects your privacy. URLs submitted are analyzed but not stored without explicit consent for database improvement. Personal data is never shared with third parties.</p>

              <button className="btn-close-modal" onClick={() => setShowAbout(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
