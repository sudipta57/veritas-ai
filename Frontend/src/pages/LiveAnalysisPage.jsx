import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalysis } from '../store/analysisStore';

const STATUS_COLOR = { completed: 'var(--green)', active: 'var(--blue)', queued: 'var(--text-muted)' };
const STATUS_BG = { completed: 'rgba(26,107,26,0.1)', active: 'rgba(29,78,216,0.1)', queued: 'var(--bg)' };
const STATUS_BORDER = { completed: 'var(--green-border)', active: 'var(--blue-border)', queued: 'var(--border)' };
const STATUS_BADGE = { completed: 'completed', active: 'progress', queued: 'unknown' };

export default function LiveAnalysisPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useAnalysis();
  console.log('[Live render]', {
    status: state.status,
    hasReport: !!state.report,
    reportId: state.report?.report_id,
  });

  useEffect(() => {
    console.log('[LiveAnalysisPage] redirect check — status=', state.status, 'report=', !!state.report);
    if (state.status === 'idle' && !state.report) {
      console.log('[LiveAnalysisPage] REDIRECTING to /verify');
      navigate('/verify');
    }
  }, [state.status, state.report, navigate]);

  useEffect(() => {
    console.log('[Live complete effect] fired — status:', state.status, 'report:', !!state.report);
    if (state.status === 'complete' && state.report) {
      console.log('[Live complete effect] NAVIGATING to /reports');
      navigate('/reports');
    }
  }, [state.status, state.report]);

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
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Session ID: {state.report?.report_id?.slice(0, 12) ?? 'Processing...'}</span>
        </div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 10, lineHeight: 1.1, maxWidth: 640 }}>
          {state.inputType === 'URL' ? 'Analyzing URL submission' : 'Analyzing submitted text'}
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 28, maxWidth: 540 }}>
          {`Verifying: "${(state.inputContent ?? '').slice(0, 80)}${
            (state.inputContent ?? '').length > 80 ? '...' : ''
          }"`}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24 }}>
          {/* Left: Steps timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {state.stages.map((step, si) => (
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
                  {si < state.stages.length - 1 && (
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
              {state.verifiedSoFar.map((claim_id, i) => {
                const ins = {
                  badge: 'progress',
                  title: 'Claim Verified',
                  text: `Claim ${claim_id} has been verified`,
                  conf: null,
                  sources: [],
                };

                return (
                <div key={i} className="card animate-in" style={{
                  borderLeft: `3px solid ${ins.badge === 'true' ? 'var(--green-vivid)' : ins.badge === 'progress' ? 'var(--blue)' : 'var(--amber)'}`,
                  animationDelay: `${i * 0.1}s`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 7,
                        background: ins.badge === 'true' ? 'var(--green-bg)' : ins.badge === 'progress' ? 'var(--blue-bg)' : 'var(--amber-bg)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span className="material-icons-round" style={{ color: ins.badge === 'true' ? 'var(--green)' : ins.badge === 'progress' ? 'var(--blue)' : 'var(--amber)', fontSize: '0.9rem' }}>
                          {ins.badge === 'true' ? 'check_circle' : ins.badge === 'progress' ? 'autorenew' : 'warning_amber'}
                        </span>
                      </div>
                      <span className="section-label" style={{ margin: 0 }}>{ins.title}</span>
                    </div>
                    <span className={`badge badge-${ins.badge === 'true' ? 'true' : ins.badge === 'progress' ? 'blue' : 'partial'}`}>
                      {ins.badge === 'true' ? '✓ TRUE' : ins.badge === 'progress' ? 'PROGRESS' : '⚠ PARTIALLY TRUE'}
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
                );
              })}

              {/* Loading card */}
              {state.status !== 'complete' && (
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 22px' }}>
                  <div className="spinner"></div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: 3 }}>Scrutinizing Data Clusters</div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{`Processing ${state.claimsFound.length} claims...`}</p>
                  </div>
                </div>
              )}
            </div>

            <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" onClick={() => navigate('/reports')}>
                <span className="material-icons-round">analytics</span>View Full Report
              </button>
              <button className="btn btn-secondary" onClick={() => {
                state.cancelFn?.();
                dispatch({ type: 'RESET' });
                navigate('/verify');
              }}>
                <span className="material-icons-round">pause</span>Pause
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
