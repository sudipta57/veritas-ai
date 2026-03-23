import { useNavigate } from 'react-router-dom';

export default function Topbar() {
  const navigate = useNavigate();
  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="topbar-search">
          <span className="material-icons-round">search</span>
          <input placeholder="Search knowledge base..." />
        </div>
      </div>

      <div className="topbar-right">
        {/* Notifications */}
        <div className="topbar-icon-btn" title="Notifications">
          <span className="material-icons-round">notifications_none</span>
          <span className="notif-badge"></span>
        </div>

        {/* Settings shortcut */}
        <div className="topbar-icon-btn" title="Settings" onClick={() => navigate('/settings')} style={{ cursor: 'pointer' }}>
          <span className="material-icons-round">settings</span>
        </div>

        <div style={{ width: 1, height: 22, background: 'var(--border)', flexShrink: 0 }} />

        {/* User */}
        <div className="topbar-user">
          <span className="topbar-user-name">Dr. Aria Thorne</span>
          <span className="pro-pill">⭐ Pro</span>
          <div className="user-avatar-top">AT</div>
        </div>
      </div>
    </div>
  );
}
