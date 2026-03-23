import { NavLink, useNavigate } from 'react-router-dom';

const NAV = [
  { icon: 'verified_user', label: 'Verify', to: '/verify' },
  { icon: 'history', label: 'History', to: '/history' },
  { icon: 'analytics', label: 'Reports', to: '/reports' },
  { icon: 'library_books', label: 'Sources', to: '/sources' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-mark">
          <div className="logo-icon">
            <span className="material-icons-round">verified</span>
          </div>
          <span className="logo-text">VerifAI</span>
        </div>
        <div className="logo-tagline">Digital Jurist Intelligence</div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">Navigation</div>
        {NAV.map(({ icon, label, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <div className="nav-icon-wrap">
              <span className="material-icons-round">{icon}</span>
            </div>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* CTA */}
      <div className="sidebar-cta">
        <button className="btn-new-analysis" onClick={() => navigate('/verify')}>
          <span className="material-icons-round">add</span>
          <span>New Analysis</span>
        </button>
      </div>

      {/* User section */}
      <div className="sidebar-user">
        <div className="sidebar-user-avatar">AT</div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">Dr. Aria Thorne</div>
          <div className="sidebar-user-plan">⭐ Pro</div>
        </div>
      </div>

      {/* Footer links */}
      <div className="sidebar-footer">
        <NavLink to="/" end className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
          <span className="material-icons-round">home</span>
          Back to Home
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
          <span className="material-icons-round">settings</span>
          Settings
        </NavLink>
        <NavLink to="/support" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
          <span className="material-icons-round">help_outline</span>
          Support
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
          <span className="material-icons-round">person_outline</span>
          Account
        </NavLink>
      </div>
    </aside>
  );
}
