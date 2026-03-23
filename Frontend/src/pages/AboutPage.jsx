import { useNavigate } from 'react-router-dom';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="animate-in">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div className="page-eyebrow">Company</div>
            <h1 className="page-title">About VerifAI</h1>
            <p className="page-subtitle">Built to help people verify claims with speed, transparency, and evidence-first reasoning.</p>
          </div>
          <button className="btn btn-secondary" type="button" onClick={() => navigate('/')}>
            <span className="material-icons-round">home</span>
            Back to Home
          </button>
        </div>
      </div>

      <div className="page-body" style={{ display: 'grid', gap: 18 }}>
        <div className="card">
          <h2 style={{ fontSize: '1rem', marginBottom: 10 }}>Our Mission</h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
            VerifAI exists to reduce misinformation risk by making verification workflows fast and explainable.
            We combine retrieval, reasoning, and credibility scoring to produce traceable outcomes.
          </p>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '0.92rem', marginBottom: 10 }}>What we focus on</h3>
          <div style={{ display: 'grid', gap: 9 }}>
            {[
              'Evidence-backed claim analysis',
              'Transparent source citations',
              'Responsible AI with human oversight',
            ].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="material-icons-round" style={{ fontSize: '0.9rem', color: 'var(--navy)' }}>check_circle</span>
                <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
