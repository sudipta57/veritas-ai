import { useNavigate } from 'react-router-dom';

const PRINCIPLES = [
  'Data minimization and purpose limitation by default',
  'User rights support for access, correction, and deletion',
  'Transparent data handling with clear legal basis',
  'Security controls to prevent unauthorized data processing',
];

export default function GdprPage() {
  const navigate = useNavigate();

  return (
    <div className="animate-in">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div className="page-eyebrow">Trust & Compliance</div>
            <h1 className="page-title">GDPR Compliance</h1>
            <p className="page-subtitle">Respect user privacy.</p>
          </div>
          <button className="btn btn-secondary" type="button" onClick={() => navigate('/')}>
            <span className="material-icons-round">home</span>
            Back to Home
          </button>
        </div>
      </div>

      <div className="page-body" style={{ display: 'grid', gap: 18 }}>
        <div className="card" style={{ borderLeft: '4px solid var(--teal)' }}>
          <h2 style={{ fontSize: '1rem', marginBottom: 10 }}>What this means</h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
            GDPR compliance ensures personal data is handled lawfully, fairly, and transparently.
            At VerifAI, privacy is treated as a product requirement from design to deployment.
          </p>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '0.92rem', marginBottom: 10 }}>How we apply it</h3>
          <div style={{ display: 'grid', gap: 9 }}>
            {PRINCIPLES.map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span className="material-icons-round" style={{ fontSize: '0.9rem', color: 'var(--teal)', marginTop: 2 }}>verified_user</span>
                <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
