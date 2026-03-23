import { useNavigate } from 'react-router-dom';

const PRACTICES = [
  'Risk assessments and treatment plans for critical assets',
  'Documented policies, controls, and regular internal audits',
  'Security awareness and role-based access governance',
  'Continuous improvement through corrective and preventive actions',
];

export default function Iso27001Page() {
  const navigate = useNavigate();

  return (
    <div className="animate-in">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div className="page-eyebrow">Trust & Compliance</div>
            <h1 className="page-title">ISO 27001</h1>
            <p className="page-subtitle">Follow a security system.</p>
          </div>
          <button className="btn btn-secondary" type="button" onClick={() => navigate('/')}>
            <span className="material-icons-round">home</span>
            Back to Home
          </button>
        </div>
      </div>

      <div className="page-body" style={{ display: 'grid', gap: 18 }}>
        <div className="card" style={{ borderLeft: '4px solid var(--blue)' }}>
          <h2 style={{ fontSize: '1rem', marginBottom: 10 }}>What this means</h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
            ISO 27001 is an international framework for building and running an Information Security Management System.
            It helps ensure security is systematic, measurable, and continuously improved.
          </p>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '0.92rem', marginBottom: 10 }}>How we operate</h3>
          <div style={{ display: 'grid', gap: 9 }}>
            {PRACTICES.map((item) => (
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
