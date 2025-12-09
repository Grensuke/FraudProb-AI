import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3000/api/admin';

export default function Admin() {
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [reports, setReports] = useState([]);
  const [scams, setScams] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (adminKey.trim()) {
      setIsAuthenticated(true);
      setError('');
      loadAllData();
    } else {
      setError('Please enter admin key');
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const headers = { 'x-admin-key': adminKey };
      
      const [statsRes, reportsRes, scamsRes] = await Promise.all([
        fetch(`${API_URL}/stats`, { headers }),
        fetch(`${API_URL}/reports`, { headers }),
        fetch(`${API_URL}/scams`, { headers })
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (reportsRes.ok) setReports(await reportsRes.json());
      if (scamsRes.ok) setScams(await scamsRes.json());
    } catch (err) {
      setError('Failed to load data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddScam = async (reportUrl) => {
    const reason = prompt('Enter reason for adding this scam:');
    if (!reason) return;

    try {
      const response = await fetch(`${API_URL}/add-scam`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey
        },
        body: JSON.stringify({
          url: reportUrl,
          reason,
          category: 'reported',
          severity: 'high'
        })
      });

      if (response.ok) {
        setSuccess('Scam added to database!');
        setTimeout(() => setSuccess(''), 3000);
        loadAllData();
      } else {
        setError('Failed to add scam');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteScam = async (scamId) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      const response = await fetch(`${API_URL}/scams/${scamId}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': adminKey }
      });

      if (response.ok) {
        setSuccess('Scam entry deleted!');
        setTimeout(() => setSuccess(''), 3000);
        loadAllData();
      } else {
        setError('Failed to delete entry');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container-md">
        <div className="hero">
          <h1>🔐 Admin Dashboard</h1>
          <p>Protected access for administrators</p>
        </div>

        <div className="card" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="adminKey">Admin Key</label>
              <input
                type="password"
                id="adminKey"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter admin key"
              />
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <button type="submit" style={{ width: '100%' }}>
              🔓 Login
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#999', fontSize: '0.85rem' }}>
            Default key: Check your .env file or ask the administrator
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="hero">
        <h1>⚙️ Admin Dashboard</h1>
        <p>Manage reports, scam database, and system statistics</p>
        <button 
          className="secondary" 
          onClick={() => { setIsAuthenticated(false); setAdminKey(''); }}
          style={{ marginTop: '1rem' }}
        >
          🚪 Logout
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📊 Statistics
        </button>
        <button 
          className={`tab-button ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          📋 Reports ({reports.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'scams' ? 'active' : ''}`}
          onClick={() => setActiveTab('scams')}
        >
          🚨 Scam DB ({scams.length})
        </button>
      </div>

      {loading && <div className="loading"><div className="spinner"></div></div>}

      {activeTab === 'stats' && stats && (
        <div className="grid grid-2" style={{ marginTop: '2rem' }}>
          <div className="card">
            <h3 style={{ color: '#646cff' }}>📊 Total Scans</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333' }}>
              {stats.totalScans}
            </div>
            <p style={{ color: '#999', marginTop: '0.5rem' }}>URLs analyzed</p>
          </div>
          <div className="card">
            <h3 style={{ color: '#e74c3c' }}>🚨 High Risk Detected</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#e74c3c' }}>
              {stats.highRiskScans}
            </div>
            <p style={{ color: '#999', marginTop: '0.5rem' }}>High risk verdicts</p>
          </div>
          <div className="card">
            <h3 style={{ color: '#f39c12' }}>📝 Reports Submitted</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f39c12' }}>
              {stats.totalReports}
            </div>
            <p style={{ color: '#999', marginTop: '0.5rem' }}>User reports</p>
          </div>
          <div className="card">
            <h3 style={{ color: '#2ecc71' }}>✅ Scam Database</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2ecc71' }}>
              {stats.totalScams}
            </div>
            <p style={{ color: '#999', marginTop: '0.5rem' }}>Known scams</p>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div style={{ marginTop: '2rem' }}>
          <h2>User Reports</h2>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>URL</th>
                  <th>Category</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No reports yet</td></tr>
                ) : (
                  reports.map((report) => (
                    <tr key={report._id}>
                      <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {report.url}
                      </td>
                      <td>
                        <span className={`badge blue`}>
                          {report.category}
                        </span>
                      </td>
                      <td>{report.userEmail}</td>
                      <td>
                        <span className={`badge ${report.status === 'verified' ? 'badge-success' : ''}`}>
                          {report.status}
                        </span>
                      </td>
                      <td>{new Date(report.reportedAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="secondary"
                          onClick={() => handleAddScam(report.url)}
                          style={{ fontSize: '0.85rem', padding: '0.5rem' }}
                        >
                          Add to DB
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'scams' && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Scam Database</h2>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>URL</th>
                  <th>Domain</th>
                  <th>Reason</th>
                  <th>Severity</th>
                  <th>Source</th>
                  <th>Date Added</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {scams.length === 0 ? (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No scams in database</td></tr>
                ) : (
                  scams.map((scam) => (
                    <tr key={scam._id}>
                      <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {scam.url}
                      </td>
                      <td>{scam.domain}</td>
                      <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {scam.reason}
                      </td>
                      <td>
                        <span className={`badge ${scam.severity === 'critical' ? 'badge-danger' : ''}`}>
                          {scam.severity}
                        </span>
                      </td>
                      <td>{scam.source}</td>
                      <td>{new Date(scam.addedDate).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="danger"
                          onClick={() => handleDeleteScam(scam._id)}
                          style={{ fontSize: '0.85rem', padding: '0.5rem' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
