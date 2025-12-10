import { useState } from 'react';

const API_URL = 'https://veritas-lsb6.onrender.com/api';

export default function Report() {
  const [formData, setFormData] = useState({
    url: '',
    message: '',
    userEmail: '',
    category: 'other'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!formData.url && !formData.message) {
      setError('Please provide at least a URL or description');
      return;
    }

    if (!formData.userEmail) {
      setError('Email is required');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit report');
      }

      setSuccess(true);
      setFormData({
        url: '',
        message: '',
        userEmail: '',
        category: 'other'
      });

      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-md">
      <div className="hero">
        <h1>🚨 Report a Scam</h1>
        <p>Help us identify new scams and protect the community</p>
        <p style={{ fontSize: '0.95rem', color: '#777', marginTop: '0.5rem' }}>
          Found a suspicious link or scam? Report it here and help us grow our database.
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="url">Suspicious URL (Optional)</label>
            <input
              type="text"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://suspicious-scam-site.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Description / Details</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Describe the scam: What happened? How did you encounter it? Any other details..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Scam Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="other">Other / Not Sure</option>
              <option value="phishing">Phishing (Fake login page)</option>
              <option value="malware">Malware / Virus</option>
              <option value="fake-bank">Fake Bank / Financial Institution</option>
              <option value="job-scam">Job / Employment Scam</option>
              <option value="payment-fraud">Payment / Purchase Fraud</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="email">Your Email</label>
            <input
              type="email"
              id="email"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleChange}
              placeholder="your-email@example.com"
              required
            />
            <small style={{ color: '#999', marginTop: '0.35rem', display: 'block' }}>
              We may contact you to verify this report (optional)
            </small>
          </div>

          {error && <div className="alert alert-error">{error}</div>}
          {success && (
            <div className="alert alert-success">
              ✅ Thank you! Your report has been submitted successfully. Our team will review it shortly.
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" disabled={loading} className="success">
              {loading ? 'Submitting...' : '📤 Submit Report'}
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => {
                setFormData({
                  url: '',
                  message: '',
                  userEmail: '',
                  category: 'other'
                });
                setError('');
                setSuccess(false);
              }}
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>

      <div className="section">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Why Report?</h2>
        <div className="grid grid-3">
          <div className="card">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎯</div>
            <h3>Improve Detection</h3>
            <p>Your reports help us train our AI model and identify new scam patterns.</p>
          </div>
          <div className="card">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>👥</div>
            <h3>Protect Others</h3>
            <p>Verified scams are added to our database, protecting thousands of users.</p>
          </div>
          <div className="card">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔍</div>
            <h3>Community Driven</h3>
            <p>Together we build the most comprehensive scam database.</p>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="card">
          <h3>🔒 Your Privacy Matters</h3>
          <p>
            All reports are handled confidentially. Your email is used only for verification purposes and will never be shared with third parties or used for marketing.
          </p>
          <p>
            Reports are reviewed by our team and verified before being added to the scam database. False reports help us fine-tune our system, so please be honest.
          </p>
        </div>
      </div>

      <div className="section">
        <div className="alert alert-info">
          <h4 style={{ marginTop: 0 }}>💡 Not Sure If It's a Scam?</h4>
          <p>Use our <strong>Link Scanner</strong> on the home page to analyze any URL first. Then come back here to report verified scams.</p>
        </div>
      </div>
    </div>
  );
}
