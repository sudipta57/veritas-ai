import { useNavigate } from 'react-router-dom';

const CLAIMS = [
  {
    verdict: 'true', conf: 91, sources: ['Reuters', 'Bloomberg'],
    text: '"Global semiconductor manufacturing hit a record high in Q3 2024, lead primarily by emerging markets in Southeast Asia."',
    reasoning: 'Cross-referencing verified institutional datasets with real-time customs records confirms the surge. Linguistic markers in the original claim align with verified financial reporting standards. No semantic hallucination detected.',
    sourceTrust: ['Reuters Intelligence / Market Report Oct 2024', 'Bloomberg Terminal / Supply Chain Index'],
  },
  {
    verdict: 'disputed', conf: null, sources: [],
    text: '"Public transit ridership in major metropolitan areas has returned to 105% of pre-pandemic levels as of late 2024."',
    conflicting: true,
  },
];

export default function ReportsPage() {
  const navigate = useNavigate();

  return (
    <div className="animate-in">
      <div style={{ padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', background: 'var(--surface-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', color: 'var(--navy)' }}>VerifAI</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Trust, but verify</span>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>How it works</span>
          <div className="topbar-icon"><span className="material-icons-round">shield_outlined</span></div>
          <div className="user-avatar-top">AT</div>
        </div>
      </div>

      <div style={{ padding: '28px 32px' }}>
        {/* Title row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <h1 className="page-title">Accuracy Report</h1>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary">
              <span className="material-icons-round">download</span>Download PDF Report
            </button>
            <button className="btn btn-secondary">
              <span className="material-icons-round">share</span>Copy Share Link
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
          {/* Main */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Score + Claims summary */}
            <div className="card">
              <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                {/* Circle score */}
                <div style={{ flexShrink: 0 }}>
                  <div style={{ width: 120, height: 120, borderRadius: '50%', border: '8px solid var(--navy)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'white', position: 'relative' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--navy)', lineHeight: 1 }}>74%</div>
                    <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>accuracy score</div>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="section-label">Total Analysis</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12 }}>12 Claims Verified</div>
                  <div style={{ display: 'flex', gap: 20 }}>
                    {[['8', 'True', 'green'], ['2', 'False', 'red'], ['1', 'Partial', 'amber'], ['1', 'Unknown', 'muted']].map(([v, l, c]) => (
                      <div key={l}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 800, color: `var(--${c})` }}>{v}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{l}</div>
                      </div>
                    ))}
                  </div>
                  <blockquote style={{ marginTop: 14, padding: '10px 14px', borderLeft: '3px solid var(--border-strong)', fontSize: '0.82rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.65 }}>
                    "Overall reliability remains high, but minor inconsistencies detected in source triangulation."
                  </blockquote>
                </div>
              </div>
            </div>

            {/* AI Detection */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div>
                  <div className="section-label" style={{ margin: 0, marginBottom: 3 }}>AI Detection Engine</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>82% AI-Generated Probability</div>
                </div>
                <span className="badge badge-false">High Risk</span>
              </div>
              <div className="progress-track" style={{ height: 7, marginBottom: 8 }}>
                <div className="progress-fill progress-red" style={{ width: '82%' }}></div>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Linguistic patterns match known Large Language Model structural markers.</p>
            </div>

            {/* Claims */}
            <div>
              {CLAIMS.map((c, i) => (
                <div key={i} className="card" style={{ marginBottom: 14, borderLeft: `3px solid ${c.verdict === 'true' ? 'var(--green)' : c.conflicting ? 'var(--red)' : 'var(--amber)'}` }}>
                  {c.conflicting && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 10px', background: 'var(--red-bg)', borderRadius: 7, marginBottom: 12 }}>
                      <span className="material-icons-round" style={{ color: 'var(--red)', fontSize: '0.9rem' }}>warning</span>
                      <span className="section-label" style={{ margin: 0, color: 'var(--red)' }}>Conflicting Sources Detected</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      {!c.conflicting && <span className="badge badge-true" style={{ marginBottom: 8, display: 'inline-block' }}>Verified: True</span>}
                      {c.conflicting && <span className="badge badge-false" style={{ marginBottom: 8, display: 'inline-block' }}>Verdict: Disputed</span>}
                      <p style={{ fontSize: '0.925rem', fontWeight: 700, lineHeight: 1.5 }}>{c.text}</p>
                    </div>
                    {c.conf && (
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div className="section-label" style={{ margin: 0, marginBottom: 2 }}>Confidence Score</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--green)' }}>{c.conf}%</div>
                      </div>
                    )}
                  </div>
                  {c.sourceTrust && (
                    <>
                      <div className="section-label">Evidence Triangulation</div>
                      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                        {c.sourceTrust.map(s => (
                          <div key={s} className="tag" style={{ padding: '6px 10px', borderRadius: 7, lineHeight: 1.5 }}>
                            <span className="material-icons-round" style={{ fontSize: '0.7rem', color: 'var(--navy)' }}>verified</span>
                            {s.split('/')[0]} <span style={{ color: 'var(--text-muted)' }}>Supports</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ padding: '12px', background: 'var(--bg)', borderRadius: 8 }}>
                        <div className="section-label">AI Reasoning Protocol</div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.72, fontFamily: 'var(--font-mono)' }}>{c.reasoning}</p>
                      </div>
                    </>
                  )}
                  {c.conflicting && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      {[['Source: Local Gov Records', 'Government data indicate a recovery spike reaching 105% in September due to new subway line openings.', 'green'],
                      ['Source: Independent Audit', '"Audited transit data suggests actual ridership remains stalled at 88%, citing ghost bus phenomena."', 'red']].map(([l, t, col]) => (
                        <div key={l} style={{ padding: '12px', background: 'var(--bg)', borderRadius: 8, borderLeft: `3px solid var(--${col})` }}>
                          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: `var(--${col})`, fontFamily: 'var(--font-mono)', marginBottom: 6 }}>{l}</div>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{t}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="card">
              <div className="section-label">Source Trust Index</div>
              {[['Reuters', 'High Authority', 'green'], ['Bloomberg', 'High Authority', 'green'], ['GlobalNews.ai', 'Medium Trust', 'amber'], ['Social Stream X', 'Low Reliability', 'red']].map(([s, t, c]) => (
                <div key={s} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid var(--divider)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span className={`dot dot-${c === 'green' ? 'true' : c === 'red' ? 'false' : 'partial'}`}></span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>{s}</span>
                  </div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: `var(--${c})`, fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>{t}</span>
                </div>
              ))}
            </div>

            <div className="card">
              <div className="section-label">Report Metadata</div>
              {[['Report ID', 'VI-9992-1A'], ['Analysis Speed', '1.4s (Ultra)'], ['Dataset Version', 'V4.2 (Real-time)']].map(([l, v]) => (
                <div key={l} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 2 }}>{l}</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
