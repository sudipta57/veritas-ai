import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const INSIGHTS = [
  { type: 'verified', title: 'Verified Verdict', badge: 'true', conf: 99.2, text: '"The unemployment rate in the US fell to 3.4% in early 2023, hitting a 50-year low."', sources: ['BLS', 'REUTERS'] },
  { type: 'nuance', title: 'Nuance Required', badge: 'partial', conf: null, text: '"Inflation has returned to pre-pandemic levels across all major sectors as of Dec 2023."', note: '3 Supporting / 2 Conflicting' },
];

const STEPS = [
  { label: 'Extracting Claims', status: 'completed', icon: 'article', claims: ['"US unemployment fell to 3.4%..."', '"Inflation reached 10-year low..."', '"GDP growth exceeded 2%..."'] },
  { label: 'Searching the Web', status: 'active', icon: 'search', queries: ['[US unemployment rate 2023]', '[Bureau of Labor Statistics data Dec 2023]'] },
  { label: 'Verifying & Scoring', status: 'queued', icon: 'assessment', note: 'Waiting for search results...' },
];

const STATUS_COLOR = { completed: 'var(--green)', active: 'var(--blue)', queued: 'var(--text-muted)' };
const STATUS_BG = { completed: 'rgba(26,107,26,0.1)', active: 'rgba(29,78,216,0.1)', queued: 'var(--bg)' };
const STATUS_BORDER = { completed: 'var(--green-border)', active: 'var(--blue-border)', queued: 'var(--border)' };
const STATUS_BADGE = { completed: 'completed', active: 'progress', queued: 'unknown' };

export default function LiveAnalysisPage() {
  const navigate = useNavigate();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="animate-in">
      {/* Status bar */}
      <div style={{
        padding: '9px 32px',
        background: 'linear-gradient(90deg, var(--green-bg) 0%, #d4edda 100%)',
        borderBottom: '1px solid var(--green-border)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div className="live-indicator"><span className="live-dot"></span>System Online</div>
        <div style={{ flex: 1 }}></div>
        <button className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '5px 10px' }}>How it works</button>
        <div style={{ width: 1, height: 18, background: 'var(--green-border)' }} />
        <div className="user-avatar-top" style={{ width: 28, height: 28, fontSize: '0.65rem' }}>AT</div>
      </div>

      <div style={{ padding: '28px 32px' }}>
        {/* Session header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span className="badge badge-blue">
            <span className="spinner-sm" style={{ display: 'inline-block', width: 8, height: 8, borderWidth: 1.5, marginRight: 2 }}></span>
            In Progress
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Session ID: 492-AXV-901</span>
        </div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 10, lineHeight: 1.1, maxWidth: 640 }}>
          Analyzing Economic Report: Q4-2023 Executive Summary
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 28, maxWidth: 540 }}>
          We are currently cross-referencing claims from your document against 42 global financial databases and live economic indicators.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24 }}>
          {/* Left: Steps timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {STEPS.map((step, si) => (
              <div key={step.label} style={{ display: 'flex', gap: 12 }}>
                {/* Timeline track */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 32 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    background: STATUS_BG[step.status],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1.5px solid ${STATUS_BORDER[step.status]}`,
                    boxShadow: step.status === 'active' ? '0 0 0 4px rgba(29,78,216,0.1)' : 'none',
                    transition: 'all 0.3s',
                    zIndex: 1,
                  }}>
                    {step.status === 'active'
                      ? <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2, borderTopColor: 'var(--blue)' }}></div>
                      : <span className="material-icons-round" style={{ fontSize: '0.9rem', color: STATUS_COLOR[step.status] }}>{step.icon}</span>
                    }
                  </div>
                  {si < STEPS.length - 1 && (
                    <div style={{
                      width: 2, flex: 1, minHeight: 20,
                      background: step.status === 'completed'
                        ? 'linear-gradient(180deg, var(--green-vivid), rgba(34,160,34,0.3))'
                        : 'var(--border)',
                      margin: '4px 0', borderRadius: 1, transition: 'background 0.5s',
                    }}></div>
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, paddingBottom: 16, paddingTop: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>{step.label}</span>
                    <span className={`badge badge-${STATUS_BADGE[step.status]}`}>{step.status.toUpperCase()}</span>
                  </div>
                  {step.claims && step.claims.map(c => (
                    <div key={c} style={{ background: 'rgba(26,107,26,0.07)', border: '1px solid var(--green-border)', borderRadius: 6, padding: '4px 9px', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 5, fontFamily: 'var(--font-mono)' }}>
                      {c}
                    </div>
                  ))}
                  {step.queries && step.queries.map(q => (
                    <div key={q} style={{ background: 'var(--blue-bg)', border: '1px solid var(--blue-border)', borderRadius: 6, padding: '4px 9px', fontSize: '0.75rem', color: 'var(--blue)', marginBottom: 5, fontFamily: 'var(--font-mono)' }}>
                      {q}
                    </div>
                  ))}
                  {step.note && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>{step.note}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Right: Insights stream */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div className="section-label" style={{ margin: 0 }}>Live Insights Stream</div>
              <span className="badge badge-teal">
                <span className="material-icons-round" style={{ fontSize: '0.75rem' }}>bolt</span>
                AI-Powered Analysis
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {INSIGHTS.map((ins, i) => (
                <div key={i} className="card animate-in" style={{
                  borderLeft: `3px solid ${ins.badge === 'true' ? 'var(--green-vivid)' : 'var(--amber)'}`,
                  animationDelay: `${i * 0.1}s`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 7,
                        background: ins.badge === 'true' ? 'var(--green-bg)' : 'var(--amber-bg)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span className="material-icons-round" style={{ color: ins.badge === 'true' ? 'var(--green)' : 'var(--amber)', fontSize: '0.9rem' }}>
                          {ins.badge === 'true' ? 'check_circle' : 'warning_amber'}
                        </span>
                      </div>
                      <span className="section-label" style={{ margin: 0 }}>{ins.title}</span>
                    </div>
                    <span className={`badge badge-${ins.badge === 'true' ? 'true' : 'partial'}`}>
                      {ins.badge === 'true' ? '✓ TRUE' : '⚠ PARTIALLY TRUE'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.6, marginBottom: 10 }}>{ins.text}</p>
                  {ins.conf && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {ins.sources?.map(s => <span className="tag" key={s}>{s}</span>)}
                      <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Confidence: {ins.conf}%</span>
                    </div>
                  )}
                  {ins.note && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <span className="material-icons-round" style={{ fontSize: '0.75rem' }}>link</span>{ins.note}
                      </span>
                      <button className="btn btn-ghost" style={{ fontSize: '0.75rem', padding: '4px 9px', color: 'var(--navy)' }}>View Evidence</button>
                    </div>
                  )}
                </div>
              ))}

              {/* Loading card */}
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 22px' }}>
                <div className="spinner"></div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: 3 }}>Scrutinizing Data Clusters</div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Cross-referencing {42 + tick} sources...</p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" onClick={() => navigate('/reports')}>
                <span className="material-icons-round">analytics</span>View Full Report
              </button>
              <button className="btn btn-secondary">
                <span className="material-icons-round">pause</span>Pause
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
