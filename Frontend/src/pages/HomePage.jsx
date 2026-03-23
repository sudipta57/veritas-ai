import { useNavigate } from 'react-router-dom';

const RECENT = [
  { title: 'The Impact of Synthetic Media on Election Integrity', score: 78, status: 'partial', date: '2024-03-22' },
  { title: 'SEC Regulation Proposal v2.44 Analysis', score: 91, status: 'true', date: '2024-03-21' },
  { title: 'Climate Statistics Fact Check: Global Emissions 2023', score: 81, status: 'true', date: '2024-03-18' },
];

const SCORE_COLOR = s => s >= 75 ? 'var(--green)' : s >= 50 ? 'var(--amber)' : 'var(--red)';
const SCORE_BG = s => s >= 75 ? 'var(--green-bg)' : s >= 50 ? 'var(--amber-bg)' : 'var(--red-bg)';
const SCORE_BORDER = s => s >= 75 ? 'var(--green-border)' : s >= 50 ? 'var(--amber-border)' : 'var(--red-border)';

const STATUS_ROW_CLASS = { true: 'list-row-true', partial: 'list-row-partial', false: 'list-row-false' };

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="animate-in">
      {/* Hero */}
      <div style={{
        padding: '48px 32px 36px',
        borderBottom: '1px solid var(--border)',
        background: 'linear-gradient(160deg, var(--surface) 0%, #ece8df 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', right: -80, top: -80, width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(26,39,68,0.05) 0%, transparent 70%)', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', right: 80, bottom: -40, width: 180, height: 180, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(26,64,128,0.04) 0%, transparent 70%)', pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div className="live-indicator"><span className="live-dot"></span>Live Intelligence</div>
          <span className="badge badge-navy">v2.4.0</span>
        </div>

        <h1 style={{ fontSize: '3.2rem', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1.05, marginBottom: 18 }}>
          Is it{' '}
          <span className="gradient-text">true?</span>
        </h1>
        <p style={{ fontSize: '0.975rem', color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 30, maxWidth: 540 }}>
          Paste any text or drop a news article URL. Our AI will extract every claim, search the web for evidence, and deliver a full accuracy report.
        </p>

        <div style={{ maxWidth: 620 }}>
          <textarea
            className="input" rows={4}
            placeholder="Paste article text, URL, or any claim you want verified..."
            style={{ marginBottom: 14, resize: 'vertical', fontSize: '0.9rem' }}
          />
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: '0.95rem', padding: '13px 20px' }} onClick={() => navigate('/verify')}>
              <span className="material-icons-round">verified_user</span>Verify Now
            </button>
            <button className="btn btn-secondary" style={{ padding: '13px 20px' }} onClick={() => navigate('/reports')}>
              View Reports
            </button>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 12, fontFamily: 'var(--font-mono)' }}>
            Supports articles, blog posts, AI-generated text, social media posts and more.
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderBottom: '1px solid var(--border)', background: 'var(--surface-card)' }}>
        {[
          ['2.4B+', 'SOURCES INDEXED', 'storage', 'var(--navy)'],
          ['127ms', 'AVG RESPONSE', 'bolt', 'var(--blue)'],
          ['99.2%', 'UPTIME SLA', 'verified', 'var(--green)'],
          ['42', 'COUNTRIES', 'public', 'var(--teal)'],
        ].map(([v, l, icon, color]) => (
          <div key={l} className="stat-bar-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-icons-round" style={{ fontSize: '0.9rem', color }}>{icon}</span>
              </div>
            </div>
            <div className="stat-value" style={{ fontSize: '1.6rem' }}>{v}</div>
            <div className="stat-label">{l}</div>
          </div>
        ))}
      </div>

      <div className="page-body">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 310px', gap: 28 }}>
          {/* Left */}
          <div>
            {/* How it works */}
            <div className="section-label">How it Works</div>
            <div className="grid-3" style={{ marginBottom: 28 }}>
              {[
                { icon: 'search', title: 'Real-time Web Search', desc: 'Our agents crawl the live web to find the latest citations and counter-evidence.' },
                { icon: 'psychology', title: 'AI Claim Extraction', desc: 'Advanced NLP dissects complex narratives into individual, verifiable statements.' },
                { icon: 'leaderboard', title: 'Accuracy Scoring', desc: 'A definitive VerifAI Score 0–100. Our Digital Jurist assigns confidence ratings.' },
              ].map(f => (
                <div className="feature-card" key={f.title}>
                  <div className="feature-icon">
                    <span className="material-icons-round">{f.icon}</span>
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: 6 }}>{f.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{f.desc}</div>
                </div>
              ))}
            </div>

            {/* Recent analyses */}
            <div className="section-label">Recent Analyses</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {RECENT.map((item, i) => (
                <div
                  key={i}
                  className={`list-row card-hover list-row-${item.status}`}
                  onClick={() => navigate('/reports')}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 5 }} className="ellipsis">{item.title}</div>
                    <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
                      <span className={`badge badge-${item.status}`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{item.date}</span>
                    </div>
                  </div>
                  {/* Score badge */}
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                    background: SCORE_BG(item.score),
                    border: `2px solid ${SCORE_BORDER(item.score)}`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: SCORE_COLOR(item.score), lineHeight: 1 }}>{item.score}</div>
                  </div>
                  <span className="material-icons-round" style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>chevron_right</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Methodology card */}
            <div className="card" style={{ background: 'linear-gradient(145deg, var(--navy) 0%, var(--navy-mid) 100%)', border: 'none', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', right: -20, top: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
              <span className="material-icons-round" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.4rem', marginBottom: 11, display: 'block' }}>gavel</span>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white', marginBottom: 8 }}>Sovereign Intelligence Methodology</h3>
              <p style={{ fontSize: '0.795rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 16 }}>
                Built on Forensic Linguistics, Network Analysis, and Probabilistic Confidence Scoring — the Digital Jurist standard.
              </p>
              <button className="btn" style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', width: '100%', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
                Learn More
              </button>
            </div>

            {/* Quick stats */}
            <div className="card">
              <div className="section-label">Platform Performance</div>
              {[['Total Analyses', '14,847'], ['Avg Accuracy', '88.4%'], ['Sources Active', '1,284']].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--divider)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{l}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{v}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="card" style={{ background: 'var(--bg)' }}>
              <div className="section-label">Start verifying</div>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 9 }} onClick={() => navigate('/verify')}>
                <span className="material-icons-round">add</span>New Analysis
              </button>
              <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/history')}>
                <span className="material-icons-round">history</span>View History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
