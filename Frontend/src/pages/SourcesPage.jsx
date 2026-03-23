import { useState } from 'react';

const SOURCES = [
  { name: 'The Global Chronicle', type: 'Public Media', desc: 'Institutional journalism with rigorous peer-review standards for editorial content.', trust: 'HIGH', color: 'green', badge: 'high', reports: 142 },
  { name: 'TechPulse Daily', type: 'Technology', desc: 'Specialized technology reporting. Reliable data with occasional corporate bias.', trust: 'MEDIUM', color: 'amber', badge: 'medium', reports: 89 },
  { name: 'OpenSignal Web', type: 'Crowdsourced', desc: 'Unverified crowd-sourced data. High frequency of corrected claims.', trust: 'LOW', color: 'red', badge: 'low', reports: 14 },
  { name: 'Verity Archives', type: 'Academic', desc: 'Digital repository of academic papers and verified public records.', trust: 'HIGH', color: 'green', badge: 'high', reports: 312 },
];

export default function SourcesPage() {
  const [search, setSearch] = useState('');
  const filtered = SOURCES.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.type.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-in">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="page-eyebrow">Source Directory</div>
            <h1 className="page-title">The VerifAI Ledger</h1>
            <p className="page-subtitle">A curated index of institutional, independent, and digital entities analyzed by the Jurist Intelligence engine. Authority is calculated based on historical accuracy and peer-reviewed citations.</p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignSelf: 'flex-end' }}>
            <button className="btn btn-secondary"><span className="material-icons-round">filter_list</span>Filters</button>
            <button className="btn btn-primary"><span className="material-icons-round">add</span>Propose Source</button>
          </div>
        </div>
      </div>

      <div className="page-body">
        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: 26 }}>
          {[['Total Verified', '1,284', '', ''], ['High Authority', '842', '', 'green'], ['Pending Review', '12', '', 'red'], ['Global Reach', '42 Countries', '', 'navy']].map(([l, v, i, c]) => (
            <div className="card" key={l}>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 5 }}>{l}</div>
              <div className={`stat-value${c ? ` stat-value-${c}` : ''}`} style={{ fontSize: '1.5rem' }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 22 }}>
          {/* Main list */}
          <div>
            <div className="section-label">Primary Entities</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map(src => (
                <div className="list-row" key={src.name} style={{ alignItems: 'stretch', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    {/* Icon */}
                    <div style={{ width: 40, height: 40, background: 'var(--bg)', borderRadius: 7, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span className="material-icons-round" style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>language</span>
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 5 }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{src.name}</h3>
                            <span className={`badge badge-${src.badge}`}>{src.trust} {src.badge === 'high' ? 'AUTHORITY' : src.badge === 'medium' ? 'TRUST' : 'RELIABILITY'}</span>
                          </div>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{src.desc}</p>
                        </div>
                        <div style={{ flexShrink: 0, textAlign: 'right' }}>
                          <div className="page-eyebrow" style={{ marginBottom: 2 }}>Verification History</div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Used in {src.reports} reports</div>
                        </div>
                      </div>
                    </div>
                    <span className="material-icons-round" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>chevron_right</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Showing 1–10 of 1,284 verified sources</span>
              <div style={{ display: 'flex', gap: 5 }}>
                {[1, 2, 3, '…', 12].map(p => (
                  <button key={p} className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: '0.8rem', background: p === 1 ? 'var(--navy)' : undefined, color: p === 1 ? 'white' : undefined, borderColor: p === 1 ? 'var(--navy)' : undefined }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card" style={{ background: 'var(--navy)', color: 'white' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 8, color: 'white' }}>AI Consensus Update</h3>
              <p style={{ fontSize: '0.8rem', lineHeight: 1.65, color: 'rgba(255,255,255,0.75)', marginBottom: 14 }}>
                A new cluster of sources from the Southeast Asia region has been elevated to 'Medium Trust' following a 6-month accuracy audit.
              </p>
              <button className="btn" style={{ background: 'white', color: 'var(--navy)', border: 'none', width: '100%', justifyContent: 'center', fontWeight: 700 }}>View Audit Report</button>
            </div>

            <div className="card">
              <div className="section-label">Trusted Networks</div>
              {[['EU Fact-Check Alliance', '24 Trusted Domains'], ['Associated Press API', 'Direct Verification Line'], ['Wiki-Intel Commons', 'Under Active Monitoring']].map(([n, c]) => (
                <div key={n} style={{ display: 'flex', gap: 8, padding: '8px 0', borderBottom: '1px solid var(--divider)' }}>
                  <span className="dot dot-true" style={{ flexShrink: 0, marginTop: 5 }}></span>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{n}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{c}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="card">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '14px 0', color: 'var(--text-muted)' }}>
                <span className="material-icons-round" style={{ fontSize: '1.6rem', marginBottom: 8, opacity: 0.35 }}>public</span>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>Reliability Heatmap</div>
                <div style={{ fontSize: '0.75rem', textAlign: 'center', lineHeight: 1.5 }}>Visualize source authority by geographic and political origin.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
