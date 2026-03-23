const SECTIONS = [
  { icon:'gavel',       title:'Our Methodology',            body:`VerifAI's Digital Jurist operates on three pillars: Forensic Linguistics, Network Analysis, and Probabilistic Confidence Scoring. We extract atomic claims using advanced NLP, then crawl 1,284 verified sources in real-time. Our Jurist model assigns weighted confidence scores based on source authority, consensus breadth, and semantic coherence.` },
  { icon:'lock',        title:'Data Privacy & Security',    body:`All submitted content is processed ephemerally using TLS 1.3+ encrypted channels. Input text is never stored beyond the active analysis session and is permanently discarded once verification is complete. We comply with GDPR Article 5 and CCPA standards. Account data is stored with AES-256 encryption.` },
  { icon:'description', title:'Terms of Use',               body:`VerifAI is an advisory intelligence platform. All outputs—including verdicts, confidence scores, and source attributions—are advisory in nature. They do not constitute legal, journalistic, medical, or financial advice. All critical decisions must be cross-validated with qualified human professionals.` },
  { icon:'balance',     title:'Neutral Inquiry Commitment', body:`VerifAI does not endorse or suppress any political ideology, corporate interest, or institutional agenda. Our source corpus is continuously audited by an independent board of investigative journalists, data scientists, and ethicists. The Bias Audit Report is published quarterly.` },
  { icon:'cookie',      title:'Cookies & Tracking',         body:`We use strictly necessary cookies for session authentication and platform functionality only. We do not use third-party advertising trackers, social media pixels, or behavioral profiling cookies. Analytics are collected in aggregated, anonymized form using our proprietary telemetry system.` },
];

export default function PrivacyPage() {
  return (
    <div className="animate-in">
      <div className="page-header">
        <h1 className="page-title">Privacy, Terms & Methodology</h1>
        <p className="page-subtitle">Our commitment to neutral inquiry, data privacy, and responsible AI deployment.</p>
      </div>

      <div className="page-body">
        <div style={{ display:'grid', gridTemplateColumns:'180px 1fr', gap:32 }}>
          {/* TOC */}
          <div style={{ position:'sticky', top:60, alignSelf:'flex-start' }}>
            <div className="section-label">On this page</div>
            <nav style={{ display:'flex', flexDirection:'column', gap:2 }}>
              {SECTIONS.map(s => (
                <a key={s.title} href={`#${s.title.replace(/\s/g,'-')}`}
                  style={{ display:'flex', alignItems:'center', gap:7, padding:'6px 9px', borderRadius:7, fontSize:'0.8rem', color:'var(--text-secondary)', transition:'all 0.12s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                  <span className="material-icons-round" style={{ fontSize:'0.8rem', color:'var(--navy)' }}>{s.icon}</span>
                  {s.title}
                </a>
              ))}
            </nav>
            <div className="divider"></div>
            <div style={{ padding:'11px', background:'var(--surface-card)', borderRadius:8, border:'1px solid var(--border)' }}>
              {[['Last Updated','March 22, 2024'],['Version','Protocol v4.2']].map(([l,v]) => (
                <div key={l} style={{ marginBottom:8 }}>
                  <div style={{ fontSize:'0.58rem', color:'var(--text-muted)', fontFamily:'var(--font-mono)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:2 }}>{l}</div>
                  <div style={{ fontSize:'0.8rem', color:'var(--text-primary)', fontWeight:500 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
            {/* Banner */}
            <div className="card" style={{ borderLeft:'4px solid var(--navy)', background:'rgba(26,39,68,0.03)' }}>
              <div style={{ display:'flex', gap:12 }}>
                <span className="material-icons-round" style={{ color:'var(--navy)', fontSize:'1.3rem', flexShrink:0 }}>verified_user</span>
                <div>
                  <h3 style={{ fontSize:'1rem', fontWeight:700, marginBottom:7 }}>Built on the foundation of neutral inquiry.</h3>
                  <p style={{ fontSize:'0.845rem', color:'var(--text-secondary)', lineHeight:1.72 }}>
                    VerifAI is not a media company. We do not publish opinions. We are a precision instrument — a digital arbiter engineered to provide probabilistic truth assessments based on evidence, not ideology.
                  </p>
                </div>
              </div>
              <div style={{ display:'flex', gap:20, marginTop:14, paddingTop:14, borderTop:'1px solid var(--divider)', flexWrap:'wrap' }}>
                {['Neutral Verdicts','Traceable Sources','GDPR Compliant'].map(l => (
                  <div key={l} style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <span className="dot dot-true"></span>
                    <span style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>

            {SECTIONS.map(s => (
              <div className="card" key={s.title} id={s.title.replace(/\s/g,'-')}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                  <div style={{ width:32, height:32, borderRadius:7, background:'var(--navy)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <span className="material-icons-round" style={{ color:'white', fontSize:'0.9rem' }}>{s.icon}</span>
                  </div>
                  <h2 style={{ fontSize:'0.95rem', fontWeight:700 }}>{s.title}</h2>
                </div>
                <p style={{ fontSize:'0.845rem', color:'var(--text-secondary)', lineHeight:1.8 }}>{s.body}</p>
              </div>
            ))}

            <div style={{ padding:'14px 18px', background:'var(--surface-card)', border:'1px solid var(--border)', borderRadius:10, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
              <div>
                <div style={{ fontSize:'0.82rem', fontWeight:600 }}>Questions about our policies?</div>
                <a href="mailto:legal@verifai.io" style={{ fontSize:'0.8rem', color:'var(--navy)', fontFamily:'var(--font-mono)' }}>legal@verifai.io</a>
              </div>
              <div style={{ fontSize:'0.68rem', color:'var(--text-muted)', fontFamily:'var(--font-mono)', textAlign:'right' }}>
                <div>VerifAI Core v2.4.0</div>
                <div>© 2024 Intelligence Judiciary Systems</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
