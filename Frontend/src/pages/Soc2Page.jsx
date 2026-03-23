import { useNavigate } from 'react-router-dom';

const CONTROLS = [
  'Independent third-party audits performed annually',
  'Continuous monitoring of infrastructure and access logs',
  'Strict access controls with least-privilege enforcement',
  'Incident response playbooks with evidence retention workflows',
];

export default function Soc2Page() {
  const navigate = useNavigate();

  return (
    <div className="animate-in">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div className="page-eyebrow">Trust & Compliance</div>
            <h1 className="page-title">SOC 2 Type II</h1>
            <p className="page-subtitle">Prove you are secure.</p>
          </div>
          <button className="btn btn-secondary" type="button" onClick={() => navigate('/')}>
            <span className="material-icons-round">home</span>
            Back to Home
          </button>
        </div>
      </div>

      <div className="page-body" style={{ display: 'grid', gap: 18 }}>
        <div className="card" style={{ borderLeft: '4px solid var(--navy)' }}>
          <h2 style={{ fontSize: '1rem', marginBottom: 10 }}>What this means</h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
            SOC 2 Type II validates that our operational controls are not just designed correctly but also tested over time.
            It demonstrates that VerifAI consistently protects customer data with auditable, repeatable security processes.
          </p>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '0.92rem', marginBottom: 10 }}>How we back it up</h3>
          <div style={{ display: 'grid', gap: 9 }}>
            {CONTROLS.map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span className="material-icons-round" style={{ fontSize: '0.9rem', color: 'var(--green)', marginTop: 2 }}>check_circle</span>
                <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
