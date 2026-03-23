import { useNavigate } from 'react-router-dom';

const TERMS = [
  'Use outputs as advisory intelligence, not sole decision authority.',
  'Do not submit unlawful or rights-violating content.',
  'Respect API usage limits and fair-use provisions.',
  'Report security concerns responsibly and promptly.',
];

export default function TermsPage() {
  const navigate = useNavigate();

  return (
    <div className="animate-in">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div className="page-eyebrow">Legal</div>
            <h1 className="page-title">Terms of Service</h1>
            <p className="page-subtitle">Clear rules for using VerifAI responsibly and securely.</p>
          </div>
          <button className="btn btn-secondary" type="button" onClick={() => navigate('/')}>
            <span className="material-icons-round">home</span>
            Back to Home
          </button>
        </div>
      </div>

      <div className="page-body" style={{ display: 'grid', gap: 18 }}>
        <div className="card">
          <h2 style={{ fontSize: '1rem', marginBottom: 10 }}>Summary</h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
            By using VerifAI, you agree to follow our acceptable-use requirements and acknowledge that verification results are probabilistic guidance.
          </p>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '0.92rem', marginBottom: 10 }}>Key terms</h3>
          <div style={{ display: 'grid', gap: 9 }}>
            {TERMS.map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <span className="material-icons-round" style={{ fontSize: '0.9rem', color: 'var(--amber)', marginTop: 2 }}>gavel</span>
                <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
