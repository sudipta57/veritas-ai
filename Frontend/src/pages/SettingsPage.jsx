import { useState } from 'react';

export default function SettingsPage({ isDarkMode = false, onToggleDarkMode = () => {} }) {
  const [model, setModel] = useState('ultra');
  const [prefs, setPrefs] = useState({ notify: true, autosave: true, dark: isDarkMode });
  const toggle = k => setPrefs(p => ({ ...p, [k]: !p[k] }));

  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account, inference engine, and security preferences.</p>
      </div>
      <div className="page-body">
        <div style={{ maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Account */}
          <div className="card">
            <div className="section-label">Account Identity</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px', background: 'var(--bg)', borderRadius: 10, marginBottom: 16, border: '1px solid var(--border)' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-display)', flexShrink: 0 }}>AT</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>Dr. Aria Thorne</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>aria.thorne@verifai.io</div>
                <span className="badge badge-navy" style={{ marginTop: 5, display: 'inline-block' }}>Jurist Prime</span>
              </div>
              <button className="btn btn-secondary">Edit Profile</button>
            </div>
            <div className="grid-2">
              {[['Display Name', 'Dr. Aria Thorne'], ['Email', 'aria.thorne@verifai.io']].map(([l, v]) => (
                <div key={l}>
                  <label style={{ fontSize: '0.62rem', color: 'var(--text-muted)', display: 'block', marginBottom: 5, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{l}</label>
                  <input className="input" defaultValue={v} />
                </div>
              ))}
            </div>
          </div>

          {/* Inference */}
          <div className="card">
            <div className="section-label">Inference Logic</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 14 }}>Select the core LLM architecture powering your analysis.</p>
            {[
              { id: 'ultra', name: 'Jurist-V4 Ultra', desc: 'Deep reasoning with 128k context window. Optimized for legal nuances.', badge: 'Recommended' },
              { id: 'flash', name: 'QuickCheck Flash', desc: 'Sub-second latency for social media verification.', badge: null },
            ].map(m => (
              <div key={m.id} onClick={() => setModel(m.id)} style={{
                padding: '12px 14px', borderRadius: 9, cursor: 'pointer', marginBottom: 9,
                border: `1px solid ${model === m.id ? 'var(--navy)' : 'var(--border)'}`,
                background: model === m.id ? 'rgba(26,39,68,0.04)' : 'var(--bg)',
                display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.12s',
              }}>
                <div style={{ width: 14, height: 14, borderRadius: '50%', border: `2px solid ${model === m.id ? 'var(--navy)' : 'var(--border-strong)'}`, background: model === m.id ? 'var(--navy)' : 'transparent', flexShrink: 0 }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>{m.name}</div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{m.desc}</div>
                </div>
                {m.badge && <span className="badge badge-navy">{m.badge}</span>}
              </div>
            ))}
          </div>

          {/* Preferences */}
          <div className="card">
            <div className="section-label">Quick Preferences</div>
            {[
              { key: 'notify', label: 'Push Notifications', desc: 'Get notified when analyses complete' },
              { key: 'autosave', label: 'Auto-save Drafts', desc: 'Automatically save unfinished analyses' },
              { key: 'dark', label: 'Dark Mode', desc: 'Switch to the Sovereign Intelligence dark theme' },
            ].map(p => (
              <div key={p.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 2 }}>{p.label}</div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{p.desc}</div>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={p.key === 'dark' ? isDarkMode : prefs[p.key]}
                    onChange={() => {
                      if (p.key === 'dark') {
                        onToggleDarkMode(!isDarkMode);
                        return;
                      }
                      toggle(p.key);
                    }}
                  />
                  <span className="toggle-track"></span>
                </label>
              </div>
            ))}
          </div>

          {/* Security */}
          <div className="card">
            <div className="section-label">Access & Security</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 13px', background: 'var(--green-bg)', borderRadius: 9, marginBottom: 14, border: '1px solid var(--green-border)' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span className="material-icons-round" style={{ color: 'var(--green)' }}>security</span>
                <div>
                  <div style={{ fontSize: '0.845rem', fontWeight: 600 }}>Two-Factor Authentication</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Biometric and hardware key support enabled.</div>
                </div>
              </div>
              <span className="badge badge-true">Enabled</span>
            </div>
            <div className="section-label">Active Sessions</div>
            {[['MacBook Pro 16" — London, UK', '2 minutes ago'], ['iPhone 15 Pro — Paris, FR', '4 hours ago']].map(([dev, time]) => (
              <div key={dev} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--divider)' }}>
                <div>
                  <div style={{ fontSize: '0.825rem', fontWeight: 600 }}>{dev}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Last active: {time}</div>
                </div>
                <button className="btn btn-danger" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>Revoke</button>
              </div>
            ))}
          </div>

          {/* Subscription */}
          <div className="card" style={{ borderLeft: '3px solid var(--navy)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <span className="material-icons-round" style={{ color: 'var(--navy)' }}>workspace_premium</span>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Jurist Prime</h3>
                  <span className="badge badge-navy">Active</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Professional grade verification. Renewing in 12 days.</p>
              </div>
              <button className="btn btn-primary"><span className="material-icons-round">upgrade</span>Manage Plan</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
