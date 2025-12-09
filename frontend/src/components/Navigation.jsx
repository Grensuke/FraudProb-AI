import { Link } from 'react-router-dom';
import './Navigation.css';

export default function Navigation() {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-wrapper">
          <Link to="/" className="nav-brand">
            <span className="nav-logo">🛡️</span>
            <span className="nav-title">Veritas</span>
          </Link>
          <ul className="nav-menu">
            <li><Link to="/" className="nav-link">Home</Link></li>
            <li><Link to="/report" className="nav-link">Report Scam</Link></li>
            <li><Link to="/admin" className="nav-link">Admin</Link></li>
            <li><Link to="/about" className="nav-link">About</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
