import { useNavigate } from 'react-router-dom';

const CONTROLS = [
  'Encryption in transit and at rest for sensitive data paths',
  'Access logging, monitoring, and role-based authorization',
  'Routine vulnerability scanning and patch management',
  'Incident response process with containment and review stages',
];

export default function SecurityPage() {
  const navigate = useNavigate();

  return (
    <div className="animate-in">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div className="page-eyebrow">Security</div>
            <h1 className="page-title">Security Overview</h1>
            <p className="page-subtitle">How VerifAI protects systems, data, and customer workflows.</p>
          </div>
          <button className="btn btn-secondary" type="button" onClick={() => navigate('/')}>
            <span className="material-icons-round">home</span>
            Back to Home
          </button>
        </div>
      </div>

      <div className="page-body" style={{ display: 'grid', gap: 18 }}>
        <div className="card" style={{ borderLeft: '4px solid var(--blue)' }}>
          <h2 style={{ fontSize: '1rem', marginBottom: 10 }}>Security posture</h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
            Security is integrated into architecture, operations, and release practices.
            Our controls are mapped to recognized frameworks to maintain consistency and accountability.
          </p>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '0.92rem', marginBottom: 10 }}>Core controls</h3>
          <div style={{ display: 'grid', gap: 9 }}>
            {CONTROLS.map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span className="material-icons-round" style={{ fontSize: '0.9rem', color: 'var(--blue)', marginTop: 2 }}>security</span>
                <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
