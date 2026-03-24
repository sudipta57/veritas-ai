import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalysis } from '../store/analysisStore';

export default function ReportsPage() {
  const navigate = useNavigate();
  const { state } = useAnalysis();
  const report = state.report;

  useEffect(() => {
    if (!report) navigate('/verify');
  }, [report, navigate]);

  if (!report) return null;

  const aiScore = report.ai_text_score ?? 0;
  const aiBadgeClass = aiScore > 70 ? 'badge-false' : aiScore >= 40 ? 'badge-partial' : 'badge-true';
  const aiBadgeText = aiScore > 70 ? 'High Risk' : aiScore >= 40 ? 'Possible' : 'Likely Human';
  const verdictItems = [
    [report.verdict_breakdown?.['TRUE'] ?? 0, 'True', 'green'],
    [report.verdict_breakdown?.['FALSE'] ?? 0, 'False', 'red'],
    [report.verdict_breakdown?.['PARTIALLY_TRUE'] ?? 0, 'Partial', 'amber'],
    [report.verdict_breakdown?.['UNVERIFIABLE'] ?? 0, 'Unknown', 'muted'],
  ];
  const allSources = [...new Map(
    report.claims.flatMap(c => c.sources).map(s => [s.url, s])
  ).values()].slice(0, 6);

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
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--navy)', lineHeight: 1 }}>{report.overall_score}%</div>
                    <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>accuracy score</div>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="section-label">Total Analysis</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12 }}>{report.total_claims} Claims Verified</div>
                  <div style={{ display: 'flex', gap: 20 }}>
                    {verdictItems.map(([value, label, color]) => (
                      <div key={label}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 800, color: `var(--${color})` }}>{value}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{label}</div>
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
                  <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>{aiScore}% AI-Generated Probability</div>
                </div>
                <span className={`badge ${aiBadgeClass}`}>{aiBadgeText}</span>
              </div>
              <div className="progress-track" style={{ height: 7, marginBottom: 8 }}>
                <div className="progress-fill progress-red" style={{ width: `${aiScore}%` }}></div>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Linguistic patterns match known Large Language Model structural markers.</p>
            </div>

            {/* Claims */}
            <div>
              {report.claims.map((claim) => {
                const verdict = claim.verdict;
                const verdictBorder = verdict === 'TRUE'
                  ? 'var(--green)'
                  : verdict === 'FALSE'
                    ? 'var(--red)'
                    : verdict === 'PARTIALLY_TRUE'
                      ? 'var(--amber)'
                      : verdict === 'CONFLICTING'
                        ? 'var(--red)'
                        : 'var(--border)';
                const badgeConfig = verdict === 'TRUE'
                  ? { cls: 'badge-true', text: 'Verified: True' }
                  : verdict === 'FALSE'
                    ? { cls: 'badge-false', text: 'Verdict: False' }
                    : verdict === 'PARTIALLY_TRUE'
                      ? { cls: 'badge-partial', text: 'Partially True' }
                      : verdict === 'CONFLICTING'
                        ? { cls: 'badge-false', text: 'Conflicting' }
                        : { cls: 'badge-partial', text: 'Unverifiable' };

                return (
                <div key={claim.claim_id} className="card" style={{ marginBottom: 14, borderLeft: `3px solid ${verdictBorder}` }}>
                  {claim.is_conflicting === true && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 10px', background: 'var(--red-bg)', borderRadius: 7, marginBottom: 12 }}>
                      <span className="material-icons-round" style={{ color: 'var(--red)', fontSize: '0.9rem' }}>warning</span>
                      <span className="section-label" style={{ margin: 0, color: 'var(--red)' }}>Conflicting Sources Detected</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <span className={`badge ${badgeConfig.cls}`} style={{ marginBottom: 8, display: 'inline-block' }}>{badgeConfig.text}</span>
                      <p style={{ fontSize: '0.925rem', fontWeight: 700, lineHeight: 1.5 }}>{claim.claim.atomic_claim}</p>
                    </div>
                    {claim.confidence > 0 && (
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div className="section-label" style={{ margin: 0, marginBottom: 2 }}>Confidence Score</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--green)' }}>{claim.confidence}%</div>
                      </div>
                    )}
                  </div>
                  {claim.sources?.length > 0 && (
                    <>
                      <div className="section-label">Evidence Triangulation</div>
                      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                        {claim.sources.map(source => (
                          <div key={source.url} className="tag" style={{ padding: '6px 10px', borderRadius: 7, lineHeight: 1.5 }}>
                            <span className="material-icons-round" style={{ fontSize: '0.7rem', color: 'var(--navy)' }}>verified</span>
                            {source.title} / {source.tier} <span style={{ color: 'var(--text-muted)' }}>Supports</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ padding: '12px', background: 'var(--bg)', borderRadius: 8 }}>
                        <div className="section-label">AI Reasoning Protocol</div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.72, fontFamily: 'var(--font-mono)' }}>{claim.reasoning}</p>
                      </div>
                    </>
                  )}
                  {claim.is_conflicting === true && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      {[['Position A', claim.conflict_position_a, 'green'], ['Position B', claim.conflict_position_b, 'red']].map(([l, t, col]) => (
                        <div key={l} style={{ padding: '12px', background: 'var(--bg)', borderRadius: 8, borderLeft: `3px solid var(--${col})` }}>
                          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: `var(--${col})`, fontFamily: 'var(--font-mono)', marginBottom: 6 }}>{l}</div>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{t}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="card">
              <div className="section-label">Source Trust Index</div>
              {allSources.map((source) => {
                const tierMeta = source.tier === 'TIER1'
                  ? { label: 'High Authority', color: 'green' }
                  : source.tier === 'TIER2'
                    ? { label: 'Established News', color: 'green' }
                    : { label: 'General Web', color: 'amber' };

                return (
                <div key={source.url} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid var(--divider)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span className={`dot dot-${tierMeta.color === 'green' ? 'true' : tierMeta.color === 'red' ? 'false' : 'partial'}`}></span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>{source.title}</span>
                  </div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: `var(--${tierMeta.color})`, fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>{tierMeta.label}</span>
                </div>
                );
              })}
            </div>

            <div className="card">
              <div className="section-label">Report Metadata</div>
              {[['Report ID', report.report_id], ['Analysis Speed', `${(report.processing_time_seconds ?? 0).toFixed(1)}s`], ['Dataset Version', 'V4.2 (Real-time)']].map(([l, v]) => (
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
